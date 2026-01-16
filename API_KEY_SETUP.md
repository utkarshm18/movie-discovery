# API Key Setup Guide

## Getting Your OMDb API Key

1. Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)

2. Choose the free plan (1,000 requests per day)

3. Enter your email address and submit the form

4. Check your email and click the activation link

5. Your API key will be displayed on the website

## Adding Your API Key to the Application

1. Open `src/environments/environment.ts`

2. Replace `YOUR_API_KEY_HERE` with your actual API key:

```typescript
export const environment = {
  production: false,
  omdbApiKey: 'your-actual-api-key-here', // <-- Replace this
  omdbApiUrl: 'https://www.omdbapi.com/'
};
```

3. Save the file

4. Restart the development server if it's running

## Important Notes

- ⚠️ **Never commit your API key to version control**
- The `.gitignore` file already excludes `environment.ts` from git tracking (if you add it)
- For production, use environment variables instead of hardcoding the key
- The free tier allows 1,000 requests per day

## Testing Your API Key

After adding your API key, you can test it by:

1. Starting the development server: `npm start`
2. Navigating to the home page
3. You should see movie categories loading

If you see errors, verify:
- The API key is correct
- The API key is activated
- You haven't exceeded the daily request limit

