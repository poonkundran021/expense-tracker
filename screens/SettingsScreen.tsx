import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { useTheme } from '../context/ThemeContext';

const CURRENCIES = ['₹ INR', '$ USD', '€ EUR', '£ GBP'];

export default function SettingsScreen() {
  const { isDark, toggleDark, colors } = useTheme();
  const [currency, setCurrency] = useState('₹ INR');

  const loadSettings = async () => {
    const savedCurrency = await AsyncStorage.getItem('currency');
    setCurrency(savedCurrency || '₹ INR');
  };

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const changeCurrency = async (value: string) => {
    setCurrency(value);
    await AsyncStorage.setItem('currency', value);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear all data?',
      'This will permanently delete every transaction and budget. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            const db = await SQLite.openDatabaseAsync('expenses.db');
            await db.execAsync('DELETE FROM transactions;');
            await db.execAsync('DELETE FROM budgets;');
            Alert.alert('Done', 'All data cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>⚙️ Settings</Text>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleDark} />
      </View>

      <Text style={[styles.label, { color: colors.text, marginTop: 24 }]}>Currency</Text>
      <View style={styles.currencyRow}>
        {CURRENCIES.map((c) => (
          <Pressable
            key={c}
            style={[
              styles.currencyChip,
              { borderColor: colors.border },
              currency === c && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => changeCurrency(c)}
          >
            <Text
              style={[
                styles.currencyText,
                { color: colors.text },
                currency === c && styles.currencyTextActive,
              ]}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.dangerButton} onPress={handleClearData}>
        <Text style={styles.dangerButtonText}>Clear All Data</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: { fontSize: 16, fontWeight: '600' },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  currencyChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  currencyText: { fontSize: 14 },
  currencyTextActive: { color: '#fff', fontWeight: '600' },
  dangerButton: {
    marginTop: 40,
    backgroundColor: '#c62828',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});