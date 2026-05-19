import PocketBase from "pocketbase";

let pb: PocketBase | null = null;

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";

export function getPB(): PocketBase {
  if (!pb) {
    pb = new PocketBase(PB_URL);

    // Load auth dari cookie (SSR compatibility)
    if (typeof window === "undefined") {
      // Server-side: auth dari cookie di-handle oleh middleware
    } else {
      // Client-side: auto load dari localStorage (PocketBase SDK built-in)
    }
  }
  return pb;
}

/** Helper: dapatkan PocketBase client yang sudah terautentikasi */
export function getAuthenticatedPB(token?: string): PocketBase {
  const client = getPB();
  if (token) {
    client.authStore.save(token, null);
  }
  return client;
}
