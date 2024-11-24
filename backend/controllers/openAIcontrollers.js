import { openai } from '../config/openAIconfig.js'

// TODO: `Give me 5 sentences in English for me to translate into german that will allow me to practice ${concept}. Give me the nouns and verbs present in the sentence in german in parenthesis after each sentence for reference.`

export async function listVerbs(req, res) {
    const { number } = req.body
    
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Give me the ${number} most common verbs in German. Just list the verb(s).` }],
      model: "gpt-4o-mini",
      max_tokens: 100
    });
  
    res.status(200).json({
      verbs: completion.choices[0].message.content
    })
  }
