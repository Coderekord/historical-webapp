const express = require('express');
const app = express();

app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.get('/api', async(req, res) =>{
    const{month, day} = req.query;
    try{
        const response = await fetch(
            `https://today.zenquotes.io?api=true&month=${month}&day=${day}&key=`
        );
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        res.json(data);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});
app.listen(3000, () => console.log('Server started on port 3000'));