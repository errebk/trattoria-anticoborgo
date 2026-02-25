// Inizializza GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger, Draggable, ScrollToPlugin);

// Animazione di Caricamento
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
            // Forza l'aggiornamento dopo il caricamento per assicurare le corrette posizioni di "pin"
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

// Scroll Orizzontale per il Menu (Multi-Finestra)
function initMenuScroll() {
    const menuWindows = document.querySelectorAll(".menu-window");

    menuWindows.forEach((windowEl) => {
        const track = windowEl.querySelector(".menu-track");
        if (!track) return;

        ScrollTrigger.matchMedia({

            // DESKTOP: Scroll Indipendente col Movimento del Mouse per Finestra
            "(min-width: 769px)": function () {
                const maxScroll = track.scrollWidth - window.innerWidth;

                // Gestore Movimento Mouse specifico per questa finestra
                function onMouseMove(e) {
                    // Calcola la percentuale della posizione del mouse sulla larghezza (da 0 a 1)
                    const progress = e.clientX / window.innerWidth;

                    // Calcola la posizione di scroll di destinazione
                    const targetX = -progress * maxScroll;

                    // Anima in modo fluido SOLO questa traccia
                    gsap.to(track, {
                        x: targetX,
                        duration: 1.2,
                        ease: "power3.out",
                        overwrite: "auto"
                    });
                }

                // Aggiungi Listener in modo specifico a questa FINESTRA
                // Gli utenti devono passare sopra la riga specifica per scorrerla
                windowEl.addEventListener("mousemove", onMouseMove);

                return () => {
                    windowEl.removeEventListener("mousemove", onMouseMove);
                };
            },

            // MOBILE: Scroll orizzontale nativo per fluidità
            "(max-width: 768px)": function () {
                // Resetta le trasformazioni GSAP e passa allo scroll nativo CSS
                gsap.set(track, { x: 0, clearProps: "all" });

                const draggables = Draggable.get(track);
                if (draggables) draggables.kill();
            }
        });
    });
}

// Inizializza al caricamento e aggiorna al ridimensionamento
window.addEventListener("load", initMenuScroll);
// Il ridimensionamento è gestito in automatico da ScrollTrigger.matchMedia

// Effetti Parallasse
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



// Logica Scroll Toggle Menu
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
