# GitHub Repository Setup Instructions

Follow these steps to push your Mars Weather App to GitHub as a portfolio item:

## 1. Create a new repository on GitHub

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "mars-weather-app")
4. Add a description: "A web application that displays Mars weather data, built with Node.js and designed to be deployed on AWS"
5. Keep the repository public for portfolio visibility
6. Do not initialize with README, .gitignore, or license (we've already created these)
7. Click "Create repository"

## 2. Push your local repository to GitHub

After creating the repository, GitHub will show you commands to push an existing repository. Run these commands in your project directory:

```bash
# Replace YOUR_USERNAME with your GitHub username and REPO_NAME with your repository name
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 3. Verify your repository

1. Refresh your GitHub repository page
2. Ensure all files are visible and properly formatted
3. Check that your README.md appears on the main page

## 4. Enhance your portfolio presentation

For a more professional portfolio presentation, consider:

1. Adding screenshots of the application to the README.md
2. Creating a GitHub Pages demo if applicable
3. Adding topics/tags to your repository for better discoverability
4. Completing the "About" section with a link to a live demo if deployed

## Security Notes

- The `.env` file is in `.gitignore` and won't be pushed to GitHub
- We've created `.env.example` as a template for required environment variables
- Your actual NASA API key has been replaced with "DEMO_KEY" in your local `.env` file
- Remember to use environment variables for any sensitive information when deploying

## Deployment Instructions

If you decide to deploy this application, follow the instructions in the README.md file under the "AWS Deployment" section.