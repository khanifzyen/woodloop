// Helper: set cookie yang bisa dibaca proxy middleware
export function setAuthCookie(token: string, role: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

  // Cookie 1: token auth (buat client PocketBase)
  document.cookie = `pb_auth=${token}; path=/; expires=${expires}; SameSite=Lax`;
  // Cookie 2: role user (buat proxy middleware — JWT gak contain role)
  document.cookie = `pb_role=${role}; path=/; expires=${expires}; SameSite=Lax`;
}

// Helper: hapus semua cookie auth
export function clearAuthCookie() {
  document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "pb_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
