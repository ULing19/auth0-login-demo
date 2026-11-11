# Auth0 login demo

A minimal first login flow for MLH Global Hack Week. The app is a Vite single-page app that uses [@auth0/auth0-spa-js](https://github.com/auth0/auth0-spa-js) and Auth0 Universal Login.

Log in to open Universal Login. After Auth0 redirects back, the page shows your profile name, email, and picture. Log out to clear the session and return here.

## Create the Auth0 application

1. Open the [Auth0 Dashboard](https://manage.auth0.com/) for the tenant `dev-0aksjjqs5whor0ur.us.auth0.com`.
2. Go to **Applications → Applications → Create Application**.
3. Name the app (for example, `MLH Login Demo`) and choose **Single Page Application**.
4. Open the application's **Settings** tab.
5. Copy the **Domain** and **Client ID**. The domain should look like `dev-0aksjjqs5whor0ur.us.auth0.com`.
6. Set these URLs, then save:

| Setting | URL |
| --- | --- |
| Allowed Callback URLs | `http://localhost:5173` |
| Allowed Logout URLs | `http://localhost:5173` |
| Allowed Web Origins | `http://localhost:5173` |

The dev server in this repo listens on port **5173**. If you run the app on port **3000** instead, use `http://localhost:3000` for all three settings and start Vite with `npm run dev -- --port 3000`.

Allowed Callback URLs must match the address Auth0 returns to after login. Allowed Logout URLs must match the address Auth0 returns to after logout. Allowed Web Origins lets the SPA renew a session in the browser.

This sample uses the public SPA client id only. Do not put a client secret in the frontend.

## Configure the app

```bash
cp .env.example .env
```

Edit `.env`:

```bash
AUTH0_DOMAIN=dev-0aksjjqs5whor0ur.us.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
```

Replace `your-auth0-client-id` with the Client ID from the application settings. `.env` is gitignored. `.env.example` is the template and contains no real client id.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **Log in**, complete Universal Login, and confirm the profile. Use **Log out** to return to the signed-out page.

Other scripts:

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` writes the production bundle to `dist/`. Create `.env` before building or running the dev server. Vite reads `AUTH0_DOMAIN` and `AUTH0_CLIENT_ID` when it bundles the app. `npm run preview` serves that bundle on port 5173, which matches the Auth0 URL settings above.

The session is kept in the browser's local storage, so a refresh stays signed in until you log out or the token expires.
