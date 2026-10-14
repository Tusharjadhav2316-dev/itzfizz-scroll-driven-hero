# ITZFIZZ DIGITAL — Scroll-Driven Automotive Hero Experience

A high-performance, interactive scroll-driven automotive experience built for **ITZFIZZ DIGITAL**. As the user scrolls, a supercar glides across a dynamic asphalt runway, drawing an emerald neon trail, revealing kinetic typography letter-by-letter, and activating staggered metric performance cards.

---

## 🌟 Key Features

- **Smooth Scroll-Driven Scrubbing**: Powered by **GSAP** and **ScrollTrigger** with responsive pinning and tuned scrub physics (`0.65s`) for a silky, fluid feel.
- **Dynamic Neon Trail Effect**: The emerald energy trail dynamically scales in real-time, synchronized with the vehicle's position without layout thrashing.
- **Letter-by-Letter Typography Reveal**: Kinetic headline ("WELCOME ITZ FIZZ") revealed letter-by-letter as the car's leading edge passes over each glyph.
- **Staggered Metric Stat Cards**: Four business impact cards animate smoothly into view at calibrated checkpoints along the scroll journey.
- **Interactive Vehicle Selector**: Toggle seamlessly between high-resolution **McLaren 720S** and sleek **Supercar Silhouette** vector graphics.
- **Fully Responsive Architecture**: Custom-tuned breakpoints ensuring clean presentation on mobile, tablet, and ultrawide screens.
- **Accessibility & Motion Safety**: Native support for `prefers-reduced-motion`, providing an accessible, instant-reveal presentation for users with vestibular sensitivities.
- **Modern Performance**: Built with Next.js 16 (Turbopack), React 19, TypeScript, and Tailwind CSS v4.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | React Framework with App Router and Turbopack compiler |
| **React 19** | Core UI library |
| **TypeScript 5** | Strict type safety and component contracts |
| **Tailwind CSS v4** | Modern styling system with CSS theme variables |
| **GSAP 3.15** | Industry-standard animation engine |
| **ScrollTrigger** | Scroll-driven timeline control and pinning |
| **@gsap/react** | React hooks (`useGSAP`) for safe lifecycle scoping |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or Node.js 20+
- npm 9+ (or pnpm / yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tusharjadhav2316-dev/itzfizz-scroll-driven-hero.git
   cd itzfizz-scroll-driven-hero
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Turbopack |
| `npm run build` | Compiles production build and validates TypeScript & static generation |
| `npm run start` | Runs the production build server locally |
| `npm run lint` | Runs ESLint 9 checks across all source files |

---

## 📁 Project Structure

```text
itzfizz-scroll-animation/
├── public/
│   ├── images/
│   │   ├── mclaren-720s.png       # High-resolution supercar asset
│   │   └── sports-car-side.svg    # Vector supercar silhouette
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind CSS v4 & custom animation utilities
│   │   ├── layout.tsx             # Root layout with font imports and metadata
│   │   └── page.tsx               # Main landing page
│   ├── components/
│   │   ├── Car.tsx                # Vehicle component with variant toggle
│   │   ├── Hero.tsx               # Master scroll-driven animation controller
│   │   └── StatCard.tsx           # Impact metric cards
│   ├── lib/
│   │   └── gsap.ts                # Client-safe GSAP & ScrollTrigger registration
│   └── types/
│       └── index.ts               # TypeScript interfaces & types
├── eslint.config.mjs              # ESLint configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript compiler settings
└── README.md                      # Project documentation
```

---

## 🌐 Live Demo & Deployment

- **Live Demo**: `https://your-deployment-url.vercel.app` *(Placeholder — to be updated upon Vercel deployment)*
- **Target Repository**: [https://github.com/Tusharjadhav2316-dev/itzfizz-scroll-driven-hero](https://github.com/Tusharjadhav2316-dev/itzfizz-scroll-driven-hero)

### Vercel Deployment Notes

This project is fully configured for zero-configuration deployment on [Vercel](https://vercel.com):
1. Connect your GitHub repository to Vercel.
2. The framework preset is automatically detected as **Next.js**.
3. Build command: `next build` (or `npm run build`).
4. Output directory: default (`.next`).
5. No required environment variables for the core hero experience.
