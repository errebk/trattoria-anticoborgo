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
        "(min-width: 769px)": function () {
            // Horizontal Scroll Animation
            const maxScroll = menuTrack.scrollWidth - window.innerWidth;

            const scrollTween = gsap.to(menuTrack, {
                x: -maxScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: "#menu-section",
                    pin: true,
                    scrub: 1, // Momentum scroll
                    start: "top top",
                    end: () => "+=" + maxScroll, // Scroll distance equals content width
                    invalidateOnRefresh: true,
                    id: "menuScroll"
                }
            });

            // Arrow Navigation Logic
            const scrollAmount = window.innerHeight; // Scroll one viewport height per click

            const prevBtn = document.querySelector(".prev-arrow");
            if (prevBtn) {
                prevBtn.onclick = () => {
                    gsap.to(window, {
                        scrollTo: {
                            y: window.scrollY - scrollAmount,
                            autoKill: true
                        },
                        duration: 1,
                        ease: "power2.out"
                    });
                };
            }

            const nextBtn = document.querySelector(".next-arrow");
            if (nextBtn) {
                nextBtn.onclick = () => {
                    gsap.to(window, {
                        scrollTo: {
                            y: window.scrollY + scrollAmount,
                            autoKill: true
                        },
                        duration: 1,
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

gsap.to(".floating-img", {
    y: -100,
    rotation: 0,
    scrollTrigger: {
        trigger: ".manifesto",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    }
});
