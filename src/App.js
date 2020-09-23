import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import {cards} from './Card';
import SortableCard from './SortableCard';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0080FF',
    flex: 1,
  },
  header: {
    width: '100%',
    backgroundColor: '#0080FF',
    height: 75,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
  },
  body: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFF',
  },
});

function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0080FF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Drag to Sort</Text>
      </View>
      <View style={styles.body}>
        {cards.map((card, index) => (
          <SortableCard key={card.id} {...{card, index}} />
        ))}
      </View>
    </View>
  );
}

export default App;
