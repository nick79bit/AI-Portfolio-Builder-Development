# ⚡ AI-Powered Portfolio Builder & Recruiter Optimizer

An intelligent, interactive web application built with **React, Vite, and Vanilla CSS**. It empowers developers to parse resumes, complete an intuitive 8-step creation wizard, evaluate job-readiness with real-time ATS scoring, and instantly export fully responsive, gorgeous portfolios using customized visual themes.

---

## 🎨 Core Color Palette (Midnight & Warm Glowing Accents)
This application features a premium visual aesthetic custom-built around four harmonious brand tokens:
*   **Primary Dark Navy / Background:** `#09122C`
*   **Deep Burgundy / Contrast:** `#872341`
*   **Vibrant Crimson / Accents:** `#BE3144`
*   **Warm Coral / Highlights:** `#E17564`

---

## 🌟 Key Features

### 1. 📋 Guided 8-Step Recruiter Wizard
*   **Step 1: Bio Details** – Custom summary with AI text generation capabilities.
*   **Step 2: Role Selector** – Interactive chip-based selector.
*   **Step 3: Education** – Academic credentials list editor.
*   **Step 4: Tech Stack** – Dynamic tag-based skill organizer.
*   **Step 5: Projects** – Multi-card project showcase with URLs.
*   **Step 6: Work History** – Professional position logs with bullet points.
*   **Step 7: Achievements** – Award and certification credentials tracker.
*   **Step 8: Contact & Style** – Social links and custom visual preferences.

### 2. 🤖 Hybrid AI Intelligence (Local & Online)
*   **Offline Local AI:** Built-in template engines generating professional bios and action-verb experiences without requiring network calls.
*   **Gemini 2.5 Flash Online:** Secure browser integration querying Google's Gemini LLMs for advanced summary polishes and custom cover letters.

### 3. 🎯 ATS Scorer & Cover Letter Tailoring
*   **ATS Analyzer:** Evaluates skill density, contact complete links, and action verb frequency. Gives a score out of 100 with actionable feedback checklist.
*   **Cover Letter Generator:** Merges your wizard states with custom job descriptions to write tailored applications in seconds.

### 4. 📺 Multi-Device Live Sandbox Preview
*   Instantly renders character-by-character updates inside an isolated sandbox iframe.
*   Toggle viewports to preview your layout across **Desktop, Tablet, or Mobile** mock frames.
*   Includes **6 gorgeously styled themes**: *Midnight Neon, Warm Sunset, Crimson Slate, Minimal Stark, Classic Elegance,* and *Bold High-Contrast*.

### 5. 💾 Local Storage Draft Auto-Save
*   Saves entered values to browser `localStorage` on every keystroke. 
*   Accidental tab closes or refreshes preserve your draft state perfectly.

### 6. 🚀 Direct HTML Export & Hosting
*   Compiles theme CSS rules, variables, SVG icons, and text data into a single self-contained `index.html` file.
*   **GitHub Pages Deploy Guide:** Step-by-step interactive instructions to host the exported portfolio for free in under 2 minutes.

---

## 🛠️ Local Installation & Development

To spin up a local development server with hot-module-replacement (HMR):

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-builder.git

# Navigate to the directory
cd portfolio-builder

# Install packages
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser to get started!

---

## ⚙️ Exporter Output Specifications
The exported `index.html` matches standard static site conventions:
*   **Offline-Ready:** 100% self-contained HTML (all styles, scripts, and responsive icons inside a single file).
*   **SEO Optimized:** Descriptive dynamic Title, meta elements, heading hierarchies, and standard anchor attributes.
*   **Responsive:** Flexible columns transitioning to single column stacks on small viewport devices.
