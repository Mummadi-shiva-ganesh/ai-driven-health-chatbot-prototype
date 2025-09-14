# GitHub Pages Deployment Guide

This guide will help you deploy your Health Chatbot React frontend to GitHub Pages.

## Prerequisites

1. Your project must be in a GitHub repository
2. You need admin access to the repository
3. Your backend API should be deployed separately (e.g., on Heroku, Railway, or similar)

## Step 1: Update Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

## Step 2: Update Homepage URL

1. Replace `yourusername` in `client/package.json` with your actual GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/sih22"
   ```

## Step 3: Configure Backend API URL

### Option A: Using GitHub Secrets (Recommended)
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `REACT_APP_API_URL`
4. Value: Your deployed backend API URL (e.g., `https://your-app.herokuapp.com/api`)
5. Click **Add secret**

### Option B: Update the workflow file directly
Edit `.github/workflows/deploy.yml` and replace the default URL:
```yaml
REACT_APP_API_URL: 'https://your-actual-backend-url.herokuapp.com/api'
```

## Step 4: Deploy Backend (If Not Already Deployed)

Since GitHub Pages only hosts static files, you'll need to deploy your Flask backend separately:

### Heroku Deployment
1. Create a `Procfile` in your root directory:
   ```
   web: python app.py
   ```

2. Deploy to Heroku:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Railway Deployment
1. Connect your repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

## Step 5: Push Changes and Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. Go to the **Actions** tab in your GitHub repository
3. You should see the deployment workflow running
4. Once completed, your site will be available at:
   `https://yourusername.github.io/sih22`

## Step 6: Verify Deployment

1. Visit your deployed site
2. Test the login/registration functionality
3. Test the chat functionality
4. Check browser console for any errors

## Troubleshooting

### Common Issues:

1. **404 Error on Refresh**: This is normal for React Router. The GitHub Pages configuration handles this.

2. **API Connection Issues**: 
   - Verify your backend is deployed and accessible
   - Check the `REACT_APP_API_URL` environment variable
   - Ensure CORS is properly configured in your Flask backend

3. **Build Failures**:
   - Check the Actions tab for detailed error logs
   - Ensure all dependencies are properly listed in `package.json`

4. **Styling Issues**:
   - Verify all CSS files are properly imported
   - Check for any missing assets

### Backend CORS Configuration

Make sure your Flask backend has CORS properly configured for your GitHub Pages domain:

```python
from flask_cors import CORS

# Allow your GitHub Pages domain
CORS(app, origins=[
    "https://yourusername.github.io",
    "http://localhost:3000"  # For local development
])
```

## Environment Variables

The following environment variables are used:

- `REACT_APP_API_URL`: Your deployed backend API URL
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## File Structure After Deployment

```
.github/
  workflows/
    deploy.yml          # GitHub Actions workflow
client/
  package.json         # Updated with homepage field
  build/               # Generated build files (deployed to GitHub Pages)
GITHUB_PAGES_DEPLOYMENT.md  # This guide
```

## Next Steps

1. Set up a custom domain (optional)
2. Configure HTTPS (automatic with GitHub Pages)
3. Set up monitoring and analytics
4. Configure automatic deployments from other branches

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify all configuration steps
3. Test locally with production build: `npm run build && serve -s build`
