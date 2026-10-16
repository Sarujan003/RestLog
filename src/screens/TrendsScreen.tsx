import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSleep } from '../context/SleepContext';
import { formatDate } from '../utils/dateHelpers';

const screenWidth = Dimensions.get('window').width;

export default function TrendsScreen() {
  const { entries } = useSleep();

  // Pick up to the last 7 entries (chronological order)
  const recentEntries = [...entries].reverse().slice(-7);

  const averageScore =
    entries.length > 0
      ? (entries.reduce((acc, curr) => acc + curr.rating, 0) / entries.length).toFixed(1)
      : '0.0';

  const averageHours =
    entries.length > 0
      ? (entries.reduce((acc, curr) => acc + curr.durationHours, 0) / entries.length).toFixed(1)
      : '0.0';

  const chartData = {
    labels: recentEntries.length > 0 ? recentEntries.map((e) => formatDate(e.createdAt)) : ['No Data'],
    datasets: [
      {
        data: recentEntries.length > 0 ? recentEntries.map((e) => e.durationHours) : [0],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weekly Trends & Insights</Text>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Avg Sleep Score</Text>
          <Text style={styles.kpiValue}>★ {averageScore} / 5</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiLabel}>Avg Sleep Hours</Text>
          <Text style={styles.kpiValue}>{averageHours} hrs</Text>
        </View>
      </View>

      {/* Sleep Duration Bar Chart */}
      <Text style={styles.chartTitle}>Recent Sleep Hours</Text>
      <View style={styles.chartWrapper}>
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="h"
          fromZero
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
            style: { borderRadius: 12 },
          }}
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8fafc', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1e293b' },
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  kpiBox: { flex: 0.48, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  kpiLabel: { color: '#64748b', fontSize: 13, marginBottom: 4 },
  kpiValue: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 12 },
  chartWrapper: { backgroundColor: '#fff', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  chart: { borderRadius: 8 },
});