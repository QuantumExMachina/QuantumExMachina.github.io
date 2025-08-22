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

// Dark Mode Toggle
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.setAttribute('title', 'Toggle dark/light mode');
    
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    // System theme preference detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (!localStorage.getItem('theme')) {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateThemeIcon(systemTheme);
    }
    
    // Listen for system theme changes
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

// Reading Progress Indicator
function initReadingProgress() {
    // Only add progress bar on article pages
    if (document.querySelector('.single-article')) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        
        // Update progress on scroll
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
    
    // Calculate reading progress
    const articleStart = articleTop - windowHeight / 3;
    const articleEnd = articleTop + articleHeight - windowHeight / 3;
    const progress = Math.max(0, Math.min(100, 
        ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100
    ));
    
    progressBar.style.width = progress + '%';
}

// Reading Optimizations
function initReadingOptimizations() {
    // Auto-save scroll position for articles
    if (document.querySelector('.single-article')) {
        const articleUrl = window.location.pathname;
        
        // Restore scroll position
        const savedPosition = sessionStorage.getItem(`scroll-${articleUrl}`);
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
            }, 100);
        }
        
        // Save scroll position
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                sessionStorage.setItem(`scroll-${articleUrl}`, window.pageYOffset);
            }, 100);
        });
    }
    
    // Smooth anchor scrolling
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
    
    // Improve text selection on mobile
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    }
    
    // Reading time estimation
    addReadingTime();
    
    // Font size adjustment (optional enhancement)
    initFontSizeControls();
}

function addReadingTime() {
    const article = document.querySelector('.single-article');
    if (!article) return;
    
    const text = article.textContent || '';
    const wordsPerMinute = 250; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    // Add reading time to article meta
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

// Font size controls for better accessibility
function initFontSizeControls() {
    const article = document.querySelector('.single-article');
    if (!article) return;
    
    // Create font size controls
    const fontControls = document.createElement('div');
    fontControls.className = 'font-controls';
    fontControls.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 999;
        display: flex;
        flex-direction: column;
        gap: 5px;
        background: var(--reading-bg);
        padding: 10px;
        border-radius: 10px;
        box-shadow: var(--shadow-medium);
        border: 1px solid var(--reading-border);
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    // Font size buttons
    const sizes = [
        { label: 'A⁻', size: '0.9', title: 'Diminuir texto' },
        { label: 'A', size: '1.05', title: 'Texto padrão' },
        { label: 'A⁺', size: '1.2', title: 'Aumentar texto' }
    ];
    
    sizes.forEach(({ label, size, title }) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.title = title;
        button.style.cssText = `
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 5px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('click', () => {
            changeFontSize(size);
            // Highlight active button
            fontControls.querySelectorAll('button').forEach(b => {
                b.style.background = 'var(--gradient-primary)';
            });
            button.style.background = 'var(--secondary-color)';
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        fontControls.appendChild(button);
    });
    
    // Show/hide on hover
    fontControls.addEventListener('mouseenter', () => {
        fontControls.style.opacity = '1';
    });
    
    fontControls.addEventListener('mouseleave', () => {
        fontControls.style.opacity = '0.7';
    });
    
    document.body.appendChild(fontControls);
    
    // Load saved font size
    const savedFontSize = localStorage.getItem('article-font-size') || '1.05';
    changeFontSize(savedFontSize);
    
    // Highlight default button
    const defaultButton = fontControls.children[1];
    defaultButton.style.background = 'var(--secondary-color)';
}

function changeFontSize(size) {
    const article = document.querySelector('.single-article');
    if (!article) return;
    
    // Apply font size to paragraphs and text elements
    const textElements = article.querySelectorAll('p, li, blockquote');
    textElements.forEach(element => {
        element.style.fontSize = `${size}rem`;
    });
    
    // Adjust line height proportionally
    const lineHeight = parseFloat(size) * 1.7;
    textElements.forEach(element => {
        element.style.lineHeight = lineHeight.toString();
    });
    
    // Save preference
    localStorage.setItem('article-font-size', size);
}

// Keyboard shortcuts for better navigation
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only on article pages
        if (!document.querySelector('.single-article')) return;
        
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                break;
            case 'ArrowDown':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
                break;
            case ' ':
                // Space bar for page down (like in many readers)
                e.preventDefault();
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                break;
            case 't':
                // 't' key to toggle theme
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    document.querySelector('.theme-toggle')?.click();
                }
                break;
        }
    });
}

// Focus mode for distraction-free reading
function initFocusMode() {
    const article = document.querySelector('.single-article');
    if (!article) return;
    
    // Create focus mode toggle
    const focusToggle = document.createElement('button');
    focusToggle.className = 'focus-toggle';
    focusToggle.innerHTML = '🎯';
    focusToggle.title = 'Modo foco (F)';
    focusToggle.style.cssText = `
        position: fixed;
        top: 130px;
        right: 20px;
        z-index: 999;
        background: var(--gradient-secondary);
        border: none;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-medium);
        transition: all 0.3s ease;
        color: white;
        font-size: 1.1rem;
    `;
    
    let focusMode = false;
    
    focusToggle.addEventListener('click', () => {
        focusMode = !focusMode;
        toggleFocusMode(focusMode);
        focusToggle.innerHTML = focusMode ? '👁️' : '🎯';
        focusToggle.style.background = focusMode ? 'var(--accent-color)' : 'var(--gradient-secondary)';
    });
    
    // Keyboard shortcut 'F' for focus mode
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                focusToggle.click();
            }
        }
    });
    
    document.body.appendChild(focusToggle);
}

function toggleFocusMode(enabled) {
    const elementsToHide = [
        'nav',
        'footer', 
        '.theme-toggle',
        '.font-controls',
        '.reading-progress'
    ];
    
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (enabled) {
                element.style.opacity = '0';
                element.style.pointerEvents = 'none';
                element.style.transition = 'opacity 0.3s ease';
            } else {
                element.style.opacity = '';
                element.style.pointerEvents = '';
            }
        });
    });
    
    // Adjust article container in focus mode
    const article = document.querySelector('.single-article');
    if (article) {
        if (enabled) {
            article.style.maxWidth = '650px';
            article.style.margin = '2rem auto';
            article.style.transition = 'all 0.3s ease';
        } else {
            article.style.maxWidth = '';
            article.style.margin = '';
        }
    }
}

// Initialize all reading optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        initKeyboardShortcuts();
        initFocusMode();
    }, 500);
});

// Print optimization
function initPrintOptimization() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .theme-toggle,
            .font-controls,
            .focus-toggle,
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
        }
    `;
    document.head.appendChild(style);
}

// Call print optimization
initPrintOptimization();
