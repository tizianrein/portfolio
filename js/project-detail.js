/* js/project-detail.js */

// Globale Variablen
let allProjects = [];
let currentProject = null;
let currentImageIndex = 0;
// NEU: Eine gemeinsame Liste für Bilder UND Videos
let mediaList = []; 

// === 1. INITIALISIERUNG ===
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('projects.json');
        allProjects = await response.json();

        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');

        if (projectId) {
            currentProject = allProjects.find(p => p.id === projectId);
        }

        // Fallback
        if (!currentProject && allProjects.length > 0) {
            currentProject = allProjects[0];
        }

        if (currentProject) {
            // === NEU: DATEN ZUSAMMENFÜHREN ===
            // Wir kopieren die Bilder in eine neue Liste
            mediaList = [...(currentProject.images || [])];

            // Wenn es ein Video-Objekt gibt, fügen wir es an der gewünschten Stelle ein
            if (currentProject.video && currentProject.video.src) {
                const insertPos = currentProject.video.insertAt || 1; // Standard: an 2. Stelle
                mediaList.splice(insertPos, 0, currentProject.video.src);
            }

            initPage();
        } else {
            document.querySelector('#project-description').innerHTML = "Projekt nicht gefunden.";
        }

    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
});

// === 2. SEITE AUFBAUEN ===
function initPage() {
    renderText();
    renderThumbnails();
    setupFooterNav();
    setupLanguageSwitcher();
    setupKeyboardNav();
}

/**
 * Rendert Text (ID, Titel, Beschreibung)
 */
function renderText() {
    const lang = localStorage.getItem('userLanguage') || 'de';
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const data = currentProject[lang] || currentProject.en;
    const title = data.title;
    const desc = data.description; 

    const container = document.getElementById('project-description');
    
    container.innerHTML = `
        <span class="project-id-block">${currentProject.id}</span>
        <span class="project-title-block">${title}</span>
        <div class="info-text">
            ${desc}
        </div>
    `;

    const overlayTitle = document.getElementById('fs-project-title');
    if(overlayTitle) overlayTitle.innerText = title;
    
    const mobTitle = document.getElementById('fs-mob-title');
    if(mobTitle) mobTitle.innerText = title;
}

/**
 * Erstellt Smart-Media-Elemente (Video/Bild/Iframe)
 */
function createMediaElement(src, isThumbnail = false) {
    // 1. Video (MP4, WEBM, MOV)
    if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov')) {
        const video = document.createElement('video');
        
        if (!isThumbnail) {
            video.className = 'fs-img';
        } else {
            video.className = 'thumb-video'; 
        }

        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;       
        video.playsInline = true; 
        video.controls = false; 
        video.preload = "metadata"; // Wichtig für Thumbnail-Anzeige
        
        return video;
    }

    // 2. Iframe (YouTube / Vimeo)
    if (src.includes('youtube') || src.includes('vimeo')) {
        if (isThumbnail) {
            const div = document.createElement('div');
            div.className = 'thumb-iframe-placeholder';
            div.innerHTML = '<span>▶</span>'; 
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.background = '#eee';
            div.style.width = '100%';
            div.style.height = '100%';
            return div;
        }

        const iframe = document.createElement('iframe');
        iframe.className = 'fs-img';
        
        let finalSrc = src;
        if (src.includes('vimeo') && !src.includes('?')) {
            finalSrc += '?autoplay=1&loop=1&background=1&muted=1';
        }
        
        iframe.src = finalSrc;
        iframe.frameBorder = '0';
        iframe.allow = "autoplay; fullscreen";
        return iframe;
    }

    // 3. Bild
    const img = document.createElement('img');
    if (!isThumbnail) {
        img.className = 'fs-img';
    }
    img.src = src;
    return img;
}

/**
 * Thumbnails rendern (nutzt jetzt mediaList statt images)
 */
function renderThumbnails() {
    const grid = document.getElementById('thumbnail-grid');
    grid.innerHTML = '';

    if (mediaList.length === 0) return;

    mediaList.forEach((src, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-item';
        
        const num = document.createElement('span');
        num.className = 'thumb-index';
        num.innerText = (index + 1).toString().padStart(2, '0');
        
        const mediaEl = createMediaElement(src, true); 
        
        wrapper.appendChild(num);
        wrapper.appendChild(mediaEl);

        wrapper.onclick = () => openGallery(index);
        grid.appendChild(wrapper);
    });
}

// === 3. FOOTER & NAV ===
function setupFooterNav() {
    const currentIndex = allProjects.findIndex(p => p.id === currentProject.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = allProjects.length - 1;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= allProjects.length) nextIndex = 0;

    const prevProj = allProjects[prevIndex];
    const nextProj = allProjects[nextIndex];

    const prevLink = document.getElementById('prev-project-link');
    if(prevLink) prevLink.href = `project.html?id=${prevProj.id}`;
    
    const nextLink = document.getElementById('next-project-link');
    if(nextLink) nextLink.href = `project.html?id=${nextProj.id}`;

    updateFooterLabels();
}

function updateFooterLabels() {
    const lang = localStorage.getItem('userLanguage') || 'de';
    const prevLabel = document.getElementById('prev-label');
    const nextLabel = document.getElementById('next-label');

    if (lang === 'de') {
        if(prevLabel) prevLabel.innerText = "Vorheriges Projekt";
        if(nextLabel) nextLabel.innerText = "Nächstes Projekt";
    } else {
        if(prevLabel) prevLabel.innerText = "Previous Project";
        if(nextLabel) nextLabel.innerText = "Next Project";
    }
}

// === 4. GALERIE LOGIK ===
const overlay = document.getElementById('fs-overlay');
const stack = document.getElementById('fs-image-stack');

function openGallery(index) {
    currentImageIndex = index;
    overlay.classList.add('active');
    updateFullscreenImage();
}

function closeGallery() {
    overlay.classList.remove('active');
    stack.innerHTML = ''; 
}

function nextImage() {
    if (mediaList.length === 0) return;
    currentImageIndex++;
    if (currentImageIndex >= mediaList.length) currentImageIndex = 0;
    updateFullscreenImage();
}

function prevImage() {
    if (mediaList.length === 0) return;
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = mediaList.length - 1;
    updateFullscreenImage();
}

function updateFullscreenImage() {
    stack.innerHTML = '';
    // Hier nutzen wir jetzt mediaList statt images!
    const src = mediaList[currentImageIndex];
    const el = createMediaElement(src, false);
    stack.appendChild(el);
}

// === 5. HELPERS ===
window.closeGallery = closeGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;

function setupLanguageSwitcher() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            localStorage.setItem('userLanguage', lang);
            renderText();
            updateFooterLabels();
        };
    });
}

function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}