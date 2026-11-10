// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu after clicking a link (mobile)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ---------- Scroll reveal animation ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- Contact form validation ----------
const form = document.getElementById("contact-form");
const success = document.getElementById("form-success");

function setError(id, text) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "-error");
  error.textContent = text;
  input.parentElement.classList.toggle("invalid", text !== "");
  return text === "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  success.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const okName = setError("name", name.length < 2 ? "Please enter your name." : "");
  const okEmail = setError("email", !emailPattern.test(email) ? "Enter a valid email." : "");
  const okMsg = setError("message", message.length < 10 ? "Message must be at least 10 characters." : "");

  if (okName && okEmail && okMsg) {
    success.textContent = "Thanks! Your message has been sent (demo).";
    form.reset();
  }
});