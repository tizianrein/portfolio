/* === KONFIGURATION === */
const GRID_UNIT = 50;
const CONTAINER_WIDTH = 1200;
const container = document.getElementById('grid-container');

// Globale Variable für Daten
let allProjectsData = [];
let currentFilter = 'all';

// Hilfsfunktion: Bild-Metadaten laden
function loadMeta(project) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            project.aspectRatio = img.naturalWidth / img.naturalHeight;
            resolve(project);
        };
        img.onerror = () => {
            project.aspectRatio = 1.0; 
            resolve(project);
        };
        if (project.thumbnail) {
            img.src = project.thumbnail;
        } else if (project.images && project.images.length > 0) {
            img.src = project.images[0];
        } else {
            img.src = ''; 
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomModifier() {
    return Math.random() * (1.4 - 0.6) + 0.6;
}

/* === HAUPTFUNKTION === */
async function initGrid() {
    try {
        // 1. JSON nur einmal laden, wenn noch nicht da
        if (allProjectsData.length === 0) {
            const response = await fetch('projects.json');
            allProjectsData = await response.json();
            
            // Initialen Filter aus URL prüfen (z.B. ?filter=architecture)
            const params = new URLSearchParams(window.location.search);
            const urlFilter = params.get('filter');
            if (urlFilter) currentFilter = urlFilter;
        }

        renderGrid(); // Grid bauen
        setupInteractions(); // Klick-Events starten

    } catch (error) {
        console.error("Fehler beim Laden der Grid-Daten:", error);
    }
}

/* === GRID RENDERN === */
async function renderGrid() {
    container.innerHTML = ''; // Leeren
    
    // Sprache holen
    const lang = localStorage.getItem('userLanguage') || 'de';
    updateLanguageUI(lang); // Buttons aktualisieren

    // Filtern
    let projectsToRender = allProjectsData;
    if (currentFilter && currentFilter !== 'all') {
        projectsToRender = allProjectsData.filter(p => p.category === currentFilter);
    }

    // Metadaten laden (Asynchron)
    const loadedProjects = await Promise.all(projectsToRender.map(loadMeta));

    let currentIndex = 0;

    // Grid Algorithmus
    while (currentIndex < loadedProjects.length) {
        
        // Wie viele sind insgesamt noch übrig?
        let remaining = loadedProjects.length - currentIndex;
        
        // Zufallszahl zwischen 2 und 4 generieren
        let count = getRandomInt(3, 4);

        /* 
           LOGIK-ANPASSUNG: KEINE EINZELNEN PROJEKTE 
        */

        // Fall A: Wir sind fast am Ende (nur noch 2, 3 oder 4 übrig)
        // Dann nehmen wir einfach alle restlichen in diese Reihe, 
        // damit keiner einzeln übrig bleibt.
        if (remaining <= 4) {
            count = remaining;
        } 
        // Fall B: Wir sind mitten drin, aber der Zufall würde dazu führen,
        // dass für die NÄCHSTE Runde genau 1 übrig bleibt.
        else if (remaining - count === 1) {
            // Beispiel: 5 übrig. Zufall sagt 4. Rest wäre 1 (Böse).
            // Lösung: Wir reduzieren diese Reihe auf 3.
            // Dann bleiben 2 für die nächste Reihe (Gut).
            count--; 
        }

        /* ------------------------------------- */

        const rowItems = [];
        for (let i = 0; i < count; i++) {
            let item = { ...loadedProjects[currentIndex + i] };
            item.weight = item.aspectRatio * getRandomModifier(); 
            rowItems.push(item);
        }

        const gapsCount = Math.max(0, count - 1);
        const availableWidthPx = CONTAINER_WIDTH - (gapsCount * GRID_UNIT);
        const totalWeightedAR = rowItems.reduce((sum, item) => sum + item.weight, 0);

        let allocatedWidth = 0;
        let finalItems = rowItems.map(item => {
            let rawWidth = (item.weight / totalWeightedAR) * availableWidthPx;
            let snappedWidth = Math.round(rawWidth / GRID_UNIT) * GRID_UNIT;
            if (snappedWidth < 4 * GRID_UNIT) snappedWidth = 4 * GRID_UNIT; // Mindestbreite

            allocatedWidth += snappedWidth;
            return { ...item, width: snappedWidth };
        });

        // Lücken füllen / Korrektur
        let diff = availableWidthPx - allocatedWidth;
        finalItems.sort((a, b) => b.width - a.width);
        finalItems[0].width += diff;

        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';

        finalItems.forEach(item => {
            // Hier ein Sicherheitscheck, falls item.aspectRatio 0 oder undefined ist
            let safeAR = item.aspectRatio || 1; 
            let rawHeight = item.width / safeAR;
            let snappedHeight = Math.round(rawHeight / GRID_UNIT) * GRID_UNIT;
            
            // Mindesthöhe
            if (snappedHeight < GRID_UNIT) snappedHeight = GRID_UNIT;

            // Titel je nach Sprache
            const title = (item[lang] && item[lang].title) ? item[lang].title : (item.en ? item.en.title : item.id);

            const link = document.createElement('a');
            link.className = 'grid-item';
            link.style.width = item.width + 'px';
            link.href = `project.html?id=${item.id}`;

            link.innerHTML = `
                <div class="image-wrapper" style="height: ${snappedHeight}px;">
                    <img src="${item.thumbnail}" alt="${title}">
                </div>
                <div class="meta-data">
                    <span class="meta-id">${item.id}</span><br>
                    <span class="meta-title">${title}</span>
                </div>
            `;
            
            rowDiv.appendChild(link);
        });

        container.appendChild(rowDiv);
        currentIndex += count;
    }
}

/* === INTERAKTIONEN (Filter & Sprache) === */
function setupInteractions() {
    
    // 1. FILTER BUTTONS (Header & Mobile)
    const filterLinks = document.querySelectorAll('[data-filter]');
    filterLinks.forEach(link => {
        // Events nur einmal hinzufügen
        link.onclick = (e) => {
            e.preventDefault();
            const newFilter = link.dataset.filter;
            
            // URL aktualisieren ohne Neuladen (schön für "Zurück"-Button)
            const url = new URL(window.location);
            if(newFilter === 'all') url.searchParams.delete('filter');
            else url.searchParams.set('filter', newFilter);
            window.history.pushState({}, '', url);

            currentFilter = newFilter;
            renderGrid(); // Grid neu bauen
        };
    });

    // 2. SPRACHE BUTTONS
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const newLang = btn.dataset.lang;
            localStorage.setItem('userLanguage', newLang);
            
            renderGrid(); // Grid neu bauen (Titel ändern sich)
        };
    });
}

// UI Helfer: Setzt 'active' Klasse auf Sprachbuttons
function updateLanguageUI(currentLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === currentLang) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', initGrid);