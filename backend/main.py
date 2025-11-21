from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import os
import shutil
import uuid
from agent import job_agent
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

# Global variable to store jobs with embeddings
JOB_DATABASE = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup: Load Jobs & Pre-calculate Embeddings ---
    print(">>> Loading jobs and generating embeddings...")
    with open("jobs.json", "r") as f:
        raw_jobs = json.load(f)
    
    # CHANGE THIS LINE:
    # Old: embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    # New:
    embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Batch embed descriptions for efficiency
    descriptions = [j["description"] for j in raw_jobs]
    embeddings = embeddings_model.embed_documents(descriptions)
    
    for job, emb in zip(raw_jobs, embeddings):
        job["embedding"] = emb
        JOB_DATABASE.append(job)
    
    print(f">>> System ready with {len(JOB_DATABASE)} jobs.")
    yield
    # --- Shutdown ---
    JOB_DATABASE.clear()

app = FastAPI(lifespan=lifespan)

# CORS for Frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.js default port
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported.")

    # Save file temporarily
    file_id = str(uuid.uuid4())
    temp_path = f"temp_{file_id}.pdf"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run the Agent
        initial_state = {
            "resume_path": temp_path,
            "available_jobs": JOB_DATABASE, # Pass the in-memory DB
            "resume_text": "",
            "resume_embedding": [],
            "matched_jobs": [],
            "cover_letter": None
        }
        
        result = job_agent.invoke(initial_state)
        
        return {
            "matched_jobs": result["matched_jobs"],
            "cover_letter": result["cover_letter"]
        }
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)