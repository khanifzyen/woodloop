import PocketBase from "pocketbase";

let pb: PocketBase | null = null;

export const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";

export function getPB(): PocketBase {
  if (!pb) {
    pb = new PocketBase(PB_URL);
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

/**
 * Helper: build full PocketBase file URL using the SDK's built-in method.
 * Accepts any object with `id` and optional `collectionId` (PocketBase records
 * always include these at runtime).
 */
export function getFileUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any,
  filename: string,
): string {
  const pb = getPB();
  return pb.files!.getURL(record, filename);
}
