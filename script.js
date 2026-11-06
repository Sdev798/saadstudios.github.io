/* =========================================================
   YOUR LINKS — paste your links between the quotes below.
   Every button on the site that uses that link updates by itself.
   ========================================================= */
const LINKS = {
  github:    "https://github.com/SDev798",
  passsaver: "",   // download link for Saad Studios PassSaver, e.g. https://github.com/SDev798/PassSaver/releases/latest
  fiverr:    "",   // e.g. https://www.fiverr.com/your-username
  instagram: "",   // e.g. https://www.instagram.com/your-username
  youtube:   "",   // e.g. https://www.youtube.com/@your-channel
  x:         "",   // e.g. https://x.com/your-username
  linkedin:  "",   // e.g. https://www.linkedin.com/in/your-name
  email:     "saadjabir683@gmail.com"
};

/* ========================================================= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Apply links ----------
$$("[data-link]").forEach(a => {
  const key = a.dataset.link;
  const value = LINKS[key];
  if (key === "email") { a.href = "mailto:" + value; return; }
  if (value) { a.href = value; return; }
  // Link not added yet: stay on the page instead of opening an empty tab
  a.removeAttribute("target");
  a.addEventListener("click", e => e.preventDefault());
});

// ---------- Intro screen ----------
const intro = $("#intro");
if (reduceMotion) {
  intro.remove();
  document.body.classList.remove("loading");
} else {
  setTimeout(() => document.body.classList.remove("loading"), 1500);
  setTimeout(() => intro.remove(), 2200);
}

// ---------- Scroll: nav, progress bar, back to top ----------
const nav = $("#nav");
const progress = $("#progress");
const toTop = $("#toTop");
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle("scrolled", y > 30);
  toTop.classList.toggle("show", y > 700);
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

// ---------- Mobile menu ----------
const burger = $("#burger");
const menu = $("#menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// ---------- Sliding line under the current menu link ----------
const menuLine = $("#menuLine");
const menuLinks = $$("a", menu);
function moveLine(link) {
  if (!link) { menuLine.style.opacity = 0; return; }
  menuLine.style.left = link.offsetLeft + "px";
  menuLine.style.width = link.offsetWidth + "px";
  menuLine.style.opacity = 1;
}
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const link = menuLinks.find(a => a.getAttribute("href") === "#" + entry.target.id);
    menuLinks.forEach(a => a.classList.toggle("active", a === link));
    moveLine(link);
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("section[id]").forEach(s => sectionObserver.observe(s));
menuLinks.forEach(a => a.addEventListener("mouseenter", () => moveLine(a)));
menu.addEventListener("mouseleave", () => moveLine($(".menu a.active")));

// ---------- Reveal on scroll (with stagger) ----------
$$(".services, .about-side").forEach(group =>
  $$(".reveal", group).forEach((el, i) => el.style.setProperty("--i", i)));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    revealObserver.unobserve(entry.target);
    // remove the stagger delay afterwards so hover effects react instantly
    setTimeout(() => entry.target.style.setProperty("--i", 0), 1800);
    $$("[data-count]", entry.target).forEach(countUp);
  });
}, { threshold: 0.18 });
$$(".reveal").forEach(el => revealObserver.observe(el));

function countUp(el) {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const dur = 1600;
  (function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

// ---------- PassSaver mockup: reveal passwords one by one ----------
const entries = $$(".mock-pass .entry");
let current = 0;
function typeInto(el, text, done) {
  let i = 0;
  const t = setInterval(() => {
    el.textContent = text.slice(0, ++i) + "•".repeat(Math.max(0, 10 - i));
    if (i >= text.length) { clearInterval(t); done && done(); }
  }, 70);
}
function cycleVault() {
  entries.forEach(e => e.classList.remove("focus"));
  $$(".pw").forEach(p => p.textContent = "••••••••••");
  const entry = entries[current];
  entry.classList.add("focus");
  const pw = $(".pw", entry);
  setTimeout(() => typeInto(pw, pw.dataset.pw), 500);
  current = (current + 1) % entries.length;
}
if (!reduceMotion && entries.length) { cycleVault(); setInterval(cycleVault, 3200); }

// ---------- Hero: changing encrypted text ----------
const hex = $("#heroHex");
const hexChars = "0123456789abcdef";
const randomHex = () => Array.from({ length: 3 }, () =>
  Array.from({ length: 4 }, () => hexChars[Math.floor(Math.random() * 16)]).join("")).join(" ");
if (!reduceMotion) setInterval(() => { hex.textContent = randomHex(); }, 900);

// ---------- Hero: cards follow the mouse ----------
const heroArt = $("#heroArt");
const cards = $$(".float-card", heroArt);
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  $(".hero").addEventListener("mousemove", e => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    cards.forEach(c => {
      const d = +c.dataset.depth;
      c.style.transform = `translate(${x * d}px, ${y * d}px) rotate(${x * d * 0.15}deg)`;
    });
  });
}

// ---------- Spotlight that follows the cursor on cards ----------
$$(".mock, .service").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

// ---------- Ripple when a button is clicked ----------
$$(".btn").forEach(btn => {
  btn.addEventListener("click", e => {
    if (reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// ---------- Contact form: opens an email to you, ready to send ----------
const form = $("#contactForm");
const note = $("#formNote");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#fName"), email = $("#fEmail"), msg = $("#fMsg"), type = $("#fType");
  let ok = true;
  [name, email, msg].forEach(f => f.parentElement.classList.remove("error"));
  if (!name.value.trim()) { name.parentElement.classList.add("error"); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email.value)) { email.parentElement.classList.add("error"); ok = false; }
  if (!msg.value.trim()) { msg.parentElement.classList.add("error"); ok = false; }
  if (!ok) { note.textContent = "Please fill in your name, a valid email and your message."; return; }

  const subject = `New project: ${type.value} (from ${name.value.trim()})`;
  const body = `${msg.value.trim()}\n\nName: ${name.value.trim()}\nEmail: ${email.value.trim()}`;
  location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Your email app is opening with the message ready. Press send there.";
});
