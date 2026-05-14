# Quickstart: QA Feed Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and set your Neon Database URL.
   ```env
   DATABASE_URL="postgres://user:password@hostname.neon.tech/dbname?sslmode=require"
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
4. Navigate to `http://localhost:3000` to view the RTL QA Feed.
