const express = require('express');
const app = express();
const APIKljuc = process.env.GROQ_API_KEY;
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.get ('/apiAI', dobijPodatke);
async function dobijPodatke(req, res){
    try{
        const {month, day, year} = req.query;
        const response = await fetch ('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APIKljuc}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{
                    role: 'user',
                    content: `What significant historical event happened on ${day}.${month}.${year}?
If you know of any event, describe it briefly and factually.
If you truly have no information about this specific date, respond only with: "No data found for entered date".
Do not make up events
Do not say undefined say no data found on that date if you can't find anything.(Date format is dd-mm-yyyy)(behave like a bot don't give answers that sound personal)`
                }]
            })
        });
        const data = await response.json();
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

app.listen(process.env.PORT || 4000, () => console.log('Server started on port 4000'));