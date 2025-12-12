const fs = require('fs');
const path = require('path');

// 1. Load your projects data
const projects = JSON.parse(fs.readFileSync('projects.json', 'utf8'));

// 2. Define the output directory
const outputDir = path.join(__dirname, 'projects');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

// 3. Helper to create SEO-friendly Alt Text
const getAltText = (project, index) => {
    return `${project.en.title} - Architecture by Tizian Rein - View ${index + 1}`;
};

// 4. The HTML Template Function
const generateHTML = (project, prevProject, nextProject) => {
    const title = `${project.de.title} – Tizian Rein`;
    const description = project.en.description.replace(/<[^>]*>?/gm, '').substring(0, 160); // Strip HTML, trunc to 160 chars

    // Generate Image Grid HTML
    let galleryHTML = '';
    
    // Check for specific video object (like in Project 017)
    if (project.video) {
        galleryHTML += `
        <div class="thumb-item" onclick="openGallery(0)">
            <video class="thumb-video" src="../${project.video.src}" poster="../${project.video.poster}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
            <span class="thumb-index">01</span>
        </div>`;
    }

    // Loop through images
    project.images.forEach((imgSrc, index) => {
        // Adjust index if video exists
        let displayIndex = project.video ? index + 2 : index + 1;
        let realIndex = project.video ? index + 1 : index;
        
        // Correct path: images are in root, file is in /projects/, so we need "../"
        const relativeImgSrc = `../${imgSrc}`;
        
        galleryHTML += `
        <div class="thumb-item" onclick="openGallery(${realIndex})">
            <img src="${relativeImgSrc}" alt="${getAltText(project, displayIndex)}" loading="lazy">
            <span class="thumb-index">${displayIndex.toString().padStart(2, '0')}</span>
        </div>
        `;
    });

    // JSON-LD Schema for Google
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": project.en.title,
        "artist": { "@type": "Person", "name": "Tizian Rein" },
        "description": description,
        "image": project.images.map(img => `https://www.tizianrein.de/${img}`),
        "yearCreated": project.year
    };

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="author" content="Tizian Rein">
    
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://www.tizianrein.de/${project.thumbnail}">
    <meta property="og:type" content="article">

    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🟥</text></svg>">
    <link rel="stylesheet" href="../css/style.css">
    
    <!-- Structured Data for Google -->
    <script type="application/ld+json">
    ${JSON.stringify(schemaData)}
    </script>

    <style>
        /* Project Specific Styles */
        .project-layout { display: grid; grid-template-columns: 400px 750px; column-gap: 50px; width: 1200px; max-width: 1200px; margin: 0 auto; position: relative; }
        .col-text { position: sticky; top: 100px; height: fit-content; }
        #thumbnail-grid { width: 100%; display: grid; grid-template-columns: repeat(6, 100px); gap: 30px; align-content: start; }
        .thumb-item { width: 100px; cursor: pointer; display: flex; flex-direction: column; gap: 5px; }
        .thumb-item img, .thumb-item video { width: 100px; height: auto; display: block; }
        .info-text { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.35; color: var(--color-text); margin-top: 0; }
        .project-id-block { display: block; margin-bottom: 0; font-weight: normal; }
        .project-title-block { display: block; margin-bottom: 20px; font-weight: normal; }
        
        /* Fullscreen Overlay Styles */
        #fs-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000; z-index: 99999; }
        #fs-overlay.active { display: block; }
        .fs-img { position: absolute; max-width: 90vw; max-height: 80vh; object-fit: contain; pointer-events: none; }
        video.fs-img { pointer-events: auto !important; z-index: 60; }
        
        @media (max-width: 1240px) {
            .project-layout { display: flex; flex-direction: column; width: 100%; gap: 0; }
            .col-text { width: 100%; position: static; margin-bottom: 50px; }
            #thumbnail-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
            .thumb-item { width: 100%; }
            .thumb-item img, .thumb-item video { width: 100%; }
        }
    </style>
</head>
<body>
    <!-- NAV -->
    <nav class="mobile-nav">
        <a href="/" class="corner top-left">tizian rein</a>
        <a href="../info.html" class="corner top-right">info</a>
        <div class="corner bottom-left lang-switch">
            <a href="#" class="lang-btn active" data-lang="de">de</a>
            <a href="#" class="lang-btn" data-lang="en">en</a>
        </div>
        <div class="corner bottom-right project-trigger">
            <span>projekte</span>
            <div class="mobile-submenu">
                <a href="/?filter=architecture">architektur</a>
                <a href="/?filter=objects">objekte</a>
                <a href="/?filter=research">forschung</a>
            </div>
        </div>
    </nav>

    <header class="desktop-header">
        <div class="grid-container header-grid">
            <div class="header-col title-col"><a href="/">tizian rein</a></div>
            <div class="header-col projects-col"><a href="/" class="nav-link active">projekte</a></div>
            <div class="header-col info-col"><a href="../info.html" class="nav-link">info</a></div>
            <div class="header-col lang-col">
                <a href="#" class="lang-btn active" data-lang="de">de</a> 
                <a href="#" class="lang-btn" data-lang="en">en</a>
            </div>
        </div>
    </header>

    <main>
        <div class="grid-container">
            <div class="project-layout">
                
                <!-- TEXT COLUMN -->
                <div class="col-text">
                    
                    <!-- German Content -->
                    <div data-lang-content="de">
                        <span class="info-text project-id-block">${project.id}</span>
                        <h1 class="info-text project-title-block">${project.de.title}</h1>
                        <p class="info-text">${project.de.description}</p>
                    </div>

                    <!-- English Content (Hidden by default via JS) -->
                    <div data-lang-content="en" style="display:none;">
                        <span class="info-text project-id-block">${project.id}</span>
                        <h1 class="info-text project-title-block">${project.en.title}</h1>
                        <p class="info-text">${project.en.description}</p>
                    </div>

                </div>

                <!-- GALLERY COLUMN -->
                <div class="col-gallery" id="thumbnail-grid">
                    ${galleryHTML}
                </div>
            </div>
        </div>

        <!-- FOOTER NAV -->
        <div class="project-footer-nav">
            ${prevProject ? `<a href="${prevProject.id}.html" class="nav-arrow-link"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> <span>Previous</span></a>` : '<span></span>'}
            
            ${nextProject ? `<a href="${nextProject.id}.html" class="nav-arrow-link"><span>Next</span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>` : '<span></span>'}
        </div>
    </main>

    <!-- FULLSCREEN OVERLAY (Hardcoded Structure) -->
    <div id="fs-overlay">
        <div class="fs-header">
            <div class="fs-col fs-title-center"><span id="fs-project-title">${project.de.title}</span></div>
            <div class="grid-container">
                <a href="/" class="fs-col fs-title-left">tizian rein</a>
                <div class="fs-col fs-close-right" onclick="closeGallery()">x</div>
            </div>
        </div>
        
        <!-- Mobile UI -->
        <div class="mobile-fs-ui">
            <div class="fs-corner fs-top-left">${project.de.title}</div>
            <div class="fs-corner fs-top-right" onclick="closeGallery()">x</div>
            <div class="fs-corner fs-btm-left" onclick="closeGallery()">x</div>
            <div class="fs-corner fs-btm-right" onclick="closeGallery()">projekte</div>
        </div>

        <div class="click-zone zone-left" onclick="prevImage()"></div>
        <div class="click-zone zone-right" onclick="nextImage()"></div>
        <div id="fs-image-stack"></div>
    </div>

    <!-- Pass Data to JS for Interactive Gallery -->
    <script>
        const currentProjectData = ${JSON.stringify(project)};
    </script>
    <script src="../js/pixel-trail.js"></script>
    <script src="../js/project-detail.js"></script>
    <script src="../js/main.js"></script>
</body>
</html>`;
};

// 5. Run Generation
projects.forEach((proj, index) => {
    const prev = index > 0 ? projects[index - 1] : null;
    const next = index < projects.length - 1 ? projects[index + 1] : null;
    
    const htmlContent = generateHTML(proj, prev, next);
    const fileName = path.join(outputDir, `${proj.id}.html`);
    
    fs.writeFileSync(fileName, htmlContent);
    console.log(`Generated: projects/${proj.id}.html`);
});

console.log("All project pages generated successfully.");