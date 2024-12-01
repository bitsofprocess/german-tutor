import { openai } from '../config/openAIconfig'
import { Request, Response } from 'express';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

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

  export async function conceptPractice(req: Request, res: Response) {
    const { concept } = req.body;
    
    const NounReference = z.object({
      word: z.string(),
      gender: z.string(),
    });
    
    const VerbReference = z.object({
      word: z.string(),
      german: z.string(),
    });
    
    const Sentence = z.object({
      sentence: z.object({
        english: z.string(),
        german: z.string(),
      }),
      references: z.object({
        nouns: z.array(NounReference),
        verbs: z.array(VerbReference),
      }),
    });
    
    const QuestionSet = z.object({
      subordinateClauses: z.array(Sentence),
    });

    try {
      // Send the request to OpenAI's API
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        max_tokens: 200,
        messages: [
          { role: "user", content: `Give 1 sentence for a user to translate from English to German to practice the concept '${concept}'. Provide all verbs and nouns in each sentence with their gender after the sentence for reference. Please send as a JSON object with each sentence grouped with correlated references. Name everything appropriately for each extraction.` },
        ],
        response_format: zodResponseFormat(QuestionSet, "subordinateClauses"),  // Expect a 'subordinateClauses' array
      });
  
      // Check if the parsed data exists and is valid
      if (completion.choices[0].message.parsed) {
        const parsedData = completion.choices[0].message.parsed;
        
        // Validate using the Zod schema
        const result = QuestionSet.parse(parsedData);
        
        // Return the validated result
        res.status(200).json({ questionSet: result });
      } else {
        res.status(400).json({ error: 'Failed to extract sentence information' });
      }
    } catch (error) {
      console.error('Error processing completion:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

// structured output example
// Reference: https://platform.openai.com/docs/guides/structured-outputs
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
}