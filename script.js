// MENU MOBILE
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
             navLinks.style.display = 'flex';
             navLinks.style.flexDirection = 'column';
             navLinks.style.position = 'absolute';
             navLinks.style.top = '70px';
             navLinks.style.right = '0';
             navLinks.style.background = '#fff';
             navLinks.style.width = '100%';
             navLinks.style.padding = '20px';
        } else {
             navLinks.style.display = 'none';
        }
    });
}

// METEO LOGIC (API OPEN-METEO)
async function fetchMeteo(lat, lon, name) {
    // Aggiorna Nome Isola UI
    const nameEl = document.getElementById('island-name');
    if(nameEl) nameEl.innerText = name;

    // Gestione Bottoni Active (Pills)
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText === name) btn.classList.add('active');
    });

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FRome`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const container = document.getElementById('forecast-container');
        
        if(container) {
            container.innerHTML = ''; // Pulisci precedenti
            
            // Cicla 7 giorni
            for(let i=0; i<7; i++) {
                const day = data.daily.time[i];
                const max = Math.round(data.daily.temperature_2m_max[i]);
                const min = Math.round(data.daily.temperature_2m_min[i]);
                const code = data.daily.weathercode[i];

                // Icona e Descrizione base
                let iconClass = 'fa-sun';
                let desc = 'Sereno';
                if(code > 3) { iconClass = 'fa-cloud-sun'; desc = 'Nuvoloso'; }
                if(code > 50) { iconClass = 'fa-cloud-rain'; desc = 'Pioggia'; }
                if(code > 80) { iconClass = 'fa-cloud-showers-heavy'; desc = 'Temporale'; }

                // Formatta data
                const dateObj = new Date(day);
                const options = { weekday: 'short', day: 'numeric', month: 'short' };
                const dateStr = dateObj.toLocaleDateString('it-IT', options).toUpperCase();
                
                // Evidenzia card "OGGI"
                const isToday = i === 0 ? 'today' : '';
                const labelDate = i === 0 ? 'OGGI' : dateStr;

                const card = document.createElement('div');
                card.className = `weather-card-new ${isToday}`;
                card.innerHTML = `
                    <p style="font-size:0.8rem; font-weight:700; color:#0b1c2c; margin-bottom:5px;">${labelDate}</p>
                    <p style="font-size:0.75rem; color:#777;">${i === 0 ? 'In tempo reale' : ''}</p>
                    <div class="w-icon"><i class="fas ${iconClass}"></i></div>
                    <p style="margin-bottom:10px; font-weight:600; font-size:0.9rem;">${desc}</p>
                    <div class="temp-range">
                        <span style="color:#3498db">Min ${min}°</span>  <span style="color:#e67e22">Max ${max}°</span>
                    </div>
                `;
                container.appendChild(card);
            }
        }

    } catch (error) {
        console.error("Errore meteo", error);
        document.getElementById('forecast-container').innerHTML = '<p>Errore caricamento meteo.</p>';
    }
}