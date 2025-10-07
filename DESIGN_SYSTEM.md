# Design System & Style Guide

**create-v0-turbo** - A comprehensive design system documentation for maintaining consistent UI/UX across the application.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Patterns](#component-patterns)
6. [Page Structure Patterns](#page-structure-patterns)
7. [Style Inconsistencies & Recommendations](#style-inconsistencies--recommendations)
8. [Best Practices](#best-practices)

---

## Design Philosophy

The design system follows **shadcn/ui** principles with a focus on:

- **Consistency**: Unified spacing, typography, and component usage
- **Accessibility**: WCAG 2.1 AA compliant with semantic HTML
- **Flexibility**: Dark/light mode support with CSS variables
- **Modularity**: Reusable components that work across web and mobile
- **Performance**: Minimal CSS footprint with Tailwind CSS utility-first approach

---

## Color System

### Theme Variables

All colors use CSS custom properties defined in `/apps/nextjs/src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 327 66% 69%;        /* Pink accent */
  --primary-foreground: 337 65.5% 17.1%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --destructive: 0 72.22% 50.59%;
  --border: 240 5.9% 90%;
  --radius: 0.5rem;
}
```

### Brand Colors

- **Primary**: Pink (`hsl(327 66% 69%)`) - Used for CTAs, links, highlights
- **Secondary**: Gray (`hsl(240 4.8% 95.9%)`) - Used for secondary actions
- **Destructive**: Red (`hsl(0 72.22% 50.59%)`) - Used for warnings, errors

### Integration/Feature Colors

Consistent color coding for integrations and features:

```typescript
// From packages/features/integrations/src/constants.ts
{
  gmail: "red",           // text-red-600
  outlook: "blue",        // text-blue-600
  google_drive: "green",  // text-green-600
  dropbox: "blue",        // text-blue-600
  slack: "purple",        // text-purple-600
  github: "gray"          // text-gray-900 dark:text-white
}

// From packages/features/payments/src/constants.ts
{
  stripe: "blue",         // text-blue-600
  polar: "purple"         // text-purple-600
}
```

---

## Typography

### Font Families

- **Sans**: Geist Sans (variable font) - Default UI font
- **Mono**: Geist Mono (variable font) - Code blocks and technical content

### Heading Hierarchy

```tsx
// Page Title (h1)
<h1 className="text-3xl font-bold tracking-tight mb-2">
  Page Title
</h1>

// Section Title (h2)
<h2 className="text-xl font-semibold mb-4">
  Section Title
</h2>

// Subsection Title (h3)
<h3 className="text-base font-medium">
  Subsection Title
</h3>

// Description Text
<p className="text-muted-foreground">
  Supporting text or description
</p>
```

### Hero/Landing Typography

```tsx
// Hero Title
<h1 className="text-5xl md:text-7xl xl:text-[5.25rem] font-bold">
  Ship Your Next SaaS
</h1>

// Hero Description
<p className="text-lg text-balance max-w-2xl">
  Description text
</p>
```

---

## Spacing & Layout

### Container Patterns

```tsx
// Dashboard Pages (Standard)
<div className="container mx-auto px-4 py-8 max-w-4xl">
  {/* Content */}
</div>

// Marketing Pages (Wide)
<div className="container mx-auto px-6 py-16 max-w-7xl">
  {/* Content */}
</div>

// Narrow Content (Forms, Settings)
<div className="max-w-2xl mx-auto">
  {/* Content */}
</div>
```

### Spacing Scale

- **Gap between sections**: `space-y-8` (2rem / 32px)
- **Gap between cards**: `gap-4` (1rem / 16px)
- **Card padding**: `p-6` (1.5rem / 24px)
- **Section vertical padding**: `py-16` or `py-32` for marketing
- **Section vertical padding**: `py-8` for dashboard

---

## Component Patterns

### Card Component

**Standard Card Pattern**:
```tsx
<Card className="p-6">
  <div className="space-y-4">
    {/* Icon + Title */}
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
        <Icon className="size-5 text-blue-600" />
      </div>
      <h3 className="text-base font-medium">Title</h3>
    </div>

    {/* Description */}
    <p className="text-sm text-muted-foreground">
      Description text
    </p>

    {/* Action */}
    <Button variant="secondary" size="sm">
      Action
    </Button>
  </div>
</Card>
```

**Used in**:
- `/dashboard/billing` - Payment provider cards
- `/dashboard/integrations` - Integration cards
- `/dashboard` - Feature cards

### Header Pattern

**Page Header (Dashboard)**:
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-bold tracking-tight mb-2">
    Page Title
  </h1>
  <p className="text-muted-foreground">
    Page description or subtitle
  </p>
</div>
```

**Section Header (Marketing)**:
```tsx
<div className="text-center mb-16">
  <h2 className="text-3xl md:text-4xl font-semibold text-balance">
    Section Title
  </h2>
  <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
    Section description
  </p>
</div>
```

### Button Variants

```tsx
// Primary CTA
<Button variant="default" size="lg">
  Get Started
</Button>

// Secondary Action
<Button variant="secondary" size="sm">
  Connect Now
</Button>

// Outline/Ghost (less prominent)
<Button variant="outline">
  Learn More
</Button>

// Destructive
<Button variant="destructive">
  Delete
</Button>
```

### Icon Patterns

**Icon in Card**:
```tsx
<div className="flex items-center justify-center size-10 rounded-lg bg-muted">
  <Icon className="size-5 text-blue-600" />
</div>
```

**Icon in Button**:
```tsx
<Button className="gap-1">
  Connect Now
  <ChevronRight className="size-3.5" />
</Button>
```

---

## Page Structure Patterns

### Dashboard Pages

**Standard Structure**:
```tsx
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Title</h1>
        <p className="text-muted-foreground">Description</p>
      </div>

      {/* Main Content - Sections with vertical spacing */}
      <div className="space-y-8">
        <Section1 />
        <Section2 />
        <Section3 />
      </div>
    </div>
  );
}
```

**Examples**:
- `/dashboard/billing/page.tsx` ✅
- `/dashboard/(sidebar-layout)/page.tsx` ✅

### Marketing Pages

**Standard Structure**:
```tsx
export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Title</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Description
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cards */}
        </div>
      </div>
    </div>
  );
}
```

**Examples**:
- `/pricing/page.tsx` ✅

### Hero/Landing Pages

**Standard Structure**:
```tsx
export default function HeroPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section>
        <div className="relative pt-24 md:pt-36">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              {/* Badge/Announcement */}
              <Link className="inline-flex items-center gap-2 rounded-full...">
                Badge
              </Link>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl xl:text-[5.25rem]">
                Hero Title
              </h1>

              {/* Description */}
              <p className="text-lg max-w-2xl mx-auto mt-8">
                Description
              </p>

              {/* CTAs */}
              <div className="flex gap-2 mt-12">
                <Button>Primary CTA</Button>
                <Button variant="ghost">Secondary CTA</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
    </main>
  );
}
```

**Examples**:
- `/hero-section.tsx` ✅

---

## Style Inconsistencies & Recommendations

### ✅ Consistent Patterns

1. **Card-based layouts** - Billing and Integrations pages use the same card structure
2. **Icon sizing** - Consistent `size-10` containers with `size-5` icons
3. **Color coding** - Integrations and payments use consistent color mapping
4. **Typography hierarchy** - Consistent heading sizes and weights
5. **Spacing** - Consistent `space-y-8` for sections, `gap-4` for grids

### ⚠️ Inconsistencies Found

#### 1. **Container Width Variations**

**Issue**: Different max-width constraints across similar pages

```tsx
// Billing page
<div className="container mx-auto px-4 py-8 max-w-4xl">

// Dashboard page (no max-width)
<div className="flex flex-1 flex-col gap-6">

// Components page
<div className="container max-w-6xl py-10">
```

**Recommendation**: Standardize container widths
```tsx
// Dashboard pages (narrow content)
<div className="container mx-auto px-4 py-8 max-w-4xl">

// Showcase/marketing pages (wide content)
<div className="container mx-auto px-6 py-16 max-w-7xl">
```

#### 2. **Section Header Spacing**

**Issue**: Inconsistent bottom margin on section headers

```tsx
// Billing page
<h2 className="text-xl font-semibold mb-4">

// Dashboard page
<h2 className="text-xl font-semibold">  {/* No margin */}

// Integrations section
<h2 className="text-xl font-semibold mb-2">
```

**Recommendation**: Always use consistent margin
```tsx
<h2 className="text-xl font-semibold mb-4">Section Title</h2>
```

#### 3. **Button Size Usage**

**Issue**: Mixing `size="sm"` and default sizes inconsistently

```tsx
// Integrations
<Button variant="secondary" size="sm">

// Billing
<Button variant="default" size="sm">

// Pricing
<Button size="lg">  {/* Only for hero CTAs */}
```

**Recommendation**:
- Use `size="lg"` only for hero/primary CTAs
- Use `size="sm"` for card actions and secondary buttons
- Use default size for forms and standard actions

#### 4. **Description Text Patterns**

**Issue**: Inconsistent text sizing and spacing

```tsx
// Some pages use text-sm
<p className="text-sm text-muted-foreground">

// Others use default size
<p className="text-muted-foreground">
```

**Recommendation**: Use consistent pattern
```tsx
// Card descriptions
<p className="text-sm text-muted-foreground">Description</p>

// Page descriptions (under h1)
<p className="text-muted-foreground">Description</p>
```

#### 5. **Grid Responsive Breakpoints**

**Issue**: Inconsistent grid breakpoint usage

```tsx
// Billing - uses md: breakpoint
<div className="grid gap-4 md:grid-cols-2">

// Dashboard - uses md: breakpoint
<div className="grid md:grid-cols-3 gap-4">

// Integrations - uses sm: and lg: breakpoints
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
```

**Recommendation**: Standardize responsive patterns
```tsx
// 2-column layout
<div className="grid gap-4 md:grid-cols-2">

// 3-column layout
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

// 4-column layout
<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

#### 6. **Badge/Status Indicators**

**Issue**: Inline styles vs. consistent pattern

```tsx
// Billing - good pattern
<span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
  Available
</span>

// Should create reusable Badge component variants
```

**Recommendation**: Create Badge component
```tsx
// packages/ui/src/badge.tsx
<Badge variant="success">Available</Badge>
<Badge variant="warning">Not configured</Badge>
<Badge variant="info">Popular</Badge>
```

---

## Best Practices

### 1. **Always Use Design Tokens**

```tsx
// ✅ Good - uses theme variables
<div className="bg-muted text-muted-foreground">

// ❌ Bad - hardcoded colors
<div className="bg-gray-100 text-gray-600">
```

### 2. **Consistent Component Imports**

```tsx
// ✅ Good - use @ alias for app components
import { Button } from "@/components/ui/button";

// ✅ Good - use @tocld for shared packages
import { INTEGRATION_METADATA } from "@tocld/features-integrations/constants";

// ❌ Bad - mixing aliases
import { Button } from "~/components/ui/button";
```

### 3. **Semantic HTML**

```tsx
// ✅ Good
<section>
  <h2>Section Title</h2>
  <p>Description</p>
</section>

// ❌ Bad
<div>
  <div className="text-xl font-bold">Section Title</div>
  <div>Description</div>
</div>
```

### 4. **Responsive Design Mobile-First**

```tsx
// ✅ Good - mobile first, then tablet, then desktop
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

// ❌ Bad - desktop first
<div className="grid grid-cols-3 md:grid-cols-2">
```

### 5. **Consistent Icon Sizing**

```tsx
// ✅ Good - semantic sizing
<Icon className="size-5" />      // Inside cards
<Icon className="size-4" />      // Inside buttons
<Icon className="size-3.5" />    // Trailing icons

// ❌ Bad - arbitrary sizing
<Icon className="w-5 h-5" />
<Icon className="w-[20px] h-[20px]" />
```

### 6. **Dark Mode Considerations**

```tsx
// ✅ Good - uses theme variables that adapt
<div className="bg-muted text-muted-foreground">

// ✅ Good - explicit dark mode variant when needed
<div className="bg-green-100 dark:bg-green-900/30">

// ❌ Bad - no dark mode support
<div className="bg-gray-100 text-gray-800">
```

### 7. **Spacing Consistency**

```tsx
// ✅ Good - uses space-y for vertical stacking
<div className="space-y-8">
  <Section1 />
  <Section2 />
</div>

// ✅ Good - uses gap for grid/flex
<div className="grid gap-4 md:grid-cols-2">
  <Card />
  <Card />
</div>

// ❌ Bad - manual margins
<div>
  <Section1 className="mb-8" />
  <Section2 className="mb-8" />
</div>
```

---

## Implementation Checklist

When creating new pages or components:

- [ ] Use consistent container widths (`max-w-4xl` for dashboard, `max-w-7xl` for marketing)
- [ ] Follow header pattern (h1 with `text-3xl font-bold tracking-tight mb-2`)
- [ ] Use `space-y-8` for section vertical spacing
- [ ] Use `gap-4` for card grids
- [ ] Apply card padding `p-6`
- [ ] Use semantic heading hierarchy (h1 → h2 → h3)
- [ ] Include dark mode support via theme variables
- [ ] Use consistent icon sizing (`size-10` container, `size-5` icon)
- [ ] Apply responsive breakpoints (`md:` for 2-col, `lg:` for 3-col)
- [ ] Use `text-muted-foreground` for descriptions
- [ ] Test in both light and dark modes
- [ ] Verify mobile responsiveness

---

## Component Reference

### UI Components Location

```
packages/ui/src/
├── button.tsx          - Button with variants
├── card.tsx           - Card container
├── input.tsx          - Form input
├── badge.tsx          - Status badges (TODO: create)
└── theme.tsx          - Theme provider

apps/nextjs/src/components/
├── ui/                - shadcn components (@/ alias)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── payments/          - Payment-related components
│   ├── billing-cards.tsx
│   ├── checkout-button.tsx
│   └── subscription-card.tsx
└── integrations-1.tsx - Integrations section
```

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Project architecture and commands
- [README.md](./README.md) - Getting started guide
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

**Last Updated**: 2025-10-07
**Maintained By**: Design System Team
