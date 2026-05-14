---
name: Official Military Knowledge Architecture
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#45483e'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#76786d'
  outline-variant: '#c6c8bb'
  surface-tint: '#55633d'
  primary: '#273312'
  on-primary: '#ffffff'
  primary-container: '#3d4a26'
  on-primary-container: '#aab98c'
  inverse-primary: '#bdcd9d'
  secondary: '#695e39'
  on-secondary: '#ffffff'
  secondary-container: '#f3e1b3'
  on-secondary-container: '#70633f'
  tertiary: '#312f28'
  on-tertiary: '#ffffff'
  tertiary-container: '#48453e'
  on-tertiary-container: '#b8b2a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e9b8'
  primary-fixed-dim: '#bdcd9d'
  on-primary-fixed: '#141f02'
  on-primary-fixed-variant: '#3e4b27'
  secondary-fixed: '#f3e1b3'
  secondary-fixed-dim: '#d6c599'
  on-secondary-fixed: '#231b01'
  on-secondary-fixed-variant: '#514624'
  tertiary-fixed: '#e8e2d8'
  tertiary-fixed-dim: '#cbc6bc'
  on-tertiary-fixed: '#1d1b16'
  on-tertiary-fixed-variant: '#49463f'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered to project authority, discipline, and modern governance. It serves as an official repository of military knowledge, requiring a UI that feels both institutional and high-performance. The aesthetic is rooted in **Corporate Minimalism**, favoring structure and clarity over decorative elements.

The visual language communicates "Quiet Strength." It avoids stereotypical military tropes (camouflage, stencils) in favor of a premium, state-level digital experience. The interface should feel balanced and grounded, evoking a sense of national pride and intellectual rigor. Every element must serve a functional purpose, reflecting the disciplined nature of the military institution.

## Colors

The palette is derived from natural, desert-adjacent environments and traditional military dress, refined for high-end digital use.

- **Primary (Deep Olive):** Used for primary actions, navigation headers, and structural emphasis. It represents duty and permanence.
- **Secondary (Muted Khaki):** Used for subtle accents, category tagging, and border treatments to provide warmth without sacrificing professionalism.
- **Tertiary (Warm Gray):** Reserved for meta-data, secondary icons, and disabled states.
- **Neutral (Light Sand):** The primary background color. It reduces eye strain and provides a premium, "stationery" feel compared to pure white.
- **Text (Charcoal):** High-contrast for maximum legibility, specifically tuned for complex Arabic script rendering.

## Typography

This design system utilizes **IBM Plex Sans Arabic** for its systematic, professional, and neutral character. It bridges the gap between traditional calligraphy and modern engineering.

- **Hierarchy:** Use bold weights for headlines to create a sense of command.
- **Legibility:** Maintain generous line heights for body text to ensure the complex details of Arabic characters are preserved.
- **Directionality:** All type tokens must support Right-to-Left (RTL) alignment by default, with numerical data handled with high precision.
- **Spacing:** Letter spacing for Arabic should remain at 0; use tracking only for Latin sub-text or labels.

## Layout & Spacing

The layout is based on a **Fixed Grid** model for desktop to maintain an "official document" feel, transitioning to a fluid model for smaller devices. 

- **Grid:** A 12-column system is used for desktop (1280px max width).
- **Rhythm:** An 8px baseline grid governs all vertical spacing, ensuring mathematical consistency.
- **Margins:** Generous outer margins (48px+) on desktop emphasize the premium nature of the content and prevent a cluttered appearance.
- **Breakpoints:**
  - Mobile: < 600px (4 columns)
  - Tablet: 600px - 1024px (8 columns)
  - Desktop: > 1024px (12 columns)

## Elevation & Depth

To maintain a disciplined and professional look, the design system avoids heavy, "floating" shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Tiers:** Depth is achieved by shifting background colors. The base is Light Sand (#FBF9F5). Primary cards use a pure White background with a 1px border in Muted Khaki (#B5A67C) at 30% opacity.
- **Shadows:** When necessary for interactive elements (like a raised button or active menu), use a "Hard Micro-Shadow": 2px Y-offset, 4px Blur, with a 10% opacity of the Primary Deep Olive color. This keeps the shadow grounded and intentional.
- **Backdrop:** Modal overlays should use a 40% opacity of the Primary Deep Olive to maintain brand presence even in the background.

## Shapes

The shape language is **Soft (Level 1)**. This choice reflects a balance between the "sharp" precision of military hardware and the modern, accessible nature of a knowledge portal.

- **Standard Radius:** 4px (0.25rem) for buttons, input fields, and small components.
- **Large Radius:** 8px (0.5rem) for cards and containers.
- **Consistency:** Avoid pill-shaped buttons or fully circular elements (unless they are profile avatars), as they appear too casual for an official portal. Sharp 90-degree corners should be reserved only for the outermost screen edges or structural dividers.

## Components

- **Buttons:** Primary buttons are solid Deep Olive with white text. Use "Soft" (4px) corners. Secondary buttons use a 1px Muted Khaki border with a transparent background.
- **Cards:** Cards feature a white background, an 8px corner radius, and a subtle Khaki border. Content should be padded with a minimum of 24px (3 units) to maintain the premium feel.
- **Input Fields:** Use a subtle Sand-tinted fill with a bottom-only 2px border in Khaki for a modern, "form" feel. The label should be in the Label-MD typography style, positioned above the field.
- **Chips/Tags:** Used for categorization. These should be rectangular with a 2px radius and use light tints of the Secondary color.
- **Lists:** Structured with clear dividers (1px Warm Gray at 20% opacity). Use icons in the Primary Deep Olive for bullet points to denote authority.
- **Status Indicators:** Use a refined palette for states—Muted Sage for success, Burnt Sienna for alerts, and Navy for information—ensuring they fit the earthy military theme.