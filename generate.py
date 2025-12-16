import json
import os

# 1. Load projects.json
# Ensure projects.json exists in the same directory
with open('projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# 2. Output Directory
output_dir = 'projects'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Helper for Alt Text
def get_alt_text(proj, index):
    title = proj.get('en', {}).get('title', 'Project')
    return f"{title} - Architecture by Tizian Rein - View {index}"

# 3. HTML Generator
def generate_html(project, prev_proj, next_proj):
    
    # --- DATA PREP ---
    p_id = project['id']
    
    # Clean description for Meta Tags (remove HTML)
    desc_clean = project['en']['description'].replace('<br>', ' ').replace('<a>', '').replace('</a>', '')[:160] + "..."
    
    # Page Title
    page_title = f"{project['de']['title']} – Tizian Rein"

    # Year handling for Body Text
    year_str = project.get('year', '')
    
    # --- THUMBNAIL GRID ---
    gallery_html = ""
    gallery_assets = [] 
    
    display_counter = 1
    
    # 1. Video Check
    if 'video' in project:
        vid_src = f"/{project['video']['src']}"
        vid_poster = f"/{project['video']['poster']}"
        
        # Number: 023.01
        num_str = f"{p_id}.{display_counter:02d}"
        alt_text = get_alt_text(project, display_counter)
        
        gallery_html += f"""
        <div class="thumb-item" onclick="openGallery(0)">
            <span class="thumb-index">{num_str}</span>
            <video class="thumb-video" src="{vid_src}" poster="{vid_poster}" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
        </div>"""
        
        gallery_assets.append({'type': 'video', 'src': vid_src, 'poster': vid_poster, 'alt': alt_text})
        display_counter += 1

    # 2. Image Loop
    for img_path in project['images']:
        # Ensure path starts with / if not present
        img_src_rel = f"/{img_path}" if not img_path.startswith('/') else img_path
        
        js_index = len(gallery_assets)
        
        # Number: 023.02
        num_str = f"{p_id}.{display_counter:02d}"
        alt_text = get_alt_text(project, display_counter)
        
        gallery_html += f"""
        <div class="thumb-item" onclick="openGallery({js_index})">
            <span class="thumb-index">{num_str}</span>
            <img src="{img_src_rel}" alt="{alt_text}" loading="lazy">
        </div>"""
        
        gallery_assets.append({'type': 'image', 'src': img_src_rel, 'alt': alt_text})
        display_counter += 1

    # --- FOOTER LINKS ---
    # Note: Using {id}.html for links as specific slugs (like 'from-structure-to-action') 
    # cannot be determined automatically without extra logic. 
    
    prev_link_html = ""
    if prev_proj:
        prev_link_html = f"""
            <a href="{prev_proj['id']}.html" id="prev-project-link" class="nav-arrow-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span id="prev-label">Vorheriges Projekt</span>
            </a>"""

    next_link_html = ""
    if next_proj:
        next_link_html = f"""
            <a href="{next_proj['id']}.html" id="next-project-link" class="nav-arrow-link">
                <span id="next-label">Nächstes Projekt</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>"""


    # --- JSON DATA ---
    schema_data = {
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": project['en']['title'],
        "artist": { "@type": "Person", "name": "Tizian Rein" },
        "description": desc_clean,
        "image": [f"https://www.tizianrein.de/{img}" for img in project['images']],
        "yearCreated": project['year']
    }
    schema_json = json.dumps(schema_data)
    assets_json = json.dumps(gallery_assets)

    # --- HTML TEMPLATE ---
    # This template matches your provided index.html structure exactly.
    html_content = f"""<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <meta name="description" content="{desc_clean}">
    <meta name="robots" content="index, follow">
    
    <meta property="og:title" content="{page_title}">
    <meta property="og:description" content="{desc_clean}">
    <meta property="og:image" content="https://www.tizianrein.de/{project['thumbnail']}">
    <meta property="og:type" content="article">

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/css/style.css">

    <script type="application/ld+json">
    {schema_json}
    </script>

    <style>
        .project-layout, .project-layout * {{ box-sizing: border-box; }}
        .project-layout {{
            display: grid; grid-template-columns: 400px 750px; column-gap: 50px;
            width: 1200px; max-width: 1200px; margin: 0 auto; position: relative;
        }}
        .col-text {{ position: sticky; top: 100px; height: fit-content; margin: 0; }}
        #thumbnail-grid {{
            width: 100%; display: grid; grid-template-columns: repeat(6, 100px);
            gap: 30px; align-content: start;
        }}
        .thumb-item {{ 
            width: 100px; cursor: pointer; 
            display: flex; flex-direction: column; 
            gap: 5px; margin: 0; 
            align-items: flex-start; 
        }}
        .thumb-index {{ font-size: 12px; display: block; color: var(--color-text); margin-bottom: 2px; }}
        
        .thumb-item img, .thumb-item video, .thumb-video {{
            width: 100%; /* Force full width of container (100px) */
            height: auto; display: block; object-fit: cover;
        }}
        
        .info-text {{
            font-family: Arial, sans-serif; font-size: 15px; line-height: 1.35;
            color: var(--color-text); margin-top: 0;
        }}
        .info-text a {{ text-decoration: underline; color: inherit; }}
        .info-text a:hover {{ color: var(--color-grey); }}
        .project-id-block {{ display: block; margin-bottom: 0; font-weight: normal; }}
        .project-title-block {{ display: block; margin-bottom: 20px; text-decoration: none; font-weight: normal; }}

        /* OVERLAY - STACKING LOGIC */
        #fs-overlay {{
            display: none; position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh; background: #000; color: #fff;
            z-index: 99999; overflow: hidden;
        }}
        #fs-overlay.active {{ display: block; }}
        .fs-header {{
            position: absolute; top: 0; left: 0; width: 100%;
            padding-top: 25px; pointer-events: none; z-index: 100;
        }}
        .fs-header .grid-container {{ position: relative; height: 0; }}
        .fs-col {{
            font-size: 28px; line-height: 1; position: absolute;
            top: 0; pointer-events: auto; color: #fff; text-decoration: none;
        }}
        .fs-title-left {{ left: 0; }} 
        .fs-title-center {{ position: fixed; top: 25px; left: 0; width: 100%; text-align: center; pointer-events: none; }} 
        .fs-close-right {{ right: 0; cursor: pointer; }}
        .click-zone {{ position: absolute; top: 0; bottom: 0; width: 50%; z-index: 50; }}
        .zone-right {{ right: 0; left: auto; }}
        
        #fs-image-stack {{
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center; pointer-events: none;
        }}

        .fs-img, video.fs-img {{
            position: absolute; 
            max-width: 90vw; max-height: 80vh;
            object-fit: contain; 
            display: block;
            border: none;
        }}
        video.fs-img {{ pointer-events: auto !important; z-index: 60; }}

        .mobile-fs-ui {{ display: none; }}
        @media (max-width: 1240px) {{
            .project-layout {{ display: flex; flex-direction: column; width: 100%; grid-template-columns: none; gap: 0; }}
            .col-text {{ width: 100%; position: static; margin-bottom: 50px; }}
            #thumbnail-grid {{ width: 100%; grid-template-columns: repeat(4, 1fr); gap: 10px; }}
            .thumb-item {{ width: 100%; }}
            .thumb-item img, .thumb-item video {{ width: 100%; }}
            .fs-header {{ display: none; }}
            .mobile-fs-ui {{ display: block; }}
            .fs-corner {{ position: absolute; padding: 20px; font-size: 28px; color: #fff; z-index: 101; line-height: 1; cursor: pointer; }}
            .fs-top-left {{ top: 0; left: 0; pointer-events: none; }} 
            .fs-top-right {{ top: 0; right: 0; }}
            .fs-btm-left {{ bottom: 0; left: 0; }}
            .fs-btm-right {{ bottom: 0; right: 0; text-align: right; }}
            .fs-img {{ max-width: 95vw; max-height: 70vh; }}
        }}
    </style>
</head>
<body>
    <nav class="mobile-nav">
        <a href="/" class="corner top-left">tizian rein</a>
        <a href="/info" class="corner top-right">info</a>
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
            <div class="header-col info-col"><a href="/info" class="nav-link">info</a></div>
            <div class="header-col lang-col">
                <a href="#" class="lang-btn active" data-lang="de">de</a> 
                <a href="#" class="lang-btn" data-lang="en">en</a>
            </div>
        </div>
    </header>

    <main>
        <div class="grid-container">
            <div class="project-layout">
                <div class="col-text">
                    <div data-lang-content="de">
                        <span class="info-text project-id-block">{p_id}</span>
                        <h1 class="info-text project-title-block">{project['de']['title']}</h1>
                        <p class="info-text">{project['de']['description']}<br><br>{year_str}</p>
                    </div>
                    <div data-lang-content="en" style="display:none;">
                        <span class="info-text project-id-block">{p_id}</span>
                        <h1 class="info-text project-title-block">{project['en']['title']}</h1>
                        <p class="info-text">{project['en']['description']}<br><br>{year_str}</p>
                    </div>
                </div>
                <div class="col-gallery" id="thumbnail-grid">
                    {gallery_html}
                </div>
            </div>
        </div>
        <div class="project-footer-nav">
            {prev_link_html}
            {next_link_html}
        </div>
    </main>

    <div id="fs-overlay">
        <div class="fs-header">
            <div class="fs-col fs-title-center"><span id="fs-project-title">{project['de']['title']}</span></div>
            <div class="grid-container">
                <a href="/" class="fs-col fs-title-left">tizian rein</a>
                <div class="fs-col fs-close-right" onclick="closeGallery()">x</div>
            </div>
        </div>
        <div class="mobile-fs-ui">
            <div class="fs-corner fs-top-left" id="fs-mob-title">{project['de']['title']}</div>
            <div class="fs-corner fs-top-right" onclick="closeGallery()">x</div>
            <div class="fs-corner fs-btm-left" onclick="closeGallery()">x</div>
            <div class="fs-corner fs-btm-right" onclick="closeGallery()">projekte</div>
        </div>
        <div class="click-zone zone-left" onclick="prevImage()"></div>
        <div class="click-zone zone-right" onclick="nextImage()"></div>
        <div id="fs-image-stack"></div>
    </div>

    <script src="/js/pixel-trail.js"></script>
    <script src="/js/main.js"></script>
    
    <!-- FULL PROJECT DETAIL LOGIC INJECTED -->
    <script>
        const galleryAssets = {assets_json};
        let currentImageIndex = 0;
        const stack = document.getElementById('fs-image-stack');
        const overlay = document.getElementById('fs-overlay');

        // === OPEN / CLOSE ===
        function openGallery(index) {{
            currentImageIndex = index;
            overlay.classList.add('active');
            
            // Thumbnails Videos stoppen
            document.querySelectorAll('.thumb-video').forEach(v => {{
                v.pause();
                v.currentTime = 0;
            }});

            stack.innerHTML = '';
            updateFullscreenImage(true); 
        }}

        function closeGallery() {{
            overlay.classList.remove('active');
            setTimeout(() => {{ stack.innerHTML = ''; }}, 300);
        }}

        function nextImage() {{
            if (galleryAssets.length === 0) return;
            currentImageIndex++;
            if (currentImageIndex >= galleryAssets.length) currentImageIndex = 0;
            updateFullscreenImage(false);
        }}

        function prevImage() {{
            if (galleryAssets.length === 0) return;
            currentImageIndex--;
            if (currentImageIndex < 0) currentImageIndex = galleryAssets.length - 1;
            updateFullscreenImage(false);
        }}

        // === CORE LOGIC (Stacking, Video, Scaling) ===
        function updateFullscreenImage(isInitial = false) {{
            
            // 1. Hintergrund-Videos pausieren
            Array.from(stack.children).forEach(child => {{
                if (child.tagName === 'VIDEO') {{
                    child.pause();
                }}
            }});

            // 2. Prüfen ob Element schon existiert
            const existingEl = Array.from(stack.children).find(el => parseInt(el.dataset.index) === currentImageIndex);
            let el;
            let isNew = false;

            if (existingEl) {{
                el = existingEl;
                stack.appendChild(el); // Nach oben holen
                if (el.tagName === 'VIDEO') {{
                    el.currentTime = 0;
                    el.play().catch(e => console.log("Auto-Play prevented:", e));
                }}
            }} else {{
                isNew = true;
                const asset = galleryAssets[currentImageIndex];
                el = createMediaElement(asset);
                el.dataset.index = currentImageIndex; 
                stack.appendChild(el);
            }}

            // 3. Z-Index Management
            Array.from(stack.children).forEach(child => {{
                child.style.zIndex = '1'; 
            }});
            el.style.zIndex = '60';

            // 4. Random Scaling (wenn nicht das erste Bild)
            let scale = 1;
            if (!isInitial) {{
                scale = (0.80 + Math.random() * 0.25).toFixed(3);
            }}
            el.style.transform = `scale(${{scale}})`;

            // 5. Fade In Animation für neue Elemente
            if (isNew) {{
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
                // Trigger reflow
                void el.offsetWidth;
                el.style.opacity = '1';
            }} else {{
                el.style.opacity = '1';
            }}

            // 6. Cleanup (Max 10 Elemente)
            if (stack.children.length > 10 && isNew) {{
                const bottomEl = stack.firstElementChild;
                if (bottomEl !== el) {{
                    stack.removeChild(bottomEl);
                }}
            }}
        }}

        // === DOM HELPER ===
        function createMediaElement(asset) {{
            let el;
            if (asset.type === 'video') {{
                el = document.createElement('video');
                el.src = asset.src;
                el.poster = asset.poster;
                el.className = 'fs-img';
                el.autoplay = true;   
                el.muted = false;     
                el.controls = true;   
                el.loop = false;
                el.playsInline = true; 
                el.style.pointerEvents = "auto";
            }} else {{
                el = document.createElement('img');
                el.src = asset.src;
                el.className = 'fs-img';
                el.alt = asset.alt;
            }}
            return el;
        }}

        // === TOUCH GESTURES ===
        let touchStartX = 0;
        let touchStartY = 0;
        const minSwipeDistance = 50;

        overlay.addEventListener('touchstart', (e) => {{
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }}, {{ passive: true }});

        overlay.addEventListener('touchend', (e) => {{
            let touchEndX = e.changedTouches[0].screenX;
            let touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {{
                // Horizontal
                if (Math.abs(deltaX) > minSwipeDistance) {{
                    if (deltaX < 0) nextImage();
                    else prevImage();
                }}
            }} else {{
                // Vertikal (nur nach unten = schließen)
                if (deltaY > minSwipeDistance) {{
                    closeGallery();
                }}
            }}
        }}, {{ passive: true }});

        // === KEYBOARD NAV ===
        document.addEventListener('keydown', (e) => {{
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowDown') closeGallery();
        }});
    </script>
</body>
</html>"""
    
    return html_content

# --- EXECUTION ---
print("Starte Generierung...")
if isinstance(projects, list):
    for index, proj in enumerate(projects):
        count = len(projects)
        prev_proj = projects[index - 1] if index > 0 else None
        next_proj = projects[index + 1] if index < count - 1 else None
        
        html = generate_html(proj, prev_proj, next_proj)
        
        # Writes to projects/022.html (based on ID)
        fname = os.path.join(output_dir, f"{proj['id']}.html")
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Erstellt: {fname}")
print("Fertig.")