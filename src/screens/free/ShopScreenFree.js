import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Smartphone, ShieldCheck, Timer } from 'lucide-react-native';

export default function ShopScreenFree({ t, jetons, appsBloquees, toggleApp, debloquer }) {
  const apps = ["TikTok", "Instagram", "YouTube", "Facebook", "Snapchat"];
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.blockTitle}</Text>
      <ScrollView style={{ padding: 20 }}>
        {apps.map((app) => (
          <View key={app} style={[styles.appItem, appsBloquees.includes(app) && styles.appActive]}>
            <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center'}} onPress={() => toggleApp(app)}>
                <Smartphone color={appsBloquees.includes(app) ? "#6366F1" : "#94A3B8"} size={24} />
                <Text style={[styles.appName, appsBloquees.includes(app) && {color: '#6366F1'}]}>{app}</Text>
            </TouchableOpacity>

            {/* SI L'APP EST BLOQUÉE, ON PROPOSE DE LA DÉBLOQUER AVEC DES JETONS */}
            {appsBloquees.includes(app) && (
                <TouchableOpacity style={styles.unlockBtn} onPress={() => debloquer(app, 10, 20)}>
                    <Timer color="white" size={14} />
                    <Text style={styles.unlockTxt}>10 min (20 🪙)</Text>
                </TouchableOpacity>
            )}
          </View>
        ))}
        <Text style={styles.infoText}>{t.freeLimit}</Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', marginLeft: 25, marginBottom: 20 },
  appItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2 },
  appActive: { borderWidth: 2, borderColor: '#6366F1' },
  appName: { marginLeft: 15, fontWeight: 'bold', color: '#475569' },
  unlockBtn: { backgroundColor: '#10B981', padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  unlockTxt: { color: 'white', fontSize: 10, fontWeight: 'bold', marginLeft: 5 },
  infoText: { textAlign: 'center', marginTop: 20, color: '#94A3B8', fontSize: 12 }
});