import { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllTransactions, deleteTransaction } from '../db/database';

type Transaction = {
  id: number;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = async () => {
    const data = await getAllTransactions();
    setTransactions(data as Transaction[]);
  };

  // Reload every time this screen comes into focus (so new transactions show up)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert('Delete transaction?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          loadData();
        },
      },
    ]);
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions yet.</Text>
        <Text style={styles.emptySubtext}>Add one from the Home tab!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable style={styles.card} onLongPress={() => handleDelete(item.id)}>
          <View style={styles.cardLeft}>
            <Text style={styles.category}>{item.category}</Text>
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#333' },
  emptySubtext: { fontSize: 14, color: '#888', marginTop: 6 },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flex: 1 },
  category: { fontSize: 16, fontWeight: '600', color: '#222' },
  note: { fontSize: 13, color: '#666', marginTop: 2 },
  date: { fontSize: 12, color: '#999', marginTop: 4 },
  amount: { fontSize: 17, fontWeight: 'bold', color: '#c62828' },
});