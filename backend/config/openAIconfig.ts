import OpenAI from 'openai'
import dotenv from 'dotenv'
import { resolve } from 'path';

dotenv.config({ path: resolve('../.env') })

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
