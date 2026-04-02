"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileBuilder_1 = require("./profileBuilder");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/build-profile', (req, res) => {
    const result = (0, profileBuilder_1.buildProfile)(req.body);
    if (!result.success) {
        return res.status(400).json(result);
    }
    res.json(result);
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
