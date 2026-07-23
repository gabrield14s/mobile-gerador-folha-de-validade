import React, { useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductTable from '../components/ProductTable';
import { Product } from '../models/Product';
import BarcodeScannerModal from '../screens/BarcodeScannerModal';
import { applyDateMask, parseDisplayDateToISO } from '../utils/dateHelpers';
import { gerarPDF } from '../controls/pdfGenerator';
import { fetchProductName } from '../services/productService';
import { useProducts } from '../context/ProductsContext';

const GREEN = '#1D9E75';

export default function HomeScreen() {
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const { products, addProduct, removeProduct, clearProducts } = useProducts();
  const [scannerVisible, setScannerVisible] = useState(false);

  const descRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const qtyRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (!barcode.trim() || !description.trim() || !expiryDate.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha código de barras, descrição e validade.');
      return;
    }

    const isoDate = parseDisplayDateToISO(expiryDate);
    if (!isoDate) {
      Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA.');
      return;
    }

    addProduct({
      barcode: barcode.trim(),
      description: description.trim(),
      expiryDate: isoDate,
      quantity: parseInt(quantity) || 1,
    });

    setBarcode('');
    setDescription('');
    setExpiryDate('');
    setQuantity('');
  };

  const handleRemove = (id: string) => {
    Alert.alert('Remover produto', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeProduct },
    ]);
  };

  const handleClear = () => {
    if (products.length === 0) return;
    Alert.alert('Limpar tudo', 'Remover todos os produtos?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: () => clearProducts },
    ]);
  };

  // único ponto de entrada após leitura do barcode:
  // preenche código → fecha modal → busca nome na API → preenche descrição → foca próximo campo
  const handleScanned = async (code: string) => {
    setBarcode(code);
    setScannerVisible(false);
    const name = await fetchProductName(code);
    if (name) setDescription(name);
    descRef.current?.focus();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>📋</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Folha de validades</Text>
          <Text style={styles.headerSub}>Adicione os produtos da sessão</Text>
        </View>
      </View>

      {/* Formulário */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>PRODUTO</Text>

        <Text style={styles.fieldLabel}>Código de barras</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={barcode}
            onChangeText={setBarcode}
            placeholder="0000000000000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => descRef.current?.focus()}
          />
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => setScannerVisible(true)}
          >
            <Text style={styles.scanBtnIcon}>▦</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>Descrição do produto</Text>
        <TextInput
          ref={descRef}
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Leite integral 1L"
          placeholderTextColor="#9CA3AF"
          returnKeyType="next"
          onSubmitEditing={() => expiryRef.current?.focus()}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.fieldLabel}>Data de validade</Text>
            <TextInput
              ref={expiryRef}
              style={styles.input}
              value={expiryDate}
              onChangeText={text => setExpiryDate(applyDateMask(text))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => qtyRef.current?.focus()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>Quantidade</Text>
            <TextInput
              ref={qtyRef}
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Adicionar produto</Text>
        </TouchableOpacity>
      </View>

      {/* Preview da tabela */}
      <View style={styles.previewHeader}>
        <Text style={styles.sectionLabel}>PRODUTOS ADICIONADOS</Text>
        <Text style={styles.countLabel}>{products.length} {products.length === 1 ? 'item' : 'itens'}</Text>
      </View>

      <View style={styles.card}>
        <ProductTable products={products} onRemove={handleRemove} />
      </View>

      {/* Rodapé */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.pdfBtn]}
          onPress={() => gerarPDF(products)}
        >
          <Text style={styles.pdfBtnText}>Gerar PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.clearBtn]} onPress={handleClear}>
          <Text style={styles.clearBtnText}>Limpar tudo</Text>
        </TouchableOpacity>
      </View>

      {/* Modal único de scanner */}
      <BarcodeScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanned={handleScanned}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { paddingBottom: 40 },

  header: {
    marginTop: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: { fontSize: 18 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#111827' },
  headerSub: { fontSize: 12, color: '#6B7280', marginTop: 1 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  fieldLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4, marginTop: 10 },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#111827',
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  scanBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBtnIcon: { fontSize: 20, color: GREEN },
  addBtn: {
    marginTop: 16,
    height: 42,
    borderRadius: 8,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 20,
    marginBottom: 4,
  },
  countLabel: { fontSize: 12, color: GREEN, fontWeight: '600' },

  bottomBar: { flexDirection: 'row', marginHorizontal: 12, marginTop: 12, gap: 10 },
  actionBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pdfBtn: { backgroundColor: GREEN },
  pdfBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  clearBtn: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#E5E7EB' },
  clearBtnText: { color: '#6B7280', fontSize: 13 },
});
