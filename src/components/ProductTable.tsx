import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Product } from '../models/Product';
import { formatDate, isExpired, isExpiringSoon } from '../utils/dateHelpers';

interface Props {
  products: Product[];
  onRemove: (id: string) => void;
}

const GREEN = '#1D9E75';
const GREEN_LIGHT = '#E1F5EE';
const GREEN_DARK = '#0F6E56';

const ExpiryBadge = ({ dateStr }: { dateStr: string }) => {
  if (isExpired(dateStr)) {
    return <View style={[styles.badge, styles.badgeDanger]}><Text style={styles.badgeDangerText}>Vencido</Text></View>;
  }
  if (isExpiringSoon(dateStr)) {
    return <View style={[styles.badge, styles.badgeWarn]}><Text style={styles.badgeWarnText}>Vence logo</Text></View>;
  }
  return <View style={[styles.badge, styles.badgeOk]}><Text style={styles.badgeOkText}>{formatDate(dateStr)}</Text></View>;
};

const ProductRow = ({
  item,
  index,
  onRemove,
}: {
  item: Product;
  index: number;
  onRemove: (id: string) => void;
}) => (
  <View style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
    <Text style={[styles.tableCell, styles.cellBarcode]} numberOfLines={1}>{item.barcode}</Text>
    <Text style={[styles.tableCell, styles.cellDesc]} numberOfLines={1}>{item.description}</Text>
    <View style={styles.cellExpiry}><ExpiryBadge dateStr={item.expiryDate} /></View>
    <Text style={[styles.tableCell, styles.cellQty]}>{item.quantity}</Text>
    <TouchableOpacity style={styles.cellAction} onPress={() => onRemove(item.id)}>
      <Text style={styles.removeBtn}>✕</Text>
    </TouchableOpacity>
  </View>
);

export default function ProductTable({ products, onRemove }: Props) {
  if (products.length === 0) {
    return <Text style={styles.emptyText}>Nenhum produto adicionado ainda.</Text>;
  }

  return (
    <>
      {/* Cabeçalho */}
      <View style={[styles.tableRow, styles.tableHead]}>
        <Text style={[styles.tableHeadCell, styles.cellBarcode]}>Cód. barras</Text>
        <Text style={[styles.tableHeadCell, styles.cellDesc]}>Descrição</Text>
        <Text style={[styles.tableHeadCell, { width: 82 }]}>Validade</Text>
        <Text style={[styles.tableHeadCell, styles.cellQty]}>Qtd</Text>
        <View style={styles.cellAction} />
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <ProductRow item={item} index={index} onRemove={onRemove} />
        )}
        scrollEnabled={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tableHead: { backgroundColor: '#F3F4F6' },
  tableHeadCell: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  tableRowEven: { backgroundColor: '#FAFAFA' },
  tableCell: { fontSize: 12, color: '#374151', paddingVertical: 9, paddingHorizontal: 6 },

  cellBarcode: { width: 110 },
  cellDesc: { flex: 1 },
  cellExpiry: { width: 82, alignItems: 'center', justifyContent: 'center' },
  cellQty: { width: 32, textAlign: 'center' },
  cellAction: { width: 32, alignItems: 'center' },

  removeBtn: { fontSize: 13, color: '#9CA3AF' },

  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  badgeOk: { backgroundColor: GREEN_LIGHT },
  badgeOkText: { fontSize: 10, fontWeight: '600', color: GREEN_DARK },
  badgeWarn: { backgroundColor: '#FAEEDA' },
  badgeWarnText: { fontSize: 10, fontWeight: '600', color: '#633806' },
  badgeDanger: { backgroundColor: '#FCEBEB' },
  badgeDangerText: { fontSize: 10, fontWeight: '600', color: '#A32D2D' },

  emptyText: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingVertical: 24 },
});
