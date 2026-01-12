# 🚀 SoongGrow Setup Instructions

## 1. Move Project to OneDrive
Since I couldn't access your OneDrive directly, I created the project here.
**Please move the entire `soonggrow` folder to:**
`C:\Users\yieth\OneDrive\Projects\soonggrow`

## 2. Private GitHub Repo (Command Line)
Once you have moved the folder, open a terminal (PowerShell/Command Prompt) **inside the new folder** and run:

```bash
# 1. Login to GitHub (if not already logged in)
gh auth login

# 2. Create Private Repo and Push
gh repo create SoongGrow --private --source=. --remote=origin --push
```

*(If you don't have the `gh` tool, you can create a repo on github.com manually and follow the "Push an existing repository" instructions).*

## 3. Next Steps
I will continue building the app. You can run it locally with:
```bash
npm run dev
```
