document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadFooter();
    setActiveNavItem();
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
