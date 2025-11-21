"use client";

import { useState } from "react";
import axios from "axios";
import { 
  UploadCloud, 
  FileText, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Copy,
  MapPin,
  Building2,
  Grip,
  Check
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  similarity: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMatchedJobs([]);
      setCoverLetter("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setMatchedJobs([]);
    setCoverLetter("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/analyze", formData);
      setMatchedJobs(response.data.matched_jobs);
      setCoverLetter(response.data.cover_letter);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      
      {/* --- Decorative Background Elements --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Navbar --- */}
      <nav className="relative z-10 border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-600/20">
              <Briefcase size={20} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JobFinder
            </span>
          </div>
          <div className="hidden md:block text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Portfolio Project By Chitranshu
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        
        {/* --- Hero Section --- */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-4 border border-indigo-100 shadow-sm">
            <Sparkles size={14} />
            <span>Powered by Gemini</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Land Your Dream Job <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              With Intelligent AI
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            Upload your resume and let our AI agent match you with the perfect roles 
            and write a tailored cover letter in seconds.
          </p>
        </div>

        {/* --- Upload Card --- */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-100 border border-white p-8 mb-16 max-w-3xl mx-auto transform transition-all hover:scale-[1.01] duration-500">
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group ${
              file ? "border-indigo-400 bg-indigo-50/30" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50"
            }`}
          >
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            <div className="flex flex-col items-center justify-center gap-4 relative z-10 pointer-events-none">
              <div className={`p-5 rounded-2xl transition-all duration-300 ${
                file ? 'bg-indigo-100 text-indigo-600 rotate-0' : 'bg-slate-100 text-slate-400 group-hover:scale-110 group-hover:rotate-3'
              }`}>
                {file ? <FileText size={32} /> : <UploadCloud size={32} />}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 mb-1">
                  {file ? file.name : "Drop your resume here"}
                </p>
                <p className="text-sm text-slate-500">
                  {file ? "Ready to analyze" : "Support PDF files only (Max 5MB)"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full md:w-auto min-w-[240px] flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 shadow-xl shadow-indigo-500/20 ${
                !file || loading 
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 hover:-translate-y-1"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* --- Results Section --- */}
        {matchedJobs.length > 0 && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Left Column: Job Matches */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 mb-4">
                <span className="bg-green-100 p-2 rounded-lg text-green-600">
                  <CheckCircle2 size={24} />
                </span>
                Top Matches For You
              </h2>
              
              <div className="space-y-4">
                {matchedJobs.map((job, idx) => (
                  <div 
                    key={job.id} 
                    style={{ animationDelay: `${idx * 150}ms` }}
                    className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden animate-in slide-in-from-bottom-4"
                  >
                    {/* Match Badge */}
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl z-10 shadow-sm">
                      {(job.similarity * 100).toFixed(0)}% Match
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-slate-500 text-sm">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          <Building2 size={14} className="text-indigo-500" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                          <MapPin size={14} className="text-indigo-500" /> {job.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-2">
                      {job.description}
                    </p>

                    <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-all group-hover:gap-2">
                      View Job Details <span>&rarr;</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Cover Letter */}
            <div className="lg:col-span-5">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <FileText size={24} />
                    </span>
                    AI Cover Letter
                  </h2>
                  <button 
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                      copied 
                      ? "bg-green-100 text-green-700" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                </div>

                {/* --- RESIZABLE CONTAINER --- */}
                {/* Added: resize-y, min-h, and shrink-0 on header/footer */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col h-[600px] min-h-[400px] resize-y">
                  
                  {/* Paper Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-2 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="ml-3 text-xs text-slate-400 font-mono">generated_letter.txt</span>
                  </div>
                  
                  {/* Letter Content */}
                  <div className="p-8 overflow-y-auto flex-1 bg-white relative group">
                    {/* Subtle gradient line at top */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-loose tracking-wide">
                      {coverLetter}
                    </pre>
                  </div>
                  
                  {/* Footer with Grip Handle */}
                  <div className="bg-slate-50 border-t border-slate-100 p-4 text-center relative shrink-0">
                     <p className="text-xs text-slate-400">Generated by Gemini</p>
                     
                     {/* Visual Grip Icon */}
                     <div className="absolute bottom-1 right-1 p-1 pointer-events-none text-slate-300/80">
                        <Grip size={16} />
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}