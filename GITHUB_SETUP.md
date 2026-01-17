# GitHub Repository Setup Guide

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in to your account

2. Click the **"+"** icon in the top right corner and select **"New repository"**

3. Fill in the repository details:
   - **Repository name**: `movie-discovery` (or your preferred name)
   - **Description**: "Angular Movie Discovery Application using OMDb API"
   - **Visibility**: Select **Public** (for public repository)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

4. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see a page with instructions. Use these commands:

```bash
# Navigate to your project directory (if not already there)
cd movie-discovery

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/movie-discovery.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/movie-discovery.git
git branch -M main
git push -u origin main
```

## Step 3: Verify Your Repository

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Your README.md will be displayed on the main page

## Important Notes

⚠️ **Before pushing to GitHub:**

1. Make sure you've added your OMDb API key to `src/environments/environment.ts`
   - The environment file is already committed (it contains a placeholder)
   - For production, consider using environment variables instead
   - Never commit actual API keys in public repositories

2. If you want to keep your API key private:
   - Add `src/environments/environment.ts` to `.gitignore`
   - Create `src/environments/environment.example.ts` with placeholder
   - Update README with instructions to copy the example file

## Optional: Add Environment File to .gitignore

If you want to keep your API key out of version control:

```bash
# Remove environment.ts from git tracking
git rm --cached src/environments/environment.ts

# Add to .gitignore (if not already there)
echo "src/environments/environment.ts" >> .gitignore

# Commit the change
git add .gitignore
git commit -m "Keep API key out of version control"
git push
```

Then create `src/environments/environment.example.ts`:

```typescript
export const environment = {
  production: false,
  omdbApiKey: 'YOUR_API_KEY_HERE',
  omdbApiUrl: 'https://www.omdbapi.com/'
};
```

## Adding a License (Optional)

If you want to add a license:

```bash
# Create a LICENSE file (MIT License example)
# Or download from: https://choosealicense.com/licenses/mit/

git add LICENSE
git commit -m "Add MIT License"
git push
```

## Setting Up GitHub Pages (Optional)

If you want to host your app on GitHub Pages:

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Select the branch (usually `main` or `gh-pages`)
4. Select the folder (usually `/root`)
5. Click Save
6. Your site will be available at: `https://YOUR_USERNAME.github.io/movie-discovery`

**Note:** For Angular apps, you may need to build and deploy the `dist/` folder using GitHub Actions or a tool like `angular-cli-ghpages`.

## Troubleshooting

### If you get authentication errors:
- Use a Personal Access Token instead of password
- Generate one at: GitHub Settings → Developer settings → Personal access tokens

### If you get "repository not found":
- Check that the repository name matches exactly
- Verify you have push access to the repository
- Make sure you're using the correct remote URL

### If you want to change the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/movie-discovery.git
```

## Next Steps After Pushing

1. ✅ Add a description and topics to your repository
2. ✅ Enable GitHub Pages if you want to host it
3. ✅ Add screenshots to your README
4. ✅ Set up GitHub Actions for CI/CD (optional)
5. ✅ Add issues templates and pull request templates (optional)

Your repository is now live on GitHub! 🎉


