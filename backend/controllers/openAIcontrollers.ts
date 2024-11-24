import { openai } from '../config/openAIconfig'
import { Request, Response } from 'express';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// TODO: `Give me 5 sentences in English for me to translate into german that will allow me to practice ${concept}. Give me the nouns and verbs present in the sentence in german in parenthesis after each sentence for reference.`


export async function listVerbs(req: Request, res: Response) {
    const { number }= req.body

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Give me the ${number} most common verbs in German. Just list the verb(s).` }],
      model: "gpt-4o-mini",
      max_tokens: 100
    });
  
    res.status(200).json({
      verbs: completion.choices[0].message.content
    })
    
  }

export async function extract(req: Request, res: Response) {
  const { message } = req.body

  const CalendarEvent = z.object({
    name: z.string(),
    date: z.string(),
    participants: z.array(z.string()),
  });
  
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    max_tokens: 100,
    messages: [
      { role: "system", content: "Extract the event information." },
      { role: "user", content: `${message}` },
    ],
    response_format: zodResponseFormat(CalendarEvent, "event"),
  });

  res.status(200).json({
    event: completion.choices[0].message.parsed 
  })
  
  // const event = completion.choices[0].message.parsed; 
  // console.log(event);
}