import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllTransactions, getAllBudgets, setBudget } from '../db/database';

type Budget = { category: string; limit_amount: number };

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({});
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const loadData = async () => {
    const budgetRows = (await getAllBudgets()) as Budget[];
    setBudgets(budgetRows);

    const transactions = (await getAllTransactions()) as any[];
    const spent: Record<string, number> = {};
    transactions.forEach((t) => {
      spent[t.category] = (spent[t.category] || 0) + t.amount;
    });
    setSpentByCategory(spent);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleSetBudget = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Missing category', 'Enter a category name.');
      return;
    }
    if (!newLimit || isNaN(Number(newLimit)) || Number(newLimit) <= 0) {
      Alert.alert('Invalid limit', 'Enter a valid budget amount.');
      return;
    }

    await setBudget(newCategory.trim(), Number(newLimit));
    setNewCategory('');
    setNewLimit('');
    loadData();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎯 Budgets</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Food"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <Text style={styles.label}>Monthly Limit</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 3000"
          keyboardType="numeric"
          value={newLimit}
          onChangeText={setNewLimit}
        />
        <Pressable style={styles.button} onPress={handleSetBudget}>
          <Text style={styles.buttonText}>Set Budget</Text>
        </Pressable>
      </View>

      {budgets.length === 0 ? (
        <Text style={styles.emptyText}>No budgets set yet.</Text>
      ) : (
        budgets.map((b) => {
          const spent = spentByCategory[b.category] || 0;
          const pct = Math.min(spent / b.limit_amount, 1);
          const overBudget = spent > b.limit_amount;

          return (
            <View key={b.category} style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetCategory}>{b.category}</Text>
                <Text style={[styles.budgetAmounts, overBudget && styles.overBudget]}>
                  ₹{spent.toFixed(0)} / ₹{b.limit_amount.toFixed(0)}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${pct * 100}%` },
                    overBudget && styles.progressBarOver,
                  ]}
                />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  form: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 10, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  emptyText: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 20 },
  budgetCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetCategory: { fontSize: 16, fontWeight: '600', color: '#222' },
  budgetAmounts: { fontSize: 14, color: '#444' },
  overBudget: { color: '#c62828', fontWeight: '700' },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: 6,
  },
  progressBarOver: {
    backgroundColor: '#c62828',
  },
});