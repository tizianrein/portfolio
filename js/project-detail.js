/* js/project-detail.js */

// Globale Variablen
let allProjects = [];
let currentProject = null;
let currentImageIndex = 0;

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
            initPage();
        } else {
            document.querySelector('#project-description').innerHTML = "<h2>Projekt nicht gefunden.</h2>";
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
 * Rendert Titel und Beschreibung (Clean: Ohne extra Year/Category Labels am Ende)
 */
function renderText() {
    const lang = localStorage.getItem('userLanguage') || 'de';
    
    // UI Buttons Status
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const data = currentProject[lang] || currentProject.en;
    const title = data.title;
    const desc = data.description; // HTML erlaubt

    const container = document.getElementById('project-description');
    
    // KORREKTUR: Nur ID, Titel und Beschreibung. Keine automatischen Zusatzinfos unten drunter.
    container.innerHTML = `
        <span class="project-id-block">${currentProject.id}</span>
        <h1 class="project-title-block">${title}</h1>
        <div class="info-text">
            ${desc}
        </div>
    `;

    // Titel für Overlay
    const overlayTitle = document.getElementById('fs-project-title');
    if(overlayTitle) overlayTitle.innerText = title;
    
    const mobTitle = document.getElementById('fs-mob-title');
    if(mobTitle) mobTitle.innerText = title;
}

/**
 * Erstellt Smart-Media-Elemente
 */
function createMediaElement(src, isThumbnail = false) {
    // 1. Video (MP4, WEBM, MOV)
    if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov')) {
        const video = document.createElement('video');
        
        // Klassen setzen
        if (!isThumbnail) {
            video.className = 'fs-img';
        } else {
            video.className = 'thumb-video'; // Neue Klasse für Grid
        }

        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;       
        video.playsInline = true; 
        video.controls = false; 
        
        // WICHTIG: Metadata laden lassen, damit Aspect Ratio stimmt
        video.preload = "metadata";
        
        return video;
    }

    // 2. Iframe (YouTube / Vimeo)
    if (src.includes('youtube') || src.includes('vimeo')) {
        if (isThumbnail) {
            // Im Grid zeigen wir besser ein Bild-Placeholder oder ein Icon,
            // da 100 Auto-Play Iframes den Browser killen.
            // Falls du ein Thumbnail-Bild im JSON hast, könnte man das hier nutzen.
            // Hier simple Lösung: Graues Feld vermeiden, wenn möglich -> wir nehmen ein Video-Icon
            const div = document.createElement('div');
            div.className = 'thumb-iframe-placeholder';
            div.innerHTML = '<span>▶</span>'; 
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
 * Thumbnails rendern
 */
function renderThumbnails() {
    const grid = document.getElementById('thumbnail-grid');
    grid.innerHTML = '';

    if (!currentProject.images) return;

    currentProject.images.forEach((src, index) => {
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

// === 3. FOOTER & NAV (Bleibt gleich) ===
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
    if (!currentProject.images) return;
    currentImageIndex++;
    if (currentImageIndex >= currentProject.images.length) currentImageIndex = 0;
    updateFullscreenImage();
}

function prevImage() {
    if (!currentProject.images) return;
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = currentProject.images.length - 1;
    updateFullscreenImage();
}

function updateFullscreenImage() {
    stack.innerHTML = '';
    const src = currentProject.images[currentImageIndex];
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