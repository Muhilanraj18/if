# Inan Infinites

This is a Next.js project configured for deployment to GitHub Pages.

## Getting Started

First, install dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on GitHub Pages

This project is already pre-configured to be exported as a static HTML site (`output: "export"` in `next.config.ts`). This is the required configuration for GitHub Pages deployment without Vercel.

To automatically deploy this site to GitHub Pages whenever you push to the `main` branch, you can create a GitHub Actions workflow:

1. Create a file in your repository at `.github/workflows/deploy.yml`
2. Add the following configuration to the file:

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm ci
      - name: Build with Next.js
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. Go to your repository **Settings > Pages**. Under **Build and deployment**, set the **Source** to **GitHub Actions**.

> Note: If you are deploying your site to a subfolder repository (e.g. `username.github.io/my-repo`), you will need to uncomment and set the `basePath` property in `next.config.ts`.
