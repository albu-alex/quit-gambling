# Firebase Environment Setup

## Quick Start

1. **Edit `.env`** - Add your Firebase credentials from [Firebase Console](https://console.firebase.google.com):
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project"
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
   EXPO_PUBLIC_FIREBASE_APP_ID="1:123456789:ios:abc123"
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABC123"
   ```

2. **Run the app** - dotenvx will automatically load `.env`:
   ```bash
   npm run ios
   npm run android
   npm start
   ```

## Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** (⚙️ gear icon)
4. Go to the **General** tab
5. Copy each credential value into `.env`

## Files

- **`.env`** - Your Firebase credentials (in `.gitignore` - never committed)
- **`.env.keys`** - Generated automatically when you encrypt `.env` (in `.gitignore` - never committed)
- **`.env.example`** - Template for other developers

## Encryption (Optional)

To encrypt your `.env` file:

```bash
npx dotenvx encrypt
```

This creates `.env.keys` with your decryption key. Then:
- Commit only `.env.keys` to your repo
- Keep the decrypted `.env` locally (not in Git)

When running: `dotenvx run` automatically decrypts using `.env.keys`.

## Troubleshooting

**Firebase not initializing?**
- Check console: `🔍 Firebase env vars check:`
- Ensure all values in `.env` are filled (not "YOUR_...")
- Verify your API key is valid (Firebase gives `auth/invalid-api-key` error if wrong)

**"Cannot find module dotenvx?"**
```bash
npm install
```

**Still seeing encrypted values?**
- Delete `.env.keys` and re-run: `npx dotenvx encrypt`
- Or just fill in `.env` with unencrypted values

