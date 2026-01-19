/* === js/main.js === */

document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. MOBILE MENU TOGGLE ===
    const projTrigger = document.querySelector('.project-trigger');
    
    if (projTrigger) {
        projTrigger.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return;
            this.classList.toggle('is-open');
        });

        document.addEventListener('click', function(e) {
            if (!projTrigger.contains(e.target)) {
                projTrigger.classList.remove('is-open');
            }
        });
    }

    // === 2. LANGUAGE SWITCHER (Global) ===
    const langBtns = document.querySelectorAll('.lang-btn');
    
    if (langBtns.length > 0) {
        // Initial Language
        const currentLang = localStorage.getItem('userLanguage') || 'de';
        applyLanguage(currentLang);

        // Click Listeners
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.getAttribute('data-lang');
                localStorage.setItem('userLanguage', newLang);
                applyLanguage(newLang);
            });
        });
    }

    function applyLanguage(lang) {
        // A. Buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // B. Content Blocks (Info Page)
        const contentBlocks = document.querySelectorAll('[data-lang-content]');
        contentBlocks.forEach(block => {
            if (block.getAttribute('data-lang-content') === lang) {
                block.style.display = 'block';
            } else {
                block.style.display = 'none';
            }
        });

        // C. Footer Labels (Project Pages)
        const prevLabel = document.getElementById('prev-label');
        const nextLabel = document.getElementById('next-label');
        if (prevLabel) prevLabel.innerText = (lang === 'de') ? "Vorheriges Projekt" : "Previous Project";
        if (nextLabel) nextLabel.innerText = (lang === 'de') ? "Nächstes Projekt" : "Next Project";

        // D. Grid Titles (Index Page) - Aufruf der Funktion aus grid-layout.js
        if (typeof window.updateProjectTitles === 'function') {
            window.updateProjectTitles(lang);
        }
    }
});