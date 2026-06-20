import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

interface Props {
  visible: boolean;
  onClose: () => void;
  onScanned: (data: string) => void;
}

const GREEN = '#1D9E75';

export default function BarcodeScannerModal({ visible, onClose, onScanned }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false); // evita múltiplas leituras do mesmo código
  const [requesting, setRequesting] = useState(false);

  // pede permissão automaticamente ao abrir, se ainda não decidida
  React.useEffect(() => {
    if (!visible) return;

    setLocked(false); // reseta o lock cada vez que o modal abre

    if (!permission?.granted && permission?.canAskAgain !== false) {
      setRequesting(true);
      requestPermission().finally(() => setRequesting(false));
    }
  }, [visible]);

  const handleScan = (result: BarcodeScanningResult) => {
    if (locked) return;
    setLocked(true); // trava novas leituras até o modal fechar e reabrir
    onScanned(result.data);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>

        {!permission?.granted ? (
          <View style={styles.centered}>
            <Text style={styles.permissionText}>
              {requesting
                ? 'Solicitando permissão de câmera...'
                : permission?.canAskAgain === false
                ? 'Permissão de câmera negada. Habilite nas configurações do app.'
                : 'Câmera sem permissão de acesso.'}
            </Text>
          </View>
        ) : (
          <>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={locked ? undefined : handleScan}
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
              }}
            />

            {/* Moldura visual de leitura */}
            <View style={styles.overlay}>
              <View style={styles.frame} />
              <Text style={styles.hint}>Aponte a câmera para o código de barras</Text>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Cancelar</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  permissionText: { color: '#fff', fontSize: 14, textAlign: 'center' },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 260,
    height: 140,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  hint: {
    color: '#fff',
    fontSize: 13,
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  closeBtn: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  closeBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
