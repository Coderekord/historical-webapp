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

    fetch(`http://localhost:3000/api?month=${month}&day=${day}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (!data || !data.data || !data.data.Events) {
                result.innerHTML = `<p>Not found</p>`;
                return;
            }

            const events = data.data.Events;

            if (events.length === 0) {
                result.innerHTML = `<p>Nema događaja za taj datum</p>`;
                return;
            }

            // filtrira samo događaje za unesenu godinu
            const filtered = events.filter(e =>
                e.text.startsWith(year)
            );

            if (filtered.length === 0) {
                result.innerHTML = `<p>Nema događaja za godinu ${year}</p>`;
                return;
            }

            filtered.forEach(e => {
                result.innerHTML += `
                    <div class="event">
                        <p>${e.text}</p>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.log(err);
            result.innerHTML = `<p>Greška pri učitavanju</p>`;
        });
});

// RANDOM BUTTON
randomBtn.addEventListener("click", () => {
    result.innerHTML = "";

    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;

    fetch(`http://localhost:3000/api?month=${randomMonth}&day=${randomDay}`)
        .then(response => response.json())
        .then(data => {

            if (!data || !data.data || !data.data.Events) {
                result.innerHTML = `<p>Not found</p>`;
                return;
            }

            const events = data.data.Events;

            if (events.length === 0) {
                result.innerHTML = `<p>Nema random događaja</p>`;
                return;
            }

            const randomEvent =
                events[Math.floor(Math.random() * events.length)];

            result.innerHTML = `
                <div class="event">
                    <h3>Random događaj</h3>
                    <p>${randomEvent.text}</p>
                </div>
            `;
        })
        .catch(err => {
            console.log(err);
            result.innerHTML = `<p>Greška pri učitavanju</p>`;
        });
});