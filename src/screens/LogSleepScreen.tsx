import { useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import TimePickerModal from '../components/TimePickerModal';
import { useSleep } from '../context/SleepContext';
import { calculateDurationInHours, calculateSleepRating, formatTime } from '../utils/dateHelpers';

export default function LogSleepScreen() {
  const { addEntry, ratingSettings } = useSleep();
  const scrollViewRef = useRef<ScrollView>(null);

  const [bedtime, setBedtime] = useState(new Date(new Date().setHours(23, 0, 0, 0)));
  const [wakeTime, setWakeTime] = useState(new Date(new Date().setHours(7, 0, 0, 0)));
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [note, setNote] = useState('');

  const duration = calculateDurationInHours(bedtime, wakeTime);
  const rating = calculateSleepRating(duration, ratingSettings.minimumHours, ratingSettings.hoursPerAdditionalStar);

  const handleSave = async () => {
    await addEntry({
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      durationHours: duration,
      rating,
      note,
    });
    setNote('');
    Alert.alert('Logged!', 'Sleep entry recorded successfully.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    >
      <Text style={styles.title}>Log Your Sleep</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.timeBox} onPress={() => setShowBedtimePicker(true)}>
          <Text style={styles.label}>Bedtime</Text>
          <Text style={styles.timeValue}>{formatTime(bedtime.toISOString())}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeBox} onPress={() => setShowWakePicker(true)}>
          <Text style={styles.label}>Wake Time</Text>
          <Text style={styles.timeValue}>{formatTime(wakeTime.toISOString())}</Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={showBedtimePicker}
        title="Set Bedtime"
        initialDate={bedtime}
        onClose={() => setShowBedtimePicker(false)}
        onConfirm={(date) => setBedtime(date)}
      />

      <TimePickerModal
        visible={showWakePicker}
        title="Set Wake Time"
        initialDate={wakeTime}
        onClose={() => setShowWakePicker(false)}
        onConfirm={(date) => setWakeTime(date)}
      />

      <View style={styles.durationCard}>
        <Text style={styles.durationLabel}>Calculated Duration</Text>
        <Text style={styles.durationValue}>{duration} hrs</Text>
      </View>

      <Text style={styles.sectionTitle}>Sleep Quality</Text>
      <View style={styles.ratingCard}>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <View key={star} style={[styles.star, rating >= star && styles.starSelected]}>
              <Text style={[styles.starText, rating >= star && styles.starTextSelected]}>★</Text>
            </View>
          ))}
        </View>
        <Text style={styles.ratingHint}>{rating}/5 based on sleep duration</Text>
      </View>

      <Text style={styles.sectionTitle}>Notes (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Read a book before sleeping..."
        value={note}
        onChangeText={setNote}
        multiline
        onFocus={() => setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 250)}
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Log</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: { flex: 1 },
  container: { padding: 20, paddingBottom: 48, backgroundColor: '#f8fafc', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1e293b' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  timeBox: { flex: 0.48, backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  label: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  timeValue: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
  durationCard: { backgroundColor: '#e0e7ff', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  durationLabel: { color: '#3730a3', fontSize: 14, fontWeight: '500' },
  durationValue: { color: '#312e81', fontSize: 24, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 8 },
  ratingCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, marginBottom: 20 },
  ratingRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  star: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#fff' },
  starSelected: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  starText: { color: '#cbd5e1', fontSize: 22, fontWeight: '600' },
  starTextSelected: { color: '#ffffff' },
  ratingHint: { color: '#64748b', fontSize: 13, textAlign: 'center', marginTop: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, minHeight: 70, textAlignVertical: 'top', marginBottom: 20 },
  saveBtn: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
