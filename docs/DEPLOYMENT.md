# Deploying to Vercel

Use this checklist when GitHub is updated but production still looks old.

## 1. Confirm Vercel is building the right code

In [Vercel Dashboard](https://vercel.com) → your project → **Deployments**:

- Open the latest **Production** deployment.
- Check **Source** shows commit `bb8f437` or newer from `stormandjohnsonltd-dev/stormandjohnson` on branch **`main`**.
- If the commit is older, the deploy is not using your latest GitHub push.

**Fix:** Deployments → **Create Deployment** → select **`main`** → latest commit → deploy to **Production**.

Also check **Settings → Git**:

- Connected repository: `stormandjohnsonltd-dev/stormandjohnson`
- Production branch: **`main`**
- Root directory: **empty** (project root, not a subfolder)

## 2. Check the build succeeded

On the deployment page, **Building** must finish with **Ready** (green). If it failed, production keeps the previous version.

Click **View Build Logs** and fix any errors (missing env vars, TypeScript errors, etc.).

## 3. Promote the right deployment to Production

Manual redeploy from an **old** deployment only rebuilds that old commit.

- Use **Create Deployment** from latest `main`, or
- On the newest successful deployment → **⋯** → **Promote to Production**

## 4. Environment variables (required)

**Settings → Environment Variables** → add for **Production** (and Preview if needed).

Copy values from your local `.env.local`. Use the **new names** (not `NEXT_PUBLIC_*`):

| Variable | Notes |
|----------|--------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `SMTP_HOST` | e.g. `smtp.gmail.com` |
| `SMTP_PORT` | e.g. `587` |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail app password |
| `EMAIL_FROM` | Sender display name + email |
| `EMAIL_TO` | Inbox for form submissions |
| `SITE_URL` | **Your live URL**, e.g. `https://your-domain.vercel.app` |
| `WHATSAPP` | e.g. `2349041140745` |
| `FIREBASE_API_KEY` | From Firebase console |
| `FIREBASE_AUTH_DOMAIN` | From Firebase console |
| `FIREBASE_PROJECT_ID` | From Firebase console |
| `FIREBASE_STORAGE_BUCKET` | From Firebase console |
| `FIREBASE_MESSAGING_SENDER_ID` | From Firebase console |
| `FIREBASE_APP_ID` | From Firebase console |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **Entire** service account JSON as **one line** |

### Firebase on Vercel (important)

- `FIREBASE_SERVICE_ACCOUNT_PATH` **does not work** on Vercel (no local file).
- Use **`FIREBASE_SERVICE_ACCOUNT_JSON`** instead: paste the full JSON from `firebase-service-account.json` minified to a single line.
- After changing env vars, ** redeploy** (env changes do not apply until the next build).

### If you still have old variable names

Remove or replace these if present:

- `NEXT_PUBLIC_SITE_URL` → use **`SITE_URL`**
- `NEXT_PUBLIC_WHATSAPP` → use **`WHATSAPP`**
- `NEXT_PUBLIC_FIREBASE_*` → use **`FIREBASE_*`**

## 5. Clear browser cache

After a successful deploy:

- Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
- Or open the site in a **private/incognito** window

## 6. Verify the live site matches GitHub

Compare a visible change (e.g. mobile **Order on WhatsApp** on a product page, favicon, admin products layout).

If local works but production does not:

1. Deployment commit is latest on `main`
2. Build status is **Ready**
3. `SITE_URL` matches your Vercel URL
4. Env vars saved and **Redeploy** triggered after edits

## 7. MongoDB Atlas

Allow Vercel serverless IPs or use **Network Access → Allow access from anywhere** (`0.0.0.0/0`) so production can reach Atlas.

## Quick redeploy command (optional)

If Vercel CLI is installed and linked:

```bash
npx vercel --prod
```

Ensure you are logged in and the project is linked to the correct GitHub repo.
