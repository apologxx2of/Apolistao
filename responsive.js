document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav ul");
    const cards = document.querySelectorAll(".features .card");

    // =========================
    // Menu Mobile animado
    // =========================
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("show");
        hamburger.classList.toggle("active");

        const [line1, line2, line3] = hamburger.children;
        if (hamburger.classList.contains("active")) {
            line1.style.transform = "rotate(45deg) translate(5px, 5px)";
            line2.style.opacity = "0";
            line3.style.transform = "rotate(-45deg) translate(5px, -5px)";
        } else {
            line1.style.transform = "rotate(0) translate(0,0)";
            line2.style.opacity = "1";
            line3.style.transform = "rotate(0) translate(0,0)";
        }
    });

    // =========================
    // Cards animação ao scroll
    // =========================
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
});