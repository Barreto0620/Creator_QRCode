mermaid.initialize({ 
    startOnLoad: true,
    theme: document.body.classList.contains('dark-mode') ? 'dark' : 'default'
});

const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('nav ul li a');

function setActiveLink() {
    let current = 'overview';
    const offset = 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - offset && window.scrollY < sectionTop + sectionHeight - offset) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function updateMermaidTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    mermaid.initialize({ 
        startOnLoad: true,
        theme: isDarkMode ? 'dark' : 'default'
    });
    
    // Rerender mermaid diagrams
    const mermaidElements = document.querySelectorAll('.mermaid');
    mermaidElements.forEach((element, index) => {
        const graphDefinition = element.textContent;
        element.innerHTML = '';
        element.setAttribute('data-processed', 'false');
        mermaid.render(`mermaid-${index}`, graphDefinition, (svgCode) => {
            element.innerHTML = svgCode;
        });
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Update button text and icon
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (isDarkMode) {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
    }
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update mermaid theme
    setTimeout(updateMermaidTheme, 100);
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', () => {
    setActiveLink();
    
    // Load saved theme preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-icon').textContent = '☀️';
        document.getElementById('theme-text').textContent = 'Light';
    }
    
    updateMermaidTheme();
});

// Update active link on scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            setActiveLink();
            ticking = false;
        });
        ticking = true;
    }
});