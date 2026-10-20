// URLs y claves PÚBLICAS. Nunca pongas aquí la API key de la IA (vive en el Worker).
// Marcadores pendientes: ver PENDIENTES.md.
export const CONFIG = {
  supabaseUrl: '[SUPABASE_URL]',
  supabaseAnonKey: '[SUPABASE_ANON_KEY]',
  workerUrl: '[WORKER_URL]'
};

export const esPendiente = (valor) => typeof valor !== 'string' || !/^https?:\/\//.test(valor);
