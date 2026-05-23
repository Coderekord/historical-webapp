const express = require('express');
const app = express();

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.get('/wiki',async (req, res)=>{
    const {month, day, year} = req.query;
    try{
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
        const data = await response.json();

        const event = data.events.find(e => e.year === parseInt(year));
        if(!event){
            const aiRes = await fetch(
                `https://historical-webapp-callai.onrender.com/apiAI?month=${month}&day=${day}&year=${year}`
            );
            const aiData = await aiRes.json();
            res.json({found: true, text: aiData.choices[0].message.content});
            return;
        }
        res.json({found: true, text: `${event.year} - ${event.pages[0].extract}`});
        } catch(err){
            res.status(500).json({error: err.message});
        }
    });
    app.listen(process.env.PORT || 5000, () => console.log('Server started on port 5000'));