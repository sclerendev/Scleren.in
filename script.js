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
            star.style.position = "absolute";

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
                if (s.vy < 0.2) s.vy += 0.01;

                s.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
                s.style.opacity = s.baseOpacity;
            }
            requestAnimationFrame(animate);
        };
        animate();
    };
    initStars();

    /* -----------------------------------------------
        2. MENU TOGGLE + ACTIVE PAGE
    ----------------------------------------------- */
    const menuToggle = document.getElementById("menuToggle");
    const menuDropdown = document.getElementById("menuDropdown");

    if (menuToggle && menuDropdown) {
        const currentPath = window.location.pathname;

        menuDropdown.querySelectorAll("a").forEach(link => {
            const linkPath = link.getAttribute("href");
            if (
                currentPath.endsWith(linkPath) ||
                (currentPath === "/" && linkPath === "index.html")
            ) {
                link.classList.add("active-page");
            }
        });

        menuToggle.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            menuDropdown.classList.toggle("open");
            menuToggle.classList.toggle("active");
        });

        document.addEventListener("click", e => {
            if (!menuDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
                menuDropdown.classList.remove("open");
                menuToggle.classList.remove("active");
            }
        });
    }

    /* -----------------------------------------------
        3. PAGE TRANSITIONS (SAFE)
    ----------------------------------------------- */
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");

            // 🚫 Do NOT intercept mail, Gmail, or external links
            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("mailto:") ||
                href.startsWith("https://mail.google.com") ||
                link.hostname !== window.location.hostname
            ) return;

            e.preventDefault();

            const content = document.querySelector(".content");
            if (content) content.classList.add("fade-out");

            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    /* -----------------------------------------------
        4. RIBBON SCROLL BEHAVIOR
    ----------------------------------------------- */
    let lastScrollY = window.scrollY;
    let isHidden = false;
    const RIBBON = document.querySelector(".top-ribbon");

    if (RIBBON) {
        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) < 10) return;

            if (currentScrollY > lastScrollY && currentScrollY > 120) {
                if (!isHidden) {
                    RIBBON.classList.add("hide");
                    isHidden = true;
                }
            } else {
                if (isHidden) {
                    RIBBON.classList.remove("hide");
                    isHidden = false;
                }
            }
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    /* -----------------------------------------------
        5. HERO SPLIT SYSTEM
    ----------------------------------------------- */
   const exploreTrigger = document.getElementById("exploreTrigger");
const heroContainer  = document.getElementById("heroActionContainer");
const floatParent    = heroContainer?.closest(".btn-float");

if (exploreTrigger && heroContainer && floatParent) {

  // Toggle on button click
  exploreTrigger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = heroContainer.classList.toggle("active");
    floatParent.classList.toggle("active", isActive);
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!heroContainer.contains(e.target) && !exploreTrigger.contains(e.target)) {
      heroContainer.classList.remove("active");
      floatParent.classList.remove("active");
    }
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    heroContainer.classList.remove("active");
    floatParent.classList.remove("active");
  }
});


    /* -----------------------------------------------
        6. HERO TITLE LADDER EFFECT
    ----------------------------------------------- */
    document.querySelectorAll(".hero-title span").forEach(span => {
        const text = span.innerText;
        span.innerHTML = text
            .split("")
            .map((char, i) =>
                `<span class="ladder-char" style="--delay:${i}">${char}</span>`
            ).join("");
    });

});



/* -----------------------------------------------
    7. GMAIL OPEN FUNCTION (INQUIRY PAGE)
----------------------------------------------- */
function openGmail(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    const gmailURL =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=sclerendev@gmail.com" +
        "&su=" + encodeURIComponent(`[INQUIRY] ${subject}`) +
        "&body=" + encodeURIComponent(
            `From: ${email}\n\nInquiry Type:\n${subject}\n\nMessage:\n${message}`
        );

    window.open(gmailURL, "_blank");
}

function copyEmail(e) {
    e.preventDefault();

    const email = "sclerendev@gmail.com";

    // Modern clipboard (works on most mobile browsers)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
            .then(() => showCopyToast("Copied to clipboard"))
            .catch(() => legacyCopy(email));
    } else {
        // iOS / older fallback
        legacyCopy(email);
    }
}

function legacyCopy(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // iOS fix

    try {
        document.execCommand("copy");
        showCopyToast("Copied to clipboard");
    } catch {
        showCopyToast("Tap & hold to copy");
    }

    document.body.removeChild(tempInput);
}

function showCopyToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "80px";               // higher for thumbs
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(15,15,15,0.95)";
    toast.style.color = "#fffd98";
    toast.style.padding = "14px 22px";         // touch-friendly
    toast.style.borderRadius = "10px";
    toast.style.fontFamily = "IBM Plex Mono, monospace";
    toast.style.fontSize = "14px";
    toast.style.letterSpacing = "0.05em";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 8px 30px rgba(0,0,0,0.5)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    toast.style.pointerEvents = "none";

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(-6px)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(0)";
        setTimeout(() => toast.remove(), 300);
    }, 1400);
}

/* ENSURE READ LESS ALWAYS COLLAPSES */
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".read-toggle");
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const card = btn.closest(".game-card");

  if (btn.classList.contains("read-less")) {
    card.classList.remove("active");
  } else {
    card.classList.add("active");
  }
});