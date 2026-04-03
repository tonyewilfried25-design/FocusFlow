import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Smartphone, Crown, ShieldCheck, Gem } from 'lucide-react-native';

export default function ShopScreenPremium({ t, appsBloquees, toggleApp, modeSombre }) {
  const apps = ["TikTok", "Instagram", "YouTube", "Facebook", "Snapchat", "Netflix", "Twitter"];
  const isDark = modeSombre;

  return (
    <View style={[styles.container, !isDark && {backgroundColor: '#F8FAFC'}]}>
      <View style={styles.header}>
        <Text style={[styles.title, !isDark && {color: '#1E293B'}]}>{t.blockTitle} ELITE</Text>
        <Crown color="#F59E0B" size={24} fill="#F59E0B" />
      </View>
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.statusBox}><Gem color="#F59E0B" size={20} /><Text style={styles.statusText}>{t.premiumLimit}</Text></View>
        {apps.map((app) => (
          <TouchableOpacity key={app} style={[styles.appItem, !isDark && {backgroundColor: 'white', borderColor: '#E2E8F0'}, appsBloquees.includes(app) && styles.appActive]} onPress={() => toggleApp(app)}>
            <Smartphone color={appsBloquees.includes(app) ? "#F59E0B" : "#475569"} size={24} />
            <Text style={[styles.appName, !isDark && {color: '#1E293B'}, appsBloquees.includes(app) && {color: isDark ? 'white' : '#F59E0B'}]}>{app}</Text>
            {appsBloquees.includes(app) ? <ShieldCheck color="#F59E0B" size={24} /> : <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  statusBox: { backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 15, borderRadius: 15, marginBottom: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  statusText: { color: '#F59E0B', fontWeight: 'bold', fontSize: 12, marginLeft: 10 },
  appItem: { backgroundColor: '#1E293B', padding: 22, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  appActive: { borderColor: '#F59E0B' },
  appName: { flex: 1, marginLeft: 15, fontWeight: 'bold', fontSize: 17, color: '#94A3B8' },
  circle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#334155' }
});