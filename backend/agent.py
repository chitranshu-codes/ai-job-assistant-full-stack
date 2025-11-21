import os
from typing import TypedDict, List, Optional
import numpy as np
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langgraph.graph import StateGraph, START, END
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader

load_dotenv()

# Initialize Models
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.2)
embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# --- State Definition ---
class JobState(TypedDict):
    resume_path: str
    resume_text: str
    resume_embedding: List[float]
    # We pass the entire pool of pre-embedded jobs here
    available_jobs: List[dict]
    matched_jobs: List[dict]
    cover_letter: Optional[str]

# --- Node 1: Process Resume ---
def process_resume(state: JobState) -> JobState:
    resume_path = state.get("resume_path")
    loader = PyPDFLoader(resume_path)
    docs = loader.load()
    
    # simple text extraction
    plain_text = " ".join([doc.page_content for doc in docs]).replace("\n", " ")
    
    # Generate embedding for the *whole* resume summary or specific chunks
    # For simplicity in matching, we embed the first 2000 chars as a summary representation
    summary_text = plain_text[:3000] 
    resume_emb = embeddings_model.embed_query(summary_text)

    state["resume_text"] = plain_text
    state["resume_embedding"] = resume_emb
    return state

# --- Node 2: Find Matches (Optimized) ---
def match_jobs(state: JobState) -> JobState:
    resume_vec = np.array(state["resume_embedding"])
    jobs = state["available_jobs"]
    
    scored_jobs = []
    for job in jobs:
        # We assume job['embedding'] is pre-calculated in main.py
        if "embedding" not in job:
            continue
            
        job_vec = np.array(job["embedding"])
        
        # Cosine Similarity
        norm_resume = np.linalg.norm(resume_vec)
        norm_job = np.linalg.norm(job_vec)
        
        if norm_resume == 0 or norm_job == 0:
            sim = 0
        else:
            sim = np.dot(resume_vec, job_vec) / (norm_resume * norm_job)
            
        # Add score to a copy of the job dict to avoid mutating global state
        job_copy = job.copy()
        del job_copy['embedding'] # Don't send vectors to frontend
        job_copy["similarity"] = float(sim)
        scored_jobs.append(job_copy)

    # Sort by similarity and take top 3
    scored_jobs.sort(key=lambda x: x["similarity"], reverse=True)
    state["matched_jobs"] = scored_jobs[:3]
    return state

# --- Node 3: Generate Cover Letter ---
def generate_cover_letter(state: JobState) -> JobState:
    top_job = state["matched_jobs"][0] if state["matched_jobs"] else None
    if not top_job:
        state["cover_letter"] = "No suitable jobs found to generate a letter for."
        return state

    prompt = (
        f"Write a professional cover letter for the position of '{top_job['title']}' at '{top_job['company']}'.\n"
        f"Use the following details from the candidate's resume:\n{state['resume_text'][:2000]}...\n\n"
        f"And relate them to the job description: {top_job['description']}\n"
        "Keep it concise, enthusiastic, and professional."
    )
    
    response = llm.invoke(prompt)
    state["cover_letter"] = response.content
    return state

# --- Build Graph ---
workflow = StateGraph(JobState)
workflow.add_node("process_resume", process_resume)
workflow.add_node("match_jobs", match_jobs)
workflow.add_node("generate_cover_letter", generate_cover_letter)

workflow.add_edge(START, "process_resume")
workflow.add_edge("process_resume", "match_jobs")
workflow.add_edge("match_jobs", "generate_cover_letter")
workflow.add_edge("generate_cover_letter", END)

job_agent = workflow.compile()