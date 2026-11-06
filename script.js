// Typing effect
const words = ["Web Developer", "Web Designer", "Freelancer"];
const typing = document.getElementById("typing");
let w = 0, c = 0, deleting = false;

function type() {
  const word = words[w];
  typing.textContent = word.substring(0, c);
  if (!deleting && c < word.length) c++;
  else if (deleting && c > 0) c--;
  else {
    deleting = !deleting;
    if (!deleting) w = (w + 1) % words.length;
    return setTimeout(type, deleting ? 1400 : 300);
  }
  setTimeout(type, deleting ? 50 : 110);
}
type();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => navLinks.classList.remove("open")));

// Navbar background, progress bar, back-to-top button
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle("scrolled", y > 50);
  toTop.classList.toggle("visible", y > 500);
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

// Glow that follows the mouse
const glow = document.getElementById("glow");
window.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Count-up numbers
function countUp(el) {
  const target = +el.dataset.target;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const timer = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n;
    if (n === target) clearInterval(timer);
  }, 25);
}

// Reveal sections on scroll (and start counters / skill bars)
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    e.target.querySelectorAll(".count").forEach(countUp);
    e.target.querySelectorAll(".fill").forEach(f => f.style.width = f.dataset.width + "%");
    observer.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// 3D tilt on cards
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

// Portfolio filter
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project").forEach(p =>
      p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f));
  });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
