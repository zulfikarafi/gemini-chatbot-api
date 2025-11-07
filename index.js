import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the "public" directory and to show index.html on browser
// app.use(express.static('public'));

// serve all files in the public folder
app.use(express.static(path.join(__dirname, 'public')));


// Endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    if (!Array.isArray(messages))
      throw new Error("messages must be an array of messages.");

    const contents = messages.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
    });
    res.status(200).json({ result: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
