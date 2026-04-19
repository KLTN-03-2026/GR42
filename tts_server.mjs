import express from 'express';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/tts', async (req, res) => {
    try {
        let text = req.body.text;
        if (!text) {
            return res.status(400).json({ status: 'error', message: 'No text provided' });
        }
        
        const chunks = text.match(/.{1,190}([\s\.\,\;\:\n]|$)/g) || [text];
        const buffers = [];
        
        for (const chunk of chunks) {
            if (!chunk.trim()) continue;
            const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=vi-VN&q=${encodeURIComponent(chunk.trim())}`;
            const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            if (!response.ok) {
                throw new Error('Google TTS trả về lỗi: ' + response.status);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            buffers.push(Buffer.from(arrayBuffer));
        }
        
        const audioBuffer = Buffer.concat(buffers);
        
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message || 'Lỗi kết nối API TTS' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`TTS Server is running on http://localhost:${PORT}`);
});
