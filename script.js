document.addEventListener('DOMContentLoaded', () => {
    
    /* -----------------------------------------------
        1. STAR BACKGROUND SYSTEM
    ----------------------------------------------- */
    const initStars = () => {
        const bg = document.getElementById("bg");
        if (!bg) return;
        
        const STAR_COUNT = 80;
        const REPEL_DIST = 150;
        const REPEL_DIST_SQ = REPEL_DIST * REPEL_DIST;
        const stars = [];

        let width = window.innerWidth;
        let height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
        });
        
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement("div");
            star.className = "star";
            const chars = ["·", "+", "°"];
            star.textContent = chars[Math.floor(Math.random() * chars.length)];
            star.style.color = "#fffd98"; 
            star.style.position = 'absolute';
            star.x = Math.random() * width;
            star.y = Math.random() * height;
            star.vx = (Math.random() - 0.5) * 0.5;
            star.vy = (Math.random() * 0.5) + 0.2; 
            star.baseOpacity = Math.random() * 0.4 + 0.1;
            bg.appendChild(star);
            stars.push(star);
        }

        let mouseX = -999;
        let mouseY = -999;

        window.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            for (const s of stars) {
                s.x += s.vx;
                s.y += s.vy;
                const dx = s.x - mouseX;
                const dy = s.y - mouseY;
                const distSq = dx * dx + dy * dy;

                if (distSq < REPEL_DIST_SQ) {
                    const dist = Math.sqrt(distSq);
                    const angle = Math.atan2(dy, dx);
                    const force = (REPEL_DIST - dist) / REPEL_DIST;
                    s.vx += Math.cos(angle) * force * 0.5;
                    s.vy += Math.sin(angle) * force * 0.5;
                }

                if (s.y > height) {
                    s.y = -10;
                    s.x = Math.random() * width;
                }
                if (s.x > width) s.x = 0;
                if (s.x < 0) s.x = width;

                s.vx *= 0.95;
                if(s.vy < 0.2) s.vy += 0.01; 
                s.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
                s.style.opacity = s.baseOpacity;
            }
            requestAnimationFrame(animate);
        };
        animate();
    };
    initStars();

   /* -----------------------------------------------
        2. MENU TOGGLE (FIXED SELECTORS)
    ----------------------------------------------- */
    const menuToggle = document.getElementById("menuToggle");
    const menuDropdown = document.getElementById("menuDropdown"); 
    
    if (menuToggle && menuDropdown) {
        // --- NEW: Highlight current page ---
        const highlightActivePage = () => {
            const currentPath = window.location.pathname;
            const menuLinks = menuDropdown.querySelectorAll('a');

            menuLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                
                // If current path matches link href exactly, or if at root '/' matches 'index.html'
                if (currentPath.endsWith(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
                    link.classList.add('active-page');
                } else {
                    link.classList.remove('active-page');
                }
            });
        };
        highlightActivePage();
        // ------------------------------------

        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            menuDropdown.classList.toggle("open");
            menuToggle.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!menuDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
                menuDropdown.classList.remove("open");
                menuToggle.classList.remove("active");
            }
        });
    }

    /* -----------------------------------------------
        3. PAGE TRANSITIONS
    ----------------------------------------------- */
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            // Check if it's a real internal link
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && link.hostname === window.location.hostname) {
                e.preventDefault();
                const content = document.querySelector('.content');
                if(content) content.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 500); 
            }
        });
    });

    /* -----------------------------------------------
        4. RIBBON SCROLL BEHAVIOR
    ----------------------------------------------- */
    let lastScrollY = window.scrollY;
    let isHidden = false;
    const RIBBON = document.querySelector('.top-ribbon');

    if (RIBBON) {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const SCROLL_THRESHOLD = 10;
            const TOP_THRESHOLD = 120;

            if (Math.abs(currentScrollY - lastScrollY) < SCROLL_THRESHOLD) return;

            if (currentScrollY > lastScrollY && currentScrollY > TOP_THRESHOLD) {
                if (!isHidden) {
                    RIBBON.classList.add('hide');
                    isHidden = true;
                }
            } else {
                if (isHidden) {
                    RIBBON.classList.remove('hide');
                    isHidden = false;
                }
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /* -----------------------------------------------
        5. HERO EXPLORE SPLIT SYSTEM
    ----------------------------------------------- */
    const exploreTrigger = document.getElementById('exploreTrigger');
    const heroContainer = document.getElementById('heroActionContainer');

    if (exploreTrigger && heroContainer) {
        exploreTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            heroContainer.classList.toggle('active');
            
            // Adjust parent rotation if it exists
            const parent = heroContainer.closest('.btn-float');
            if (parent) {
                parent.style.transform = heroContainer.classList.contains('active') ? 'rotate(0deg)' : 'rotate(-90deg)';
            }
        });

        // Close split buttons when clicking outside
        document.addEventListener('click', (e) => {
            if (!heroContainer.contains(e.target)) {
                heroContainer.classList.remove('active');
                const parent = heroContainer.closest('.btn-float');
                if (parent) parent.style.transform = 'rotate(-90deg)';
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Selects both the gold "Scleren" and white "Developer" text spans
    const titleSpans = document.querySelectorAll(".hero-title span");

    titleSpans.forEach(span => {
        const text = span.innerText;
        span.innerHTML = text.split("").map((char, index) => {
            // --delay is used by CSS to stagger the lights
            return `<span class="ladder-char" style="--delay: ${index}">${char}</span>`;
        }).join("");
    });
});