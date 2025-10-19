// Mobile menu toggle
const mobileToggle = document.getElementById("mobile-toggle");
const mobileMenu = document.getElementById("mobile-menu");
mobileToggle?.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));

// Auto-close mobile menu on scroll
let scrollTimeout;
window.addEventListener("scroll", () => {
    if (!mobileMenu.classList.contains("hidden")) {
        // Clear any existing timeout to avoid multiple closures
        clearTimeout(scrollTimeout);
        // Close the menu after a short delay to prevent flickering during fast scrolls
        scrollTimeout = setTimeout(() => {
            mobileMenu.classList.add("hidden");
        }, 150);
    }
});

// Also close mobile menu when clicking on menu links
document.querySelectorAll("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
    });
});

// Theme toggle logic
const root = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
const themeIconPath = document.getElementById("theme-path");
const themeIconPathMobile = document.getElementById("theme-path-mobile");

function setTheme(t) {
    // Add switching animation class
    themeToggle?.classList.add("switching");
    themeToggleMobile?.classList.add("switching");

    root.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);

    // Get all profile images
    const profileImages = document.querySelectorAll('img[src*="profile"]');

    // Create smooth fade transition for profile images
    profileImages.forEach((img) => {
        // Fade out
        img.style.opacity = "0";

        // Change image source after fade out completes
        setTimeout(() => {
            if (t === "light") {
                img.src = "assets/profile-light.jpg";
            } else {
                img.src = "assets/profile-dark.jpg";
            }

            // Fade back in
            setTimeout(() => {
                img.style.opacity = "1";
            }, 80); // Small delay to ensure image loads
        }, 100); // Wait for fade out animation
    });

    // swap icon (desktop + mobile)
    if (t === "light") {
        themeIconPath.setAttribute("d", "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z");
        themeIconPathMobile.setAttribute("d", "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z");
    } else {
        themeIconPath.setAttribute("d", "M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M1 12h2M21 12h2M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56");
        themeIconPathMobile.setAttribute("d", "M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M1 12h2M21 12h2M4.22 4.22l1.56 1.56M18.22 18.22l1.56 1.56M4.22 19.78l1.56-1.56M18.22 5.78l1.56-1.56");
    }

    // Remove switching class after animation completes
    setTimeout(() => {
        themeToggle?.classList.remove("switching");
        themeToggleMobile?.classList.remove("switching");
    }, 600);
}
const saved = localStorage.getItem("theme") || "dark";
setTheme(saved);
themeToggle?.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));
themeToggleMobile?.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

// Profile card tilt effect + subtle parallax
const card = document.getElementById("profile-card");
if (card) {
    // Add smooth transition to the card
    card.style.transition = "transform 0.3s ease-out";

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate rotation based on distance from center
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        // Clamp values to prevent excessive tilting
        const clampedX = Math.max(-1, Math.min(1, x));
        const clampedY = Math.max(-1, Math.min(1, y));

        const rotateX = clampedY * -5;
        const rotateY = clampedX * 5;

        card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(5px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
}

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("is-visible");
        });
    },
    { threshold: 0.12 }
);
reveals.forEach((r) => obs.observe(r));

// Nav active link
const navLinks = document.querySelectorAll(".nav-link");
const sections = ["main", "about", "experience", "education", "projects", "contact"].map((id) => document.getElementById(id));
function updateActive() {
    const y = window.scrollY + 120;
    navLinks.forEach((link) => link.classList.remove("active"));
    sections.forEach((sec) => {
        if (!sec) return;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (y >= top && y < bottom) {
            const target = document.querySelector(`a[href='#${sec.id}']`);
            target?.classList.add("active");
        }
    });
}
window.addEventListener("scroll", updateActive);
updateActive();

// scroll progress
const progress = document.getElementById("progress");
window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / h) * 100;
    progress.style.width = pct + "%";
});

// background particles + cursor interaction
const canvas = document.getElementById("bg-canvas");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
    let W = (canvas.width = innerWidth);
    let H = (canvas.height = innerHeight);

    window.addEventListener("resize", () => {
        W = canvas.width = innerWidth;
        H = canvas.height = innerHeight;
    });

    // Mouse tracking for particle interaction
    const mouse = { x: -9999, y: -9999 }; // Start off-screen
    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    const particles = [];
    const COUNT = 250;
    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            originalVx: 0,
            originalVy: 0,
        });
        particles[i].originalVx = particles[i].vx;
        particles[i].originalVy = particles[i].vy;
    }

    const neighborLists = Array.from({ length: COUNT }, () => []);
    const links = new Map();
    const linkCooldowns = new Map();
    const LINK_DISTANCE = 400;
    const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;
    const LINK_NEIGHBORS = 8;
    const LINK_MAX_LIFE = 2500;
    const LINK_BUILD_RATE = 1.8; // life gained per ms while active
    const LINK_FADE_RATE = 2.2; // life lost per ms when inactive
    const LINK_TTL = 1500; // ms until a link expires even if particles stay close
    const LINK_COOLDOWN = 1000; // ms before a link can reform after expiring
    const LINK_SPAWN_DELAY_MIN = 50;
    const LINK_SPAWN_DELAY_MAX = 2500;
    const SPAWN_BATCH_LIMIT = 6;

    let lastTime;
    let frameId = 0;

    function loop(time = 0) {
        if (lastTime === undefined) lastTime = time;
        const delta = Math.min(time - lastTime, 10);
        lastTime = time;
        frameId++;

        ctx.clearRect(0, 0, W, H);
        const hue = 230; // blue/purple
        const theme = document.body.getAttribute("data-theme") || "dark";
        const alphaBase = theme === "light" ? 0.1 : 0.05;
        const sizeMul = theme === "light" ? 0.5 : 0.6;

        for (let i = 0; i < neighborLists.length; i++) neighborLists[i].length = 0;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 100;

            if (distance < influenceRadius && distance > 0) {
                const force = (influenceRadius - distance) / influenceRadius;
                const pushStrength = 3;
                const pushX = (dx / distance) * force * pushStrength;
                const pushY = (dy / distance) * force * pushStrength;

                p.vx = p.originalVx + pushX;
                p.vy = p.originalVy + pushY;
            } else {
                p.vx += (p.originalVx - p.vx) * 0.05;
                p.vy += (p.originalVy - p.vy) * 0.05;
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const distSq = dx * dx + dy * dy;
                if (distSq <= LINK_DISTANCE_SQ) {
                    neighborLists[i].push({ index: j, distSq });
                    neighborLists[j].push({ index: i, distSq });
                }
            }
        }

        const activeKeys = new Set();
        let spawnsThisFrame = 0;

        for (let i = 0; i < neighborLists.length; i++) {
            const list = neighborLists[i];
            if (!list.length) continue;
            list.sort((a, b) => a.distSq - b.distSq);
            const limit = Math.min(list.length, LINK_NEIGHBORS);
            for (let k = 0; k < limit; k++) {
                const { index, distSq } = list[k];
                if (i > index) continue;
                if (distSq > LINK_DISTANCE_SQ) continue;
                const key = `${i}-${index}`;
                const cooldownUntil = linkCooldowns.get(key) || 0;
                if (cooldownUntil > time) continue;
                const dist = Math.sqrt(distSq);
                let link = links.get(key);
                if (!link) {
                    const spawnDelay = LINK_SPAWN_DELAY_MIN + Math.random() * (LINK_SPAWN_DELAY_MAX - LINK_SPAWN_DELAY_MIN);
                    link = { i, j: index, life: 0, activeFrame: frameId, dist, age: 0, spawnAt: time + spawnDelay, spawned: false };
                    links.set(key, link);
                }
                if (link.spawned && link.age >= LINK_TTL) continue;
                link.i = i;
                link.j = index;
                link.dist = dist;
                link.activeFrame = frameId;
                if (!link.spawned && time >= link.spawnAt && spawnsThisFrame < SPAWN_BATCH_LIMIT) {
                    link.spawned = true;
                    link.age = 0;
                    link.life = 0;
                    spawnsThisFrame++;
                }
                if (link.spawned) {
                    activeKeys.add(key);
                }
            }
        }

        const lineBaseAlpha = theme === "light" ? 0.07 : 0.08;
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (const [key, link] of links) {
            if (!link.spawned) {
                continue;
            }

            link.age += delta;
            const isActive = activeKeys.has(key) && link.age < LINK_TTL;

            if (isActive) {
                link.life = Math.min(LINK_MAX_LIFE, link.life + delta * LINK_BUILD_RATE);
            } else {
                link.life -= delta * LINK_FADE_RATE;
            }

            const p = particles[link.i];
            const q = particles[link.j];
            if (!p || !q) {
                links.delete(key);
                linkCooldowns.set(key, time + LINK_COOLDOWN);
                continue;
            }

            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const currentDistSq = dx * dx + dy * dy;
            const dist = Math.sqrt(currentDistSq);
            link.dist = dist;

            if (!isActive && currentDistSq > LINK_DISTANCE_SQ) {
                const overshoot = Math.min(4, currentDistSq / LINK_DISTANCE_SQ);
                link.life -= delta * LINK_FADE_RATE * (overshoot - 1);
            }

            if (link.life <= 0) {
                linkCooldowns.set(key, time + LINK_COOLDOWN);
                links.delete(key);
                continue;
            }

            if (currentDistSq > LINK_DISTANCE_SQ) {
                continue;
            }

            const strength = Math.min(1, Math.max(0, link.life / LINK_MAX_LIFE));
            const distanceFactor = Math.max(0, 1 - dist / LINK_DISTANCE);
            const opacity = lineBaseAlpha * distanceFactor * strength;
            if (opacity <= 0.001) continue;

            ctx.strokeStyle = `hsla(${(hue + 15) % 360},85%,${theme === "light" ? 45 : 65}%,${opacity})`;
            ctx.lineWidth = 0.6 + 1.3 * strength;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
        }
        ctx.restore();

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const a = alphaBase + Math.abs(Math.sin((p.x + p.y + time / 120) / 180)) * 0.04;
            const c1 = `hsla(${(hue + p.r * 6) % 360},80%,60%,${a})`;
            const c2 = `hsla(${(hue + 40 + p.r * 4) % 360},70%,50%,${a * 0.6})`;
            const g = ctx.createLinearGradient(p.x, p.y - p.r, p.x + p.r * 6, p.y + p.r * 6);
            g.addColorStop(0, c1);
            g.addColorStop(1, c2);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * sizeMul, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

// Staggered entrance for project cards
document.querySelectorAll(".project-card").forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(15px)";
    setTimeout(() => {
        el.style.transition = "all 250ms cubic-bezier(.2,.9,.2,1)";
        el.style.opacity = 1;
        el.style.transform = "none";
    }, 80 + i * 50);
});

// Mobile "load more" behaviour for project cards
const projectsGrid = document.querySelector(".projects-grid");
const projectCards = projectsGrid ? Array.from(projectsGrid.querySelectorAll(".project-card")) : [];
const loadMoreButton = document.getElementById("load-more-projects");
const MOBILE_BREAKPOINT = 1024;
const MOBILE_VISIBLE_COUNT = 3; // Display cards up to "LLMs4Subjects" on mobile by default
const PROJECT_REVEAL_ANIMATION = "projectCardReveal";
let projectsExpanded = false;

projectCards.forEach((card) => {
    card.addEventListener("animationend", (event) => {
        if (event.animationName === PROJECT_REVEAL_ANIMATION) {
            card.classList.remove("project-reveal");
        }
    });
});

function updateProjectVisibility(forceCollapse = false) {
    if (!projectsGrid || !projectCards.length) return;

    if (forceCollapse) projectsExpanded = false;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const hasExtraProjects = projectCards.length > MOBILE_VISIBLE_COUNT;

    if (!isMobile) {
        projectCards.forEach((card) => {
            card.classList.remove("project-hidden", "project-reveal");
        });
        if (loadMoreButton) {
            loadMoreButton.classList.add("hidden");
            loadMoreButton.setAttribute("aria-hidden", "true");
            loadMoreButton.setAttribute("aria-expanded", "false");
            loadMoreButton.textContent = "Load more";
        }
        projectsExpanded = false;
        return;
    }

    projectCards.forEach((card, index) => {
        const wasHidden = card.classList.contains("project-hidden");
        const shouldHide = !projectsExpanded && index >= MOBILE_VISIBLE_COUNT;

        if (shouldHide) {
            if (!wasHidden) {
                card.classList.add("project-hidden");
                card.classList.remove("project-reveal");
            }
        } else if (wasHidden) {
            card.classList.remove("project-hidden");
            card.classList.remove("project-reveal");
            void card.offsetWidth; // restart animation
            card.classList.add("project-reveal");
        }
    });

    if (loadMoreButton) {
        const shouldShowButton = hasExtraProjects;
        loadMoreButton.classList.toggle("hidden", !shouldShowButton);
        loadMoreButton.setAttribute("aria-hidden", shouldShowButton ? "false" : "true");
        loadMoreButton.setAttribute("aria-expanded", projectsExpanded ? "true" : "false");
        loadMoreButton.textContent = projectsExpanded ? "Show less" : "Load more";
    }
}

loadMoreButton?.addEventListener("click", () => {
    projectsExpanded = !projectsExpanded;
    updateProjectVisibility();
});

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => updateProjectVisibility(true), 150);
});

updateProjectVisibility(true);

// Set dynamic current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear();
