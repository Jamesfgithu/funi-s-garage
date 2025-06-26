# Funi's Garage Landing Page Demo

## How to Replace Visuals
- **Logo:** Replace `public/funis-garage/logo.png` with a professional black/gold logo (120x120px, transparent PNG).
- **Hero Background:** Replace `public/funis-garage/hero-bg.jpg` with a dark, automotive-themed background (1920x1080px JPG).
- **Before/After Images:** Replace `public/funis-garage/before.jpg` and `public/funis-garage/after.jpg` with realistic car photos (350x220px JPG).

## Visitor Tracking
- The first user interaction triggers `/api/notify-anthony`.
- This sends an email (SMS via Verizon gateway) using `nodemailer` and `jamesf1972@gmail.com`.
- Set the Gmail app password in your environment as `GMAIL_APP_PASSWORD`.

## Tailwind Customization
- Colors: gold (`#FFD700`), cobalt (`#0033CC`), cobalt-dark (`#002299`)
- Animations: fade-in, fade-in-up, logo-fade, card-fade

## Mobile Optimization
- Responsive layout, fast-loading, minimal external dependencies.

---

**Note:** This is a demo. For production, replace all placeholder images and secure environment variables.
