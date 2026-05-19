// Helper: set cookie yang bisa dibaca proxy middleware
export function setAuthCookie(token: string) {
  // Set cookie dengan path=/ dan expires 7 hari
  // Cookie name 'pb_auth' sesuai yang dicek proxy.ts
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `pb_auth=${token}; path=/; expires=${expires}; SameSite=Lax`;
}

// Helper: hapus cookie
export function clearAuthCookie() {
  document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
