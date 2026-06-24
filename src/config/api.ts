// Configuração da API
export const API_URL = '/api';

// Helper para fazer requisições autenticadas
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('educart_token');
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only add Content-Type if not already present and not FormData
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Prepend API_URL if the url doesn't start with http or API_URL already
  const fullUrl = (url.startsWith('http') || url.startsWith(API_URL)) ? url : `${API_URL}${url}`;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
};

// Helper para upload de arquivos
export const uploadFile = async (file: File) => {
  const token = localStorage.getItem('educart_token');
  
  const formData = new FormData();
  formData.append('file', file);

  return fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
};