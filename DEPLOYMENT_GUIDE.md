# Deployment Guide

This guide will walk you through deploying your Restaurant Order System to Vercel with Neon PostgreSQL.

## Prerequisites

Before you begin, make sure you have:
- A GitHub, GitLab, or Bitbucket account
- A Vercel account (sign up at https://vercel.com - free tier available)
- A Neon account (sign up at https://neon.tech - free tier available)

## Step 1: Set Up Neon Database

1. **Create a Neon Account**:
   - Go to https://neon.tech
   - Sign up for a free account
   - Verify your email

2. **Create a New Project**:
   - Click "Create a project"
   - Choose a name (e.g., "restaurant-orders")
   - Select a region closest to you
   - Click "Create project"

3. **Get Your Connection String**:
   - After project creation, you'll see a connection string
   - It looks like: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
   - **Save this connection string** - you'll need it for Vercel

4. **Initialize the Database** (from your local machine):
   ```bash
   # Create a .env file with your connection string
   echo "DATABASE_URL='your-neon-connection-string'" > .env
   
   # Run the initial migration
   npx prisma migrate deploy
   ```

## Step 2: Push Your Code to Git

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Restaurant Order System"

# Create a repository on GitHub, then:
git remote add origin https://github.com/yourusername/restaurant-orders.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. **Import Your Project**:
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your Git repository
   - Select your repository from the list

2. **Configure Your Project**:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: Leave as default (./`)
   - **Build Command**: Leave as default (`npm run build`)
   - **Output Directory**: Leave as default (`.next`)
   - **Install Command**: Leave as default (`npm install`)

3. **Add Environment Variables**:
   - Expand the "Environment Variables" section
   - Add a new variable:
     - **Name**: `DATABASE_URL`
     - **Value**: Your Neon connection string (from Step 1)
   - Make sure to select all environments: Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete (usually 2-3 minutes)

## Step 4: Verify Your Deployment

1. **Visit Your Site**:
   - Once deployment is complete, Vercel will provide a URL (e.g., `your-project.vercel.app`)
   - Click on the URL to visit your live site

2. **Test the Application**:
   - Try adding a supplier
   - Add some ingredients
   - Create an order
   - If everything works, congratulations! 🎉

## Step 5: Set Up a Custom Domain (Optional)

1. In your Vercel project, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure your DNS settings

## Troubleshooting

### Database Connection Errors

If you see database connection errors:

1. **Check your environment variable**:
   - Go to Vercel → Project Settings → Environment Variables
   - Verify `DATABASE_URL` is set correctly
   - Make sure there are no extra spaces or quotes

2. **Verify Neon database is active**:
   - Go to your Neon console
   - Check that your project is active
   - Try connecting with the connection string locally

3. **Redeploy**:
   - After fixing environment variables, trigger a new deployment
   - Go to Deployments → Click "..." → "Redeploy"

### Build Errors

If the build fails:

1. **Check the build logs** in Vercel for specific errors
2. **Common fixes**:
   - Make sure all dependencies are in `package.json`
   - Verify `DATABASE_URL` is set in environment variables
   - Try running `npm run build` locally to reproduce the error

### Prisma Issues

If you see Prisma-related errors:

1. **Regenerate Prisma Client**:
   - The `postinstall` script should handle this automatically
   - If not, the build command includes `prisma generate`

2. **Migration Issues**:
   - Make sure you've run `npx prisma migrate deploy` locally first
   - Check that your Neon database is accessible

## Updating Your Deployment

Whenever you make changes:

1. **Commit and push** to your Git repository:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Vercel will automatically deploy** your changes

3. **For database schema changes**:
   - Run migrations locally first: `npx prisma migrate dev`
   - Push the migration files to Git
   - Vercel will apply them automatically

## Environment Variables Reference

Required environment variable for production:

- `DATABASE_URL`: Your Neon PostgreSQL connection string

## Performance Tips

1. **Neon has a free tier limit**: 
   - 0.5 GB storage
   - 100 hours of compute per month
   - Should be sufficient for most small restaurants

2. **Upgrade if needed**:
   - If you exceed limits, Neon offers paid tiers
   - Vercel's free tier is usually sufficient for this application

3. **Optimize queries**:
   - The app is already optimized with proper indexes
   - Use `prisma.order.findMany()` with limits to avoid loading too much data

## Security Notes

1. **Never commit** `.env` or `.env.local` files to Git
2. **Rotate credentials** if they're accidentally exposed
3. **Use Vercel's environment variables** for all sensitive data
4. **Keep dependencies updated**: Run `npm update` regularly

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Neon Documentation**: https://neon.tech/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs

## Need Help?

If you encounter issues:
1. Check the error logs in Vercel's deployment dashboard
2. Review Neon's connection documentation
3. Ensure all environment variables are set correctly
4. Try deploying a minimal version first to isolate issues

---

**Congratulations on deploying your Restaurant Order System!** 🎉

You now have a fully functional ordering system running in the cloud, accessible from anywhere!
