/**
 * AI Engine & Analytics System
 * Handles Resume Parsing, ATS scoring, offline content generation, and optional live Gemini API integration.
 */

// Common action verbs preferred by ATS and recruiters
const ATS_ACTION_VERBS = [
  "Spearheaded", "Engineered", "Orchestrated", "Designed", "Optimized", 
  "Architected", "Pioneered", "Implemented", "Redesigned", "Streamlined",
  "Developed", "Automated", "Formulated", "Accelerated", "Delivered",
  "Maximised", "Cultivated", "Overhauled", "Executed", "Expanded"
];

// Tech skill keywords for parsing detection
const KNOWN_SKILLS = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "HTML", "CSS", "SQL", "NoSQL", "Bash",
  // Frameworks/Libs
  "React", "Angular", "Vue", "Next.js", "Svelte", "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", 
  "Tailwind", "Bootstrap", "jQuery", "Redux", "GraphQL", "PyTorch", "TensorFlow", "React Native", "Flutter",
  // Databases/Tools
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "SQLite", "Firebase", "DynamoDB", "Git", "GitHub", "Docker", "Kubernetes", 
  "AWS", "Google Cloud", "GCP", "Azure", "Vercel", "Netlify", "Heroku", "Figma", "Jira", "Linux", "Webpack", "Vite"
];

/**
 * 1. SIMULATED RESUME PARSER
 * Extracts data from plain text representation of a resume.
 */
export function parseResumeText(text) {
  if (!text || text.trim().length === 0) return null;
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const data = {
    fullName: "",
    email: "",
    github: "",
    linkedin: "",
    targetRole: "",
    skills: [],
    projects: [],
    experience: [],
    education: [],
    achievements: []
  };

  // Try to find Name (typically first non-empty line or capitalized short line)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.split(' ').length <= 4 && /^[A-Z][a-zA-Z\s]+$/.test(line) && !line.toLowerCase().includes("resume") && !line.toLowerCase().includes("cv")) {
      data.fullName = line;
      break;
    }
  }
  if (!data.fullName && lines[0]) data.fullName = lines[0].substring(0, 30);

  // Email match
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) data.email = emailMatch[0];

  // GitHub match
  const githubRegex = /(github\.com\/[a-zA-Z0-9_-]+)/i;
  const githubMatch = text.match(githubRegex);
  if (githubMatch) data.github = "https://" + githubMatch[1].toLowerCase();

  // LinkedIn match
  const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const linkedinMatch = text.match(linkedinRegex);
  if (linkedinMatch) data.linkedin = "https://" + linkedinMatch[1].toLowerCase();

  // Role detection
  const lowerText = text.toLowerCase();
  if (lowerText.includes("frontend") || lowerText.includes("front-end")) data.targetRole = "Frontend Developer";
  else if (lowerText.includes("fullstack") || lowerText.includes("full-stack")) data.targetRole = "Full Stack Engineer";
  else if (lowerText.includes("backend") || lowerText.includes("back-end")) data.targetRole = "Backend Engineer";
  else if (lowerText.includes("machine learning") || lowerText.includes(" ml ") || lowerText.includes("deep learning")) data.targetRole = "ML Engineer";
  else if (lowerText.includes("ui") || lowerText.includes("ux") || lowerText.includes("designer")) data.targetRole = "UI/UX Designer";
  else if (lowerText.includes("devops") || lowerText.includes("site reliability")) data.targetRole = "DevOps Engineer";
  else if (lowerText.includes("mobile") || lowerText.includes("android") || lowerText.includes("ios")) data.targetRole = "Mobile Developer";
  else data.targetRole = "Software Engineer";

  // Skill extraction
  KNOWN_SKILLS.forEach(skill => {
    // Word boundary check for safe skill parsing
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      data.skills.push(skill);
    }
  });

  // Basic Section Parsing
  let currentSection = "";
  let currentProject = null;
  let currentJob = null;
  let currentEd = null;

  lines.forEach((line) => {
    const lowerLine = line.toLowerCase();
    
    // Section headers detection
    if (/experience|employment|work history|career/i.test(line) && line.length < 30) {
      currentSection = "experience";
      return;
    }
    if (/projects|personal work|key accomplishments/i.test(line) && line.length < 30) {
      currentSection = "projects";
      return;
    }
    if (/education|academic/i.test(line) && line.length < 30) {
      currentSection = "education";
      return;
    }
    if (/awards|certifications|achievements|credentials/i.test(line) && line.length < 35) {
      currentSection = "achievements";
      return;
    }

    if (currentSection === "projects") {
      // If line is short and bold-like, treat as project title
      if (line.length > 3 && line.length < 40 && !line.includes(":") && !line.startsWith("-") && !line.startsWith("*")) {
        if (currentProject) data.projects.push(currentProject);
        currentProject = { name: line, description: "", techStack: "" };
      } else if (currentProject && (line.startsWith("-") || line.startsWith("*") || line.startsWith("•"))) {
        const desc = line.replace(/^[-*•\s]+/, "");
        currentProject.description += (currentProject.description ? " " : "") + desc;
        
        // Try extracting tech keywords for project stack
        KNOWN_SKILLS.forEach(s => {
          if (new RegExp(`\\b${s}\\b`, 'i').test(line) && !currentProject.techStack.includes(s)) {
            currentProject.techStack += (currentProject.techStack ? ", " : "") + s;
          }
        });
      }
    }

    else if (currentSection === "experience") {
      if (line.length > 4 && line.length < 50 && !line.startsWith("-") && !line.startsWith("*") && (line.includes("at") || line.includes("|") || line.includes(" - ") || /manager|developer|engineer|intern|lead|analyst/i.test(line))) {
        if (currentJob) data.experience.push(currentJob);
        
        let company = "Company";
        let role = line;
        
        if (line.includes(" at ")) {
          const parts = line.split(" at ");
          role = parts[0].trim();
          company = parts[1].trim();
        } else if (line.includes("|")) {
          const parts = line.split("|");
          role = parts[0].trim();
          company = parts[1].trim();
        }
        
        currentJob = {
          role: role.substring(0, 40),
          company: company.substring(0, 40),
          duration: "2024 - Present",
          responsibilities: ""
        };
      } else if (currentJob && (line.startsWith("-") || line.startsWith("*") || line.startsWith("•"))) {
        const desc = line.replace(/^[-*•\s]+/, "");
        currentJob.responsibilities += (currentJob.responsibilities ? "\n" : "") + "• " + desc;
      }
    }

    else if (currentSection === "education") {
      if (line.length > 5 && line.length < 60 && !line.startsWith("-") && !line.startsWith("*") && /degree|bachelor|master|university|college|school|b\.tech|b\.s|b\.sc|m\.s|m\.tech/i.test(line)) {
        if (currentEd) data.education.push(currentEd);
        currentEd = {
          degree: line.substring(0, 50),
          school: "Institution",
          year: "2023"
        };
        // Simple regex to extract years
        const yearMatch = line.match(/\b(20\d{2})\b/);
        if (yearMatch) currentEd.year = yearMatch[0];
      } else if (currentEd && line.length < 80) {
        if (currentEd.school === "Institution") {
          currentEd.school = line;
        } else {
          currentEd.degree += " (" + line + ")";
        }
      }
    }

    else if (currentSection === "achievements") {
      if (line.length > 3 && line.length < 100) {
        data.achievements.push(line.replace(/^[-*•\s]+/, ""));
      }
    }
  });

  // Push pending elements
  if (currentProject) data.projects.push(currentProject);
  if (currentJob) data.experience.push(currentJob);
  if (currentEd) data.education.push(currentEd);

  // Fallback defaults if sections empty
  if (data.projects.length === 0) {
    data.projects.push({ name: "Personal Portfolio Builder", description: "Built a reactive client-side resume parsing and visual portfolio generation tool using React and HTML5 canvas APIs.", techStack: "React, Webpack, CSS3" });
  }
  if (data.experience.length === 0) {
    data.experience.push({ role: "Junior Software Engineer", company: "Innovative Tech Labs", duration: "2024 - Present", responsibilities: "• Implemented dynamic web experiences utilizing modern front-end layouts.\n• Managed continuous deployment pipelines across sandbox environments." });
  }
  if (data.education.length === 0) {
    data.education.push({ degree: "B.S. in Computer Science", school: "State Technology University", year: "2023" });
  }
  if (data.achievements.length === 0) {
    data.achievements.push("Certified AWS Cloud Practitioner");
    data.achievements.push("Winner of Regional College Hackathon 2024");
  }

  return data;
}

/**
 * 2. ATS SCANNER & ANALYZER
 * Analyzes the user portfolio data to score and suggest exact recruiter-ready improvements.
 */
export function calculateATSScore(portfolio) {
  let score = 30; // base score
  const feedback = [];

  if (!portfolio) return { score: 0, feedback: [] };

  // Name & Contact
  if (portfolio.fullName && portfolio.fullName.trim().length > 3) {
    score += 5;
  } else {
    feedback.push({ category: "Profile", text: "Add your full professional name to your profile.", severity: "high" });
  }

  // Links Presence
  let linkCount = 0;
  if (portfolio.email) linkCount++;
  if (portfolio.github) linkCount++;
  if (portfolio.linkedin) linkCount++;

  if (linkCount === 3) {
    score += 15;
  } else if (linkCount > 0) {
    score += linkCount * 4;
    feedback.push({ category: "Contact Links", text: "Complete all key contact links (Email, GitHub, LinkedIn) to maximize recruiters' outreach channels.", severity: "medium" });
  } else {
    feedback.push({ category: "Contact Links", text: "Ensure your GitHub, LinkedIn, and Email are attached to simplify recruitment communication.", severity: "high" });
  }

  // Role Chip Selector
  if (portfolio.targetRole && portfolio.targetRole.trim().length > 2) {
    score += 10;
  } else {
    feedback.push({ category: "Target Role", text: "Choose a target role (e.g., Frontend, ML) to specify your niche.", severity: "high" });
  }

  // Technical Skills (Density test)
  const skillsCount = portfolio.skills ? portfolio.skills.length : 0;
  if (skillsCount >= 10) {
    score += 15;
  } else if (skillsCount >= 5) {
    score += 10;
    feedback.push({ category: "Skills Density", text: "Add at least 10 core technical skills to pass keywords screening bots.", severity: "low" });
  } else if (skillsCount > 0) {
    score += 5;
    feedback.push({ category: "Skills Density", text: "Add at least 5 tech skills; currently, your list is too sparse to attract keyword parsers.", severity: "high" });
  } else {
    feedback.push({ category: "Skills Density", text: "No technical skills listed! Recruiters look for concrete skill tags.", severity: "high" });
  }

  // Projects Analysis
  const projects = portfolio.projects || [];
  if (projects.length >= 3) {
    score += 15;
  } else if (projects.length > 0) {
    score += projects.length * 5;
    feedback.push({ category: "Projects Showcase", text: "Aim to highlight at least 3 active portfolio projects to demonstrate scope.", severity: "medium" });
  } else {
    feedback.push({ category: "Projects Showcase", text: "Add details of at least 2 relevant projects demonstrating your technology skills.", severity: "high" });
  }

  // Check project descriptions for tech stacks and URLs
  projects.forEach((proj, idx) => {
    if (proj.description && proj.description.split(' ').length < 10) {
      feedback.push({ category: "Projects Detail", text: `Project ${idx + 1} ("${proj.name || 'Untitled'}") has a very short description. Expand on what you built and how.`, severity: "medium" });
    }
    if (!proj.techStack) {
      feedback.push({ category: "Projects Tech", text: `Define a target tech stack for project "${proj.name || 'Untitled'}" so recruiters see your applied capabilities.`, severity: "high" });
    }
  });

  // Experience Analysis & Action Verbs
  const experience = portfolio.experience || [];
  if (experience.length >= 1) {
    score += 10;
    
    // Search descriptions for action verbs
    let verbCount = 0;
    experience.forEach(job => {
      const resp = (job.responsibilities || "").toLowerCase();
      ATS_ACTION_VERBS.forEach(verb => {
        if (resp.includes(verb.toLowerCase())) verbCount++;
      });
    });

    if (verbCount >= 3) {
      score += 10;
    } else {
      score += Math.min(10, verbCount * 3);
      feedback.push({ 
        category: "Action-Oriented Language", 
        text: "Increase the density of strong action verbs (e.g. 'Spearheaded', 'Engineered', 'Optimized') in your job bullet points to sound impact-oriented.", 
        severity: "medium" 
      });
    }
  } else {
    feedback.push({ category: "Experience", text: "List your previous job history or internship experience. If a recent graduate, include relevant university academic positions.", severity: "medium" });
  }

  // Education Verification
  if (portfolio.education && portfolio.education.length > 0) {
    score += 5;
  } else {
    feedback.push({ category: "Education", text: "Mention your educational degrees or active online bootcamps.", severity: "medium" });
  }

  return {
    score: Math.min(100, score),
    feedback: feedback
  };
}

/**
 * 3. OFFLINE GENERATIVE AI ENGINE
 * Instant offline generative logic for bios, cover letters, and bullet point enhancements.
 */
export function generateOfflineBio(fullName, role, skills, stylePreference) {
  const name = fullName || "Professional Developer";
  const primaryRole = role || "Software Engineer";
  const skillList = skills && skills.length > 0 ? skills.slice(0, 4).join(', ') : "Modern Web Frameworks, System Design";
  
  const bios = {
    modern: `I am an ambitious ${primaryRole} dedicated to crafting performant, visually captivating digital products. Specialized in leveraging ${skillList}, I bridge the gap between creative design layouts and powerful backend performance. Let's engineer something memorable.`,
    creative: `Designing modern layouts, coding clean features, and developing interactive web apps are what excite me. As a specialized ${primaryRole}, my technical foundation in ${skillList} empowers me to bring advanced designs to life with fluid motion and pixel-perfect attention to detail.`,
    executive: `Result-driven and detail-oriented ${primaryRole} with deep expertise in technical engineering systems, specifically ${skillList}. Recognized for optimizing architecture scaling, driving clean coding conventions, and building systems that directly accelerate customer business metrics.`,
    minimalist: `Focussed ${primaryRole}. Specialized in simple, fast, and structured engineering. Powered by ${skillList}.`
  };

  const styleKey = (stylePreference || "modern").toLowerCase();
  return bios[styleKey] || bios.modern;
}

export function enhanceDraftBullet(draftText) {
  if (!draftText || draftText.trim().length === 0) return "";
  
  // Pick random strong action verbs
  const verb1 = ATS_ACTION_VERBS[Math.floor(Math.random() * ATS_ACTION_VERBS.length)];
  const verb2 = ATS_ACTION_VERBS[(Math.floor(Math.random() * ATS_ACTION_VERBS.length) + 1) % ATS_ACTION_VERBS.length];
  
  const cleans = draftText.replace(/^[-*•\s]+/, "").trim();
  
  // Pre-configured conversion patterns
  if (cleans.toLowerCase().includes("worked on") || cleans.toLowerCase().includes("built a")) {
    return `• ${verb1} a robust architecture for the application, optimizing execution speeds by 25% using modern engineering models.`;
  }
  if (cleans.toLowerCase().includes("made the website faster") || cleans.toLowerCase().includes("fixed speed")) {
    return `• ${verb1} front-end loading speeds, utilizing code splitting and custom rendering pipelines to achieve a 40% reduction in bounce rate.`;
  }
  if (cleans.toLowerCase().includes("helped users") || cleans.toLowerCase().includes("added user login")) {
    return `• ${verb1} secure OAuth flows and user verification panels, ensuring seamless onboarding for over 5,000+ monthly active platform users.`;
  }
  
  return `• ${verb1} key application features and ${verb2.toLowerCase()} continuous deployment steps to elevate software robustness and team development cycles.`;
}

export function generateOfflineCoverLetter(portfolio, jobTitle, jobDesc) {
  const name = portfolio.fullName || "Candidate Name";
  const role = portfolio.targetRole || "Software Developer";
  const email = portfolio.email || "candidate@email.com";
  const phone = "Your Contact Number";
  const linkedin = portfolio.linkedin || "linkedin.com/in/username";
  const targetJob = jobTitle || "Target Software Engineer Position";
  
  const skillHighlights = portfolio.skills && portfolio.skills.length > 0 
    ? `leveraging my proficiency in ${portfolio.skills.slice(0, 5).join(', ')}` 
    : "employing my solid engineering foundation and technical skillsets";
    
  const projectHighlights = portfolio.projects && portfolio.projects.length > 0
    ? `Specifically, my work on "${portfolio.projects[0].name}" – where I built a system incorporating ${portfolio.projects[0].techStack || 'key technologies'} – matches the scale of the product architecture details you described.`
    : "My custom codebase submissions demonstrate a strong affinity for clean structure, scalability, and robust visual layout styling.";

  return `[${name}]
[${email}] | [${linkedin}]

Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${targetJob} position. With my background as a ${role} and a rich catalog of software applications under my belt, I am incredibly excited about the prospect of bringing my unique blending of technical engineering and visual styling to your engineering division.

Your description of the target responsibilities strongly resonates with my background. Over the course of my career, I have focused on building highly responsive, scalable systems. In my active projects, I have successfully integrated core capabilities ${skillHighlights}. 

${projectHighlights}

Furthermore, my development philosophy values rapid iteration, robust automated checks, and precise UI animations. I thrive on collaborating across multi-disciplinary teams to translate conceptual wireframes into high-performance web products that users love.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my skillsets, project experience, and technical focus align with the goals of your engineering division.

Sincerely,

${name}`;
}

/**
 * 4. LIVE GEMINI API CONNECTOR
 * Contacts Google's official Gemini developer API directly from user's client browser.
 */
export async function generateWithGemini(apiKey, promptText) {
  if (!apiKey) throw new Error("A Gemini API Key is required to use the online generator.");
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "Failed to prompt Gemini API. Verify your API key.");
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) throw new Error("Empty response received from Gemini model.");
    
    return generatedText.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
