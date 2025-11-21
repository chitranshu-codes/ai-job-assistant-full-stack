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
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Python 3.9+
* Node.js & npm
* A Google Cloud API Key (for Gemini)

### 1. Backend Setup

Navigate to the backend folder and create a virtual environment:

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```
##Install dependencies:

```bash

pip install -r requirements.txt
Environment Configuration:

Create a .env file inside the backend/ folder and add your API key:

Code snippet

GOOGLE_API_KEY=your_google_api_key_here
Start the Server:

uvicorn main:app --reload
The server will start at http://localhost:8000 and pre-calculate embeddings for the job database.
```
2. Frontend Setup
Open a new terminal and navigate to the frontend folder:

```bash

cd frontend
Install dependencies:


npm install
Start the application:


npm run dev
Open http://localhost:3000 in your browser.
```

## 💡 How It Works
### Ingestion: The user uploads a PDF resume via the frontend.

### Embedding: The backend parses the text and generates a vector embedding using HuggingFace models.

### Matching: This vector is compared against pre-computed vectors of job descriptions in jobs.json using Cosine Similarity.

### Generation: The top matching job and the user's resume text are sent to the Gemini LLM with a specific prompt to generate a tailored cover letter.

### Delivery: The results are streamed back to the UI, where the user can view matches and copy/resize the generated letter.

## 🔮 Future Improvements
### Add database integration (PostgreSQL/Supabase) for persistent job storage.

### Implement user authentication.

### Add "Apply Now" automated email functionality.

### Deploy to Vercel (Frontend) and Render (Backend).
