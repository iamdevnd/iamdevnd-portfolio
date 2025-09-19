#Complete Portfolio Setup Guide

This guide will take you from code completion to live production deployment.

##Prerequisites

- All code is complete and pushed to GitHub
- Node.js 20+ installed
- GitHub repository connected
- Firebase account (Google account required)
- Vercel account (can sign up with GitHub)
- Resend account for emails
- Domain name (iamdevnd.dev)

---

## Phase 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `iamdevnd-portfolio`
4. Enable Google Analytics: **Yes**
5. Configure Analytics: Use default account
6. Click "Create project"

### 1.2 Enable Authentication

1. In Firebase Console → **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click "Save"

### 1.3 Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click "Add user"
3. Email: `your-admin-email@domain.com`
4. Password: Create a strong password
5. Click "Add user"
6. **Save these credentials securely!**

### 1.4 Setup Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode**
4. Location: Choose closest to your users (e.g., `us-central1`)
5. Click "Done"

### 1.5 Configure Firestore Security Rules

Go to **Firestore** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read access to published content
    match /projects/{document} {
      allow read: if resource.data.published == true;
      allow write: if false;
    }
    
    // Allow public creation for contact forms
    match /contactSubmissions/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    
    // Lock down everything else
    match /{path=**}/{document} {
      allow read, write: if false;
    }
  }
}
```

### 1.6 Create Firestore Indexes

Go to **Firestore** → **Indexes** → **Composite** and create these indexes:

```
Collection: projects
Fields: published (Ascending), createdAt (Descending)

Collection: projects  
Fields: published (Ascending), featured (Ascending), createdAt (Descending)

Collection: projects
Fields: published (Ascending), category (Ascending), createdAt (Descending)
```

### 1.7 Get Firebase Configuration

1. Go to **Project settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web icon `</>`
4. App nickname: `iamdevnd-portfolio-web`
5. **Copy the firebaseConfig object** - you'll need this!

### 1.8 Generate Service Account Key

1. Go to **Project settings** → **Service accounts**
2. Click "Generate new private key"
3. **Download the JSON file** - you'll need this!
4. Convert to base64:

```bash
# On Mac/Linux:
base64 -i path/to/your-service-account.json | pbcopy

# On Windows:
certutil -encode path/to/your-service-account.json temp.txt && findstr /v /c:"-" temp.txt
```

---

## 📧 Phase 2: Email Setup (Resend)

### 2.1 Create Resend Account

1. Go to [Resend.com](https://resend.com)
2. Sign up with your email
3. Verify your email address

### 2.2 Add Your Domain

1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain: `iamdevnd.dev`
4. Follow DNS setup instructions
5. Wait for verification (can take up to 48 hours)

### 2.3 Get API Key

1. Go to **API Keys** in Resend dashboard
2. Click "Create API Key"
3. Name: `Portfolio Contact Form`
4. Permission: **Sending access**
5. **Copy the API key** - you'll need this!

---

## 🌍 Phase 3: Environment Variables Setup

Create `.env.local` in your project root:

```bash
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_firebase_config
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Base64 encoded service account JSON)
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_json

# Email Configuration
RESEND_API_KEY=your_resend_api_key

# Admin Configuration
ADMIN_EMAIL=your-admin-email@domain.com
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@domain.com

# Optional: Analytics & Security
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test admin login at http://localhost:3000/admin/login
```

---

## Phase 4: Vercel Deployment

### 4.1 Connect to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up/in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Project Name: `iamdevnd-portfolio`
6. Framework: **Next.js** (auto-detected)
7. **Don't deploy yet!**

### 4.2 Configure Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add **ALL** variables from your `.env.local`
3. Set Environment: **Production, Preview, Development**
4. **Important**: For `FIREBASE_SERVICE_ACCOUNT_KEY`, paste the base64 string

### 4.3 Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Test the deployment URL

### 4.4 Custom Domain Setup

1. Go to **Settings** → **Domains**
2. Add domain: `iamdevnd.dev`
3. Add domain: `www.iamdevnd.dev` → redirect to `iamdevnd.dev`
4. Configure DNS records as instructed by Vercel

---

## Phase 5: Initial Content Setup

### 5.1 Login to Admin Panel

1. Go to `https://iamdevnd.dev/admin/login`
2. Use your Firebase admin credentials
3. You should see the admin dashboard

### 5.2 Create Your First Project

1. Go to **Projects** → **New Project**
2. Fill out the form with a real project
3. Set **Published** = true, **Featured** = true
4. Save the project

### 5.3 Test Public Site

1. Visit `https://iamdevnd.dev`
2. Your project should appear on the homepage
3. Test the contact form
4. Check that you receive emails

---

## 🔧 Phase 6: Optional Enhancements

### 6.1 Google Analytics (Optional)

1. Create Google Analytics 4 property
2. Add tracking code to `src/app/layout.tsx`

### 6.2 Microsoft Clarity (Optional)

1. Create Clarity account
2. Add project ID to environment variables

### 6.3 reCAPTCHA (Optional)

1. Create reCAPTCHA v3 site
2. Add keys to environment variables

---

## Final Checklist

### Production Readiness

- [ ] Firebase project created and configured
- [ ] Firestore rules deployed
- [ ] Composite indexes created
- [ ] Admin user created in Firebase Auth
- [ ] Resend domain verified
- [ ] All environment variables set in Vercel
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Admin panel accessible
- [ ] First project created and visible
- [ ] Contact form tested and working
- [ ] Email delivery confirmed

### Performance & SEO

- [ ] Run Lighthouse audit (should be 95+ in all categories)
- [ ] Test mobile responsiveness
- [ ] Verify metadata and Open Graph tags
- [ ] Check loading times
- [ ] Test dark/light mode switching

### Security

- [ ] Firebase security rules active
- [ ] Environment variables secured
- [ ] Admin access restricted
- [ ] HTTPS enabled
- [ ] Contact form spam protection (if using reCAPTCHA)

---

## Troubleshooting

### Common Issues

**Build Fails in Vercel**
- Check environment variables are set correctly
- Ensure Firebase service account key is valid base64
- Verify all required variables are present

**Admin Login Doesn't Work**
- Check Firebase Auth is enabled
- Verify admin user exists in Firebase
- Ensure `ADMIN_EMAIL` matches Firebase user email

**Contact Form Doesn't Send Emails**
- Verify Resend domain is verified
- Check Resend API key is correct
- Ensure `RESEND_API_KEY` is set in Vercel

**Projects Don't Appear**
- Check Firestore rules allow reading published projects
- Verify projects have `published: true`
- Check Firestore indexes are created

---

## Congratulations!

Your production-grade portfolio is now live! You have:

- **Professional Portfolio Website** with modern design
- **Complete Admin Panel** for content management
- **Contact System** with email integration
- **SEO Optimization** for search visibility
- **Performance Optimization** for fast loading
- **Security** with proper authentication and rules
- **Scalability** with Firebase backend
- **Professional Hosting** on Vercel with custom domain

Your portfolio showcases your skills perfectly and provides a professional platform for attracting opportunities!