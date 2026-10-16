import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { DEFAULT_RATING_SETTINGS, useSleep } from '../context/SleepContext';

const formatHours = (value: number) => Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(1))}`;

export default function SettingsScreen() {
  const { ratingSettings, updateRatingSettings } = useSleep();
  const [minimumHours, setMinimumHours] = useState(String(ratingSettings.minimumHours));
  const [stepHours, setStepHours] = useState(String(ratingSettings.hoursPerAdditionalStar));

  useEffect(() => {
    setMinimumHours(String(ratingSettings.minimumHours));
    setStepHours(String(ratingSettings.hoursPerAdditionalStar));
  }, [ratingSettings]);

  const parsedMinimum = Number(minimumHours);
  const parsedStep = Number(stepHours);
  const isValid = minimumHours.trim() !== '' && stepHours.trim() !== '' && Number.isFinite(parsedMinimum) && Number.isFinite(parsedStep)
    && parsedMinimum >= 0 && parsedMinimum <= 23 && parsedStep > 0 && parsedStep <= 23;

  const saveSettings = async () => {
    if (!isValid) {
      Alert.alert('Check your values', 'Enter a minimum between 0 and 23 hours, and a step greater than 0 and up to 23 hours.');
      return;
    }
    await updateRatingSettings({ minimumHours: parsedMinimum, hoursPerAdditionalStar: parsedStep });
    Alert.alert('Settings saved', 'Your sleep score will use these thresholds for new logs.');
  };

  const resetSettings = async () => {
    setMinimumHours(String(DEFAULT_RATING_SETTINGS.minimumHours));
    setStepHours(String(DEFAULT_RATING_SETTINGS.hoursPerAdditionalStar));
    await updateRatingSettings(DEFAULT_RATING_SETTINGS);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sleep Score</Text>
        <Text style={styles.intro}>Choose how sleep duration converts to stars. Scores range from 1 to 5 stars.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Hours needed for 1 star</Text>
          <Text style={styles.help}>Sleep shorter than this still receives 1 star.</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={minimumHours} onChangeText={setMinimumHours} keyboardType="decimal-pad" accessibilityLabel="Hours needed for 1 star" />
            <Text style={styles.unit}>hours</Text>
          </View>

          <Text style={[styles.label, styles.secondLabel]}>Extra hours for each additional star</Text>
          <Text style={styles.help}>This step is added to the previous star threshold.</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.input} value={stepHours} onChangeText={setStepHours} keyboardType="decimal-pad" accessibilityLabel="Extra hours for each additional star" />
            <Text style={styles.unit}>hours per star</Text>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>Your star thresholds</Text>
          {isValid ? (
            [1, 2, 3, 4, 5].map((star) => (
              <View key={star} style={styles.thresholdRow}>
                <Text style={styles.stars}>{'★'.repeat(star)}{'☆'.repeat(5 - star)}</Text>
                <Text style={styles.thresholdText}>{formatHours(parsedMinimum + (star - 1) * parsedStep)} hours or more</Text>
              </View>
            ))
          ) : (
            <Text style={styles.validation}>Enter valid values to see the thresholds.</Text>
          )}
        </View>

        <Text style={styles.note}>These settings apply to new sleep logs. Existing history scores stay as recorded.</Text>
        <View style={styles.actions}>
          <Text onPress={saveSettings} style={[styles.actionButton, !isValid && styles.disabledButton]} accessibilityRole="button">Save Settings</Text>
          <Text onPress={resetSettings} style={styles.resetButton} accessibilityRole="button">Reset to defaults</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 20, paddingBottom: 36, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#1e293b' },
  intro: { color: '#64748b', fontSize: 15, lineHeight: 22, marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { color: '#334155', fontSize: 15, fontWeight: '600' },
  help: { color: '#64748b', fontSize: 13, lineHeight: 18, marginTop: 4, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { minWidth: 92, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#0f172a', fontSize: 16 },
  unit: { color: '#475569', fontSize: 14 },
  secondLabel: { marginTop: 20 },
  exampleCard: { backgroundColor: '#eef2ff', borderRadius: 12, padding: 16, marginTop: 16 },
  exampleTitle: { fontSize: 15, fontWeight: '700', color: '#312e81', marginBottom: 10 },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 },
  stars: { color: '#f59e0b', fontSize: 16, minWidth: 96 },
  thresholdText: { color: '#334155', fontSize: 14 },
  validation: { color: '#b91c1c', fontSize: 13 },
  note: { color: '#64748b', fontSize: 13, lineHeight: 18, marginTop: 14 },
  actions: { alignItems: 'center', marginTop: 20, gap: 14 },
  actionButton: { overflow: 'hidden', textAlign: 'center', color: '#fff', backgroundColor: '#4f46e5', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 13, fontSize: 16, fontWeight: '600', width: '100%' },
  disabledButton: { opacity: 0.5 },
  resetButton: { color: '#4f46e5', fontSize: 14, fontWeight: '600', padding: 6 },
});
