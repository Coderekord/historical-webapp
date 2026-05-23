const searchBtn = document.getElementById("search-btn");
const dateSrc = document.getElementById("date-src");
const result = document.getElementById("result");
const randomBtn = document.getElementById("random-btn");

searchBtn.addEventListener("click", () => {
    const date = dateSrc.value;
    result.innerHTML = "";

    if (!date) {
        result.innerHTML = `<p>Odaberi datum</p>`;
        return;
    }

    // yyyy-mm-dd
    const parts = date.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    if(year>2025){
        result.innerHTML = `<p>Date is too far in the future</p>`;
        return;
    }
    result.innerHTML = `<div class="loading">Loading...</div>`;
    fetch(`https://historical-webapp-server.onrender.com/api?month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => {

            if (!data || !data.data || !data.data.Events) {
                result.innerHTML = `<p>Not found</p>`;
                return;
            }

            const events = data.data.Events;

            // filtrira samo događaje za unesenu godinu
            const filtered = events.filter(e =>
                e.text.includes(year)
            );

            if (filtered.length === 0) {
                result.innerHTML = `<div class="loading">Loading secondary...</div>`;
                fetch(`https://historical-webapp-1.onrender.com/wiki?month=${month}&day=${day}&year=${year}`)
                .then(response => response.json())
                .then(data => {
                    result.innerHTML = `
                    <div class="event">
                    <h3>On ${day}.${month}.${year}:</h3>
                    <p>${data.text}</p>
                    </div>
                    `;
            })
            .catch(err => {
                console.log(err);
                result.innerHTML = `<p>Greška pri učitavanju</p>`;
            });
            } else {
            let eventsHtml='';
            filtered.forEach(e => {
                eventsHtml += `
                    <div class="event">
                        <h3>On ${day}.${month}.${year}:</h3>
                        <p>${e.text}</p>
                    </div>
                `;
            });
            result.innerHTML = eventsHtml;
        }
        })
        .catch(err => {
            console.log(err);
            result.innerHTML = `<p>Greška pri učitavanju</p>`;
        });
});

// RANDOM BUTTON
randomBtn.addEventListener("click", () => {
    result.innerHTML = "";
    result.innerHTML = `<div class="loading">Loading...</div>`;
    fetch(`https://historical-webapp-app.onrender.com/random-brojevi`)
        .then(response=>response.json())
        .then(data => {
            const randomMonth= data.month;
            const randomDay= data.day;
            const randomYear= data.year;
        return fetch(`https://historical-webapp-server.onrender.com/api?month=${randomMonth}&day=${randomDay}`)
        .then(response => response.json())
        .then(data => {

            if (!data || !data.data || !data.data.Events) {
                result.innerHTML = `<p>Not found</p>`;
                return;
            }
            const events = data.data.Events;
            const filtered = events.filter(e=> e.text.includes(String(randomYear)));
            const randomEvent =filtered.length>0
            ? filtered [Math.floor(Math.random() * filtered.length)]
            : null;
            if (!randomEvent) {
                result.innerHTML = `<div class="loading">Loading secondary...</div>`;
                fetch(`https://historical-webapp-1.onrender.com/wiki?month=${randomMonth}&day=${randomDay}&year=${randomYear}`)
                .then(response => response.json())
                .then(data=>
                    result.innerHTML = `
                    <div class="event">
                    <h3>On ${randomDay}.${randomMonth}.${randomYear}:</h3>
                    <p>${data.text}</p>
                    </div>
                    `
                )
                .catch(err => {
                    console.log(err);
                    result.innerHTML = `<p>Greška pri učitavanju</p>`;
                });
                return;
                }
                result.innerHTML = `
                <div class="event">
                <h3>On ${randomDay}.${randomMonth}.${randomYear}:</h3>
                <p>${randomEvent.text}</p>
                </div>
                `;
                })
                .catch(err => {
                    console.log(err);
                    result.innerHTML = `<p>Greška pri učitavanju</p>`;
                });
        })
    });