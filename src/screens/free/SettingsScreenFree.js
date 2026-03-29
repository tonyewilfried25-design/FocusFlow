import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Crown, Trash2, Timer } from 'lucide-react-native';

export default function SettingsScreenFree({ t, langue, changerLangue, dureeActuelle, changerDuree, setEstPremium, reinitialiser }) {
  const choix = [{ m: 25, s: 1500 }, { m: 15, s: 900 }];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.settings}</Text>
      <ScrollView style={{ width: '100%', paddingHorizontal: 25 }}>
        <TouchableOpacity style={styles.premiumBtn} onPress={() => setEstPremium(true)}>
          <Crown color="white" size={24} /><Text style={styles.premiumText}>{t.buyPremium}</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>{t.lang.toUpperCase()}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity onPress={() => changerLangue('fr')} style={[styles.langBtn, langue === 'fr' && styles.langActive]}><Text>🇫🇷 FR</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => changerLangue('en')} style={[styles.langBtn, langue === 'en' && styles.langActive]}><Text>🇺🇸 EN</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>TIMER</Text>
        {choix.map((i) => (
          <TouchableOpacity key={i.m} style={[styles.card, dureeActuelle === i.s && styles.cardActive]} onPress={() => changerDuree(i.s)}>
            <Timer color={dureeActuelle === i.s ? "#6366F1" : "#94A3B8"} size={20} />
            <Text style={[styles.cardLabel, dureeActuelle === i.s && {color: '#6366F1'}]}>{i.m} min</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.resetBtn} onPress={reinitialiser}><Trash2 color="#EF4444" size={20} /><Text style={{color: '#EF4444', fontWeight: 'bold', marginLeft: 10}}>{t.reset}</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 80, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  premiumBtn: { backgroundColor: '#6366F1', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 30, justifyContent: 'center' },
  premiumText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#94A3B8', marginBottom: 10, marginTop: 10 },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  langBtn: { padding: 12, backgroundColor: 'white', borderRadius: 15, flex: 1, alignItems: 'center', elevation: 2 },
  langActive: { borderWidth: 2, borderColor: '#6366F1' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardActive: { borderWidth: 2, borderColor: '#6366F1' },
  cardLabel: { marginLeft: 15, fontWeight: 'bold' },
  resetBtn: { marginTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
});