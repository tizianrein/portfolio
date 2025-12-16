/* === js/main.js === */

document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. MOBILE MENU TOGGLE ===
    const projTrigger = document.querySelector('.project-trigger');
    
    if (projTrigger) {
        projTrigger.addEventListener('click', function(e) {
            // Prevent closing if clicking a link inside the menu
            if (e.target.tagName === 'A') return;
            
            // Toggle the menu
            this.classList.toggle('is-open');
            
            // Optional: Close if clicking outside
            // (Note: This logic was slightly buggy in the previous version, simplified here)
        });

        document.addEventListener('click', function(e) {
            if (!projTrigger.contains(e.target)) {
                projTrigger.classList.remove('is-open');
            }
        });
    }

    // === 2. LANGUAGE SWITCHER (Global) ===
    // Handles toggling of [data-lang-content] blocks and updating buttons.
    // Works for both Static HTML pages and acts as a helper for Dynamic ones.

    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Check if buttons exist on this page
    if (langBtns.length > 0) {
        
        // 1. Get stored language or default to 'de'
        // Note: We use 'userLanguage' to match grid-layout.js
        const currentLang = localStorage.getItem('userLanguage') || 'de';
        applyLanguage(currentLang);

        // 2. Add Click Listeners
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.getAttribute('data-lang');
                
                // Save preference
                localStorage.setItem('userLanguage', newLang);
                
                // Apply changes
                applyLanguage(newLang);

                // Special Case: If we are on the Grid/Home page, reload the grid
                if (typeof renderGrid === 'function') {
                    renderGrid();
                }
            });
        });
    }

    function applyLanguage(lang) {
        // A. Update Button States
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // B. Toggle Content Blocks (Static HTML)
        // Looks for <div data-lang-content="de"> and <div data-lang-content="en">
        const contentBlocks = document.querySelectorAll('[data-lang-content]');
        contentBlocks.forEach(block => {
            if (block.getAttribute('data-lang-content') === lang) {
                block.style.display = 'block';
            } else {
                block.style.display = 'none';
            }
        });

        // C. Update Footer Labels (Static HTML)
        // Static pages often have these hardcoded, so we swap text manually.
        const prevLabel = document.getElementById('prev-label');
        const nextLabel = document.getElementById('next-label');
        
        if (prevLabel) {
            prevLabel.innerText = (lang === 'de') ? "Vorheriges Projekt" : "Previous Project";
        }
        if (nextLabel) {
            nextLabel.innerText = (lang === 'de') ? "Nächstes Projekt" : "Next Project";
        }

        // D. Update Fullscreen Overlay Title (Static HTML)
        // Tries to grab the visible title from the content block
        const visibleTitle = document.querySelector(`[data-lang-content="${lang}"] .project-title-block`);
        const fsTitle = document.getElementById('fs-project-title');
        const fsMobTitle = document.getElementById('fs-mob-title'); // Mobile Header Title

        if (visibleTitle) {
            if (fsTitle) fsTitle.innerText = visibleTitle.innerText;
            if (fsMobTitle) fsMobTitle.innerText = visibleTitle.innerText;
        }
    }
});