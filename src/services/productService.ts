const BASE_URL = 'https://world.openfoodfacts.org/api/v0/product';

export const fetchProductName = async (barcode: string): Promise<string | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${barcode}.json`);
    const data = await res.json();

    if (data.status !== 1) return null; // produto não encontrado

    const { product_name, product_name_pt, brands, quantity } = data.product;

    // prioriza nome em PT, cai pro nome genérico, concatena marca e quantidade se existirem
    const name = product_name_pt || product_name || null;
    if (!name) return null;

    const suffix = [brands, quantity].filter(Boolean).join(' ');
    return suffix ? `${name} ${suffix}` : name;
  } catch {
    return null; // sem internet ou erro inesperado — usuário preenche manualmente
  }
};
