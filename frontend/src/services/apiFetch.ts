import { useAuth } from '../auth/useAuth';
const { getToken } = useAuth();

// Shared API fetch function that automatically includes the JWT token in the Authorization header
const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = await getToken();
  return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export default apiFetch;
