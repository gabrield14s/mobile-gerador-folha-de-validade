import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useProducts } from '../context/ProductsContext';
import { formatDate, isExpired, isExpiringSoon } from '../utils/dateHelpers';
import { Product } from '../models/Product';

// ─── Helpers de status ────────────────────────────────────────────────────────

const getStatus = (expiryDate: string) => {
  if (isExpired(expiryDate)) return { label: 'Vencido', color: '#A32D2D', bg: '#FCEBEB', icon: '✕' };
  if (isExpiringSoon(expiryDate)) return { label: 'Vence em breve', color: '#633806', bg: '#FAEEDA', icon: '⚠' };
  return { label: 'Ok', color: '#0F6E56', bg: '#E1F5EE', icon: '✓' };
};

// ─── Card individual ──────────────────────────────────────────────────────────

const ProductCard = ({ item }: { item: Product }) => {
  const status = getStatus(item.expiryDate);

  return (
    <View style={styles.card}>
      {/* Ícone de status (placeholder visual) */}
      <View style={[styles.iconContainer, { backgroundColor: status.bg }]}>
        <Text style={[styles.iconText, { color: status.color }]}>{status.icon}</Text>
      </View>

      {/* Informações do produto */}
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.barcode}>#{item.barcode}</Text>

        <View style={styles.row}>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
          <Text style={styles.expiryDate}>{formatDate(item.expiryDate)}</Text>
        </View>
      </View>

      {/* Quantidade */}
      <View style={styles.qtyContainer}>
        <Text style={styles.qtyNumber}>{item.quantity}</Text>
        <Text style={styles.qtyLabel}>un.</Text>
      </View>
    </View>
  );
};

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function ListaScreen() {
  const { products } = useProducts();

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de produtos</Text>
        <Text style={styles.headerSub}>{products.length} {products.length === 1 ? 'item' : 'itens'} adicionados</Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Nenhum produto ainda</Text>
          <Text style={styles.emptySub}>Adicione produtos na tela de início</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ProductCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const GREEN = '#1D9E75';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  headerSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  list: { padding: 12, gap: 10 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // Ícone de status
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 24, fontWeight: '700' },

  // Info
  info: { flex: 1, gap: 4 },
  productName: { fontSize: 14, fontWeight: '600', color: '#111827', lineHeight: 20 },
  barcode: { fontSize: 11, color: '#9CA3AF' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },

  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  expiryDate: { fontSize: 11, color: '#6B7280' },

  // Quantidade
  qtyContainer: { alignItems: 'center', minWidth: 36 },
  qtyNumber: { fontSize: 20, fontWeight: '700', color: GREEN },
  qtyLabel: { fontSize: 11, color: '#9CA3AF' },

  // Empty
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySub: { fontSize: 13, color: '#9CA3AF' },
});
