# Database Setup Instructions

## Fix for 403 Error and Profile Creation Issues

The 403 error and profile creation issues are caused by:
1. **Missing database schema**: The code expects a `users` table with specific fields
2. **Missing RLS policies**: Row Level Security policies are needed for authenticated users
3. **Table name mismatch**: Code was using `profiles` table but database has `users` table
4. **Schema mismatch**: Existing tables might have wrong column names

## Steps to Fix:

### 1. Run Database Fix Script (RECOMMENDED)

**If you're getting "column user_id does not exist" error:**

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/fix-database.sql`
4. Click **Run** to execute the script

This script will:
- Drop existing tables with wrong schema
- Recreate all tables with correct schema
- Add all required columns including `user_id`
- Set up RLS policies properly

### 2. Alternative: Run Original Setup Script

If you prefer to keep existing data:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/database-setup.sql`
4. Click **Run** to execute the script

### 3. Verify Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test the Application

After running the database setup:
1. Try signing up a new user
2. Try signing in with Google OAuth
3. Check if profile creation works
4. Verify profile updates work

## What the Fix Script Does:

1. **Drops existing tables** with wrong schema to avoid conflicts
2. **Creates `users` table** with all required fields:
   - Basic info (name, email, university, etc.)
   - Profile fields (avatar_url, phone, location, bio, etc.)
   - Social links (linkedin, github)
   - Skills array

3. **Creates all related tables** with correct `user_id` columns:
   - `applications` table
   - `resumes` table
   - `mock_interviews` table
   - `learning_progress` table
   - `user_skills` table
   - `notifications` table

4. **Enables Row Level Security (RLS)** on all tables

5. **Creates RLS policies** that allow:
   - Users to read/write their own data
   - Public read access to internships
   - Secure data access based on user authentication

6. **Creates indexes** for better performance

## Troubleshooting:

If you still get errors:
1. **"column user_id does not exist"**: Run the fix-database.sql script
2. **403 errors**: Check that RLS policies are created correctly
3. **Authentication issues**: Verify the user is authenticated
4. **Console errors**: Check browser console for specific error messages
5. **Supabase credentials**: Ensure credentials are correct

## Code Changes Made:

- ✅ Updated all code to use `users` table instead of `profiles`
- ✅ Added missing fields to database schema
- ✅ Added RLS policies for secure data access
- ✅ Fixed `updateUserProfile` function
- ✅ Updated signup and profile setup pages
- ✅ Created fix script for schema conflicts

## Important Notes:

- **The fix script will drop existing tables** - use only if you don't have important data
- **If you have existing data**, backup first or use the original setup script
- **After running the script**, test all authentication flows
- **Check the Supabase logs** for any remaining errors 