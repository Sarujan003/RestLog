import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimePickerModalProps {
  visible: boolean;
  initialDate: Date;
  title: string;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export default function TimePickerModal({
  visible,
  initialDate,
  title,
  onClose,
  onConfirm,
}: TimePickerModalProps) {
  const [selectedHours, setSelectedHours] = useState(initialDate.getHours());
  const [selectedMinutes, setSelectedMinutes] = useState(initialDate.getMinutes());

  const adjustHours = (delta: number) => {
    setSelectedHours((prev) => (prev + delta + 24) % 24);
  };

  const adjustMinutes = (delta: number) => {
    // Round and step by 15 mins for convenience
    setSelectedMinutes((prev) => (prev + delta + 60) % 60);
  };

  const handleSave = () => {
    const newDate = new Date(initialDate);
    newDate.setHours(selectedHours, selectedMinutes, 0, 0);
    onConfirm(newDate);
    onClose();
  };

  const formatDisplay = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMinute = m < 10 ? `0${m}` : m;
    return `${displayHour}:${displayMinute} ${period}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={styles.pickerRow}>
            {/* Hour controls */}
            <View style={styles.column}>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustHours(1)}>
                <Text style={styles.arrowText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.digitText}>
                {selectedHours % 12 === 0 ? 12 : selectedHours % 12}
              </Text>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustHours(-1)}>
                <Text style={styles.arrowText}>▼</Text>
              </TouchableOpacity>
              <Text style={styles.subLabel}>Hours</Text>
            </View>

            <Text style={styles.separator}>:</Text>

            {/* Minute controls */}
            <View style={styles.column}>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustMinutes(15)}>
                <Text style={styles.arrowText}>▲</Text>
              </TouchableOpacity>
              <Text style={styles.digitText}>
                {selectedMinutes < 10 ? `0${selectedMinutes}` : selectedMinutes}
              </Text>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => adjustMinutes(-15)}>
                <Text style={styles.arrowText}>▼</Text>
              </TouchableOpacity>
              <Text style={styles.subLabel}>Minutes</Text>
            </View>

            {/* AM/PM toggle */}
            <View style={styles.column}>
              <TouchableOpacity
                style={[styles.ampmBtn, selectedHours < 12 && styles.ampmActive]}
                onPress={() => setSelectedHours((prev) => (prev >= 12 ? prev - 12 : prev))}
              >
                <Text style={[styles.ampmText, selectedHours < 12 && styles.ampmTextActive]}>
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ampmBtn, selectedHours >= 12 && styles.ampmActive]}
                onPress={() => setSelectedHours((prev) => (prev < 12 ? prev + 12 : prev))}
              >
                <Text style={[styles.ampmText, selectedHours >= 12 && styles.ampmTextActive]}>
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.previewText}>
            Selected: {formatDisplay(selectedHours, selectedMinutes)}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '85%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 20 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  column: { alignItems: 'center', marginHorizontal: 10 },
  arrowBtn: { padding: 8 },
  arrowText: { fontSize: 18, color: '#6366f1', fontWeight: 'bold' },
  digitText: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginVertical: 4 },
  subLabel: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  separator: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', paddingBottom: 25 },
  ampmBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginVertical: 4, backgroundColor: '#f1f5f9' },
  ampmActive: { backgroundColor: '#6366f1' },
  ampmText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  ampmTextActive: { color: '#ffffff' },
  previewText: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  cancelBtn: { flex: 0.45, padding: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#f1f5f9' },
  cancelBtnText: { color: '#64748b', fontWeight: '600' },
  confirmBtn: { flex: 0.45, padding: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#4f46e5' },
  confirmBtnText: { color: '#ffffff', fontWeight: '600' },
});
