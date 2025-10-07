# Universal Component Registry

This monorepo includes a **shadcn-compatible component registry** serving universal React components that work across Next.js and React Native (Expo).

## 🎯 Overview

Our component registry follows the [shadcn/ui registry specification](https://ui.shadcn.com/docs/registry), making it compatible with the official shadcn CLI while adding support for React Native.

## 📦 Registry Location

The registry is served from the **Next.js app** at:

```
apps/nextjs/
├── registry.json              # Registry definition
├── registry/new-york/ui/      # Component source files
└── public/r/                  # Built registry JSON (served via HTTP)
```

## 🚀 Using Components

### Method 1: Shadcn CLI (Recommended)

Install components directly from the registry:

```bash
# Install button component
npx shadcn@latest add http://localhost:3000/r/button

# Install input component
npx shadcn@latest add http://localhost:3000/r/input

# Install primitives
npx shadcn@latest add http://localhost:3000/r/primitives
```

### Method 2: Direct from Monorepo

Reference components directly from the `@tocld/ui` package:

```tsx
// Next.js
import { Button } from "@tocld/ui/components";

// Expo
import { Button } from "@tocld/ui/components";
```

## 🏗️ Component Architecture

### Three-File Pattern

Each component uses three files for universal support:

```
button.ts          → Shared types, variants (CVA)
button.tsx         → Web implementation (Radix UI)
button.native.tsx  → Native implementation (RN primitives)
```

### How It Works

1. **Metro Resolution** (React Native/Expo)
   - Automatically picks `.native.tsx` files
   - Falls back to `.tsx` if no native version exists

2. **Next.js Resolution**
   - Uses standard `.tsx` files
   - TypeScript resolves imports correctly

3. **Shared Logic**
   - Common code in `.ts` files
   - CVA variants work on both platforms
   - Type safety across the board

## 📖 Available Components

| Component | Description | Web | Native |
|-----------|-------------|-----|--------|
| **button** | Multi-variant button component | ✅ | ✅ |
| **input** | Text input with consistent styling | ✅ | ✅ |
| **primitives** | Cross-platform base components | ✅ | ✅ |

### Primitives Include:

- `View` - Universal container
- `Text` - Universal text
- `Pressable` - Universal button/touchable
- `TextInput` - Universal input

## 🛠️ Development Workflow

### 1. Add a New Component

```bash
cd apps/nextjs

# Create component files
touch registry/new-york/ui/card.ts
touch registry/new-york/ui/card.tsx
touch registry/new-york/ui/card.native.tsx
```

### 2. Update registry.json

```json
{
  "name": "card",
  "type": "registry:ui",
  "title": "Card",
  "description": "A universal card component",
  "files": [
    {
      "path": "registry/new-york/ui/card.ts",
      "type": "registry:lib"
    },
    {
      "path": "registry/new-york/ui/card.tsx",
      "type": "registry:ui"
    },
    {
      "path": "registry/new-york/ui/card.native.tsx",
      "type": "registry:ui"
    }
  ]
}
```

### 3. Build Registry

```bash
bun run registry:build
```

This generates JSON files in `public/r/`:
- `public/r/card.json` - Component definition with source code
- `public/r/registry.json` - Updated registry index

### 4. Test Installation

```bash
# Start dev server
bun run dev

# In another terminal, install from registry
npx shadcn@latest add http://localhost:3000/r/card
```

## 🌐 Deploying Your Registry

### Deploy to Vercel

```bash
cd apps/nextjs
vercel deploy
```

### Use in Production

```bash
npx shadcn@latest add https://your-domain.com/r/button
```

## 📚 Registry Endpoints

When the Next.js app is running:

| Endpoint | Description |
|----------|-------------|
| `/r/registry.json` | Registry index (list of all components) |
| `/r/button.json` | Button component definition + source |
| `/r/input.json` | Input component definition + source |
| `/r/primitives.json` | Primitives package definition + source |

## 🔍 Registry Schema

Our registry follows the shadcn schema:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "@tocld/ui",
  "homepage": "https://github.com/yourusername/create-v0-turbo",
  "items": [
    {
      "name": "component-name",
      "type": "registry:ui",
      "title": "Component Title",
      "description": "Component description",
      "dependencies": ["package-name"],
      "registryDependencies": ["other-component"],
      "files": [...]
    }
  ]
}
```

## 🎨 Styling

- **Web**: Tailwind CSS with CSS variables
- **Native**: NativeWind v4 (Tailwind for React Native)
- **Shared**: CVA (Class Variance Authority) for variants

## 📱 Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| Next.js | ✅ Full | Uses Radix UI primitives |
| Expo | ✅ Full | Uses React Native primitives |
| React Native CLI | ✅ Full | Requires NativeWind setup |
| Vite | ⚠️ Partial | Web components only |

## 🤝 Contributing

1. Create universal component (3 files)
2. Update `registry.json`
3. Run `bun run registry:build`
4. Test with both apps
5. Update documentation
6. Submit PR

## 📖 Learn More

- [Shadcn Registry Docs](https://ui.shadcn.com/docs/registry)
- [Registry Template](https://github.com/shadcn-ui/registry-template)
- [NativeWind](https://nativewind.dev)
- [CVA Documentation](https://cva.style)

## 📄 License

MIT - See LICENSE for details
