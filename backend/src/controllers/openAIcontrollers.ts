import { openai } from '../config/openAIconfig'
import { Request, Response } from 'express';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export async function translationPractice(req: Request, res: Response) {
  try {
    const { concept } = req.body;

    const sentence = z.object({
      english: z.string(),
      german: z.string()
    });

    // Make the completion request
    const completion = await openai.beta.chat.completions.parse({
      messages: [
        { role: "user", content: `Give 1 sentence for a user to translate from English to German to practice the concept '${concept}'` }
      ],
      response_format: zodResponseFormat(sentence, "sentence"),
      model: "gpt-4o-mini",
      max_tokens: 100
    });

    res.status(200).json({
      sentence: completion.choices[0].message.parsed
    })
  } catch(e) {
    console.log(e)
  }
}