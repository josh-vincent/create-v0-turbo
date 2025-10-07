# @tocld/ui Component Registry

This is a custom component registry for universal React components that work seamlessly across Next.js and React Native (Expo).

## 🚀 Quick Start

### Using the Registry

Install components from this registry using the shadcn CLI:

```bash
# Install from your deployed registry
npx shadcn@latest add https://your-domain.com/r/button

# Or if running locally
npx shadcn@latest add http://localhost:3000/r/button
```

### Available Components

- **button** - Universal button component with multiple variants
- **input** - Universal input component
- **primitives** - Cross-platform primitive components (View, Text, Pressable, TextInput)

## 📦 Registry Structure

```
apps/nextjs/
├── registry.json              # Registry definition
├── registry/
│   └── new-york/
│       └── ui/                # Component source files
│           ├── button.ts
│           ├── button.tsx
│           ├── button.native.tsx
│           ├── input.ts
│           ├── input.tsx
│           ├── input.native.tsx
│           └── primitives/
└── public/
    └── r/                     # Built registry JSON files (served statically)
        ├── button.json
        ├── input.json
        ├── primitives.json
        └── registry.json
```

## 🛠️ Development

### Building the Registry

```bash
# Build all registry files
bun run registry:build

# Or use shadcn CLI directly
bunx shadcn build
```

This will:
1. Read `registry.json`
2. Process all component files
3. Generate JSON files in `public/r/`

### Adding New Components

1. **Create component files** in `registry/new-york/ui/`:
   ```
   your-component.ts          # Shared types/logic
   your-component.tsx         # Web implementation
   your-component.native.tsx  # Native implementation
   ```

2. **Add to `registry.json`**:
   ```json
   {
     "name": "your-component",
     "type": "registry:ui",
     "title": "Your Component",
     "description": "Description of your component",
     "files": [
       {
         "path": "registry/new-york/ui/your-component.ts",
         "type": "registry:lib"
       },
       {
         "path": "registry/new-york/ui/your-component.tsx",
         "type": "registry:ui"
       },
       {
         "path": "registry/new-york/ui/your-component.native.tsx",
         "type": "registry:ui"
       }
     ]
   }
   ```

3. **Rebuild the registry**:
   ```bash
   bun run registry:build
   ```

## 🌐 Deploying Your Registry

1. **Deploy to Vercel/Netlify/etc.**:
   ```bash
   bun run build
   ```

2. **Use your registry URL**:
   ```bash
   npx shadcn@latest add https://your-domain.com/r/button
   ```

## 🔗 Integration with Monorepo

This registry serves components from the `@tocld/ui` package. The components are:

- **Universal** - Work on both web and native
- **Type-safe** - Full TypeScript support
- **Styled** - Using Tailwind CSS (web) and NativeWind (native)
- **Accessible** - Following best practices for both platforms

### How It Works

1. **Metro Resolution** - React Native automatically picks `.native.tsx` files
2. **Next.js** - Uses the standard `.tsx` files
3. **Shared Logic** - Common types and variants in `.ts` files
4. **Registry** - Shadcn CLI installs the appropriate files based on your project

## 📚 Documentation

- [Shadcn Registry Documentation](https://ui.shadcn.com/docs/registry)
- [Creating Custom Registries](https://ui.shadcn.com/docs/registry/getting-started)
- [Registry Schema](https://ui.shadcn.com/schema/registry.json)

## 🤝 Contributing

To contribute new components:

1. Create component in `registry/new-york/ui/`
2. Follow the 3-file pattern (`.ts`, `.tsx`, `.native.tsx`)
3. Update `registry.json`
4. Run `bun run registry:build`
5. Test with both Next.js and Expo apps
6. Submit PR

## 📝 License

MIT - See LICENSE file for details
