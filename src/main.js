import { createAuth0Client } from '@auth0/auth0-spa-js';
import { auth0ClientId, auth0Domain } from './config.js';
import './style.css';

const statusEl = document.querySelector('#status');
const errorEl = document.querySelector('#error');
const loggedOutEl = document.querySelector('#logged-out');
const loggedInEl = document.querySelector('#logged-in');
const loginButton = document.querySelector('#login');
const logoutButton = document.querySelector('#logout');
const nameEl = document.querySelector('#name');
const emailEl = document.querySelector('#email');
const pictureEl = document.querySelector('#picture');

function show(element) {
  element.hidden = false;
}

function hide(element) {
  element.hidden = true;
}

function showError(message) {
  hide(statusEl);
  hide(loggedOutEl);
  hide(loggedInEl);
  errorEl.textContent = message;
  show(errorEl);
}

function showLoggedOut() {
  hide(statusEl);
  hide(errorEl);
  hide(loggedInEl);
  show(loggedOutEl);
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function showProfile(user) {
  const name = user?.name || 'Unknown user';
  const email = user?.email || 'No email on this profile';

  nameEl.textContent = name;
  emailEl.textContent = email;

  if (typeof user?.picture === 'string' && isHttpUrl(user.picture)) {
    pictureEl.src = user.picture;
    pictureEl.alt = `${name}'s profile picture`;
    show(pictureEl);
  } else {
    pictureEl.removeAttribute('src');
    pictureEl.alt = '';
    hide(pictureEl);
  }

  hide(statusEl);
  hide(errorEl);
  hide(loggedOutEl);
  show(loggedInEl);
}

async function start() {
  if (!auth0Domain || !auth0ClientId) {
    showError(
      'Missing AUTH0_DOMAIN or AUTH0_CLIENT_ID. Copy .env.example to .env and add your Auth0 application values.',
    );
    return;
  }

  const auth0 = await createAuth0Client({
    domain: auth0Domain,
    clientId: auth0ClientId,
    cacheLocation: 'localstorage',
    authorizationParams: {
      redirect_uri: window.location.origin,
      scope: 'openid profile email',
    },
  });

  const params = new URLSearchParams(window.location.search);

  if (params.has('error')) {
    const message = params.get('error_description') || params.get('error') || 'Login failed.';
    window.history.replaceState({}, document.title, window.location.pathname);
    showError(message);
    return;
  }

  if (params.has('code') && params.has('state')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  loginButton.addEventListener('click', () => {
    auth0.loginWithRedirect().catch((error) => {
      showError(error instanceof Error ? error.message : 'Could not start login.');
    });
  });

  logoutButton.addEventListener('click', () => {
    auth0
      .logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
      .catch((error) => {
        showError(error instanceof Error ? error.message : 'Could not log out.');
      });
  });

  if (await auth0.isAuthenticated()) {
    showProfile(await auth0.getUser());
    return;
  }

  showLoggedOut();
}

start().catch((error) => {
  showError(error instanceof Error ? error.message : 'Could not start Auth0.');
});
