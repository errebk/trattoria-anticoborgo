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

// Horizontal Scroll for Menu (Draggable Scrollbar ONLY)
const menuSection = document.querySelector("#menu-section");
const menuTrack = document.querySelector(".menu-track");
const scrollThumb = document.querySelector(".menu-scrollbar-thumb");
const scrollTrack = document.querySelector(".menu-scrollbar-track");

// Initialize Scrollbar logic
function initMenuScroll() {
    ScrollTrigger.matchMedia({

        // DESKTOP: ScrollTrigger Pinning + Arrows
        // DESKTOP: Mouse Move Scroll (Automatic)
        "(min-width: 769px)": function () {
            const maxScroll = menuTrack.scrollWidth - window.innerWidth;

            // Mouse Move Handler
            function onMouseMove(e) {
                // Calculate percentage of mouse position across width (0 to 1)
                const progress = e.clientX / window.innerWidth;

                // Calculate target scroll position
                // progress 0 (left) -> x: 0
                // progress 1 (right) -> x: -maxScroll
                const targetX = -progress * maxScroll;

                // Smoothly animate to target position
                gsap.to(menuTrack, {
                    x: targetX,
                    duration: 1.2, // Smooth "buttery" feel
                    ease: "power3.out",
                    overwrite: "auto"
                });
            }

            // Add Listener
            menuSection.addEventListener("mousemove", onMouseMove);

            // Cleanup function provided by ScrollTrigger.matchMedia
            return () => {
                menuSection.removeEventListener("mousemove", onMouseMove);
            };
        },

        // MOBILE: Draggable (Touch & Scrollbar)
        "(max-width: 768px)": function () {
            // Force reset from pinning
            gsap.set(menuTrack, { x: 0, clearProps: "all" });

            const maxScroll = menuTrack.scrollWidth - window.innerWidth;
            const trackWidth = scrollTrack.offsetWidth;
            const thumbWidth = scrollThumb.offsetWidth;
            const maxThumbMove = trackWidth - thumbWidth;

            if (maxScroll <= 0) return;

            // Setup Draggable for Thumb
            Draggable.create(scrollThumb, {
                type: "x",
                bounds: scrollTrack,
                inertia: false,
                cursor: "grab",
                activeCursor: "grabbing",
                onDrag: function () {
                    const progress = this.x / maxThumbMove;
                    gsap.set(menuTrack, { x: -progress * maxScroll });
                },
                onPress: () => gsap.killTweensOf(menuTrack)
            });

            // Setup Draggable for Content Track (Touch)
            Draggable.create(menuTrack, {
                type: "x",
                bounds: { minX: -maxScroll, maxX: 0 },
                inertia: true,
                edgeResistance: 0.65,
                cursor: "default",
                activeCursor: "grabbing",
                onDrag: syncThumb,
                onThrowUpdate: syncThumb,
                onPress: () => gsap.killTweensOf(scrollThumb)
            });

            function syncThumb() {
                let progress = this.x / -maxScroll;
                progress = Math.min(Math.max(progress, 0), 1);
                gsap.set(scrollThumb, { x: progress * maxThumbMove });
            }
        }
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
