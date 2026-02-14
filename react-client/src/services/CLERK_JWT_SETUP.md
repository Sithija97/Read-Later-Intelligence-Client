# Clerk JWT Token Configuration Guide

## Understanding Your Token

The token you're seeing is **correct**! Clerk's default session token only includes minimal claims for security reasons:
- `sub` - User ID (this is what you need for authentication)
- `iss` - Issuer
- `exp` - Expiration
- `iat` - Issued at
- Session information

This is the **standard approach** and is sufficient for authentication. Your backend can use the `sub` claim to identify the user and fetch their details if needed.

## Option 1: Access User Data in Frontend (Recommended)

Use Clerk's `useUser()` hook to get user data in your React components:

```tsx
import { useCurrentUser } from "@/hooks/useCurrentUser";

function MyComponent() {
  const { email, username, firstName, lastName, user } = useCurrentUser();

  return (
    <div>
      <p>Email: {email}</p>
      <p>Username: {username}</p>
      {/* Access full user object if needed */}
    </div>
  );
}
```

## Option 2: Include User Data in JWT Token

If you need user data (email, username, etc.) directly in the JWT token, create a custom JWT template in Clerk:

### Step 1: Create JWT Template in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **JWT Templates** (under "Session Management")
4. Click **"New Template"** → **"Blank"**
5. Name it (e.g., `user_info`)

### Step 2: Configure Claims

Add the user data you want in the template:

```json
{
  "email": "{{user.primary_email_address}}",
  "username": "{{user.username}}",
  "first_name": "{{user.first_name}}",
  "last_name": "{{user.last_name}}",
  "full_name": "{{user.full_name}}"
}
```

### Step 3: Use Custom Template in Your App

Update your API client to use the custom template:

```tsx
// In your component
const api = useApiClient({ template: 'user_info' });

// Or directly in useApiClient hook
const token = await getToken({ template: 'user_info' });
```

### Step 4: Update useApiClient Hook

The hook has been updated to support custom templates:

```tsx
// Default (minimal token)
const api = useApiClient();

// Custom template (includes user data)
const api = useApiClient({ template: 'user_info' });
```

## Which Approach Should You Use?

### Use Frontend Hook (Option 1) if:
- ✅ You only need user data in the frontend
- ✅ You want smaller, faster tokens
- ✅ Your backend can fetch user data when needed
- ✅ You want better security (less data in token)

### Use Custom JWT Template (Option 2) if:
- ✅ Your backend needs user data without extra API calls
- ✅ You want all user data available in the token
- ✅ You're building a microservices architecture
- ✅ You want to reduce backend-to-Clerk API calls

## Current Setup

Your current setup uses the **default session token**, which is perfect for authentication. The `sub` claim contains the user ID (`user_37EMT4pmf0oInUnqMQiQWn1026J` in your case), which your backend can use to:
1. Authenticate the request
2. Fetch user details from Clerk if needed
3. Associate data with the correct user

This is the **recommended approach** for most applications!

