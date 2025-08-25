document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadFooter();
    setActiveNavItem();
    initThemeToggle();
    initReadingProgress();
    initReadingOptimizations();
});

function loadNavbar() {
    const navbarHTML = `
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="articles.html">Articles</a></li>
                <li><a href="index.html#resources">Resources</a></li>
            </ul>
        </nav>
    `;
    
    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
        placeholder.innerHTML = navbarHTML;
    }
}

function loadFooter() {
    const footerHTML = `
        <footer>
            <div class="container">
                <p>© 2025 AI Ethics Project. This site is hosted on GitHub Pages.</p>
                <p>Created with a commitment to thoughtful discussion about artificial intelligence.</p>
            </div>
        </footer>
    `;
    
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = footerHTML;
    }
}

function setActiveNavItem() {    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';    
    
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');        
        
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === 'index.html' && linkPage === 'index.html') ||
            (currentPage.startsWith('article-') && linkPage === 'articles.html')) {
            link.classList.add('active');
        }
    });
}

function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    
    document.body.appendChild(themeToggle);
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (!localStorage.getItem('theme')) {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateThemeIcon(systemTheme);
    }
    
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', systemTheme);
            updateThemeIcon(systemTheme);
        }
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
}

function initReadingProgress() {
    if (document.querySelector('.single-article')) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        window.addEventListener('scroll', updateReadingProgress);
    }
}

function updateReadingProgress() {
    const article = document.querySelector('.single-article');
    const progressBar = document.querySelector('.reading-progress-bar');
    
    if (!article || !progressBar) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const articleStart = articleTop - windowHeight / 3;
    const articleEnd = articleTop + articleHeight - windowHeight / 3;
    const progress = Math.max(0, Math.min(100, 
        ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100
    ));
    
    progressBar.style.width = progress + '%';
}

function initReadingOptimizations() {
    if (document.querySelector('.single-article')) {
        const articleUrl = window.location.pathname;
        
        const savedPosition = sessionStorage.getItem(`scroll-${articleUrl}`);
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
            }, 100);
        }
        
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                sessionStorage.setItem(`scroll-${articleUrl}`, window.pageYOffset);
            }, 100);
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
    
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    }
    
    addReadingTime();
}

function addReadingTime() {
    const article = document.querySelector('.single-article');
    if (!article) return;
    
    const text = article.textContent || '';
    const wordsPerMinute = 250;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    const articleMeta = document.querySelector('.article-meta');
    if (articleMeta) {
        const readingTimeElement = document.createElement('span');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `📖 ${readingTime} min read`;
        readingTimeElement.style.color = 'var(--reading-accent)';
        readingTimeElement.style.fontSize = '0.9rem';
        readingTimeElement.style.marginLeft = '1rem';
        
        articleMeta.appendChild(readingTimeElement);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initPrintOptimization();
    }, 500);
});

function initPrintOptimization() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .theme-toggle,
            .reading-progress,
            nav,
            footer,
            .article-navigation {
                display: none !important;
            }
            
            .single-article {
                box-shadow: none !important;
                border: none !important;
                max-width: none !important;
                padding: 0 !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
            
            h1, h2, h3, h4 {
                color: black !important;
                page-break-after: avoid;
            }
            
            p {
                text-align: justify;
                font-size: 12pt !important;
                line-height: 1.5 !important;
            }
            
            blockquote {
                background: #f5f5f5 !important;
                border-left: 3px solid #333 !important;
            }
            
            .reading-time {
                background: none !important;
                border: none !important;
                padding: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);
}
