# 🚀 AI Job Application Assistant

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)

A full-stack AI agent that streamlines the job application process. It parses PDF resumes, matches them against a job database using **Vector Similarity Search**, and generates hyper-personalized cover letters using **Google Gemini**.

## ✨ Key Features

* **📄 Smart Resume Parsing:** Extracts and processes text from PDF resumes using `PyPDF`.
* **🧠 Vector Search & Matching:** Uses **HuggingFace Embeddings** (`all-MiniLM-L6-v2`) to convert resumes and job descriptions into high-dimensional vectors. Matches are found using Cosine Similarity.
* **🤖 AI Agent Workflow:** Built with **LangGraph** to orchestrate the flow between parsing, matching, and generation.
* **✍️ Generative AI Cover Letters:** Utilizes **Google Gemini 2.0 Flash** to write professional, context-aware cover letters tailored to specific job descriptions.
* **🎨 Modern UI:** A responsive, glassmorphic interface built with **React/Next.js** and **Tailwind CSS**, featuring smooth animations and resizable components.

## 🛠️ Tech Stack

### Backend
* **Framework:** FastAPI
* **Orchestration:** LangChain & LangGraph
* **LLM:** Google Gemini 2.0 Flash via `langchain-google-genai`
* **Embeddings:** HuggingFace (`sentence-transformers`)
* **Vector Logic:** FAISS / NumPy

### Frontend
* **Framework:** Next.js 14 (App Router) / React
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **Icons:** Lucide React

## 📂 Project Structure

```bash
job-ai-assistant/
├── backend/
│   ├── main.py            # FastAPI Entry Point
│   ├── agent.py           # LangGraph Agent Logic
│   ├── jobs.json          # Job Database
│   └── requirements.txt   # Python Dependencies
├── frontend/
│   ├── app/
│   │   └── page.tsx       # Main UI Component
│   ├── public/            # Static Assets
│   └── tailwind.config.ts # Styling Config
└── README.md

