// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });
});

// Hover effects for cursor
document.querySelectorAll('a, .menu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 0.5 });
        gsap.to(follower, { scale: 1.5, borderColor: '#d4af37' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1 });
        gsap.to(follower, { scale: 1, borderColor: '#e0e0e0' });
    });
});

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
        ease: 'power2.inOut'
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

// Register Draggable
gsap.registerPlugin(Draggable);

// Initialize Scrollbar logic
// Initialize Scrollbar logic
function initMenuScroll() {
    // Calculate limits
    // We use max-content in CSS to ensure scrollWidth is correct
    const maxScroll = menuTrack.scrollWidth - window.innerWidth;
    const trackWidth = scrollTrack.offsetWidth;
    const thumbWidth = scrollThumb.offsetWidth;
    const maxThumbMove = trackWidth - thumbWidth;

    // Create Draggable for the thumb
    Draggable.create(scrollThumb, {
        type: "x",
        bounds: scrollTrack, // Use the track element as bounds
        inertia: false,
        cursor: "grab",
        activeCursor: "grabbing",
        onDrag: function () {
            // "this" refers to the Draggable instance
            const progress = this.x / maxThumbMove;

            // Move the menu track based on progress
            gsap.set(menuTrack, {
                x: -progress * maxScroll
            });
        }
    });
}

// Initialize on load and refresh on resize
window.addEventListener("load", initMenuScroll);
window.addEventListener("resize", () => {
    // Optional: Reset or recalculate on resize
    initMenuScroll();
});

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
