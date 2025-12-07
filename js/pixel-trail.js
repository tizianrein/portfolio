document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'pixel-trail';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    const FADE_DURATION = 1500; 
    const CELL_SIZE = 50; 
    
    let activeCells = [];
    let gridOffsetX = 0;

    function handleResize() {
        // Sicherstellen, dass Canvas exakt dem Viewport entspricht
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const container = document.querySelector('.grid-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            
            // === FIX: RUNDEN AUF GANZE PIXEL ===
            // Browser rendern zentrierte Container oft auf Sub-Pixel (z.B. 300.5px).
            // Das führt zu Versatz. Math.round zwingt das Raster auf klare Pixelkanten.
            const computedStyle = window.getComputedStyle(container);
            const paddingLeft = parseFloat(computedStyle.paddingLeft);
            
            gridOffsetX = Math.round(rect.left + paddingLeft);
        }
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const now = Date.now();
        const scrollY = window.scrollY; 
        
        for (let i = activeCells.length - 1; i >= 0; i--) {
            const cell = activeCells[i];
            const age = now - cell.time;
            
            if (age > FADE_DURATION) {
                activeCells.splice(i, 1);
            } else {
                const opacity = 1 - (age / FADE_DURATION);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                
                const visualY = cell.y - scrollY;

                if (visualY + CELL_SIZE > 0 && visualY < canvas.height) {
                    // Auch hier sicherstellen, dass wir auf vollen Pixeln zeichnen
                    ctx.fillRect(Math.round(cell.x), Math.round(visualY), CELL_SIZE, CELL_SIZE);
                }
            }
        }
        
        requestAnimationFrame(render);
    }

    let lastGridX = -1;
    let lastGridY = -1;

    window.addEventListener('mousemove', (e) => {
        const relativeX = e.clientX - gridOffsetX;
        const absoluteY = e.pageY;

        const colIndex = Math.floor(relativeX / CELL_SIZE);
        const rowIndex = Math.floor(absoluteY / CELL_SIZE);

        if (colIndex !== lastGridX || rowIndex !== lastGridY) {
            
            // X-Position berechnen
            const snapX = (colIndex * CELL_SIZE) + gridOffsetX;
            // Y-Position berechnen (Absolut zum Dokument)
            const snapY = rowIndex * CELL_SIZE;

            activeCells.push({
                x: snapX,
                y: snapY, 
                time: Date.now()
            });

            lastGridX = colIndex;
            lastGridY = rowIndex;
        }
    });

    window.addEventListener('resize', handleResize);
    
    // Grid-Position bei Scroll neu berechnen (wichtig, falls Browser Leisten ein/ausblendet)
    window.addEventListener('scroll', handleResize);
    
    handleResize();
    requestAnimationFrame(render);
});