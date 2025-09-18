// Constantes do sistema
export const STORAGE_KEYS = {
  USER: 'user',
  PRODUCTS: 'products',
  CART: 'cart',
  REGISTERED_USERS: 'registeredUsers',
  SITE_SETTINGS: 'siteSettings'
} as const;

export const ADMIN_CREDENTIALS = {
  email: 'admin@lavibaby.com',
  password: 'admin123'
} as const;

export const CATEGORIES = [
  { id: 'meninas', name: 'Meninas', emoji: '👧' },
  { id: 'meninos', name: 'Meninos', emoji: '👦' },
  { id: 'bebes', name: 'Bebês', emoji: '👶' },
  { id: 'acessorios', name: 'Acessórios', emoji: '🎀' }
] as const;

export const PRODUCT_SIZES = {
  bebes: ['RN', 'P', 'M', 'G'],
  meninas: ['2', '4', '6', '8', '10', '12'],
  meninos: ['2', '4', '6', '8', '10', '12'],
  acessorios: ['Único']
} as const;

export const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;
