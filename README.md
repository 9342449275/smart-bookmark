# BookmarkHub - Smart Bookmark Manager

A modern, real-time bookmark management application built with Next.js 14, Supabase, and Tailwind CSS. Users can securely sign in with Google OAuth and manage their personal bookmarks with instant synchronization across multiple devices and browser tabs.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure sign-in without email/password
- 📌 **Add Bookmarks** - Save URLs with custom titles
- 🔒 **Private & Secure** - Each user's bookmarks are completely private
- ⚡ **Real-time Sync** - Instant updates across all open tabs and devices
- 🗑️ **Delete Bookmarks** - Remove bookmarks with one click
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🚀 **Deployed on Vercel** - Fast and reliable hosting

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL Database)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime (WebSocket)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Cloud account for OAuth credentials

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd abstrait-dhana
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project: **Project Settings** → **API**

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Setup

### 1. Create the bookmarks table

Go to your Supabase project → **SQL Editor** and run:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Enable Realtime

1. Go to **Database** → **Replication**
2. Find the `bookmarks` table
3. Toggle **Enable** to turn on real-time replication

### 3. Configure Google OAuth

#### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted
6. Select **Web application**
7. Add **Authorized redirect URIs**:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/api/auth/callback` (for local development)
8. Copy the **Client ID** and **Client Secret**

#### In Supabase:

1. Go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste your **Client ID** and **Client Secret**
4. Save changes

## 🏗️ Project Structure

```
abstrait-dhana/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.js          # OAuth callback handler
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Main page (bookmarks UI)
│   └── globals.css                   # Global styles
├── lib/
│   └── supabase.js                   # Supabase client configuration
├── .env.local                        # Environment variables (not in git)
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🔧 How It Works

### Authentication Flow

1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects to `/api/auth/callback`
4. Callback route exchanges code for session
5. User is redirected to main page with active session

### Real-time Synchronization

- Uses Supabase Realtime with PostgreSQL change data capture (CDC)
- Listens for INSERT and DELETE events on the bookmarks table
- Automatically updates UI across all connected clients
- No polling required - true real-time updates via WebSocket

### Security

- **Row Level Security (RLS)** ensures users can only access their own bookmarks
- **Google OAuth** provides secure authentication without storing passwords
- **Environment variables** keep sensitive credentials secure

## 🐛 Problems Encountered & Solutions

### Problem 1: Real-time Updates Not Working

**Issue**: Bookmarks didn't appear in other tabs without refresh.

**Solution**: 
- Enabled Supabase Realtime replication for the bookmarks table
- Implemented proper WebSocket subscription with user_id filtering
- Added cleanup function to prevent memory leaks

### Problem 2: OAuth Redirect Loop

**Issue**: After Google sign-in, users were stuck in redirect loop.

**Solution**:
- Created `/api/auth/callback/route.js` with proper session exchange
- Used `@supabase/ssr` package for server-side auth
- Configured correct redirect URLs in both Google Cloud and Supabase

### Problem 3: "Unable to exchange external code" Error

**Issue**: OAuth callback failed with code exchange error.

**Solution**:
- Verified Google OAuth Client ID and Secret were correct
- Added proper authorized redirect URIs in Google Cloud Console
- Waited for Google's configuration propagation (5 minutes)
- Ensured Supabase URL matched the OAuth callback URL

### Problem 4: Environment Variables Not Loading

**Issue**: App crashed with "Invalid supabaseUrl" error.

**Solution**:
- Fixed `.env.local` to use actual Supabase project URL
- Extracted project reference from anon key to construct correct URL
- Restarted dev server to load new environment variables

### Problem 5: Row Level Security Blocking Access

**Issue**: Users couldn't see their own bookmarks.

**Solution**:
- Created proper RLS policies for SELECT, INSERT, and DELETE
- Used `auth.uid() = user_id` to match current user
- Ensured policies were enabled on the bookmarks table

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**
7. Update Google OAuth redirect URI with your Vercel URL

## 🎯 Future Enhancements

- 🏷️ Add tags/categories for bookmarks
- 🔍 Search and filter functionality
- 📊 Analytics dashboard
- 📤 Export bookmarks to JSON/CSV
- 🌙 Dark mode toggle
- ⭐ Favorite/star important bookmarks
- 📁 Folder organization
- 🔗 URL preview with metadata

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js and Supabase
