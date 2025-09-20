# 🚀 Quick Deployment Commands

## Prerequisites
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

## Step-by-Step Deployment

### 1. Environment Setup
```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your Firebase credentials
# nano .env.production
```

### 2. Build Test
```bash
# Test production build locally
npm run build:prod

# Preview production build
npm run preview:prod
```

### 3. Deploy to Vercel
```bash
# First time deployment
vercel

# Production deployment
vercel --prod

# Or use npm script
npm run deploy
```

### 4. Set Environment Variables in Vercel
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 5. Custom Domain (Optional)
```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS settings as shown in Vercel dashboard
```

## Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [project-name]

# Switch between projects
vercel switch

# Environment management
vercel env ls
vercel env add [name]
vercel env rm [name]
```

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
npm run clean
npm ci
npm run build:prod
```

### Environment Issues
```bash
# Check environment variables
vercel env ls

# Pull environment to local
vercel env pull .env.local
```

### Deployment Issues
```bash
# Check project status
vercel inspect [deployment-url]

# View build logs
vercel logs [deployment-url] --follow
```

## Performance Optimization

### After Deployment
1. Check Lighthouse scores
2. Monitor Core Web Vitals
3. Enable Vercel Analytics
4. Set up monitoring alerts

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck
```

Your app will be live at: `https://your-project-name.vercel.app` 🎉