import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DAVE_EMAIL = "postrero63@gmail.com";

app.use(express.json());

// In-memory + JSON storage for messages sent to Dave
const MESSAGES_FILE = path.join(process.cwd(), "messages_store.json");

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "unread" | "read";
}

function loadMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading messages store:", err);
  }
  return [];
}

function saveMessages(messages: ContactMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to messages store:", err);
  }
}

// Initialize Gemini Client lazily or gracefully
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Portfolio context for Dave Postrero
const DAVE_PORTFOLIO_CONTEXT = `
You are the AI Career Assistant for Dave Postrero, representing him in a professional, polite, and articulate tone to recruiters, hiring managers, and prospective clients visiting his web portfolio.

Candidate Details:
- Name: Dave Postrero
- Current Role: Junior Web & Mobile Developer
- Education: Bachelor of Science in Information Technology (BSIT) at STI West Negros University (2022 - 2026)
- Location: Silay City, Negros Occidental, Philippines (GMT+8)
- Email: postrero63@gmail.com
- Phone: +63 991 5725 762
- LinkedIn: linkedin.com/in/dave-postrero-2840493a8
- GitHub: github.com/gorfet

Key Technical Skills:
- Frontend: React 19, TypeScript, HTML5, CSS3, Tailwind CSS v4, Bootstrap, JavaScript (ES6+), Motion
- Backend: PHP, Laravel (MVC Architecture), Node.js, Express.js, RESTful APIs, Python
- Mobile: React Native, Expo, Android App Development
- Databases: MySQL, SQLite, MongoDB, Firebase Firestore
- Tools & Practices: Git & GitHub, Postman, Vite, VS Code, Agile, OOP (Java/PHP), Systems Quality Assurance

Key Experience:
- Assistant Programmer Intern at Information Technology Systems and Services (ITSS) (Feb 2026 – May 2026, 400 Hours)
  * Assisted in developing a full-scale Faculty Evaluation System using Laravel, PHP, Bootstrap, JavaScript, and MySQL.
  * Optimized database query runtimes and constructed interactive evaluation dashboards.
  * Performed modular unit testing, regression testing, and systems documentation.

Key Projects:
1. SEOPilot AI Assistant: Real-time semantic SEO crawler, keyword researcher, and AI optimizer built with Google GenAI SDK, React 19, Vite, and Tailwind CSS.
2. CareerPilot AI Coach : Interactive resume refiner, cover letter writer, and mock interview AI simulator with jsPDF export.
3. Faculty Evaluation System (Full-Stack Web): School evaluation platform with secure student ratings, admin analytics, and dynamic PDF reporting (Laravel, PHP, MySQL, Bootstrap).
4. Student Habit Tracker Mobile App (Cross-Platform Mobile): Responsive React Native / Expo app with Firebase authentication, habit analytics, and progression metrics.
5. Speed Typing Challenger (Desktop Application): Desktop typing test application with Java Swing GUI, OOP architecture, and local SQLite performance logging.
6. Battle Shapes & Maze Runner (Games & Physics): Interactive games built with Python/Pygame and HTML5/JavaScript showcasing procedural generation and custom physics.

Core Strengths & Goals:
Dave is a proactive problem solver with a passion for clean code, responsive user interfaces, and robust backend architectures. He is currently seeking Junior Web Developer, Full-Stack Developer, or Mobile App Developer roles and internship/entry-level positions.

Guidance for responses:
- Be warm, helpful, professional, and concise (2-4 paragraphs or clear bullet points).
- Provide accurate information directly based on Dave's credentials above.
- If asked about hiring or contacting Dave, encourage emailing postrero63@gmail.com or connecting on LinkedIn.
`;

// LIVE CONTACT MESSAGING API ENDPOINTS
app.post("/api/contact", (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required fields." });
      return;
    }

    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "unread",
    };

    const messages = loadMessages();
    messages.unshift(newMessage); // put latest first
    saveMessages(messages);

    // Build standard mailto URL for direct opening
    const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${newMessage.subject} - ${newMessage.name}`);
    const mailBody = encodeURIComponent(
      `Hello Dave,\n\n${newMessage.message}\n\n---\nSender Name: ${newMessage.name}\nSender Email: ${newMessage.email}\nSent via Portfolio: ${new Date().toLocaleString()}`
    );
    const mailtoUrl = `mailto:${DAVE_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

    res.json({
      success: true,
      message: `Message sent directly! Saved to inbox and prepared for ${DAVE_EMAIL}.`,
      targetEmail: DAVE_EMAIL,
      mailtoUrl,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    res.status(500).json({ error: "Failed to process contact message." });
  }
});

app.get("/api/contact/messages", (req, res) => {
  const messages = loadMessages();
  res.json({
    total: messages.length,
    unreadCount: messages.filter((m) => m.status === "unread").length,
    messages,
  });
});

app.delete("/api/contact/messages/:id", (req, res) => {
  const { id } = req.params;
  let messages = loadMessages();
  messages = messages.filter((m) => m.id !== id);
  saveMessages(messages);
  res.json({ success: true, remaining: messages.length });
});

// AI Assistant Chat API Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message string is required." });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback message if API key is not configured
      res.json({
        reply: `Hi there! I am Dave's AI Assistant. Dave is a BSIT graduate and Developer specializing in Laravel, React, and React Native. You can reach out directly via email at ${DAVE_EMAIL} or explore his featured projects below!`
      });
      return;
    }

    const prompt = `${DAVE_PORTFOLIO_CONTEXT}\n\nVisitor Question: "${message}"\n\nPlease answer the visitor politely as Dave's AI assistant:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply = response.text || `Thank you for reaching out! Feel free to ask more about Dave's skills, experience, or projects, or email him directly at ${DAVE_EMAIL}.`;
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Failed to generate response",
      reply: `I experienced a temporary glitch processing your request. Please feel free to email Dave directly at ${DAVE_EMAIL}!` 
    });
  }
});

// Start Server & Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
