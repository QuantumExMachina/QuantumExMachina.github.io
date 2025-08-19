# AI Ethics Project

A web project dedicated to ethical discussions about artificial intelligence, exploring the moral and philosophical implications of AI development.

## Project Structure

```
ai-ethics/
├── index.html              # Main page
├── about.html              # About the project
├── articles.html           # Articles listing
├── article-dual-nature.html     # Article: The Dual Nature of AI
├── article-consciousness.html   # Article: The Consciousness Conundrum
├── article-governance.html      # Article: AI Governance
├── styles/
│   └── style.css           # Main CSS styles
├── js/
│   └── components.js       # Reusable components
└── README.md              # This file
```

## Features

### Implemented
- **Responsive Layout**: Adaptive design for desktop and mobile
- **Reusable Components**: Navbar and footer loaded dynamically
- **Article Grid**: Responsive 3-column grid layout
- **Smart Navigation**: Automatically highlight active page
- **Modern Design**: Gradients, animations, and hover effects
- **Modular Structure**: Organized and reusable code

### Design Features
- **Color Palette**: Professional blues with colorful accents
- **Typography**: Montserrat + Roboto Slab for contrast
- **Animations**: Smooth transitions and hover effects
- **Interactive Cards**: Elevation and dynamic gradients
- **Grid Layout**: Flexible 3-column system

## How to Use

### 1. Clone/Download Project
```bash
git clone [repository-url]
```

### 2. File Structure
Make sure to maintain the following structure:
```
project/
├── index.html
├── about.html  
├── articles.html
├── article-*.html
├── styles/style.css
└── js/components.js
```

### 3. Local Server
For better functionality (especially JavaScript), use a local server:
```bash
# With Python 3
python -m http.server 8000

# With Node.js
npx serve .

# Or use Live Server in VS Code
```

## How to Add New Articles

### 1. Create HTML File
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Title | AI Ethics</title>
    <link rel="stylesheet" href="styles/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto+Slab:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="hero article-hero">
        <div class="hero-content">
            <h1>Article Title</h1>
            <h2>Subtitle</h2>
        </div>
    </header>

    <div id="navbar-placeholder"></div>

    <main>
        <section class="article-section">
            <div class="container">
                <article class="single-article">
                    <div class="article-meta">
                        <span class="article-category">Category</span>
                        <span class="article-date">2025</span>
                        <div class="article-tags">
                            <span class="tag">Tag1</span>
                            <span class="tag">Tag2</span>
                        </div>
                    </div>

                    <!-- Article content here -->
                    
                    <div class="article-navigation">
                        <a href="articles.html" class="nav-back">← Back to Articles</a>
                    </div>
                </article>
            </div>
        </section>
    </main>

    <div id="footer-placeholder"></div>
    <script src="js/components.js"></script>
</body>
</html>
```

### 2. Add to Articles List
In the `articles.html` file, add a new card:
```html
<article class="article-card">
    <div class="card-header">
        <div class="card-category">Category</div>
        <div class="card-date">2025</div>
    </div>
    <h3>Article Title</h3>
    <p class="card-excerpt">Article summary...</p>
    <div class="card-tags">
        <span class="tag">Tag1</span>
        <span class="tag">Tag2</span>
    </div>
    <a href="article-new.html" class="card-link">Read Article</a>
</article>
```

## Color Customization

Main colors are defined in CSS:
```css
:root {
    --primary-color: #3a506b;    /* Dark blue */
    --secondary-color: #5bc0be;  /* Blue-green */
    --accent-color: #f8f32b;     /* Yellow */
    --dark-color: #1c2541;       /* Very dark blue */
    --light-color: #f8f9fa;      /* Light gray */
}
```

## Responsiveness

The project is fully responsive with breakpoints at:
- **Desktop**: > 768px (3 columns)
- **Tablet**: 481-768px (2 columns)
- **Mobile**: ≤ 480px (1 column)

## Reusable Components

### Navbar
Automatically loaded via JavaScript with active page highlighting.

### Footer
Standard project content loaded dynamically.

### Article Cards
Automatic alternating gradient system (1st, 2nd, 3rd cards have different colors).

## Deployment

### GitHub Pages
1. Upload files to a GitHub repository
2. Go to Settings > Pages
3. Select main branch as source
4. Site will be available at `username.github.io/repository-name`

### Netlify
1. Drag project folder to netlify.com/drop
2. Or connect with GitHub repository for automatic deployment

## Contributing

To contribute to the project:
1. Fork the repository
2. Create a branch for your feature
3. Add new articles or improvements
4. Make a pull request

## License

This project is under MIT license. See the LICENSE file for more details.

---

**Created with a commitment to thoughtful discussion about artificial intelligence.**
