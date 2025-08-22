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
    
    // Initialize reading controls panel
    initReadingControlsPanel();
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

// NOVA FUNÇÃO: Painel de controles de leitura unificado
function initReadingControlsPanel() {
    const article = document.querySelector('.single-article');
    if (!article) return;
    
    // Criar container principal dos controles
    const controlsPanel = document.createElement('div');
    controlsPanel.className = 'reading-controls-panel';
    controlsPanel.id = 'reading-controls-panel';
    
    // Recuperar posição salva ou usar posição padrão
    const savedPosition = JSON.parse(localStorage.getItem('controls-position')) || { x: window.innerWidth - 80, y: 80 };
    
    controlsPanel.style.cssText = `
        position: fixed;
        top: ${savedPosition.y}px;
        left: ${savedPosition.x}px;
        z-index: 1000;
        background: var(--reading-bg, #fff);
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--reading-border, #e0e0e0);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 60px;
        transition: all 0.3s ease;
        cursor: grab;
        user-select: none;
    `;
    
    // Adicionar título do painel (handle para arrastar)
    const panelHeader = document.createElement('div');
    panelHeader.className = 'panel-header';
    panelHeader.innerHTML = '⚙️';
    panelHeader.style.cssText = `
        text-align: center;
        font-size: 1.2rem;
        cursor: grab;
        padding: 5px;
        border-radius: 8px;
        background: var(--gradient-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
        color: white;
        margin-bottom: 5px;
    `;
    
    controlsPanel.appendChild(panelHeader);
    
    // CONTROLES DE FONTE
    const fontSection = document.createElement('div');
    fontSection.className = 'font-section';
    fontSection.innerHTML = '<div style="text-align: center; font-size: 0.8rem; color: var(--text-secondary, #666); margin-bottom: 8px;">Texto</div>';
    
    const fontControls = document.createElement('div');
    fontControls.className = 'font-controls';
    fontControls.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;
    
    const fontSizes = [
        { label: 'A⁻', size: '0.9', title: 'Diminuir texto' },
        { label: 'A', size: '1.05', title: 'Texto padrão' },
        { label: 'A⁺', size: '1.2', title: 'Aumentar texto' }
    ];
    
    fontSizes.forEach(({ label, size, title }, index) => {
        const button = document.createElement('button');
        button.textContent = label;
        button.title = title;
        button.className = `font-size-btn font-size-${index}`;
        button.style.cssText = `
            background: var(--gradient-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            color: white;
            border: none;
            border-radius: 8px;
            width: 100%;
            height: 32px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        button.addEventListener('click', () => {
            changeFontSize(size);
            updateActiveFontButton(index);
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });
        
        fontControls.appendChild(button);
    });
    
    fontSection.appendChild(fontControls);
    controlsPanel.appendChild(fontSection);
    
    // SEPARADOR
    const separator = document.createElement('div');
    separator.style.cssText = `
        height: 1px;
        background: var(--reading-border, #e0e0e0);
        margin: 5px 0;
    `;
    controlsPanel.appendChild(separator);
    
    // MODO FOCO
    const focusSection = document.createElement('div');
    focusSection.innerHTML = '<div style="text-align: center; font-size: 0.8rem; color: var(--text-secondary, #666); margin-bottom: 8px;">Modo</div>';
    
    const focusToggle = document.createElement('button');
    focusToggle.className = 'focus-toggle';
    focusToggle.innerHTML = '🎯';
    focusToggle.title = 'Modo foco (F)';
    focusToggle.style.cssText = `
        background: var(--gradient-secondary, linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%));
        border: none;
        border-radius: 8px;
        width: 100%;
        height: 40px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    let focusMode = false;
    
    focusToggle.addEventListener('click', () => {
        focusMode = !focusMode;
        toggleFocusMode(focusMode);
        focusToggle.innerHTML = focusMode ? '👁️' : '🎯';
        focusToggle.style.background = focusMode ? 
            'var(--accent-color, #ff6b6b)' : 
            'var(--gradient-secondary, linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%))';
    });
    
    focusToggle.addEventListener('mouseenter', () => {
        focusToggle.style.transform = 'scale(1.05)';
        focusToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    
    focusToggle.addEventListener('mouseleave', () => {
        focusToggle.style.transform = 'scale(1)';
        focusToggle.style.boxShadow = 'none';
    });
    
    focusSection.appendChild(focusToggle);
    controlsPanel.appendChild(focusSection);
    
    // Adicionar painel ao body
    document.body.appendChild(controlsPanel);
    
    // Inicializar funcionalidade de arrastar
    initDraggableControls(controlsPanel, panelHeader);
    
    // Carregar configurações salvas
    const savedFontSize = localStorage.getItem('article-font-size') || '1.05';
    changeFontSize(savedFontSize);
    
    // Marcar botão ativo inicial
    const defaultButtonIndex = fontSizes.findIndex(f => f.size === savedFontSize);
    updateActiveFontButton(defaultButtonIndex >= 0 ? defaultButtonIndex : 1);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!document.querySelector('.single-article')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 'f':
                if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    focusToggle.click();
                }
                break;
            case 't':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    document.querySelector('.theme-toggle')?.click();
                }
                break;
            case 'arrowup':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                break;
            case 'arrowdown':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
                break;
            case ' ':
                e.preventDefault();
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                break;
        }
    });
}

function updateActiveFontButton(activeIndex) {
    const buttons = document.querySelectorAll('.font-size-btn');
    buttons.forEach((btn, index) => {
        if (index === activeIndex) {
            btn.style.background = 'var(--secondary-color, #4ecdc4)';
            btn.style.boxShadow = '0 0 0 2px var(--accent-color, #ff6b6b)';
        } else {
            btn.style.background = 'var(--gradient-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%))';
            btn.style.boxShadow = 'none';
        }
    });
}

function initDraggableControls(panel, handle) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // Recuperar offset salvo
    const savedPosition = JSON.parse(localStorage.getItem('controls-position'));
    if (savedPosition) {
        xOffset = savedPosition.x;
        yOffset = savedPosition.y;
    }
    
    handle.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    // Touch events para mobile
    handle.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        
        if (e.target === handle) {
            isDragging = true;
            panel.style.cursor = 'grabbing';
            handle.style.cursor = 'grabbing';
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            
            xOffset = currentX;
            yOffset = currentY;
            
            // Limitar movimento dentro da viewport
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            
            xOffset = Math.max(0, Math.min(maxX, xOffset));
            yOffset = Math.max(0, Math.min(maxY, yOffset));
            
            panel.style.left = xOffset + 'px';
            panel.style.top = yOffset + 'px';
        }
    }
    
    function dragEnd(e) {
        if (isDragging) {
            isDragging = false;
            panel.style.cursor = 'grab';
            handle.style.cursor = 'grab';
            
            // Salvar posição
            localStorage.setItem('controls-position', JSON.stringify({
                x: xOffset,
                y: yOffset
            }));
        }
    }
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

function toggleFocusMode(enabled) {
    const elementsToHide = [
        'nav',
        'footer', 
        '.theme-toggle',
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
    const readingTime = document.querySelector('.reading-time');
    
    if (article) {
        if (enabled) {
            article.style.maxWidth = '650px';
            article.style.margin = '2rem auto';
            article.style.transition = 'all 0.3s ease';
            
            // CORREÇÃO: Manter tempo de leitura visível e bem posicionado no modo foco
            if (readingTime) {
                readingTime.style.position = 'relative';
                readingTime.style.zIndex = '999';
                readingTime.style.display = 'inline-block';
                readingTime.style.background = 'var(--reading-bg, rgba(255, 255, 255, 0.9))';
                readingTime.style.padding = '4px 8px';
                readingTime.style.borderRadius = '12px';
                readingTime.style.border = '1px solid var(--reading-border, #e0e0e0)';
                readingTime.style.backdropFilter = 'blur(5px)';
            }
        } else {
            article.style.maxWidth = '';
            article.style.margin = '';
            
            // Restaurar estilo normal do tempo de leitura
            if (readingTime) {
                readingTime.style.position = '';
                readingTime.style.zIndex = '';
                readingTime.style.background = '';
                readingTime.style.padding = '';
                readingTime.style.borderRadius = '';
                readingTime.style.border = '';
                readingTime.style.backdropFilter = '';
            }
        }
    }
}

// Initialize all reading optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        initPrintOptimization();
    }, 500);
});

// Print optimization
function initPrintOptimization() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .theme-toggle,
            .reading-controls-panel,
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
