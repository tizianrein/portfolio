/* js/project-detail.js */

// Globale Variablen
let allProjects = [];
let currentProject = null;
let currentImageIndex = 0;
let mediaList = []; // Enthält Strings (Bilder) oder Objekte (Video)

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
            // 1. Bilder kopieren
            mediaList = [...(currentProject.images || [])];

            // 2. Video einfügen (als Objekt mit Poster!)
            if (currentProject.video && currentProject.video.src) {
                const insertPos = currentProject.video.insertAt || 1; 
                
                // Wir speichern ein Objekt, um auch das Poster zu haben
                const videoObj = {
                    src: currentProject.video.src,
                    poster: currentProject.video.poster || null, 
                    type: 'video'
                };
                
                mediaList.splice(insertPos, 0, videoObj);
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
    setupTouchGestures(); 
}

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
 * resource kann String (URL) oder Objekt ({src, poster}) sein
 */
function createMediaElement(resource, isThumbnail = false) {
    let src = resource;
    let poster = null;

    // Prüfen ob es ein Video-Objekt ist
    if (typeof resource === 'object' && resource !== null) {
        src = resource.src;
        poster = resource.poster;
    }

    // 1. Video (MP4, WEBM, MOV)
    if (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov')) {
        const video = document.createElement('video');
        
        // Poster setzen falls vorhanden (wichtig für Mobile Thumbnails)
        if (poster) {
            video.poster = poster;
        }

        if (isThumbnail) {
            // === THUMBNAIL EINSTELLUNGEN ===
            video.className = 'thumb-video'; 
            video.autoplay = false;
            video.muted = true;
            video.controls = false;
            video.loop = false;
            video.preload = "metadata"; 
            
            // Hover-Effekt (Desktop)
            video.onmouseover = () => video.play();
            video.onmouseout = () => { video.pause(); video.currentTime = 0; };
            
        } else {
            // === VOLLBILD EINSTELLUNGEN ===
            video.className = 'fs-img';
            video.autoplay = true;   
            video.muted = false;     
            video.controls = true;   
            video.loop = false;
            video.preload = "auto";
        }

        video.src = src;
        video.playsInline = true; 
        
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

function renderThumbnails() {
    const grid = document.getElementById('thumbnail-grid');
    grid.innerHTML = '';

    if (mediaList.length === 0) return;

    mediaList.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-item';
        
        const num = document.createElement('span');
        num.className = 'thumb-index';
        // ID Formatierung: 021.01
        num.innerText = `${currentProject.id}.${(index + 1).toString().padStart(2, '0')}`;
        
        const mediaEl = createMediaElement(item, true); 
        
        wrapper.appendChild(num);
        wrapper.appendChild(mediaEl);

        wrapper.onclick = () => openGallery(index);
        grid.appendChild(wrapper);
    });
}

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

// === GALERIE LOGIK (STACKING) ===
const overlay = document.getElementById('fs-overlay');
const stack = document.getElementById('fs-image-stack');

function openGallery(index) {
    currentImageIndex = index;
    overlay.classList.add('active');
    
    // Sicherstellen, dass Thumbnails gestoppt sind (Verhindert Audio-Doppelung)
    document.querySelectorAll('.thumb-video').forEach(v => {
        v.pause();
        v.currentTime = 0;
    });

    // Beim ersten Öffnen Stack leeren und erstes Bild anzeigen
    stack.innerHTML = '';
    updateFullscreenImage(true); 
}

function closeGallery() {
    overlay.classList.remove('active');
    
    // Stack leeren, damit Videos stoppen und Speicher frei wird
    // Verzögert, damit Fade-Out noch sichtbar ist (falls CSS Transition vorhanden)
    setTimeout(() => { 
        stack.innerHTML = ''; 
    }, 300);
}

function nextImage() {
    if (mediaList.length === 0) return;
    currentImageIndex++;
    if (currentImageIndex >= mediaList.length) currentImageIndex = 0;
    updateFullscreenImage(false);
}

function prevImage() {
    if (mediaList.length === 0) return;
    currentImageIndex--;
    if (currentImageIndex < 0) currentImageIndex = mediaList.length - 1;
    updateFullscreenImage(false);
}

/**
 * Zeigt das Bild an.
 * isInitial = true -> Das allererste Bild beim Öffnen (keine Skalierung).
 * isInitial = false -> Weitere Bilder werden "gestapelt".
 */
function updateFullscreenImage(isInitial = false) {
    
    // Prüfen, ob dieses Bild (Index) schon im Stack existiert
    const existingEl = Array.from(stack.children).find(el => parseInt(el.dataset.index) === currentImageIndex);

    let el;
    let isNew = false;

    if (existingEl) {
        // === BEREITS VORHANDEN: Nach oben holen ===
        el = existingEl;
        stack.appendChild(el); // Ans Ende des DOM schieben
        
        if (el.tagName === 'VIDEO') {
            el.currentTime = 0;
            el.play().catch(e => console.log("Auto-Play prevented:", e));
        }

    } else {
        // === NEU ERSTELLEN ===
        isNew = true;
        const item = mediaList[currentImageIndex];
        el = createMediaElement(item, false);
        el.dataset.index = currentImageIndex; 
        stack.appendChild(el);
    }

    // === FIX: Z-INDEX DYNAMISCH STEUERN ===
    // Wir setzen alle anderen Elemente im Stack nach hinten
    Array.from(stack.children).forEach(child => {
        child.style.zIndex = '1'; 
    });

    // Das AKTUELLE Element kommt nach ganz vorne (über Klick-Zonen mit z-50)
    // Bilder haben 'pointer-events: none', Klicks gehen also durch zur Navigation.
    // Videos haben 'pointer-events: auto', damit Controls bedienbar bleiben.
    el.style.zIndex = '60';


    // Skalierungs-Logik (+- 7.5%)
    let scale = 1;
    if (!isInitial) {
        scale = (0.85 + Math.random() * 0.25).toFixed(3);
    }
    
    el.style.transform = `scale(${scale})`;

    // Fade-In Logik
    if (isNew) {
        el.style.opacity = '0';
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
            el.style.opacity = '1';
        });
    } else {
        el.style.opacity = '1';
    }

    // Stack Cleanup (Speicher schonen)
    if (stack.children.length > 10 && isNew) {
        const bottomEl = stack.firstElementChild;
        if (bottomEl !== el) {
            stack.removeChild(bottomEl);
        }
    }
}

// === TOUCH GESTEN (Wischen) ===
function setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50; // Mindeststrecke in Pixeln

    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Prüfen, ob die Bewegung eher horizontal oder vertikal war
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // === HORIZONTAL (Blättern) ===
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX < 0) nextImage(); // Swipe Links -> Nächstes
                else prevImage();            // Swipe Rechts -> Vorheriges
            }
        } else {
            // === VERTIKAL (Schließen) ===
            // Nur Wischen nach UNTEN (deltaY > 0) soll schließen
            if (deltaY > minSwipeDistance) {
                closeGallery();
            }
        }
    }
}

// === HELPERS ===
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
        if (e.key === 'ArrowDown') closeGallery(); // Optional: Pfeil runter schließt auch
    });
}