# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://your-frontend-domain.vercel.app`
- [ ] `LIVEKIT_API_KEY=your_livekit_api_key`
- [ ] `LIVEKIT_API_SECRET=your_livekit_api_secret`
- [ ] `LIVEKIT_URL=your_livekit_url`
- [ ] `JWT_SECRET=your_jwt_secret`
- [ ] `MONGODB_URI=your_mongodb_connection_string` (if using MongoDB)

### 2. Dependencies
- [ ] All dependencies are in `package.json`
- [ ] No dev dependencies are required for production
- [ ] Node.js version is compatible (18.x or higher)

### 3. Configuration Files
- [ ] `vercel.json` is properly configured
- [ ] `package.json` has correct scripts
- [ ] ES module imports are working
- [ ] Path aliases are properly configured

### 4. Code Review
- [ ] No hardcoded localhost URLs in production code
- [ ] CORS is properly configured for production
- [ ] Error handling is in place
- [ ] Logging is appropriate for production

## 🚀 Deployment Steps

### Option 1: Vercel CLI (Recommended)
```bash
cd backend
npm install -g vercel  # if not already installed
vercel login           # if not already logged in
vercel                 # follow prompts
vercel --prod         # deploy to production
```

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Create new project
3. Connect GitHub repository
4. Set root directory to `backend`
5. Configure environment variables
6. Deploy

## 🔍 Post-Deployment Verification

### 1. Health Check
- [ ] Backend is accessible at the deployed URL
- [ ] API endpoints are responding correctly
- [ ] CORS is working with your frontend

### 2. Environment Variables
- [ ] All environment variables are properly set
- [ ] No sensitive data is exposed in logs
- [ ] Production environment is active

### 3. Performance
- [ ] Response times are acceptable
- [ ] No timeout errors
- [ ] Memory usage is within limits

## 🐛 Common Issues & Solutions

### Import Errors
- Ensure all dependencies are in `package.json`
- Check ES module syntax compatibility

### Environment Variable Issues
- Verify all variables are set in Vercel dashboard
- Check for typos in variable names

### CORS Issues
- Update frontend to use new backend URL
- Verify CORS configuration in production

### Timeout Issues
- Check function timeout settings in `vercel.json`
- Optimize database queries if applicable

## 📞 Support
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
