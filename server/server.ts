import express from 'express';
// import { fetchEmails } from './a';
// import { fetchEmails } from './pro';
// import { fetchEmails } from './imapClient';
import { fetchEmails } from './simple';

const app = express();
const PORT = 3000;

app.get('/api/mails', async (req, res) => {
    try{
        const mails = await fetchEmails();
        res.json(mails);
    }catch (error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch emails" });
    } 
});

app.listen(PORT, () => {
    console.log(`✅ サーバー起動: http://localhost:${PORT}`);
});

