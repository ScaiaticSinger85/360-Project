const API_BASE_URL = 'http://localhost:4000';
const CURRENT_USER_KEY = 'currentUser';

type StoredUser = {
  id: string;
  email?: string;
};

function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function getApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function getAuthHeaders() {
  const user = getStoredUser();

  if (!user) {
    return {};
  }

  const headers: Record<string, string> = {};

  if (user.id) {
    headers['x-user-id'] = user.id;
  }

  if (user.email) {
    headers['x-user-email'] = user.email;
  }

  return headers;
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: T | { message?: string; success?: boolean };

  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(text.startsWith('<!DOCTYPE') ? 'The backend returned HTML instead of JSON.' : 'Unexpected server response.');
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Request failed.';
    throw new Error(message);
  }

  return data as T;
}

export { API_BASE_URL };
