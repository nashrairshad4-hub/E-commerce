# Lumora — Modern E-Commerce UI

A fully responsive, animated e-commerce front-end built with **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step. Features an "Aurora Glass" design language: animated gradient backgrounds, floating blobs, drifting particles, and glassmorphism surfaces throughout.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

- **Fully responsive** — desktop, tablet, and mobile breakpoints
- **Animated aurora background** with drifting gradient blobs and a canvas particle field
- **Glassmorphism UI** — frosted, translucent cards, navbar, and panels
- **Dark / light mode toggle**
- **Smooth scroll-reveal animations** via IntersectionObserver
- **Button ripple effects** on every interactive control
- **Sticky navigation** with search bar, category chips, wishlist, and cart badge
- **Product cards** with discount/new badges, star ratings, quick view, and add-to-cart micro-interactions
- **Shopping cart** with quantity selectors, coupon codes (try `LUMORA10`), and a live price summary (subtotal, tax, shipping, grand total)
- **Custom scrollbar**, back-to-top button, toast notifications, and a branded preloader
- **SEO-friendly markup** — semantic HTML5, meta descriptions, alt text, and Open Graph tags
- **Font Awesome 6** icons and **Google Fonts (Poppins)** typography

## 📁 Folder Structure

```
E-Commerce-UI/
│── index.html          # Home page (hero, featured, new arrivals, best sellers, reviews, newsletter)
│── products.html        # Shop page with filters, sorting, and pagination
│── cart.html             # Shopping cart with coupon + order summary
│── css/
│     style.css          # Core styles, design tokens, components, animations
│     responsive.css      # Breakpoints for tablet & mobile
│── js/
│     script.js          # Particles, preloader, theme toggle, cart logic, reveal, ripple, toasts
│── images/               # Local image assets (optional — currently uses Unsplash CDN)
│── assets/               # Extra assets (icons, favicons, etc.)
│── README.md
```

## 🚀 Getting Started

No build tools required.

1. Download or clone this repository.
2. Open `index.html` directly in your browser, **or** serve it locally:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```
3. Visit `http://localhost:8080` (if using a local server).

## 🎨 Customization

- **Colors** — edit the CSS custom properties at the top of `css/style.css` (`:root` block) to change the palette instantly.
- **Fonts** — swap the Google Fonts `@import` URL in `style.css` for any other typeface.
- **Products** — duplicate a `.product-card` block in `index.html` / `products.html` and update the image, name, category, rating, and price.
- **Coupon code** — the demo coupon is `LUMORA10` (10% off), defined in `js/script.js`.

## 🧩 Tech Stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Markup     | Semantic HTML5                   |
| Styling    | CSS3 (custom properties, Grid, Flexbox) |
| Behavior   | Vanilla JavaScript (ES6+)        |
| Icons      | Font Awesome 6                   |
| Typography | Google Fonts — Poppins           |
