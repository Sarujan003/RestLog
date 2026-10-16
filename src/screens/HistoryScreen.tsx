import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSleep } from '../context/SleepContext';
import { formatDate, formatTime } from '../utils/dateHelpers';

export default function HistoryScreen() {
  const { entries, deleteEntry } = useSleep();

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to remove this log?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep History</Text>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No sleep logs yet. Add your first entry!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.timeSpan}>
                {formatTime(item.bedtime)} ➔ {formatTime(item.wakeTime)}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.duration}>{item.durationHours} hrs</Text>
                <Text style={styles.rating}>Score: {'★'.repeat(item.rating)} ({item.rating}/5)</Text>
              </View>
              {item.note ? <Text style={styles.note}>"{item.note}"</Text> : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 15, color: '#1e293b' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dateText: { fontWeight: '700', color: '#334155', fontSize: 15 },
  deleteText: { color: '#ef4444', fontWeight: '600' },
  timeSpan: { color: '#64748b', fontSize: 13, marginBottom: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  duration: { fontSize: 16, fontWeight: '700', color: '#4f46e5' },
  rating: { fontSize: 14, color: '#f59e0b', fontWeight: '500' },
  note: { marginTop: 8, fontStyle: 'italic', color: '#475569', fontSize: 13 },
});