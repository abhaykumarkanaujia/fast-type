"server-only";
import { cookies } from "next/headers";
import * as cookie from "cookie";
import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

const FIREBASE_ADMIN_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const SESSION_TOKEN_NAME = "fast-type-session-token";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_ADMIN_CONFIG),
  });
}

function getIdTokenPayload(payload: DecodedIdToken) {
  return {
    userId: payload.user_id,
    displayName: payload.name ?? "",
    photoURL: payload.picture ?? "",
    email: payload.email ?? "",
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_TOKEN_NAME);
  if (!sessionCookie) return null;

  const payload = await admin
    .auth()
    .verifySessionCookie(sessionCookie.value, true);
  return getIdTokenPayload(payload);
}

export async function saveSession(idToken: string) {
  const payload = await admin.auth().verifyIdToken(idToken);
  const maxAge = 60 * 60 * 24 * 1;
  const sessionCookie = await admin.auth().createSessionCookie(idToken, {
    expiresIn: maxAge * 1000,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_TOKEN_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
    sameSite: "lax",
  });

  return getIdTokenPayload(payload);
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_TOKEN_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(1970, 0, 1),
    path: "/",
    sameSite: "lax",
  });
}
