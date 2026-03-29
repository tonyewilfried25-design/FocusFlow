import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';

export default function TokenBadge({ montant, estPremium, modeSombre, label }) {
  const isDark = estPremium && modeSombre;
  return (
    <View style={[styles.badge, isDark && { backgroundColor: '#1E293B', borderColor: '#F59E0B', borderWidth: 1 }]}>
      <Trophy color="#F59E0B" size={18} />
      <Text style={[styles.text, isDark && { color: 'white' }]}>{montant} {label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: { flexDirection: 'row', backgroundColor: 'white', padding: 10, borderRadius: 20, elevation: 5, alignItems: 'center' },
  text: { marginLeft: 8, fontWeight: '900', color: '#B45309', fontSize: 12 },
});