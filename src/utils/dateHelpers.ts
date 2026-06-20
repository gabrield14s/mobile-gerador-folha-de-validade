export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

export const isExpiringSoon = (dateStr: string): boolean => {
  const today = new Date();
  const expiry = new Date(dateStr);
  const diffDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30 && diffDays >= 0;
};

export const isExpired = (dateStr: string): boolean => {
  return new Date(dateStr) < new Date();
};

// Máscara: digita 01012025 → exibe 01/01/2025
export const applyDateMask = (text: string): string => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length > 4) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// Converte DD/MM/AAAA → YYYY-MM-DD. Retorna null se inválido.
export const parseDisplayDateToISO = (dateStr: string): string | null => {
  const digits = dateStr.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
};
