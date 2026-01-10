# RE | Group Hub - Complete Deployment Guide

## Overview

This guide will help you deploy the RE | Group Hub with cloud database storage.

**Total time: ~40-50 minutes**

| Step | Time | What You'll Do |
|------|------|---------------|
| Part 1 | 5 min | Create GitHub account |
| Part 2 | 5 min | Create Supabase account & database |
| Part 3 | 5 min | Set up database tables |
| Part 4 | 2 min | Get Supabase credentials |
| Part 5 | 3 min | Create GitHub repository |
| Part 6 | 5 min | Upload project files |
| Part 7 | 5 min | Deploy to Vercel |
| Part 8 | 5 min | Enable AI Assistant (optional) |
| Part 9 | — | Access your app |

---

## Part 1: Create a GitHub Account (5 minutes)

*Skip this if you already have a GitHub account*

1. Go to **https://github.com**
2. Click **"Sign up"** in the top right
3. Enter your email, create a password, choose a username
4. Complete verification and click **"Create account"**
5. Verify your email

✅ **Done!** You have a GitHub account.

---

## Part 2: Create Supabase Account & Project (5 minutes)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Click **"Continue with GitHub"** (easiest option)
4. Authorize Supabase to access your GitHub
5. Click **"New Project"**
6. Fill in:
   - **Name:** `re-group-hub`
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to Miami (e.g., "East US")
7. Click **"Create new project"**
8. Wait ~2 minutes for setup to complete

✅ **Done!** You have a Supabase project.

---

## Part 3: Set Up Database Tables (5 minutes)

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. **Copy the ENTIRE contents** of the `supabase-schema.sql` file I provided
4. **Paste it** into the SQL editor
5. Click **"Run"** (or press Cmd+Enter)
6. You should see "Success. No rows returned" - this is correct!

**Verify tables were created:**
1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - contacts
   - deals
   - tasks
   - activities
   - properties
   - templates
   - user_settings
   - mastery_progress

✅ **Done!** Your database is ready.

---

## Part 4: Get Your Supabase Credentials (2 minutes)

1. In your Supabase project dashboard, click the **"Connect"** button (top right)
2. Select **"App Frameworks"** or **"ORMs"** tab
3. You'll see your Project URL and API key displayed
   
   **Or alternatively:**
   - Click **"Project Settings"** (gear icon) in the left sidebar
   - Click **"API Keys"** (under Configuration)

4. You'll need TWO values - **copy these somewhere safe**:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **Publishable key:** (may also be called "anon key" in older projects)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

📝 **Keep these handy** - you'll need them in Part 7.

---

## Part 5: Create GitHub Repository (3 minutes)

1. Go to **https://github.com**
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name:** `re-group-hub`
   - **Description:** `Luxury Real Estate CRM`
   - Select **"Public"**
   - ✅ Check **"Add a README file"**
4. Click **"Create repository"**

✅ **Done!** You have a repository.

---

## Part 6: Upload Project Files (5 minutes)

1. **Download** the `re-group-hub-app.zip` file I provided
2. **Unzip** it on your computer (double-click on Mac)
3. On your GitHub repository page, click **"Add file"** → **"Upload files"**
4. Open the unzipped `re-group-hub-app` folder
5. **Select ALL files and folders inside** and drag them to GitHub:
   ```
   app/                  (folder)
   .env.example
   .gitignore
   DEPLOYMENT-GUIDE.md
   next.config.js
   package.json
   postcss.config.js
   README.md
   supabase-schema.sql
   tailwind.config.js
   ```
6. Scroll down, type commit message: `Initial commit`
7. Click **"Commit changes"**

✅ **Done!** Your code is on GitHub.

---

## Part 7: Deploy to Vercel (5 minutes)

1. Go to **https://vercel.com/signup**
2. Select **"I'm working on personal projects"** (Hobby - free tier)
3. Click **"Continue"**
4. Choose how to sign up - select **"Continue with GitHub"**
5. Authorize Vercel to access your GitHub
6. Once logged in, click **"Add New..."** → **"Project"**
7. Find `re-group-hub` in your repository list and click **"Import"**
8. **IMPORTANT - Add Environment Variables:**
   - Click **"Environment Variables"** to expand
   - Add these variables:
   
   | Name | Value | Required |
   |------|-------|----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Yes |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key | Yes |
   | `ANTHROPIC_API_KEY` | Your Anthropic API key | Optional* |

   *Note: Older Supabase projects may show `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead - both work!
   
   *The AI Assistant feature requires the Anthropic API key. The app works without it, but the assistant will show a configuration message.

9. Click **"Deploy"**
10. Wait 1-2 minutes for the build

✅ **Done!** Your app is live!

---

## Part 8: Enable AI Assistant (Optional, 5 minutes)

The AI Assistant helps Roxanna with deal coaching, follow-up suggestions, and email drafting. To enable it:

1. Go to **https://console.anthropic.com**
2. Sign up or log in
3. Go to **Settings** → **API Keys**
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-`)
6. In Vercel:
   - Go to your project → **Settings** → **Environment Variables**
   - Add: `ANTHROPIC_API_KEY` = your key
   - Click **"Save"**
7. Go to **Deployments** → click **"..."** → **"Redeploy"**

**Cost:** ~$0.10-0.50/month for typical usage (very affordable)

✅ **Done!** AI Assistant is now active.

---

## Part 9: Access Your App

Your app is now live at:
```
https://re-group-hub.vercel.app
```
(or whatever name Vercel assigned)

### Add to Mac Dock (Optional but Recommended)

1. Open the URL in **Safari**
2. Click **File** → **Add to Dock**
3. It now works like a native Mac app!

---

## Share with Roxanna

Send her the URL:
```
https://re-group-hub.vercel.app
```

Her data will be:
- ✅ Saved to the cloud database
- ✅ Accessible from any device
- ✅ Automatically backed up
- ✅ Secure and private

---

## Troubleshooting

### "Failed to fetch" errors
- Check that environment variables are set correctly in Vercel
- Make sure there are no extra spaces in the values
- Redeploy after adding environment variables

### Database tables not found
- Make sure you ran the SQL schema in Supabase
- Check the Table Editor to verify tables exist

### Build fails on Vercel
- Make sure all files were uploaded correctly
- Check that the `app/` folder structure is intact

### Need to update environment variables
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Edit the values
3. Redeploy (Deployments → ... → Redeploy)

---

## Future: Adding Authentication (Optional)

When you're ready to add login protection:

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Email** or **Google** login
3. Update the Row Level Security policies
4. I can help you add login to the app

---

## Updating the App

When you want to make changes:

1. Edit files on GitHub (or upload new versions)
2. Vercel automatically redeploys
3. Changes are live in ~1 minute

---

## Summary

| What | Where |
|------|-------|
| Code | GitHub repository |
| Database | Supabase |
| Hosting | Vercel |
| Cost | **$0** (all free tiers) |

**You're all set!** 🎉
