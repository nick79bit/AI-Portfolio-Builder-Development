/**
 * Visual Themes definition engine.
 * Generates the full high-fidelity HTML and embedded styling for live previewing and static exports.
 */

export const THEME_LIST = [
  { id: 'midnight', name: 'Midnight Neon (Dark)', primaryColor: '#BE3144', bg: '#09122C' },
  { id: 'sunset', name: 'Warm Sunset (Glassmorphic)', primaryColor: '#E17564', bg: '#0c0717' },
  { id: 'slate', name: 'Crimson Slate (Corporate)', primaryColor: '#872341', bg: '#0f172a' },
  { id: 'minimal', name: 'Minimal Stark (Light)', primaryColor: '#BE3144', bg: '#ffffff' },
  { id: 'classic', name: 'Classic Elegance (Cream)', primaryColor: '#872341', bg: '#FDFBF7' },
  { id: 'bold', name: 'Bold High-Contrast (Steel)', primaryColor: '#E17564', bg: '#0B0C10' }
];

export function getThemeStyles(themeId) {
  switch (themeId) {
    case 'sunset':
      return `
        :root {
          --bg-primary: #0c0717;
          --bg-secondary: rgba(255, 255, 255, 0.03);
          --color-accent-1: #E17564;
          --color-accent-2: #BE3144;
          --color-text-main: #f3f4f6;
          --color-text-muted: #9ca3af;
          --border: rgba(225, 117, 100, 0.15);
          --card-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          --font-heading: 'Outfit', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --glass-effect: blur(12px);
        }
        body {
          background-image: radial-gradient(circle at 10% 20%, rgba(135, 35, 65, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(225, 117, 100, 0.1) 0%, transparent 40%);
        }
        .header-section {
          backdrop-filter: var(--glass-effect);
          -webkit-backdrop-filter: var(--glass-effect);
          border: 1px solid var(--border);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.02);
        }
        .section-card {
          backdrop-filter: var(--glass-effect);
          -webkit-backdrop-filter: var(--glass-effect);
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
        }
      `;
    case 'slate':
      return `
        :root {
          --bg-primary: #0f172a;
          --bg-secondary: #1e293b;
          --color-accent-1: #BE3144;
          --color-accent-2: #872341;
          --color-text-main: #f8fafc;
          --color-text-muted: #cbd5e1;
          --border: rgba(190, 49, 68, 0.3);
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          --font-heading: 'Georgia', serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --glass-effect: none;
        }
        .header-section {
          border-left: 6px solid var(--color-accent-1);
          background: var(--bg-secondary);
          border-radius: 4px;
        }
        .section-card {
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 2px solid var(--color-accent-2);
          background: var(--bg-secondary);
          border-radius: 8px;
        }
        .tech-chip {
          border-radius: 4px !important;
        }
      `;
    case 'minimal':
      return `
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --color-accent-1: #BE3144;
          --color-accent-2: #09122C;
          --color-text-main: #0f172a;
          --color-text-muted: #64748b;
          --border: #e2e8f0;
          --card-shadow: none;
          --font-heading: 'Outfit', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --glass-effect: none;
        }
        body {
          border-top: 6px solid var(--color-accent-1);
        }
        .header-section {
          border-bottom: 2px solid var(--color-accent-2);
          background: transparent;
          border-radius: 0;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .section-card {
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          border-radius: 0;
          box-shadow: none;
        }
        .tech-chip {
          background: white !important;
          border: 1px solid var(--border) !important;
          color: var(--color-text-main) !important;
          border-radius: 0 !important;
        }
        .nav-btn {
          border-radius: 0 !important;
        }
      `;
    case 'classic':
      return `
        :root {
          --bg-primary: #FDFBF7;
          --bg-secondary: #ffffff;
          --color-accent-1: #872341;
          --color-accent-2: #5A1827;
          --color-text-main: #1E2022;
          --color-text-muted: #5C5E62;
          --border: #E5E0D8;
          --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          --font-heading: 'Georgia', 'Times New Roman', serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --glass-effect: none;
        }
        body {
          background-color: var(--bg-primary);
        }
        .header-section {
          background: transparent;
          border: none;
          border-bottom: 2px double var(--color-accent-1);
          padding-bottom: 24px !important;
          border-radius: 0;
          text-align: center;
        }
        .header-main {
          justify-content: center !important;
          flex-direction: column;
          align-items: center !important;
          gap: 12px !important;
        }
        .name-heading {
          font-size: 2.8rem;
          background: none !important;
          -webkit-text-fill-color: var(--color-text-main) !important;
          color: var(--color-text-main) !important;
          font-weight: 400;
        }
        .role-badge {
          background: transparent !important;
          border: none !important;
          color: var(--color-accent-1) !important;
          font-style: italic;
          font-size: 1.1rem;
          padding: 0;
        }
        .social-group {
          margin-top: 8px;
        }
        .social-link {
          border: 1px solid var(--border) !important;
          background: var(--bg-secondary) !important;
        }
        .social-link:hover {
          background: var(--color-accent-1) !important;
          color: white !important;
        }
        .section-title {
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 1.4rem;
          border-bottom: 1px solid var(--color-accent-1);
        }
        .section-card {
          border: none;
          border-bottom: 1px dashed var(--border);
          background: transparent;
          border-radius: 0;
          padding: 16px 0;
          box-shadow: none;
        }
        .section-card:hover {
          transform: none !important;
          box-shadow: none !important;
          border-color: var(--border) !important;
        }
        .tech-chip {
          background: var(--bg-secondary) !important;
          border: 1px solid var(--border) !important;
          color: var(--color-text-main) !important;
          border-radius: 2px !important;
        }
      `;
    case 'bold':
      return `
        :root {
          --bg-primary: #0B0C10;
          --bg-secondary: #1F2833;
          --color-accent-1: #E17564;
          --color-accent-2: #BE3144;
          --color-text-main: #F5F5F5;
          --color-text-muted: #C5C6C7;
          --border: #45A29E;
          --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          --font-heading: 'Outfit', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --glass-effect: none;
        }
        body {
          border-left: 10px solid var(--color-accent-2);
        }
        .header-section {
          background: linear-gradient(135deg, var(--color-accent-2), var(--color-accent-1));
          border: none;
          border-radius: 0 20px 20px 0;
          padding: 48px !important;
          box-shadow: var(--card-shadow);
        }
        .name-heading {
          font-size: 3.5rem;
          background: none !important;
          -webkit-text-fill-color: #ffffff !important;
          color: #ffffff !important;
          font-weight: 900;
          letter-spacing: -0.04em;
        }
        .role-badge {
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
          font-weight: 700;
          font-size: 1rem;
        }
        .bio-text {
          color: #ffffff !important;
          opacity: 0.9;
        }
        .social-link {
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        .section-title {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 4px solid var(--color-accent-1);
        }
        .section-card {
          border: 2px solid var(--bg-secondary);
          background: var(--bg-secondary);
          border-radius: 8px;
          box-shadow: var(--card-shadow);
        }
        .section-card:hover {
          border-color: var(--color-accent-1) !important;
          transform: scale(1.02);
        }
        .tech-chip {
          background: linear-gradient(135deg, var(--color-accent-2), var(--color-accent-1)) !important;
          border: none !important;
          color: white !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
        }
      `;
    case 'midnight':
    default:
      return `
        :root {
          --bg-primary: #09122C;
          --bg-secondary: #0d173c;
          --color-accent-1: #BE3144;
          --color-accent-2: #E17564;
          --color-text-main: #f8fafc;
          --color-text-muted: #94a3b8;
          --border: rgba(225, 117, 100, 0.15);
          --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          --font-heading: 'Outfit', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --glass-effect: none;
        }
        body {
          background-image: linear-gradient(180deg, #09122C 0%, #050a1b 100%);
        }
        .header-section {
          background: linear-gradient(135deg, rgba(13, 23, 60, 0.8), rgba(9, 18, 44, 0.9));
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--card-shadow), 0 0 20px rgba(190, 49, 68, 0.1);
        }
        .section-card {
          background: rgba(13, 23, 60, 0.6);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--card-shadow);
        }
      `;
  }
}

export function generatePortfolioHtml(portfolio, themeId = 'midnight') {
  if (!portfolio) return '';

  const {
    fullName = 'Professional Developer',
    targetRole = 'Software Engineer',
    email = '',
    github = '',
    linkedin = '',
    bio = '',
    skills = [],
    projects = [],
    experience = [],
    education = [],
    achievements = [],
    includeGithubStats = false,
    githubUsername = ''
  } = portfolio;

  // Custom styling tokens
  const themeStyles = getThemeStyles(themeId);
  const primaryAccent = themeId === 'minimal' ? '#BE3144' : '#E17564';
  
  // Link layouts
  const linksHtml = `
    ${email ? `<a href="mailto:${email}" target="_blank" class="social-link" title="Email"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>` : ''}
    ${github ? `<a href="${github}" target="_blank" class="social-link" title="GitHub"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>` : ''}
    ${linkedin ? `<a href="${linkedin}" target="_blank" class="social-link" title="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>` : ''}
  `;

  // Render Skills
  const skillsHtml = skills.map(skill => `<span class="tech-chip">${skill}</span>`).join('');

  // Render Projects
  const projectsHtml = projects.map(proj => {
    const projStackHtml = proj.techStack 
      ? proj.techStack.split(',').map(s => `<span class="project-tag-chip">${s.trim()}</span>`).join('') 
      : '';
    return `
      <div class="section-card project-card animate-scroll">
        <h3 class="project-title">${proj.name}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-footer">
          <div class="project-tags">${projStackHtml}</div>
          <div class="project-links">
            ${githubUsername ? `<a href="https://github.com/${githubUsername}/${proj.name.toLowerCase().replace(/\s+/g, '-')}" target="_blank" class="project-link">GitHub ↗</a>` : `<a href="#" class="project-link">Codebase ↗</a>`}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Experience
  const expHtml = experience.map(exp => {
    const formattedBullets = exp.responsibilities 
      ? exp.responsibilities.split('\n').map(bullet => `<li class="exp-bullet">${bullet.replace(/^[-*•\s]+/, '')}</li>`).join('')
      : '';
    return `
      <div class="section-card exp-card animate-scroll">
        <div class="exp-header">
          <div>
            <h3 class="exp-role">${exp.role}</h3>
            <span class="exp-company">${exp.company}</span>
          </div>
          <span class="exp-duration">${exp.duration}</span>
        </div>
        <ul class="exp-bullets">
          ${formattedBullets}
        </ul>
      </div>
    `;
  }).join('');

  // Render Education
  const edHtml = education.map(ed => `
    <div class="section-card ed-card">
      <div class="ed-header">
        <h3 class="ed-degree">${ed.degree}</h3>
        <span class="ed-year">${ed.year}</span>
      </div>
      <p class="ed-school">${ed.school}</p>
    </div>
  `).join('');

  // Render Achievements
  const achHtml = achievements.map(ach => `
    <li class="achievement-item">
      <span class="achievement-bullet">✦</span>
      <span class="achievement-text">${ach}</span>
    </li>
  `).join('');

  // GitHub Stats Block
  let githubStatsHtml = '';
  if (includeGithubStats && githubUsername) {
    githubStatsHtml = `
      <section class="section animate-scroll">
        <h2 class="section-title">GitHub Developer Stats</h2>
        <div class="github-stats-container">
          <div class="stats-card">
            <img src="https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=tokyonight&hide_border=true&bg_color=09122C&title_color=E17564&icon_color=BE3144&text_color=94a3b8" alt="GitHub Stats" class="stats-img" />
          </div>
          <div class="stats-card">
            <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=tokyonight&hide_border=true&bg_color=09122C&title_color=E17564&text_color=94a3b8" alt="Top Langs" class="stats-img" />
          </div>
        </div>
      </section>
    `;
  }

  // Construct complete HTML file
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} | ${targetRole} Portfolio</title>
  <meta name="description" content="Personal portfolio of ${fullName}, specialized as a ${targetRole}. Check out my tech stack, projects, and work experiences.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* Theme Reset */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    ${themeStyles}

    /* Core Styles */
    body {
      font-family: var(--font-body);
      background-color: var(--bg-primary);
      color: var(--color-text-main);
      line-height: 1.6;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 24px;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    /* Navigation Header */
    .header-section {
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 20px;
    }

    .name-heading {
      font-family: var(--font-heading);
      font-size: 3.2rem;
      line-height: 1.1;
      font-weight: 800;
      color: var(--color-text-main);
      background: linear-gradient(135deg, var(--color-text-main), var(--color-accent-1));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }

    .role-badge {
      display: inline-block;
      padding: 6px 16px;
      background: linear-gradient(135deg, rgba(190, 49, 68, 0.15), rgba(135, 35, 65, 0.25));
      border: 1px solid var(--border);
      border-radius: 9999px;
      color: var(--color-accent-1);
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.02em;
    }

    .bio-text {
      color: var(--color-text-muted);
      font-size: 1.1rem;
      max-width: 700px;
      margin-top: 16px;
    }

    .social-group {
      display: flex;
      gap: 12px;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--color-text-muted);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .social-link:hover {
      color: var(--color-accent-1);
      background: rgba(225, 117, 100, 0.1);
      transform: translateY(-2px);
      border-color: var(--color-accent-1);
      box-shadow: 0 0 12px rgba(225, 117, 100, 0.2);
    }

    /* Grid Sections */
    .sections-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr;
      gap: 32px;
    }

    @media (max-width: 850px) {
      .sections-grid {
        grid-template-columns: 1fr;
      }
      .name-heading {
        font-size: 2.5rem;
      }
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--color-text-main);
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid var(--border);
      padding-bottom: 8px;
    }

    .section-card {
      padding: 24px;
      transition: all 0.3s ease;
    }

    .section-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--card-shadow), 0 0 15px rgba(225, 117, 100, 0.1);
      border-color: rgba(225, 117, 100, 0.35);
    }

    /* Technical Skills Grid */
    .skills-block {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tech-chip {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--color-text-main);
      padding: 8px 14px;
      border-radius: 9999px;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .tech-chip:hover {
      background: rgba(225, 117, 100, 0.08);
      border-color: var(--color-accent-1);
    }

    /* Projects styling */
    .project-card {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .project-title {
      font-size: 1.3rem;
      color: var(--color-text-main);
    }

    .project-desc {
      color: var(--color-text-muted);
      font-size: 0.95rem;
      flex: 1;
    }

    .project-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .project-tag-chip {
      font-size: 0.75rem;
      background: rgba(190, 49, 68, 0.1);
      border: 1px solid rgba(190, 49, 68, 0.2);
      color: var(--color-accent-1);
      padding: 2px 8px;
      border-radius: 4px;
    }

    .project-link {
      font-size: 0.88rem;
      color: var(--color-accent-1);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .project-link:hover {
      text-decoration: underline;
      color: var(--color-text-main);
    }

    /* Experience Bullet items */
    .exp-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 8px;
    }

    .exp-role {
      font-size: 1.25rem;
      color: var(--color-text-main);
      margin-bottom: 2px;
    }

    .exp-company {
      font-size: 0.95rem;
      color: var(--color-accent-1);
      font-weight: 600;
    }

    .exp-duration {
      font-size: 0.88rem;
      color: var(--color-text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid var(--border);
    }

    .exp-bullets {
      padding-left: 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: var(--color-text-muted);
      font-size: 0.95rem;
    }

    .exp-bullet {
      list-style-type: square;
    }

    /* Education styles */
    .ed-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .ed-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ed-degree {
      font-size: 1.1rem;
      color: var(--color-text-main);
    }

    .ed-year {
      font-size: 0.88rem;
      color: var(--color-accent-1);
      font-weight: 600;
    }

    .ed-school {
      color: var(--color-text-muted);
      font-size: 0.92rem;
    }

    /* Achievements list */
    .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      list-style: none;
    }

    .achievement-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .achievement-bullet {
      color: var(--color-accent-1);
      font-weight: 700;
    }

    .achievement-text {
      color: var(--color-text-muted);
      font-size: 0.95rem;
    }

    /* GitHub section */
    .github-stats-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 700px) {
      .github-stats-container {
        grid-template-columns: 1fr;
      }
    }

    .stats-card {
      background: rgba(13, 23, 60, 0.6);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .stats-img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
    }

    /* Scroll animations classes */
    .animate-scroll {
      opacity: 0;
      transform: translateY(20px);
      animation: revealScroll 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes revealScroll {
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header Block -->
    <header class="header-section">
      <div class="header-main">
        <div>
          <h1 class="name-heading">${fullName}</h1>
          <span class="role-badge">${targetRole}</span>
        </div>
        <div class="social-group">
          ${linksHtml}
        </div>
      </div>
      <p class="bio-text">${bio}</p>
    </header>

    <div class="sections-grid">
      <!-- Left Column: Experience & Projects -->
      <main class="section">
        <!-- Projects Section -->
        ${projectsHtml ? `
        <section class="section animate-scroll">
          <h2 class="section-title">Projects</h2>
          ${projectsHtml}
        </section>
        ` : ''}

        <!-- Experience Section -->
        ${expHtml ? `
        <section class="section animate-scroll" style="animation-delay: 0.1s">
          <h2 class="section-title">Professional Experience</h2>
          ${expHtml}
        </section>
        ` : ''}
      </main>

      <!-- Right Column: Skills, Education, Achievements -->
      <aside class="section">
        <!-- Technical Stack -->
        ${skillsHtml ? `
        <section class="section animate-scroll">
          <h2 class="section-title">Tech Stack</h2>
          <div class="section-card">
            <div class="skills-block">
              ${skillsHtml}
            </div>
          </div>
        </section>
        ` : ''}

        <!-- Education Section -->
        ${edHtml ? `
        <section class="section animate-scroll" style="animation-delay: 0.1s">
          <h2 class="section-title">Education</h2>
          ${edHtml}
        </section>
        ` : ''}

        <!-- Achievements Section -->
        ${achHtml ? `
        <section class="section animate-scroll" style="animation-delay: 0.2s">
          <h2 class="section-title">Achievements</h2>
          <div class="section-card">
            <ul class="achievements-list">
              ${achHtml}
            </ul>
          </div>
        </section>
        ` : ''}
      </aside>
    </div>

    <!-- GitHub Section (if active) -->
    ${githubStatsHtml}
  </div>

  <script>
    // Optional interactive animations on scroll load
    document.addEventListener("DOMContentLoaded", () => {
      const cards = document.querySelectorAll('.animate-scroll');
      cards.forEach((card, index) => {
        card.style.animationDelay = (index * 0.05) + 's';
      });
    });
  </script>
</body>
</html>`;
}
