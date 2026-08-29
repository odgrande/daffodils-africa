# Daffodils Africa — Static Site

Neo-brutalism redesign. Pure HTML/CSS. Vercel-hosted.

## Deploy to Vercel (5 min)

1. Push this folder to a GitHub repo (even private)
2. Go to [vercel.com](https://vercel.com) → New Project → Import that repo
3. Framework Preset: **Other** (it auto-detects plain HTML)
4. Click Deploy — done

## Connect daffodilsafrica.com

In your Vercel project → Settings → Domains → Add `daffodilsafrica.com`

Then in your domain registrar (Namecheap/GoDaddy etc):
- Delete the old A records / CNAME
- Add: `A @ 76.76.21.21` (Vercel IP)
- Add: `CNAME www daffodilsafrica.com`

DNS propagates in 1–48h. Vercel handles SSL automatically.

## Keep WordPress for Blog

Point WordPress to a subdomain: `blog.daffodilsafrica.com`
The main site stays on Vercel, blog stays on your existing WP host.

## Contact Form (free)

Use [Formspree](https://formspree.io):
1. Create free account → get your form endpoint
2. Replace `YOUR_FORMSPREE_ID` in the contact form HTML

## File Structure

```
/
├── index.html        — Homepage (all CSS inline)
├── vercel.json       — Vercel routing + security headers
├── README.md         — This file
└── assets/           — Add images/fonts here if needed
    └── images/
```

## Next Pages to Build

- `/about/`          — About Us
- `/programs/`       — What We Do
- `/academy/`        — Daffodils Africa Academy
- `/impact/`         — Impact & Portfolio
- `/partnerships/`   — Partner With Us
- `/blog/`           — Blog / Insights (or redirect to WP)
- `/contact/`        — Contact + Form
- `/gallery/`        — Gallery

## Brand Tokens (from index.html)

```css
--clr-black:  #0D0D0D
--clr-yellow: #F5C518   /* Daffodil Yellow — primary accent */
--clr-green:  #1B5E20   /* Deep Green — secondary accent */
--clr-white:  #FEFAF0   /* Warm off-white */
--clr-paper:  #F0EDE6   /* Section backgrounds */
--border:     3px solid #0D0D0D
--shadow-sm:  4px 4px 0 #0D0D0D
```

Fonts: Syne (display/headings) + DM Sans (body) — both via Google Fonts
