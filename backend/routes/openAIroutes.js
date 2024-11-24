"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openAIcontrollers_1 = require("../controllers/openAIcontrollers");
const router = (0, express_1.Router)();
router.post('/verbs', openAIcontrollers_1.listVerbs);
router.post('/extract', openAIcontrollers_1.extract);
router.post('/concept', openAIcontrollers_1.conceptPractice);
exports.default = router;
