// authApi/tokenManager.js
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const EXPIRES_AT_KEY = "authExpiresAt";
const USER_ID_KEY = "UserId";
const USER_OBJ_KEY = "user";

let logoutTimerId = null;

export const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

export const setToken = (token, expiresAtMs) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  if (expiresAtMs) {
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAtMs));
  }
  scheduleLogoutCheck();
};

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || null;

export const getExpiry = () =>
  Number(localStorage.getItem(EXPIRES_AT_KEY) || 0);

export const isExpired = () => getExpiry() <= Date.now();

export const clearToken = () => {
  try {
    localStorage.removeItem("token"); 
    localStorage.removeItem(ACCESS_TOKEN_KEY); 
    localStorage.removeItem(EXPIRES_AT_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_OBJ_KEY);

    Cookies.remove(USER_ID_KEY);
  } finally {
    if (logoutTimerId) {
      clearTimeout(logoutTimerId);
      logoutTimerId = null;
    }
  }
};

export const scheduleLogoutCheck = () => {
  if (logoutTimerId) clearTimeout(logoutTimerId);

  const expiresAt = getExpiry();
  const msLeft = expiresAt - Date.now();

  if (!expiresAt || msLeft <= 0) {
    clearToken();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    return;
  }

  logoutTimerId = setTimeout(() => {
    clearToken();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, msLeft);
};

export const initAuthWatchdog = () => {
  scheduleLogoutCheck();

  window.addEventListener("visibilitychange", () => {
    if (!document.hidden) scheduleLogoutCheck();
  });

  window.addEventListener("storage", (e) => {
    if ([ACCESS_TOKEN_KEY, EXPIRES_AT_KEY].includes(e.key)) {
      scheduleLogoutCheck();
    }
  });
};
