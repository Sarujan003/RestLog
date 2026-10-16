import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { SleepProvider } from './src/context/SleepContext';
import HistoryScreen from './src/screens/HistoryScreen';
import LogSleepScreen from './src/screens/LogSleepScreen';
import TrendsScreen from './src/screens/TrendsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SleepProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: '#4f46e5',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarIcon: ({ color }) => {
              let icon = '📝';
              if (route.name === 'History') icon = '📜';
              if (route.name === 'Trends') icon = '📊';
              if (route.name === 'Settings') icon = '⚙';
              return <Text style={{ fontSize: 18 }}>{icon}</Text>;
            },
            headerStyle: { backgroundColor: '#4f46e5' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
          })}
        >
          <Tab.Screen name="Log Sleep" component={LogSleepScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Trends" component={TrendsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SleepProvider>
  );
}
