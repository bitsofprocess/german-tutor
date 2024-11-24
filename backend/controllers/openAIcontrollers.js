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
        // const event = completion.choices[0].message.parsed; 
        // console.log(event);
    });
}
