import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Crown, Trash2, LogOut, Moon, Sun } from 'lucide-react-native';

export default function SettingsScreenPremium({ t, langue, changerLangue, dureeActuelle, changerDuree, reinitialiser, setEstPremium, modeSombre, setModeSombre }) {
  const [minS, setMinS] = useState('');
  const [secS, setSecS] = useState('');
  const isDark = modeSombre;

  return (
    <View style={[styles.container, !isDark && {backgroundColor: '#F8FAFC'}]}>
      <View style={styles.header}><Text style={[styles.title, !isDark && {color: '#1E293B'}]}>{t.settings} ELITE</Text><Crown color="#F59E0B" size={24} fill="#F59E0B" /></View>
      <ScrollView style={{ paddingHorizontal: 25 }}>
        <Text style={styles.sectionTitle}>{t.theme}</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity onPress={() => setModeSombre(true)} style={[styles.themeBtn, isDark && styles.themeActive]}>
            <Moon color={isDark ? "white" : "#475569"} size={20} /><Text style={{color: isDark ? 'white' : '#475569', marginLeft: 10}}>{t.dark}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModeSombre(false)} style={[styles.themeBtn, !isDark && styles.themeActive, !isDark && {backgroundColor: 'white', borderColor: '#F59E0B'}]}>
            <Sun color={!isDark ? "#F59E0B" : "#475569"} size={20} /><Text style={{color: !isDark ? '#F59E0B' : '#475569', marginLeft: 10}}>{t.light}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>{t.lang.toUpperCase()}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity onPress={() => changerLangue('fr')} style={[styles.langBtn, langue === 'fr' && styles.langActive]}><Text style={{color: isDark ? 'white' : 'black'}}>🇫🇷 FR</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => changerLangue('en')} style={[styles.langBtn, langue === 'en' && styles.langActive]}><Text style={{color: isDark ? 'white' : 'black'}}>🇺🇸 EN</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>{t.customTime}</Text>
        <View style={[styles.customBox, !isDark && {backgroundColor: 'white', borderColor: '#E2E8F0', borderWidth: 1}]}>
            <View style={styles.inputRow}>
                <TextInput style={[styles.input, !isDark && {backgroundColor: '#F1F5F9', color: '#1E293B'}]} keyboardType="numeric" placeholder="00" value={minS} onChangeText={setMinS} />
                <Text style={styles.colon}>:</Text>
                <TextInput style={[styles.input, !isDark && {backgroundColor: '#F1F5F9', color: '#1E293B'}]} keyboardType="numeric" placeholder="00" value={secS} onChangeText={setSecS} />
            </View>
            <TouchableOpacity style={styles.btnApply} onPress={() => changerDuree((parseInt(minS||0)*60)+parseInt(secS||0))}><Text style={styles.btnApplyText}>{t.apply.toUpperCase()}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnReset} onPress={reinitialiser}><Trash2 color="#EF4444" size={20} /><Text style={{color: '#EF4444', fontWeight: 'bold', marginLeft: 10}}>{t.reset}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btnFree} onPress={() => setEstPremium(false)}><LogOut color="#475569" size={18} /><Text style={{color: '#475569', marginLeft: 10}}>Switch to Free</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', paddingTop: 60 },
  header: { paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#475569', letterSpacing: 1, marginBottom: 12, marginTop: 15 },
  themeRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  themeBtn: { flex: 1, flexDirection: 'row', padding: 15, borderRadius: 15, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  themeActive: { borderWidth: 2, borderColor: '#F59E0B' },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  langBtn: { padding: 12, backgroundColor: '#1E293B', borderRadius: 15, flex: 1, alignItems: 'center' },
  langActive: { borderWidth: 2, borderColor: '#F59E0B' },
  customBox: { backgroundColor: '#1E293B', padding: 20, borderRadius: 25, marginBottom: 30 },
  inputRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  input: { backgroundColor: '#0F172A', width: 70, padding: 10, borderRadius: 12, color: 'white', fontSize: 20, textAlign: 'center', fontWeight: 'bold' },
  colon: { color: '#F59E0B', fontSize: 20, marginHorizontal: 10, fontWeight: 'bold' },
  btnApply: { backgroundColor: '#F59E0B', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnApplyText: { color: 'black', fontWeight: '900' },
  btnReset: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 15, borderRadius: 15 },
  btnFree: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }
});