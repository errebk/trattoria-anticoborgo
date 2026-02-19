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
        // DESKTOP: Draggable + Arrows (No Pinning)
        "(min-width: 769px)": function () {
            const maxScroll = menuTrack.scrollWidth - window.innerWidth;

            // 1. Enable Draggable for Desktop
            Draggable.create(menuTrack, {
                type: "x",
                bounds: { minX: -maxScroll, maxX: 0 },
                inertia: true,
                edgeResistance: 0.5,
                cursor: "grab",
                activeCursor: "grabbing"
            });

            // 2. Arrow Navigation (Moves track X instead of Window Scroll)
            const slideAmount = window.innerWidth * 0.4; // Scroll 40% of screen per click

            const prevBtn = document.querySelector(".prev-arrow");
            if (prevBtn) {
                // Remove previous event listeners if any (though matchMedia cleans up)
                prevBtn.onclick = (e) => {
                    e.preventDefault();
                    const currentX = gsap.getProperty(menuTrack, "x");
                    const newX = Math.min(currentX + slideAmount, 0); // Clamp at 0
                    gsap.to(menuTrack, {
                        x: newX,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                };
            }

            const nextBtn = document.querySelector(".next-arrow");
            if (nextBtn) {
                nextBtn.onclick = (e) => {
                    e.preventDefault();
                    const currentX = gsap.getProperty(menuTrack, "x");
                    const newX = Math.max(currentX - slideAmount, -maxScroll); // Clamp at maxScroll
                    gsap.to(menuTrack, {
                        x: newX,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                };
            }
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
