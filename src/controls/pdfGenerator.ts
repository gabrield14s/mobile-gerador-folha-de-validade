import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Product } from '../models/Product';
import { formatDate, isExpired, isExpiringSoon } from '../utils/dateHelpers';

const getStatusLabel = (expiryDate: string): string => {
  if (isExpired(expiryDate)) return 'Vencido';
  if (isExpiringSoon(expiryDate)) return 'Vence em breve';
  return 'OK';
};

const getStatusColor = (expiryDate: string): string => {
  if (isExpired(expiryDate)) return '#A32D2D';
  if (isExpiringSoon(expiryDate)) return '#633806';
  return '#0F6E56';
};

const buildHTML = (products: Product[]): string => {
  const rows = products.map((p, i) => `
    <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
      <td>${p.barcode}</td>
      <td>${p.description}</td>
      <td>${formatDate(p.expiryDate)}</td>
      <td style="text-align:center">${p.quantity}</td>
      <td style="color:${getStatusColor(p.expiryDate)};font-weight:600">${getStatusLabel(p.expiryDate)}</td>
    </tr>
  `).join('');

  return `
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 4px; }
        .meta { font-size: 11px; color: #6b7280; text-align: center; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #1D9E75; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 7px 10px; border-bottom: 0.5px solid #e5e7eb; }
        .total { margin-top: 12px; font-size: 11px; color: #6b7280; text-align: right; }
      </style>
    </head>
    <body>
      <h1>Folha de Validades</h1>
      <p class="meta">Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
      <table>
        <thead>
          <tr>
            <th>Cód. barras</th>
            <th>Descrição</th>
            <th>Validade</th>
            <th style="text-align:center">Qtd</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="total">${products.length} produto(s) listado(s)</p>
    </body>
    </html>
  `;
};

export const gerarPDF = async (products: Product[]): Promise<void> => {
  if (products.length === 0) return;

  const html = buildHTML(products);
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Exportar folha de validades' });
};
