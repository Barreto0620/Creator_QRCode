// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('cqrc_theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        const html = document.documentElement;
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.querySelector('.theme-text');

        html.setAttribute('data-theme', this.theme);

        if (this.theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            if (themeText) themeText.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            if (themeText) themeText.textContent = 'Dark';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('cqrc_theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('mobileOverlay');
        this.main = document.getElementById('main');
        this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
        this.sections = this.navLinks.map(link => 
            document.querySelector(link.getAttribute('href'))
        ).filter(Boolean);
        
        this.bindEvents();
        this.initScrollSpy();
    }

    bindEvents() {
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Overlay click
        this.overlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        this.overlay.classList.toggle('active');
        this.main.classList.toggle('full-width', !this.sidebar.classList.contains('open'));
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
        this.main.classList.remove('full-width');
    }

    initScrollSpy() {
        const onScroll = () => {
            const fromTop = window.scrollY + 140;
            let current = this.sections[0];

            for (const section of this.sections) {
                if (section && section.offsetTop <= fromTop) {
                    current = section;
                }
            }

            this.navLinks.forEach(link => link.classList.remove('active'));
            
            if (current) {
                const activeLink = document.querySelector(`.nav-link[href="#${current.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        };

        document.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('load', onScroll);
    }
}

// Progress Bar
class ProgressBar {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = Math.min((scrolled / docHeight) * 100, 100);
            this.progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, { passive: true });

        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Header Scroll Effect
class HeaderScrollEffect {
    constructor() {
        this.header = document.getElementById('header');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, { passive: true });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new ProgressBar();
    new BackToTop();
    new HeaderScrollEffect();
});

// Add smooth scrolling enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});