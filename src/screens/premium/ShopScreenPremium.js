import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Smartphone, Gem, Timer } from 'lucide-react-native';

export default function ShopScreenPremium({ t, jetons, appsBloquees, toggleApp, debloquer, modeSombre }) {
  const apps = ["TikTok", "Instagram", "YouTube", "Facebook", "Snapchat", "Netflix", "Twitter"];
  const isDark = modeSombre;

  return (
    <View style={[styles.container, !isDark && {backgroundColor: '#F8FAFC'}]}>
      <Text style={[styles.title, !isDark && {color: '#1E293B'}]}>{t.shop} ELITE</Text>
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.tokenStatus}><Gem color="#F59E0B" /><Text style={styles.tokenText}>{jetons} {t.tokens}</Text></View>
        
        {apps.map((app) => (
          <View key={app} style={[styles.appItem, appsBloquees.includes(app) && styles.appActive]}>
            <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} onPress={() => toggleApp(app)}>
                <Smartphone color={appsBloquees.includes(app) ? "#F59E0B" : "#475569"} size={24} />
                <Text style={[styles.appName, !isDark && {color: '#1E293B'}]}>{app}</Text>
            </TouchableOpacity>

            {appsBloquees.includes(app) && (
                <TouchableOpacity style={styles.unlockBtn} onPress={() => debloquer(app, 30, 15)}>
                    <Timer color="black" size={14} />
                    <Text style={styles.unlockTxt}>30 min (15 🪙)</Text>
                </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white', marginLeft: 25, marginBottom: 20 },
  tokenStatus: { flexDirection: 'row', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 15, borderRadius: 20, marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  tokenText: { color: '#F59E0B', fontWeight: 'bold', marginLeft: 10 },
  appItem: { backgroundColor: '#1E293B', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  appActive: { borderColor: '#F59E0B', borderWidth: 1 },
  appName: { marginLeft: 15, fontWeight: 'bold', color: 'white' },
  unlockBtn: { backgroundColor: '#F59E0B', padding: 12, borderRadius: 15, flexDirection: 'row', alignItems: 'center' },
  unlockTxt: { color: 'black', fontSize: 11, fontWeight: '900', marginLeft: 5 }
});