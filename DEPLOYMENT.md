# Deploying to GitHub Pages

This guide explains how to deploy your Kanban Board app to GitHub Pages.

## Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **GitHub Pages Enabled**: Enable GitHub Pages in your repository settings

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. This will allow the workflow to deploy automatically

### 2. Push Your Code

The GitHub workflow will automatically run when you push to the `main` branch:

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

### 3. Monitor Deployment

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. You'll see the "Deploy to GitHub Pages" workflow running
4. Wait for it to complete (usually takes 2-3 minutes)

### 4. Access Your App

Once deployment is complete, your app will be available at:
```
https://[your-username].github.io/[repository-name]/
```

## How It Works

### Static Export Configuration

The app is configured for static export in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',        // Generates static files
  trailingSlash: true,     // Required for GitHub Pages
  images: {
    unoptimized: true      // Required for static export
  }
}
```

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file:

1. **Triggers**: Runs on pushes to `main` branch
2. **Build**: Installs dependencies and builds the app
3. **Deploy**: Uploads the `out` folder to GitHub Pages

### Data Storage

Since GitHub Pages is static hosting, the app uses:
- **localStorage** instead of SQLite database
- **Client-side state management** 
- **No server-side API calls**

## Troubleshooting

### Common Issues

1. **Build Fails**: Check the Actions tab for error messages
2. **Page Not Found**: Ensure the repository name matches the URL
3. **Data Not Persisting**: localStorage is browser-specific

### Local Testing

Test the static build locally:

```bash
npm run build
npx serve out
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder
2. Configure your domain's DNS settings
3. Update the workflow to handle custom domains

## Security Notes

- All data is stored in the browser's localStorage
- No server-side processing or API calls
- Data is not shared between devices/browsers 