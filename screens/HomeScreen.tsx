import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAllTransactions } from '../db/database';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  MainTabs: undefined;
  AddTransaction: undefined;
};

type Transaction = {
  id: number;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { colors } = useTheme();

  const [total, setTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<Transaction[]>([]);

  const loadData = async () => {
    const data = (await getAllTransactions()) as Transaction[];

    const sum = data.reduce((acc, t) => acc + t.amount, 0);
    setTotal(sum);

    const byCategory: Record<string, number> = {};
    data.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    setCategoryTotals(byCategory);

    setRecent(data.slice(0, 5));
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>💰 Expense Tracker</Text>

      <View style={[styles.totalCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.buttonText}>+ Add Transaction</Text>
      </Pressable>

      {categoryEntries.length > 0 && (
        <View style={[styles.section, isLandscape && styles.sectionLandscape]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>By Category</Text>
          <View style={isLandscape ? styles.wrapRow : undefined}>
            {categoryEntries.map(([cat, amt]) => (
              <View
                key={cat}
                style={[
                  styles.categoryRow,
                  { borderBottomColor: colors.border },
                  isLandscape && styles.categoryRowLandscape,
                ]}
              >
                <Text style={[styles.categoryName, { color: colors.subtext }]}>{cat}</Text>
                <Text style={styles.categoryAmount}>₹{amt.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {recent.length > 0 && (
        <View style={[styles.section, isLandscape && styles.sectionLandscape]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <View style={isLandscape ? styles.wrapRow : undefined}>
            {recent.map((t) => (
              <View
                key={t.id}
                style={[
                  styles.recentRow,
                  { borderBottomColor: colors.border },
                  isLandscape && styles.categoryRowLandscape,
                ]}
              >
                <Text style={[styles.recentCategory, { color: colors.subtext }]}>{t.category}</Text>
                <Text style={[styles.recentAmount, { color: colors.text }]}>₹{t.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  totalCard: {
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  totalLabel: { color: '#e8f5e9', fontSize: 14, fontWeight: '600' },
  totalAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 4 },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  section: { marginTop: 28 },
  sectionLandscape: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  categoryRowLandscape: {
    width: '47%',
    borderBottomWidth: 1,
  },
  categoryName: { fontSize: 15 },
  categoryAmount: { fontSize: 15, fontWeight: '600', color: '#c62828' },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  recentCategory: { fontSize: 14 },
  recentAmount: { fontSize: 14, fontWeight: '600' },
});