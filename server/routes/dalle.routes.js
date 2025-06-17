import express from "express";
import * as dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.Gemini_Api_Key });


router.route('/').get(async(req, res)=>{
    res.status(200).json({message: "Hello from Gemini" })
})

router.route('/').post(async(req, res) => {
    try {
        const { prompt } = req.body;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: prompt,
            config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });
        let buffer;
        for (const part of response.candidates[0].content.parts) {
            // Based on the part type, either show the text or save the image
            if (part.text) {
            console.log(part.text);
            } else if (part.inlineData) {
            const  imageData = part.inlineData.data;
            buffer = Buffer.from(imageData, "base64");
            }
        }

        // const image = buffer;

        res.status(200).json({ 
        photo: `data:image/png;base64,${buffer.toString('base64')}` 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({mesage: "Something went wrong!"})
        
    }
})

export default router;