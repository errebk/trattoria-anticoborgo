// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger, Draggable, ScrollToPlugin);

// Loading Animation
const tlLoader = gsap.timeline();

tlLoader.to('.loader-text span', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
})
    .to('.loader-progress', {
        width: '100%',
        duration: 1.5,
        ease: 'expo.inOut'
    })
    .to('.loader', {
        y: '-100%',
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            // Force refresh after loader finishes to ensure correct pinning positions
            ScrollTrigger.refresh();
        }
    })
    .from('.hero-title span', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    }, "-=0.5");

// Horizontal Scroll for Menu (Multi-Window)
function initMenuScroll() {
    const menuWindows = document.querySelectorAll(".menu-window");

    menuWindows.forEach((windowEl) => {
        const track = windowEl.querySelector(".menu-track");
        if (!track) return;

        ScrollTrigger.matchMedia({

            // DESKTOP: Independent Mouse Move Scroll per Window
            "(min-width: 769px)": function () {
                const maxScroll = track.scrollWidth - window.innerWidth;

                // Mouse Move Handler specific to this window
                function onMouseMove(e) {
                    // Calculate percentage of mouse position across width (0 to 1)
                    const progress = e.clientX / window.innerWidth;

                    // Calculate target scroll position
                    const targetX = -progress * maxScroll;

                    // Smoothly animate ONLY this track
                    gsap.to(track, {
                        x: targetX,
                        duration: 1.2,
                        ease: "power3.out",
                        overwrite: "auto"
                    });
                }

                // Add Listener to this WINDOW specifically
                // Users must hover OVER the specific row to scroll it
                windowEl.addEventListener("mousemove", onMouseMove);

                return () => {
                    windowEl.removeEventListener("mousemove", onMouseMove);
                };
            },

            // MOBILE: Independent Draggable per Window
            "(max-width: 768px)": function () {
                // Reset any GSAP transforms
                gsap.set(track, { x: 0, clearProps: "all" });

                const maxScroll = track.scrollWidth - window.innerWidth;
                if (maxScroll <= 0) return;

                Draggable.create(track, {
                    type: "x",
                    bounds: { minX: -maxScroll, maxX: 0 },
                    inertia: true,
                    edgeResistance: 0.65,
                    cursor: "grab",
                    activeCursor: "grabbing"
                });
            }
        });
    });
}

// Initialize on load and refresh on resize
window.addEventListener("load", initMenuScroll);
// Resize handled automatically by ScrollTrigger.matchMedia

// Parallax Effects
gsap.to(".hero-image-wrapper", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});



// Menu Toggle Scroll Logic
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        gsap.to(window, {
            scrollTo: {
                y: "#menu-section",
                offsetY: 80,
                autoKill: true
            },
            duration: 1.5,
            ease: "power2.inOut"
        });
    });
}
