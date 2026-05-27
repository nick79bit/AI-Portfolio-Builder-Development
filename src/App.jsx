import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2, 
  AlertCircle, Copy, Download, RefreshCw, Smartphone, Tablet, 
  Monitor, Plus, Trash2, Key, ExternalLink, Share2, Eye, Info, 
  Check, Award, GraduationCap, Briefcase
} from 'lucide-react';
import { parseResumeText, calculateATSScore, generateOfflineBio, enhanceDraftBullet, generateOfflineCoverLetter, generateWithGemini } from './utils/AIEngine';
import { THEME_LIST, generatePortfolioHtml } from './utils/Themes';
import { exportToHtmlFile } from './utils/HtmlExporter';
import './App.css';

function App() {
  // --- STATE ---
  const DEFAULT_PORTFOLIO = {
    fullName: "",
    targetRole: "Frontend Developer",
    email: "",
    github: "",
    linkedin: "",
    bio: "",
    skills: [],
    projects: [
      { name: "EcoTracker Mobile", description: "Engineered a responsive cross-platform carbon tracking application using React and serverless cloud databases.", techStack: "React, Firebase, AWS" }
    ],
    experience: [
      { role: "Software Developer Intern", company: "AeroWeb Solutions", duration: "2024 - Present", responsibilities: "• Designed core user authorization workflows.\n• Accelerated frontend data query delivery by 15% using modern cache indexes." }
    ],
    education: [
      { degree: "B.S. in Computer Science", school: "State Technology University", year: "2024" }
    ],
    achievements: [
      "Dean's Honor List (2022 - 2024)",
      "First Place Winner - City Hackathon 2023"
    ],
    includeGithubStats: false,
    githubUsername: ""
  };

  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem("portfolio_builder_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved portfolio data", e);
      }
    }
    return DEFAULT_PORTFOLIO;
  });

  const [selectedTheme, setSelectedTheme] = useState("midnight");
  const [activeStep, setActiveStep] = useState(1);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [atsScoreData, setAtsScoreData] = useState({ score: 0, feedback: [] });
  const [customStyleDesc, setCustomStyleDesc] = useState("");
  
  // Custom states
  const [resumeText, setResumeText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);
  
  // Cover Letter Tool State
  const [coverJobTitle, setCoverJobTitle] = useState("");
  const [coverJobDesc, setCoverJobDesc] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Status Alerts
  const [alertMsg, setAlertMsg] = useState(null);
  const [shareOverlay, setShareOverlay] = useState(false);

  const iframeRef = useRef(null);

  // Trigger ATS analysis when portfolio details change
  useEffect(() => {
    const analysis = calculateATSScore(portfolio);
    setAtsScoreData(analysis);
  }, [portfolio]);

  // Auto-save portfolio data to Local Storage
  useEffect(() => {
    localStorage.setItem("portfolio_builder_data", JSON.stringify(portfolio));
  }, [portfolio]);

  // Synchronize Live Preview Iframe content
  useEffect(() => {
    if (iframeRef.current) {
      const compiledHtml = generatePortfolioHtml(portfolio, selectedTheme);
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(compiledHtml);
      doc.close();
    }
  }, [portfolio, selectedTheme]);

  // Alert Manager Helper
  const triggerAlert = (message, type = "success") => {
    setAlertMsg({ text: message, type });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // --- ACTIONS ---

  // Handle local state edits
  const handlePortfolioChange = (field, value) => {
    setPortfolio(prev => ({ ...prev, [field]: value }));
  };

  // Save Gemini Key to storage
  const handleSaveGeminiKey = (key) => {
    setGeminiKey(key);
    localStorage.setItem("gemini_api_key", key);
    triggerAlert("Gemini API Key configured successfully!");
    setShowKeyInput(false);
  };

  // Resume Parsing Drag/Drop Handler
  const handleResumeDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const parsed = parseResumeText(event.target.result);
        if (parsed) {
          setPortfolio(parsed);
          triggerAlert("Resume uploaded and parsed successfully! Step wizard pre-populated.");
          setActiveStep(1); // send user to verify Step 1
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResumeTextPaste = () => {
    if (!resumeText.trim()) {
      triggerAlert("Paste your resume content inside the box first.", "warning");
      return;
    }
    const parsed = parseResumeText(resumeText);
    if (parsed) {
      setPortfolio(parsed);
      triggerAlert("Resume text analyzed! Form details populated.", "success");
      setResumeText("");
      setActiveStep(1);
    }
  };

  // Skill Tags addition
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.trim();
      if (cleaned && !portfolio.skills.includes(cleaned)) {
        handlePortfolioChange("skills", [...portfolio.skills, cleaned]);
      }
      setTagInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    handlePortfolioChange("skills", portfolio.skills.filter(s => s !== skillToRemove));
  };

  // Dynamic lists managers (projects, experience, education, achievements)
  const addProject = () => {
    handlePortfolioChange("projects", [
      ...portfolio.projects,
      { name: "New Showcase Project", description: "Built a reactive cloud integration.", techStack: "HTML, JavaScript" }
    ]);
  };

  const editProject = (index, field, value) => {
    const updated = portfolio.projects.map((p, idx) => idx === index ? { ...p, [field]: value } : p);
    handlePortfolioChange("projects", updated);
  };

  const deleteProject = (index) => {
    handlePortfolioChange("projects", portfolio.projects.filter((_, idx) => idx !== index));
  };

  const addExperience = () => {
    handlePortfolioChange("experience", [
      ...portfolio.experience,
      { role: "Developer", company: "Company Name", duration: "2024", responsibilities: "• Implemented features." }
    ]);
  };

  const editExperience = (index, field, value) => {
    const updated = portfolio.experience.map((e, idx) => idx === index ? { ...e, [field]: value } : e);
    handlePortfolioChange("experience", updated);
  };

  const deleteExperience = (index) => {
    handlePortfolioChange("experience", portfolio.experience.filter((_, idx) => idx !== index));
  };

  const addEducation = () => {
    handlePortfolioChange("education", [
      ...portfolio.education,
      { degree: "B.S. in Software Development", school: "College Academy", year: "2024" }
    ]);
  };

  const editEducation = (index, field, value) => {
    const updated = portfolio.education.map((e, idx) => idx === index ? { ...e, [field]: value } : e);
    handlePortfolioChange("education", updated);
  };

  const deleteEducation = (index) => {
    handlePortfolioChange("education", portfolio.education.filter((_, idx) => idx !== index));
  };

  const addAchievement = (text) => {
    if (!text.trim()) return;
    handlePortfolioChange("achievements", [...portfolio.achievements, text.trim()]);
  };

  const removeAchievement = (index) => {
    handlePortfolioChange("achievements", portfolio.achievements.filter((_, idx) => idx !== index));
  };

  // --- AI GENERATIONS CONTROLLERS ---
  const handleAIBioPolish = async () => {
    setIsAiGenerating(true);
    const customPrompt = customStyleDesc 
      ? ` incorporating style guidelines: "${customStyleDesc}"` 
      : "";
    const promptText = `Write a professional personal developer bio for ${portfolio.fullName || "a software engineer"} with a target role of "${portfolio.targetRole}" and core skills including [${portfolio.skills.slice(0, 5).join(', ')}]. Style tone should be modern and engaging${customPrompt}. Keep it under 3 sentences.`;

    try {
      if (geminiKey) {
        const gen = await generateWithGemini(geminiKey, promptText);
        handlePortfolioChange("bio", gen);
        triggerAlert("Summary polished with live Gemini AI!", "success");
      } else {
        const fallback = generateOfflineBio(portfolio.fullName, portfolio.targetRole, portfolio.skills, selectedTheme);
        handlePortfolioChange("bio", fallback);
        triggerAlert("Summary polished with Local AI engine! (Configure Gemini Key in header for live responses)", "success");
      }
    } catch (err) {
      triggerAlert(err.message, "danger");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAIEnhanceExperience = async (idx) => {
    setIsAiGenerating(true);
    const job = portfolio.experience[idx];
    const promptText = `Enhance the following software developer job description bullet points to be highly impactful for recruiters, incorporating strong ATS action verbs and metrics. Job Title: "${job.role}" at "${job.company}". Current bullets:\n${job.responsibilities}. Rewrite it as concise bullet points starting with strong action verbs. Max 3 bullet points.`;

    try {
      if (geminiKey) {
        const gen = await generateWithGemini(geminiKey, promptText);
        editExperience(idx, "responsibilities", gen);
        triggerAlert("Experience refined with live Gemini AI!", "success");
      } else {
        const fallback = enhanceDraftBullet(job.responsibilities);
        editExperience(idx, "responsibilities", fallback);
        triggerAlert("Bullets refined with Local AI templates!", "success");
      }
    } catch (err) {
      triggerAlert(err.message, "danger");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!coverJobTitle) {
      triggerAlert("Specify a job title first.", "warning");
      return;
    }
    setIsAiGenerating(true);
    const promptText = `Generate a persuasive professional cover letter for ${portfolio.fullName || "a candidate"} applying to the role of "${coverJobTitle}" at a company with the following job requirements:\n${coverJobDesc}.\nInject experience details from the portfolio: Target role: ${portfolio.targetRole}, skills: [${portfolio.skills.slice(0, 6).join(', ')}], primary experience: [${portfolio.experience[0]?.role} at ${portfolio.experience[0]?.company}]. Clean layout, professional format.`;

    try {
      if (geminiKey) {
        const gen = await generateWithGemini(geminiKey, promptText);
        setGeneratedLetter(gen);
        triggerAlert("Cover letter written by Gemini AI!", "success");
      } else {
        const fallback = generateOfflineCoverLetter(portfolio, coverJobTitle, coverJobDesc);
        setGeneratedLetter(fallback);
        triggerAlert("Cover letter written by local AI templates!", "success");
      }
    } catch (err) {
      triggerAlert(err.message, "danger");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleExport = () => {
    const ok = exportToHtmlFile(portfolio, selectedTheme);
    if (ok) {
      triggerAlert("Portfolio exported! check your downloads directory.", "success");
    } else {
      triggerAlert("Failed to compile export file.", "danger");
    }
  };

  // --- RENDERING HELPERS ---
  const copyLetterToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    triggerAlert("Cover letter copied to clipboard!", "success");
  };

  return (
    <div className="workspace-container">
      {/* App Alert Banner */}
      {alertMsg && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px 20px",
          borderRadius: "8px",
          border: `1px solid ${alertMsg.type === 'danger' ? 'rgba(239, 68, 68, 0.4)' : alertMsg.type === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(225, 117, 100, 0.4)'}`,
          background: "rgba(13, 23, 60, 0.95)",
          color: alertMsg.type === 'danger' ? '#fca5a5' : alertMsg.type === 'warning' ? '#fde047' : '#f8fafc',
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(8px)",
          fontFamily: "var(--font-heading)"
        }} className="animate-fade-in">
          {alertMsg.type === 'danger' ? <AlertCircle color="#f87171" size={20} /> : <CheckCircle2 color="#E17564" size={20} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Share / Social Overlay */}
      {shareOverlay && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(9, 18, 44, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }} onClick={() => setShareOverlay(false)}>
          <div style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-medium)",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "480px",
            width: "90%",
            textAlign: "center",
            boxShadow: "var(--shadow-lg), 0 0 30px rgba(225, 117, 100, 0.15)"
          }} onClick={e => e.stopPropagation()} className="animate-fade-in">
            <h3 style={{ fontSize: "22px", marginBottom: "12px", fontFamily: "var(--font-heading)" }}>Your Portfolio is Ready to Share!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
              Upload your exported HTML file directly to your GitHub repository named <code>[username].github.io</code> to host it for free in minutes!
            </p>
            
            {/* Mock deploy Link */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.05)",
              marginBottom: "24px"
            }}>
              <span style={{ fontSize: "13px", color: "var(--color-coral)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                https://{portfolio.fullName ? portfolio.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "candidate"}.github.io/portfolio
              </span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://${(portfolio.fullName || "candidate").toLowerCase().replace(/[^a-z0-9]+/g, '-')}.github.io/portfolio`);
                  triggerAlert("Mock URL copied to clipboard!");
                }}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <Copy size={16} />
              </button>
            </div>

            {/* Simulated QR Code */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div style={{ background: "white", padding: "12px", borderRadius: "8px", width: "130px", height: "130px", display: "flex", alignItems: "center", justifyItems: "center" }}>
                {/* SVG representing a futuristic QR code */}
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#09122C" strokeWidth="2">
                  <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
                  <path d="M6 6h.01M18 6h.01M6 18h.01M18 18h.01M10 10h4v4h-4z" />
                </svg>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShareOverlay(false)}>Close</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => {
                setShareOverlay(false);
                handleExport();
              }}>Export Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="app-header">
        <div className="brand-title">
          <Sparkles color="#E17564" size={28} />
          <span>PORTFOLIO BUILDER</span>
          <span className="brand-badge">AI Powered</span>
        </div>

        {/* Gemini API Key Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {showKeyInput ? (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }} className="animate-fade-in">
              <input 
                type="password"
                placeholder="Enter Gemini API Key..."
                defaultValue={geminiKey}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveGeminiKey(e.target.value);
                }}
                className="form-input"
                style={{ padding: "6px 12px", fontSize: "12px", width: "180px" }}
              />
              <button 
                onClick={(e) => handleSaveGeminiKey(e.target.previousSibling.value)} 
                className="btn-primary" 
                style={{ padding: "6px 12px", fontSize: "12px" }}
              >
                Save
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowKeyInput(true)} 
              className="btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Key size={14} color={geminiKey ? "#E17564" : "#94a3b8"} />
              <span>{geminiKey ? "Gemini Key Configured" : "Add Gemini API Key"}</span>
            </button>
          )}
          
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your local storage draft and start fresh?")) {
                localStorage.removeItem("portfolio_builder_data");
                setPortfolio(DEFAULT_PORTFOLIO);
                triggerAlert("Portfolio draft has been reset!", "success");
                setActiveStep(1);
              }
            }}
            className="btn-secondary"
            style={{ padding: "8px 14px", fontSize: "13px" }}
          >
            Reset Draft
          </button>

          <button 
            onClick={handleExport}
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            <Download size={15} />
            <span>Export Portfolio</span>
          </button>
        </div>
      </header>

      {/* Work Grid */}
      <div className="app-grid">
        {/* LEFT WORKSPACE: Builder panel */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", height: "100%", overflowY: "auto" }}>
          
          {/* Step flow Header Indicators */}
          <div className="wizard-progress">
            <div className="wizard-progress-bar-bg"></div>
            <div className="wizard-progress-bar-fill" style={{ width: `${((activeStep - 1) / 7) * 100}%` }}></div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(step => {
              const iconsList = [
                <FileText size={13} />, 
                <Briefcase size={13} />, 
                <GraduationCap size={13} />, 
                <Sparkles size={13} />,
                <Award size={13} />, 
                <Award size={13} />, 
                <Award size={13} />, 
                <Award size={13} />
              ];
              return (
                <div 
                  key={step} 
                  className={`wizard-step-node ${activeStep === step ? 'active' : ''} ${activeStep > step ? 'completed' : ''}`}
                  onClick={() => setActiveStep(step)}
                  title={`Step ${step}`}
                >
                  {step}
                </div>
              );
            })}
          </div>

          {/* Core Builder Steps Forms */}
          <div style={{ flex: 1 }}>
            
            {/* STEP 1: Basic Bio Details */}
            {activeStep === 1 && (
              <div className="animate-fade-in form-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 1: Introduction Profile</h2>
                  
                  {/* Auto-suggest help bubble */}
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Info size={12} /> Fill name & select skills to trigger AI Bio.
                  </span>
                </div>

                {/* Drag-Drop Resume Zone */}
                <div 
                  className={`glass-panel ${isDragOver ? 'glass-panel-glow' : ''}`} 
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleResumeDrop}
                  style={{
                    border: "2px dashed var(--border-medium)",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                    background: isDragOver ? "rgba(225, 117, 100, 0.05)" : "rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <Upload size={32} color="#E17564" style={{ margin: "0 auto 8px" }} />
                  <h4 style={{ fontSize: "14px", marginBottom: "4px" }}>Drag & Drop Resume File Here</h4>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Supports simple Text or PDF formats. (Parses and auto-populates everything!)</p>
                  
                  <div style={{ margin: "12px 0 6px", display: "flex", gap: "8px", justifyContent: "center" }}>
                    <input 
                      type="text" 
                      placeholder="Or paste resume text here..." 
                      value={resumeText}
                      onChange={e => setResumeText(e.target.value)}
                      className="form-input" 
                      style={{ fontSize: "12px", padding: "6px 12px", width: "60%" }}
                    />
                    <button 
                      onClick={handleResumeTextPaste} 
                      className="btn-secondary" 
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      Parse Text
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Professional Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={portfolio.fullName}
                    onChange={(e) => handlePortfolioChange("fullName", e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label>Professional Bio / Summary</label>
                    <button 
                      onClick={handleAIBioPolish} 
                      disabled={isAiGenerating}
                      className="btn-secondary"
                      style={{ padding: "4px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(225, 117, 100, 0.4)" }}
                    >
                      <Sparkles size={11} color="#E17564" />
                      <span>{isAiGenerating ? "Polishing..." : "AI Suggest Summary"}</span>
                    </button>
                  </div>
                  <textarea 
                    placeholder="A short summary of your professional expertise, stack, and interests..."
                    value={portfolio.bio}
                    onChange={(e) => handlePortfolioChange("bio", e.target.value)}
                    className="form-textarea"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Target Role Selector */}
            {activeStep === 2 && (
              <div className="animate-fade-in form-section">
                <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 2: Choose Target Role</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>This defines the keyword optimizations and shapes the theme templates for recruiter checks.</p>
                
                <div className="chip-group">
                  {["Frontend Developer", "Backend Engineer", "Full Stack Engineer", "ML Engineer", "UI/UX Designer", "DevOps Engineer", "Mobile Developer", "Data Scientist"].map(role => (
                    <button 
                      key={role} 
                      onClick={() => handlePortfolioChange("targetRole", role)}
                      className={`chip ${portfolio.targetRole === role ? 'active' : ''}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: "12px" }}>
                  <label>Or type custom role description</label>
                  <input 
                    type="text"
                    placeholder="e.g. Distributed Systems Architect"
                    value={portfolio.targetRole}
                    onChange={(e) => handlePortfolioChange("targetRole", e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Education */}
            {activeStep === 3 && (
              <div className="animate-fade-in form-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 3: Education Background</h2>
                  <button onClick={addEducation} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Plus size={12} /> Add Institution
                  </button>
                </div>

                {portfolio.education.map((ed, idx) => (
                  <div key={idx} style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-light)",
                    background: "rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    position: "relative"
                  }}>
                    <button 
                      onClick={() => deleteEducation(idx)} 
                      style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "rgba(239, 68, 68, 0.6)", cursor: "pointer" }}
                      title="Remove Education"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label>Degree / Certificate</label>
                        <input 
                          type="text"
                          value={ed.degree}
                          onChange={(e) => editEducation(idx, "degree", e.target.value)}
                          className="form-input"
                          placeholder="B.Tech Computer Science"
                        />
                      </div>
                      <div className="form-group">
                        <label>School / University</label>
                        <input 
                          type="text"
                          value={ed.school}
                          onChange={(e) => editEducation(idx, "school", e.target.value)}
                          className="form-input"
                          placeholder="Stanford University"
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ width: "50%" }}>
                      <label>Graduation Year</label>
                      <input 
                        type="text"
                        value={ed.year}
                        onChange={(e) => editEducation(idx, "year", e.target.value)}
                        className="form-input"
                        placeholder="2024"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 4: Technical Skills Tag Editor */}
            {activeStep === 4 && (
              <div className="animate-fade-in form-section">
                <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 4: Tech Stack (Tag Editor)</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Type a technology name (e.g. React, Python) and press **Enter** or **,** to add it to your profile tags.</p>
                
                <div className="tags-container">
                  {portfolio.skills.map(skill => (
                    <span key={skill} className="tag-badge">
                      <span>{skill}</span>
                      <button onClick={() => handleRemoveSkill(skill)}>×</button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    placeholder="Add technology..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="tag-input"
                  />
                </div>

                {/* Autocomplete helper chips */}
                <div style={{ marginTop: "12px" }}>
                  <span style={{ fontSize: "12px", color: "var(--color-coral)" }}>Common choices:</span>
                  <div className="chip-group" style={{ marginTop: "6px" }}>
                    {["React", "Node.js", "Python", "TypeScript", "AWS", "Figma", "Docker", "PostgreSQL", "Tailwind"].map(item => {
                      const present = portfolio.skills.includes(item);
                      return (
                        <button 
                          key={item} 
                          onClick={() => {
                            if (present) handleRemoveSkill(item);
                            else handlePortfolioChange("skills", [...portfolio.skills, item]);
                          }}
                          className={`chip ${present ? 'active' : ''}`}
                          style={{ fontSize: "11px", padding: "4px 10px" }}
                        >
                          {present ? `✓ ${item}` : `+ ${item}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Projects */}
            {activeStep === 5 && (
              <div className="animate-fade-in form-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 5: Dynamic Projects Showcase</h2>
                  <button onClick={addProject} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Plus size={12} /> Add Project
                  </button>
                </div>

                {portfolio.projects.map((proj, idx) => (
                  <div key={idx} style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-light)",
                    background: "rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    position: "relative"
                  }}>
                    <button 
                      onClick={() => deleteProject(idx)} 
                      style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "rgba(239, 68, 68, 0.6)", cursor: "pointer" }}
                      title="Remove Project"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="form-group">
                      <label>Project Title</label>
                      <input 
                        type="text"
                        value={proj.name}
                        onChange={(e) => editProject(idx, "name", e.target.value)}
                        className="form-input"
                        placeholder="e.g. Distributed Core Cache"
                      />
                    </div>

                    <div className="form-group">
                      <label>Project Description</label>
                      <textarea 
                        value={proj.description}
                        onChange={(e) => editProject(idx, "description", e.target.value)}
                        className="form-textarea"
                        placeholder="Detail what you built, how you scaled it, or any specific achievements..."
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label>Tech Stack Used (comma separated)</label>
                      <input 
                        type="text"
                        value={proj.techStack}
                        onChange={(e) => editProject(idx, "techStack", e.target.value)}
                        className="form-input"
                        placeholder="React, Redis, Node.js"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 6: Professional Experience */}
            {activeStep === 6 && (
              <div className="animate-fade-in form-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 6: Work / Internship Experience</h2>
                  <button onClick={addExperience} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Plus size={12} /> Add Job Position
                  </button>
                </div>

                {portfolio.experience.map((exp, idx) => (
                  <div key={idx} style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-light)",
                    background: "rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    position: "relative"
                  }}>
                    <button 
                      onClick={() => deleteExperience(idx)} 
                      style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "rgba(239, 68, 68, 0.6)", cursor: "pointer" }}
                      title="Remove Role"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label>Role / Position Title</label>
                        <input 
                          type="text"
                          value={exp.role}
                          onChange={(e) => editExperience(idx, "role", e.target.value)}
                          className="form-input"
                          placeholder="Frontend Engineer Intern"
                        />
                      </div>
                      <div className="form-group">
                        <label>Company / Organization</label>
                        <input 
                          type="text"
                          value={exp.company}
                          onChange={(e) => editExperience(idx, "company", e.target.value)}
                          className="form-input"
                          placeholder="Google Tech Solutions"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Duration Dates</label>
                      <input 
                        type="text"
                        value={exp.duration}
                        onChange={(e) => editExperience(idx, "duration", e.target.value)}
                        className="form-input"
                        placeholder="May 2023 - Present"
                      />
                    </div>

                    <div className="form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label>Responsibilities & Bullet Points (one per line)</label>
                        <button 
                          onClick={() => handleAIEnhanceExperience(idx)}
                          disabled={isAiGenerating}
                          className="btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", border: "1px solid rgba(225, 117, 100, 0.4)" }}
                        >
                          <Sparkles size={11} color="#E17564" />
                          <span>{isAiGenerating ? "Polishing..." : "AI Improve Bullets"}</span>
                        </button>
                      </div>
                      <textarea 
                        value={exp.responsibilities}
                        onChange={(e) => editExperience(idx, "responsibilities", e.target.value)}
                        className="form-textarea"
                        placeholder="• Spearheaded frontend build tasks using modular architectures..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 7: Achievements & Certifications */}
            {activeStep === 7 && (
              <div className="animate-fade-in form-section">
                <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 7: Achievements & Certifications</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>List significant credentials, credentials, or licenses to build social proof.</p>
                
                <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
                  <input 
                    type="text"
                    id="newAchInput"
                    placeholder="e.g. AWS Certified Developer Associate (2024)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addAchievement(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById("newAchInput");
                      addAchievement(input.value);
                      input.value = "";
                    }} 
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {portfolio.achievements.map((ach, idx) => (
                    <div key={idx} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      background: "rgba(0,0,0,0.15)",
                      border: "1px solid var(--border-light)"
                    }}>
                      <span style={{ fontSize: "13px" }}>✦ {ach}</span>
                      <button 
                        onClick={() => removeAchievement(idx)} 
                        style={{ background: "none", border: "none", color: "rgba(239, 68, 68, 0.6)", cursor: "pointer" }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 8: Links, GitHub Widget Setup & Custom Style Description */}
            {activeStep === 8 && (
              <div className="animate-fade-in form-section">
                <h2 style={{ fontSize: "20px", color: "var(--color-coral)" }}>Step 8: Connect Links & Bio Style</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email"
                      value={portfolio.email}
                      onChange={(e) => handlePortfolioChange("email", e.target.value)}
                      className="form-input"
                      placeholder="e.g. vance@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn Link</label>
                    <input 
                      type="text"
                      value={portfolio.linkedin}
                      onChange={(e) => handlePortfolioChange("linkedin", e.target.value)}
                      className="form-input"
                      placeholder="https://linkedin.com/in/eleanor"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label>GitHub Account URL</label>
                    <input 
                      type="text"
                      value={portfolio.github}
                      onChange={(e) => handlePortfolioChange("github", e.target.value)}
                      className="form-input"
                      placeholder="https://github.com/eleanor-dev"
                    />
                  </div>
                  
                  {/* GitHub username for stats API */}
                  <div className="form-group">
                    <label>GitHub Username (for Live Stats)</label>
                    <input 
                      type="text"
                      value={portfolio.githubUsername}
                      onChange={(e) => handlePortfolioChange("githubUsername", e.target.value)}
                      className="form-input"
                      placeholder="e.g. eleanor-dev"
                    />
                  </div>
                </div>

                {/* Include stats toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" }}>
                  <input 
                    type="checkbox"
                    id="statsToggle"
                    checked={portfolio.includeGithubStats}
                    onChange={(e) => handlePortfolioChange("includeGithubStats", e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--color-coral)" }}
                  />
                  <label htmlFor="statsToggle" style={{ fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
                    Include dynamic GitHub stats and contributions grid!
                  </label>
                </div>

                {/* AI Preferred Style Description */}
                <div className="form-group" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "12px" }}>
                  <label>Describe your custom style/theme preference (AI will adapt!)</label>
                  <input 
                    type="text"
                    placeholder="e.g. futuristic cyberpunk neon, stark retro publication, minimalist high-tech"
                    value={customStyleDesc}
                    onChange={e => setCustomStyleDesc(e.target.value)}
                    className="form-input"
                  />
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>This description influences how the AI polishes and highlights your bio summary in Step 1!</p>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
            <button 
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className="btn-secondary"
              style={{ padding: "10px 18px", fontSize: "13px" }}
            >
              <ArrowLeft size={14} /> Back
            </button>

            {activeStep < 8 ? (
              <button 
                onClick={() => setActiveStep(prev => Math.min(8, prev + 1))}
                className="btn-primary"
                style={{ padding: "10px 18px", fontSize: "13px" }}
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                onClick={() => setShareOverlay(true)}
                className="btn-primary"
                style={{ padding: "10px 20px", fontSize: "13px", background: "linear-gradient(135deg, var(--color-coral), var(--color-crimson))" }}
              >
                <Share2 size={14} /> Launch Portfolio
              </button>
            )}
          </div>

          {/* JOB READINESS BLOCK: ATS Scorer & Cover Letter Writer */}
          <div style={{ borderTop: "2px dashed var(--border-medium)", marginTop: "16px", paddingTop: "20px" }}>
            <h3 style={{ fontSize: "16px", color: "var(--color-coral)", marginBottom: "12px", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={18} />
              <span>Job-Readiness & ATS Optimization</span>
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", marginBottom: "16px" }}>
              {/* ATS radial score circle */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.15)", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>ATS Score</span>
                <div className="ats-score-ring" style={{ border: `4px solid ${atsScoreData.score > 80 ? '#22c55e' : atsScoreData.score > 50 ? '#eab308' : '#ef4444'}` }}>
                  {atsScoreData.score}%
                </div>
              </div>

              {/* ATS Checklist feedback items */}
              <div style={{ maxHeight: "140px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingRight: "4px" }}>
                {atsScoreData.feedback.length === 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#22c55e", fontSize: "12px" }}>
                    <CheckCircle2 size={14} /> Correct keyword matches! Your portfolio is recruiter-ready.
                  </div>
                ) : (
                  atsScoreData.feedback.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "12px" }}>
                      <AlertCircle size={14} color={item.severity === 'high' ? '#f87171' : '#eab308'} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <span style={{ fontWeight: "700", color: "var(--color-coral)" }}>{item.category}: </span>
                        <span style={{ color: "var(--text-muted)" }}>{item.text}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cover Letter Generator Section */}
            <div className="helper-card" style={{ background: "rgba(9, 18, 44, 0.4)", margin: 0 }}>
              <h4 style={{ fontSize: "14px", color: "var(--text-main)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} color="#E17564" /> Tailored Cover Letter Generator
              </h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                Instantly write a cover letter combining your details above with your target job description.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                <input 
                  type="text" 
                  placeholder="Target Job Title (e.g. React Developer)" 
                  value={coverJobTitle}
                  onChange={e => setCoverJobTitle(e.target.value)}
                  className="form-input" 
                  style={{ fontSize: "12px", padding: "8px" }}
                />
                <input 
                  type="text" 
                  placeholder="Key Job description guidelines..." 
                  value={coverJobDesc}
                  onChange={e => setCoverJobDesc(e.target.value)}
                  className="form-input" 
                  style={{ fontSize: "12px", padding: "8px" }}
                />
              </div>

              <button 
                onClick={handleGenerateCoverLetter}
                disabled={isAiGenerating}
                className="btn-secondary"
                style={{ width: "100%", padding: "8px", fontSize: "12px", border: "1px dashed var(--border-medium)" }}
              >
                {isAiGenerating ? "Writing Letter..." : "Generate AI Cover Letter"}
              </button>

              {generatedLetter && (
                <div style={{ marginTop: "12px" }} className="animate-fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", color: "var(--color-coral)", fontWeight: "600" }}>Generated letter:</span>
                    <button 
                      onClick={copyLetterToClipboard} 
                      className="btn-secondary" 
                      style={{ padding: "2px 6px", fontSize: "10px", display: "flex", alignItems: "center", gap: "2px" }}
                    >
                      <Copy size={10} /> Copy
                    </button>
                  </div>
                  <textarea 
                    value={generatedLetter} 
                    readOnly
                    className="form-textarea" 
                    style={{ fontSize: "11px", fontFamily: "monospace", minHeight: "120px", background: "#050a1b" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT WORKSPACE: Responsive Preview Screen */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px" }}>
          
          {/* Theme Selector panel */}
          <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "12px", textTransform: "uppercase", fontWeight: "700", color: "var(--color-coral)" }}>Select Visual Style Theme</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {THEME_LIST.map(theme => (
                <button 
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: `2px solid ${selectedTheme === theme.id ? 'var(--color-coral)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: "8px",
                    padding: "8px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "12px",
                    textAlign: "center",
                    transition: "var(--transition-smooth)"
                  }}
                  title={theme.name}
                >
                  <div style={{ width: "100%", height: "8px", borderRadius: "2px", background: theme.bg, marginBottom: "4px", border: "1px solid rgba(255,255,255,0.1)" }}></div>
                  <span style={{ fontSize: "10px", display: "block" }}>{theme.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Device Mockup Preview Screen */}
          <div className="glass-panel" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="preview-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fbbf24" }}></span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399" }}></span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "8px", fontFamily: "monospace" }}>Live Interactive Screen Sandbox</span>
              </div>

              {/* Desktop/Tablet/Mobile Viewport Toggles */}
              <div className="device-selectors">
                <button 
                  onClick={() => setPreviewDevice("desktop")} 
                  className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
                  title="Desktop View"
                >
                  <Monitor size={15} />
                </button>
                <button 
                  onClick={() => setPreviewDevice("tablet")} 
                  className={`device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
                  title="Tablet View"
                >
                  <Tablet size={15} />
                </button>
                <button 
                  onClick={() => setPreviewDevice("mobile")} 
                  className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
                  title="Mobile View"
                >
                  <Smartphone size={15} />
                </button>
              </div>
            </div>

            {/* Sandbox Sandbox Viewport */}
            <div className="preview-viewport">
              <div className={`device-frame-${previewDevice}`}>
                <iframe 
                  ref={iframeRef}
                  title="Live Portfolio Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    background: "white",
                    borderRadius: previewDevice === 'desktop' ? '0 0 8px 8px' : '0'
                  }}
                />
              </div>
            </div>
          </div>

          {/* GitHub Pages Host Guide */}
          <div className="glass-panel" style={{ padding: "16px" }}>
            <h4 style={{ fontSize: "13px", color: "var(--color-coral)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <ExternalLink size={14} /> Hosting on GitHub Pages (2-Min Guide)
            </h4>
            <ol style={{ fontSize: "11px", color: "var(--text-muted)", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <li>Click **Export Portfolio** to download your self-contained single-page <code>index.html</code> file.</li>
              <li>Go to your GitHub and create a new repository named <code>[your-username].github.io</code>.</li>
              <li>Drag & drop your <code>index.html</code> file into the repository root and click commit!</li>
              <li>Your site goes live instantly at <code>https://[your-username].github.io</code>!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
