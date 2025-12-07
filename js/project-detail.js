document.addEventListener('DOMContentLoaded', () => {
    
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    
    // Globale Variablen für Zugriff innerhalb der Funktionen
    let currentProject = null;
    let allProjectsData = [];

    // DOM Elemente
    const descContainer = document.getElementById('project-description');
    const thumbGrid = document.getElementById('thumbnail-grid');
    const titleEl = document.getElementById('fs-project-title');
    const mobTitleEl = document.getElementById('fs-mob-title');
    
    // Footer Elemente
    const prevLink = document.getElementById('prev-project-link');
    const nextLink = document.getElementById('next-project-link');
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');

    // Init
    fetch('projects.json')
        .then(response => response.json())
        .then(allProjects => {
            allProjectsData = allProjects;
            currentProject = allProjects.find(p => p.id === projectId);
            
            if (currentProject) {
                initProjectPage();
                initLanguageSwitcher(); // Event Listener starten
            } else {
                showError();
            }
        })
        .catch(err => console.error('Fehler beim Laden der Projekte:', err));


    function initProjectPage() {
        // 1. Text rendern (initial)
        const savedLang = localStorage.getItem('userLanguage') || 'de';
        renderText(savedLang);

        // 2. Bilder rendern (nur einmal nötig)
        renderImages();

        // 3. Footer Navigation Links setzen
        setupNavigation();
    }

    /* === SPRACH-LOGIK & RENDERING === */
    function renderText(lang) {
        // Sprache Button Styles updaten
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if(btn.dataset.lang === lang) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Content holen
        const content = currentProject[lang] || currentProject.en; // Fallback
        
        // Beschreibungstext HTML
        const textHtml = `
            <div class="info-text">
                <span class="project-id-block">${currentProject.id}</span>
                <span class="project-title-block">${content.title}</span>
                <p>${content.description}</p>
            </div>
        `;
        if(descContainer) descContainer.innerHTML = textHtml;

        // Overlay Titel
        if(titleEl) titleEl.innerText = content.title;
        if(mobTitleEl) mobTitleEl.innerText = content.title;

        // Footer Labels übersetzen
        if(prevLabel) prevLabel.innerText = lang === 'de' ? 'Vorheriges Projekt' : 'Previous Project';
        if(nextLabel) nextLabel.innerText = lang === 'de' ? 'Nächstes Projekt' : 'Next Project';
    }

    function initLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.dataset.lang;
                
                // Speichern & Neu rendern
                localStorage.setItem('userLanguage', newLang);
                renderText(newLang);
            });
        });
    }

    /* === BILDER LOGIK === */
    function renderImages() {
        thumbGrid.innerHTML = ''; // Reset
        
        if (currentProject.images && currentProject.images.length > 0) {
            currentProject.images.forEach((imgSrc, index) => {
                const thumb = document.createElement('figure');
                thumb.className = 'thumb-item';
                thumb.onclick = () => openGallery(index);

                const idxNum = (index + 1).toString().padStart(2, '0');
                
                // Alt-Tag nehmen wir einfach vom englischen Titel als Standard
                const altTitle = currentProject.en.title;

                thumb.innerHTML = `
                    <span class="thumb-index">${currentProject.id}.${idxNum}</span>
                    <img src="${imgSrc}" alt="${altTitle}" loading="lazy">
                `;
                thumbGrid.appendChild(thumb);
            });
        }
    }

    /* === FOOTER NAVIGATION LOGIK === */
    function setupNavigation() {
        const currentIndex = allProjectsData.findIndex(p => p.id === currentProject.id);
        
        // Zyklische Navigation (Loop)
        const prevIndex = (currentIndex - 1 + allProjectsData.length) % allProjectsData.length;
        const nextIndex = (currentIndex + 1) % allProjectsData.length;

        const prevProj = allProjectsData[prevIndex];
        const nextProj = allProjectsData[nextIndex];

        if(prevLink) prevLink.href = `project.html?id=${prevProj.id}`;
        if(nextLink) nextLink.href = `project.html?id=${nextProj.id}`;
    }


    /* === GALERIE / OVERLAY LOGIK (Wie gehabt) === */
    const overlay = document.getElementById('fs-overlay');
    const stackContainer = document.getElementById('fs-image-stack');
    let currentImageIndex = 0;

    window.openGallery = (index) => {
        currentImageIndex = index;
        stackContainer.innerHTML = ''; 
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        addToStack(index);
    };

    window.closeGallery = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        stackContainer.innerHTML = '';
    };

    function addToStack(index) {
        const imgSrc = currentProject.images[index];
        const imgEl = document.createElement('img');
        imgEl.src = imgSrc;
        imgEl.className = 'fs-img';
        
        const scale = 0.85 + Math.random() * 0.15;
        imgEl.style.zIndex = stackContainer.children.length + 1;
        imgEl.style.opacity = '0';
        imgEl.style.transform = `scale(${scale})`;
        
        stackContainer.appendChild(imgEl);
        
        requestAnimationFrame(() => {
            imgEl.style.opacity = '1';
        });
    }

    window.nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % currentProject.images.length;
        addToStack(currentImageIndex);
    };

    window.prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + currentProject.images.length) % currentProject.images.length;
        addToStack(currentImageIndex);
    };

    document.addEventListener('keydown', (e) => {
        if (!overlay || !overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    function showError() {
        if(descContainer) descContainer.innerHTML = '<p class="info-text">Projekt nicht gefunden.</p>';
    }
});