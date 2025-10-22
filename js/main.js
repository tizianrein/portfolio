document.addEventListener('DOMContentLoaded', () => {

    const projects = [
        // (Ihre Projektliste bleibt unverändert)
        { id: '053', title: 'Ipsum Dolor Sit', year: 2025, scale: 'mm', thumbnail: 'images/thumbnails/053-thumb.jpg' },
        { id: '052', title: 'Lorem Ipsum Amet', year: 2023, scale: 'm', thumbnail: 'images/thumbnails/052-thumb.jpg' },
        { id: '050', title: 'Sit Amet Dolor', year: 2024, scale: 'm', thumbnail: 'images/thumbnails/050-thumb.jpg' },
        { id: '049', title: 'Consectetur Adipiscing', year: 2019, scale: 'cm', thumbnail: 'images/thumbnails/049-thumb.jpg' },
        { id: '047', title: 'Sed Do Eiusmod', year: 2018, scale: 'cm', thumbnail: 'images/thumbnails/047-thumb.jpg' },
        { id: '046', title: 'Tempor Incididunt', year: 2016, scale: 'mm', thumbnail: 'images/thumbnails/046-thumb.jpg' }
    ];

    const projectGrid = document.getElementById('project-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Die Funktion displayProjects bleibt exakt wie in der letzten Version.
    function displayProjects(projectsToDisplay) {
        projectGrid.innerHTML = '';
        projectsToDisplay.forEach((project, index) => {
            const projectElement = document.createElement('a');
            projectElement.href = `projects/project-${project.id}.html`;
            projectElement.className = 'project-item';
            projectElement.dataset.year = project.year;
            const layoutType = Math.floor(index / 2) % 2 === 0 ? 'a' : 'b';
            projectElement.classList.add(`layout-${layoutType}`);
            projectElement.innerHTML = `
                <div class="project-image-container">
                    <canvas class="pixelation-canvas"></canvas>
                    <img data-src="${project.thumbnail}" class="full-res-image" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h3>${project.id}</h3>
                    <p>${project.title}</p>
                </div>
            `;
            projectGrid.appendChild(projectElement);
            prepareInitialPixelatedImage(projectElement);
        });
        setupHoverListeners();
    }

    /**
     * Lädt das Bild für ein Projekt, platziert es UNSICHTBAR und zeichnet die erste Pixel-Stufe darüber.
     */
    function prepareInitialPixelatedImage(projectElement) {
        const container = projectElement.querySelector('.project-image-container');
        const canvas = container.querySelector('.pixelation-canvas');
        const finalImage = container.querySelector('.full-res-image');
        
        const highResImage = new Image();
        highResImage.src = finalImage.dataset.src;

        highResImage.onload = () => {
            container.imageObject = highResImage;
            const aspect = highResImage.naturalHeight / highResImage.naturalWidth;
            container.style.paddingTop = `${aspect * 100}%`;
            
            // FIX: Das finale <img>-Element SOFORT mit der Quelle füllen.
            // Es wird im DOM gerendert, ist aber durch die Leinwand verdeckt.
            finalImage.src = highResImage.src;

            // Zeichne die erste pixelige Stufe auf die Leinwand darüber.
            drawPixelated(highResImage, canvas, 4);
        };
    }

    // Die Funktion setupHoverListeners bleibt exakt wie in der letzten Version.
    function setupHoverListeners() {
    const containers = document.querySelectorAll('.project-image-container');
    const isCoarse = window.matchMedia('(pointer: coarse)').matches; // true = Touch/Mobile

    // Nur 1x starten je Container
    function triggerOnce(container) {
        if (!container || !container.imageObject) return;
        if (container.dataset.animStarted === '1') return;
        container.dataset.animStarted = '1';
        startDePixelationAnimation(container);
    }

    // DESKTOP (feiner Pointer): NUR bei Hover entpixeln
    if (!isCoarse) {
        containers.forEach(container => {
        container.addEventListener('pointerenter', () => triggerOnce(container), { passive: true, once: true });
        });
        return; // Wichtig: IO & Touch-Code NICHT auf Desktop aktivieren
    }

    // MOBILE (coarse pointer): beim Scrollen im Viewport entpixeln
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) { // mind. 50% sichtbar
            triggerOnce(entry.target);
            io.unobserve(entry.target);
        }
        });
    }, {
        root: null,
        threshold: [0.5],   // erst bei „wirklich sichtbar“
        rootMargin: '0px'   // kein Vorziehen -> wirklich im Viewfield
    });
    containers.forEach(c => io.observe(c));

    // MOBILE „Wischen“: Element unter dem Finger entpixeln (ohne Tippen/Navigieren)
    let last = 0;
    window.addEventListener('touchmove', (e) => {
        const now = Date.now();
        if (now - last < 120) return; // throttle
        last = now;
        const t = e.touches && e.touches[0];
        if (!t) return;
        const el = document.elementFromPoint(t.clientX, t.clientY);
        const container = el && el.closest && el.closest('.project-image-container');
        if (container) triggerOnce(container);
    }, { passive: true });
    }

    /**
     * Startet die Animation und blendet am Ende nur noch die Leinwand aus.
     */
    function startDePixelationAnimation(container) {
        const canvas = container.querySelector('.pixelation-canvas');
        const highResImage = container.imageObject;

        const pixelationSteps = [4, 8, 16, 32];
        let currentStep = 1;

        function animate() {
            if (currentStep >= pixelationSteps.length) {
                // FIX: Die einzige Aktion am Ende ist das Hinzufügen der Klasse.
                // Das Bild ist bereits da und muss nicht mehr geladen werden.
                container.classList.add('is-loaded');
                return;
            }
            const size = pixelationSteps[currentStep];
            drawPixelated(highResImage, canvas, size);
            currentStep++;
            setTimeout(animate, 150);
        }
        animate();
    }

    // Die Funktion drawPixelated bleibt exakt wie in der letzten Version.
    function drawPixelated(image, canvas, size) {
        const ctx = canvas.getContext('2d');
        const aspect = image.height / image.width;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0, 0, size, size * aspect);
        ctx.drawImage(canvas, 0, 0, size, size * aspect, 0, 0, canvas.width, canvas.height);
    }

    // --- Ihre Filter-Logik (unverändert) ---
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            if (filter === 'all' || !filter) {
                displayProjects(projects);
            } else {
                const filteredProjects = projects.filter(p => p.scale === filter);
                displayProjects(filteredProjects);
            }
        });
    });

    // --- Initialisierung ---
    displayProjects(projects);
});