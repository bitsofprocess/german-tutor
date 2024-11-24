"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVerbs = listVerbs;
exports.conceptPractice = conceptPractice;
exports.extract = extract;
const openAIconfig_1 = require("../config/openAIconfig");
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
// TODO: `Give me 5 sentences in English for me to translate into german that will allow me to practice ${concept}. Give me the nouns and verbs present in the sentence in german in parenthesis after each sentence for reference.`
function listVerbs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { number } = req.body;
        const completion = yield openAIconfig_1.openai.chat.completions.create({
            messages: [{ role: "user", content: `Give me the ${number} most common verbs in German. Just list the verb(s).` }],
            model: "gpt-4o-mini",
            max_tokens: 100
        });
        res.status(200).json({
            verbs: completion.choices[0].message.content
        });
    });
}
function conceptPractice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { concept } = req.body;
        const NounReference = zod_2.z.object({
            word: zod_2.z.string(),
            gender: zod_2.z.string(),
        });
        const VerbReference = zod_2.z.object({
            word: zod_2.z.string(),
            german: zod_2.z.string(),
        });
        const Sentence = zod_2.z.object({
            sentence: zod_2.z.object({
                english: zod_2.z.string(),
                german: zod_2.z.string(),
            }),
            references: zod_2.z.object({
                nouns: zod_2.z.array(NounReference),
                verbs: zod_2.z.array(VerbReference),
            }),
        });
        const QuestionSet = zod_2.z.object({
            subordinateClauses: zod_2.z.array(Sentence),
        });
        try {
            // Send the request to OpenAI's API
            const completion = yield openAIconfig_1.openai.beta.chat.completions.parse({
                model: "gpt-4o-mini",
                max_tokens: 200,
                messages: [
                    { role: "user", content: `Give 1 sentence for a user to translate from English to German to practice the concept '${concept}'. Provide all verbs and nouns in each sentence with their gender after the sentence for reference. Please send as a JSON object with each sentence grouped with correlated references. Name everything appropriately for each extraction.` },
                ],
                response_format: (0, zod_1.zodResponseFormat)(QuestionSet, "subordinateClauses"), // Expect a 'subordinateClauses' array
            });
            // Check if the parsed data exists and is valid
            if (completion.choices[0].message.parsed) {
                const parsedData = completion.choices[0].message.parsed;
                // Validate using the Zod schema
                const result = QuestionSet.parse(parsedData);
                // Return the validated result
                res.status(200).json({ questionSet: result });
            }
            else {
                res.status(400).json({ error: 'Failed to extract sentence information' });
            }
        }
        catch (error) {
            console.error('Error processing completion:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
function extract(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { message } = req.body;
        const CalendarEvent = zod_2.z.object({
            name: zod_2.z.string(),
            date: zod_2.z.string(),
            participants: zod_2.z.array(zod_2.z.string()),
        });
        const completion = yield openAIconfig_1.openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            max_tokens: 100,
            messages: [
                { role: "system", content: "Extract the event information." },
                { role: "user", content: `${message}` },
            ],
            response_format: (0, zod_1.zodResponseFormat)(CalendarEvent, "event"),
        });
        res.status(200).json({
            event: completion.choices[0].message.parsed
        });
    });
}
