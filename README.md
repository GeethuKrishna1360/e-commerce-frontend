# Form & Field storefront

A responsive e-commerce frontend built with React, TypeScript, Vite, and Tailwind CSS v4.

## Getting started

```sh
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run lint` to run Oxlint.

## Project structure

```text
src/
  components/
    layout/       Shared site navigation and layout
    products/     Product display components
  data/           Store catalog data
  types/          Shared TypeScript models
  App.tsx         Storefront page composition
  index.css       Tailwind import and global styles
```

Tailwind is enabled through the Vite plugin in `vite.config.ts`. Product images are currently loaded from Unsplash and can be replaced with local assets or a product API.
