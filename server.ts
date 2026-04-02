import express from 'express';
import { buildProfile } from './profileBuilder';

const app = express();
app.use(express.json());

app.post('/build-profile', (req, res) => {
    const result = buildProfile(req.body);

    if (!result.success) {
        return res.status(400).json(result);
    }

    res.json(result);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});