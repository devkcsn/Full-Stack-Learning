import express from "express";
import OpenAI from "openai";
import Message from "../models/Message.js";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//Chat with AI
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const aiResponse = await client.responses.create({
      model: "gpt-5-mini",
      input: message,
    });

    const reply = aiResponse.output[0]?.content[0]?.text || "No response";
    await Message.create({ sender: "AI", message: reply });
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;