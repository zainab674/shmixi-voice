# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Make sure you have a Vercel account

## Environment Variables
Set these environment variables in your Vercel dashboard:

```
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-frontend-domain.vercel.app
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=your_livekit_url
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

## Deployment Steps

### Option 1: Using Vercel CLI
1. Navigate to the backend directory: `cd backend`
2. Run: `vercel`
3. Follow the prompts to link to your Vercel project
4. Deploy: `vercel --prod`

### Option 2: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Configure environment variables
6. Deploy

## Important Notes
- The backend will be available at: `https://your-project.vercel.app`
- API endpoints will be at: `https://your-project.vercel.app/api/v1/`
- Make sure to update your frontend CORS settings with the new backend URL
- Update your frontend API calls to use the new backend URL

## Troubleshooting
- If you get import errors, make sure all dependencies are in package.json
- Check Vercel function logs for any runtime errors
- Ensure environment variables are properly set
