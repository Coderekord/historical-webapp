const express = require('express');
const app = express();
require('dotenv').config({path: '../.env'});
const APIKljuc = process.env.GROQ_API_KEY;
console.log(APIKljuc);
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
                model: 'llama-3.1-8b-instant',
                messages: [{
                    role: 'user',
                    content: `Fetch from wikipedia what significant happened on ${day}.${month}.${year}.
                    Please don't add any of your tex but just what's written in the article.`
                }]
            })
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

app.listen(4000, () => console.log('Server started on port 4000'));