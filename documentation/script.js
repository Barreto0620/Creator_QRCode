// Tema (dark/light) com persistência
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    themeIcon.textContent = '🌞';
  } else {
    body.classList.remove('dark');
    themeIcon.textContent = '🌙';
  }
}

(function initTheme() {
  const saved = localStorage.getItem('cqrc_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeToggle.addEventListener('click', () => {
  const next = body.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('cqrc_theme', next);
  applyTheme(next);
});

// Menu mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobileOverlay');

function toggleSidebar(forceOpen = null) {
  const open = forceOpen !== null ? forceOpen : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('active', open);
  document.getElementById('main').classList.toggle('full-width', !open);
}

mobileMenuBtn.addEventListener('click', () => toggleSidebar());
overlay.addEventListener('click', () => toggleSidebar(false));

// Scroll spy para destacar a seção ativa no menu
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

function onScrollSpy() {
  const fromTop = window.scrollY + 140; // compensar header
  let current = sections[0];

  for (const sec of sections) {
    if (sec.offsetTop <= fromTop) current = sec;
  }
  navLinks.forEach(link => link.classList.remove('active'));
  const active = document.querySelector(`.nav-link[href="#${current.id}"]`);
  if (active) active.classList.add('active');
}

document.addEventListener('scroll', onScrollSpy, { passive: true });
window.addEventListener('load', onScrollSpy);

// Melhorar navegação (fecha menu ao clicar em item no mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) toggleSidebar(false);
  });
});

// 🚀 Scripts Adicionados

// Barra de Progresso de Leitura
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / docHeight) * 100;
    progressBar.style.width = progress + '%';
});

// Botão de Voltar ao Topo
const backToTopBtn = document.getElementById('backToTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});