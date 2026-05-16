//https://today.zenquotes.io?api=true&month=[month]&day=[day]&key=

const searchBtn = document.getElementById("search-btn");
const dateSrc = document.getElementById("date-src");
const result = document.getElementById("result");

searchBtn.addEventListener("click", () => {
    const date = dateSrc.value;
    result.innerHTML = "";
    const parts = date.split(/[.\-\/]/);
    const month = parts[1];
    const day = parts[2];
    const year = parts[0];
    console.log("fetching...")
    console.log(date)
    fetch(`http://localhost:3000/api?month=${month}&day=${day}`)
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
        if(!data || !data.data || !data.data.Events){
            result.innerHTML = `<p>Not found</p>`;
            return;
        }
        const events = data.data.Events;
        if(!events||events.length===0){
            result.innerHTML = `<p>Not found</p>`;
            return;
        }
        const filtered= events.filter(e=> e.text.startsWith(year));
        if(filtered.length===0){
            result.innerHTML = `<p>Za taj datum nema dogadaja</p>`;
            return;
        }
            filtered.forEach(e=>{
                result.innerHTML += `<p>${e.text}</p>`
            });
    })
    .catch(err => {
        result.innerHTML = `<p>${err}</p>`;
});
});