import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Smartphone, PlayCircle, Lock, ShieldCheck } from 'lucide-react-native';

export default function ShopScreenFree({ t, jetons, setJetons, appsBloquees, toggleApp }) {
  const apps = ["TikTok", "Instagram", "YouTube", "Facebook", "Snapchat"];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.blockTitle}</Text>
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.infoCard}><Text style={styles.infoText}>{t.freeLimit}</Text></View>
        {apps.map((app) => (
          <TouchableOpacity key={app} style={[styles.appItem, appsBloquees.includes(app) && styles.appActive]} onPress={() => toggleApp(app)}>
            <Smartphone color={appsBloquees.includes(app) ? "#6366F1" : "#94A3B8"} size={24} />
            <Text style={[styles.appName, appsBloquees.includes(app) && {color: '#6366F1'}]}>{app}</Text>
            {appsBloquees.includes(app) ? <ShieldCheck color="#6366F1" size={20} /> : <View style={styles.circle} />}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.premiumAdv} onPress={() => Alert.alert("Premium ✨", t.upgradeAdv)}>
            <Lock color="#6366F1" size={20} /><Text style={styles.premiumAdvText}>{t.upgradeAdv}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adCard} onPress={() => setJetons(jetons + 5)}>
            <PlayCircle color="white" size={24} /><Text style={styles.adText}>{t.adButton}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', marginLeft: 25, marginBottom: 10 },
  infoCard: { backgroundColor: '#EEF2FF', padding: 15, borderRadius: 15, marginHorizontal: 20, marginBottom: 20 },
  infoText: { color: '#6366F1', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  appItem: { backgroundColor: 'white', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2 },
  appActive: { borderWidth: 2, borderColor: '#6366F1' },
  appName: { flex: 1, marginLeft: 15, fontWeight: 'bold', color: '#475569' },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1' },
  premiumAdv: { marginTop: 20, padding: 20, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#6366F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  premiumAdvText: { marginLeft: 10, color: '#6366F1', fontWeight: 'bold', fontSize: 12 },
  adCard: { backgroundColor: '#10B981', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginTop: 30, justifyContent: 'center' },
  adText: { color: 'white', fontWeight: 'bold', marginLeft: 10 }
});