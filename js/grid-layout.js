/* === js/grid-layout.js === */

/* === KONFIGURATION === */
const GRID_UNIT = 50;
const CONTAINER_WIDTH = 1200;
const container = document.getElementById('grid-container');

// Wir speichern hier die Referenzen zu den DOM-Elementen, 
// damit wir sie beim Filtern nicht verlieren.
let allGridItems = []; 
let currentFilter = 'all';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomModifier() {
    return Math.random() * (1.4 - 0.6) + 0.6;
}

/* === INIT === */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Alle existierenden Artikel aus dem HTML lesen und speichern
    const items = document.querySelectorAll('.grid-item');
    
    // Konvertiere NodeList in Array von Objekten für einfacheres Handling
    allGridItems = Array.from(items).map(el => {
        const img = el.querySelector('img');
        
        // Versuche Aspect Ratio zu bekommen, falls Bild schon geladen
        let ar = 1.0;
        if (img.naturalWidth > 0) {
            ar = img.naturalWidth / img.naturalHeight;
        }

        return {
            element: el, // Das DOM Element selbst
            category: el.dataset.category,
            img: img,
            aspectRatio: ar,
            loaded: (img.complete && img.naturalWidth > 0)
        };
    });

    // 2. Initialen Filter aus URL prüfen
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    if (urlFilter) currentFilter = urlFilter;

    // 3. Grid starten (Bilder laden, dann Layout)
    initImagesAndLayout();
    
    // 4. Interaktionen (Filter-Buttons)
    setupInteractions();
    
    // 5. Initiale Sprache setzen
    const savedLang = localStorage.getItem('userLanguage') || 'de';
    updateProjectTitles(savedLang);
});


/* === BILDER LADEN & LAYOUT STARTEN === */
async function initImagesAndLayout() {
    // Wir müssen sicherstellen, dass wir die Aspect Ratio kennen
    // für Bilder, die noch nicht geladen sind.
    const promises = allGridItems.map(item => {
        if (item.loaded) return Promise.resolve();
        return new Promise((resolve) => {
            item.img.onload = () => {
                item.aspectRatio = item.img.naturalWidth / item.img.naturalHeight;
                item.loaded = true;
                resolve();
            };
            item.img.onerror = () => {
                item.aspectRatio = 1.0; // Fallback
                resolve();
            };
        });
    });

    // Warten bis Bilder geladen (oder Fehler) -> dann Layout berechnen
    // (Da wir "loading=lazy" nutzen, kann das Layout auch schrittweise passieren, 
    // aber für die genaue Berechnung brauchen wir AR).
    // Um Flackern zu vermeiden, berechnen wir Layout neu, sobald wichtige Infos da sind.
    // Ein Timeout hilft bei sehr schnellem Cache.
    setTimeout(() => {
        calculateLayout();
    }, 100);

    // Falls Bilder langsam laden, layouten wir nach Abschluss nochmal
    Promise.all(promises).then(() => {
        calculateLayout();
    });
}


/* === LAYOUT ALGORITHMUS (Dein Original-Design) === */
function calculateLayout() {
    // 1. Container leeren
    container.innerHTML = '';

    // 2. Filtern
    let visibleItems = allGridItems;
    if (currentFilter && currentFilter !== 'all') {
        visibleItems = allGridItems.filter(p => p.category === currentFilter);
    }

    let currentIndex = 0;

    // 3. Zeilen bauen
    while (currentIndex < visibleItems.length) {
        
        let remaining = visibleItems.length - currentIndex;
        let count = getRandomInt(3, 4);

        if (remaining <= 4) {
            count = remaining;
        } else if (remaining - count === 1) {
            count--; 
        }

        const rowBatch = [];
        for (let i = 0; i < count; i++) {
            let itemObj = visibleItems[currentIndex + i];
            // Gewicht berechnen
            let weight = itemObj.aspectRatio * getRandomModifier();
            rowBatch.push({ ...itemObj, weight: weight });
        }

        // Breiten berechnen
        const gapsCount = Math.max(0, count - 1);
        const availableWidthPx = CONTAINER_WIDTH - (gapsCount * GRID_UNIT);
        const totalWeightedAR = rowBatch.reduce((sum, item) => sum + item.weight, 0);

        let allocatedWidth = 0;
        let processedRowItems = rowBatch.map(item => {
            let rawWidth = (item.weight / totalWeightedAR) * availableWidthPx;
            let snappedWidth = Math.round(rawWidth / GRID_UNIT) * GRID_UNIT;
            
            if (snappedWidth < 4 * GRID_UNIT) snappedWidth = 4 * GRID_UNIT;

            allocatedWidth += snappedWidth;
            return { ...item, finalWidth: snappedWidth };
        });

        // Lückenkorrektur
        let diff = availableWidthPx - allocatedWidth;
        processedRowItems.sort((a, b) => b.finalWidth - a.finalWidth);
        processedRowItems[0].finalWidth += diff;

        // Zeilen-Div erstellen
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';

        processedRowItems.forEach((processed, index) => {
            const originalEl = processed.element;
            const width = processed.finalWidth;
            
            // Höhe berechnen
            let safeAR = processed.aspectRatio || 1;
            let rawHeight = width / safeAR;
            let snappedHeight = Math.round(rawHeight / GRID_UNIT) * GRID_UNIT;
            if (snappedHeight < GRID_UNIT) snappedHeight = GRID_UNIT;

            // Styles anwenden
            originalEl.style.width = width + 'px';
            
            const imgWrap = originalEl.querySelector('.image-wrapper');
            if (imgWrap) {
                imgWrap.style.height = snappedHeight + 'px';
            }

            // Element einfügen
            rowDiv.appendChild(originalEl);

            // === NEU: VERZÖGERTES EINBLENDEN ===
            // Wir nutzen setTimeout, damit der Browser den Style-Wechsel registriert
            // Kleiner Stagger-Effekt (index * 50) sieht schick aus
            setTimeout(() => {
                originalEl.classList.add('is-visible');
            }, 50 + (index * 30)); 
        });

        container.appendChild(rowDiv);
        currentIndex += count;
    }
}

/* === INTERAKTIONEN === */
function setupInteractions() {
    // Filter Links
    const filterLinks = document.querySelectorAll('[data-filter]');
    filterLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const newFilter = link.dataset.filter;
            
            const url = new URL(window.location);
            if(newFilter === 'all') url.searchParams.delete('filter');
            else url.searchParams.set('filter', newFilter);
            window.history.pushState({}, '', url);

            currentFilter = newFilter;
            calculateLayout();
        };
    });
}

/* === SPRACHE UPDATE (Wird von main.js aufgerufen) === */
// Wir exportieren diese Funktion global oder nutzen Event Listener
window.updateProjectTitles = function(lang) {
    // Buttons UI
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    // Titel Text tauschen
    allGridItems.forEach(item => {
        const titleSpan = item.element.querySelector('.meta-title');
        if (titleSpan) {
            const newTitle = titleSpan.getAttribute(`data-${lang}`);
            if (newTitle) titleSpan.innerText = newTitle;
        }
    });
};