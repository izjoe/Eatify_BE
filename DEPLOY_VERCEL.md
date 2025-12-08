# Deploying Eatify Backend to Vercel

This guide covers deploying the Eatify backend API to Vercel as a serverless function.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional but recommended):
   ```bash
   npm i -g vercel
   ```
3. MongoDB Atlas account with a remote database (Vercel cannot access localhost)

## Quick Start

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy from your project directory**
   ```bash
   cd /path/to/Eatify_BE
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project? (Choose No for first deployment)
   - What's your project's name? `eatify-backend` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? `N`

4. **Set environment variables** (see below)

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository `izjoe/Eatify_BE`
3. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
4. Add environment variables (see below)
5. Click **Deploy**

## Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

### Required Variables

```bash
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eatify?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_production_jwt_secret_change_this

# Frontend URL
FRONTEND_URL=https://eatify-fe.vercel.app

# Node Environment
NODE_ENV=production
```

### Optional (Email Configuration)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM="Eatify <noreply@eatify.com>"
```

## MongoDB Atlas Setup

Since Vercel is serverless, you **must** use a cloud MongoDB instance (not localhost).

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Add `0.0.0.0/0` to Network Access (or restrict to Vercel IPs)
4. Get connection string and set as `MONGO_URI`

Example connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/eatify?retryWrites=true&w=majority
```

## Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## Testing Your Deployment

After deployment, Vercel will provide a URL like:
```
https://eatify-backend-xyz.vercel.app
```

Test the API:
```bash
# Health check
curl https://your-deployment-url.vercel.app/

# Test auth endpoint
curl https://your-deployment-url.vercel.app/api/auth/login
```

## Update Frontend to Use Backend URL

In your frontend `.env` or config:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-deployment.vercel.app
# or
VITE_API_URL=https://your-backend-deployment.vercel.app
```

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:** Ensure `package.json` has all dependencies (not just devDependencies):
```bash
npm install
```

### Issue: MongoDB connection timeout

**Solution:** 
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check connection string format
- Ensure database user has correct permissions

### Issue: CORS errors from frontend

**Solution:** 
- Verify `FRONTEND_URL` environment variable is set correctly
- Check `server.js` CORS configuration includes your frontend domain

### Issue: 500 Internal Server Error

**Solution:**
- Check Vercel Function logs: Dashboard → Project → Deployments → Click deployment → Function Logs
- Verify all environment variables are set
- Check for missing imports or incompatible packages

## Limitations of Vercel Serverless

1. **Function timeout:** 10 seconds (Hobby), 60 seconds (Pro)
2. **No persistent filesystem:** Uploaded files won't persist (use cloud storage like AWS S3, Cloudinary)
3. **Cold starts:** First request may be slower
4. **Stateless:** Each request is handled by a separate function instance

### File Upload Handling

For production, replace local file storage with cloud storage:

**Recommended services:**
- [Cloudinary](https://cloudinary.com/) - Image hosting with CDN
- [AWS S3](https://aws.amazon.com/s3/) - General file storage
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) - Vercel's native solution

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "feat: deploy to vercel"
git push origin fix-auth-api
```

Vercel will:
1. Detect the push
2. Build and deploy automatically
3. Provide preview URL for the branch
4. Deploy to production (if pushing to `main`)

## Local Development

Keep developing locally as usual:
```bash
npm run server
```

The code will work in both environments thanks to the conditional server start in `server.js`.

## Monitoring & Logs

View logs in Vercel Dashboard:
1. Go to your project
2. Click **Deployments**
3. Select a deployment
4. View **Function Logs** and **Build Logs**

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
