import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Play, Square, Pause, Zap, ShieldCheck } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import TokenBadge from '../../components/TokenBadge'; 

const { width } = Dimensions.get('window');
const TAILLE = width * 0.75;
const R = (TAILLE / 2) - 20;
const CIRC = 2 * Math.PI * R;

export default function HomeScreenPremium({ t, secondes, actif, jetons, totalSecondes, appsBloquees, modeSombre, demarrer, abandonner, mettreEnPause, format, pourcentage }) {
  const strokeDashoffset = CIRC - (CIRC * pourcentage) / 100;
  const isDark = modeSombre;

  return (
    <SafeAreaView style={[styles.container, !isDark && {backgroundColor: '#F8FAFC'}]}>
      <View style={styles.header}><TokenBadge montant={jetons} estPremium={true} modeSombre={isDark} label={t.tokens} /></View>
      <View style={styles.mainContent}>
        <View style={styles.timerWrapper}>
          <Svg width={TAILLE} height={TAILLE}>
            <Circle cx={TAILLE/2} cy={TAILLE/2} r={R} stroke={isDark ? "#1E293B" : "#E2E8F0"} strokeWidth="12" fill="transparent" />
            <Circle cx={TAILLE/2} cy={TAILLE/2} r={R} stroke="#F59E0B" strokeWidth="12" fill="transparent" strokeDasharray={CIRC} strokeDashoffset={strokeDashoffset} strokeLinecap="round" rotation="-90" origin={`${TAILLE/2}, ${TAILLE/2}`} />
          </Svg>
          <View style={styles.centerContent}>
            <Zap color="#F59E0B" size={40} fill="#F59E0B" />
            <Text style={[styles.timerText, !isDark && {color: '#1E293B'}]}>{format(secondes)}</Text>
            <Text style={styles.label}>{actif ? t.dontLeave : t.ready}</Text>
          </View>
        </View>
        <View style={styles.appList}>
          <ShieldCheck color="#10B981" size={18} />
          <Text style={styles.appCount}>{appsBloquees.length} {t.unlocked.toUpperCase()}</Text>
        </View>
        <View style={styles.controls}>
          {!actif ? (
            <TouchableOpacity style={styles.btnStart} onPress={demarrer}><Play color="black" fill="black" size={24} /><Text style={styles.btnText}>{t.start}</Text></TouchableOpacity>
          ) : (
            <View style={styles.activeButtons}>
              <TouchableOpacity style={[styles.btnPause, !isDark && {backgroundColor: 'white'}]} onPress={mettreEnPause}><Pause color="#F59E0B" size={30} /></TouchableOpacity>
              <TouchableOpacity style={styles.btnStop} onPress={abandonner}><Square color="white" fill="white" size={24} /></TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center' },
  header: { marginTop: 60, width: '85%', alignItems: 'center' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timerWrapper: { justifyContent: 'center', alignItems: 'center' },
  centerContent: { position: 'absolute', alignItems: 'center' },
  timerText: { fontSize: 65, fontWeight: '900', color: 'white' },
  label: { color: '#F59E0B', fontWeight: 'bold', fontSize: 10, letterSpacing: 1 },
  appList: { flexDirection: 'row', alignItems: 'center', marginTop: 30, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 15 },
  appCount: { color: '#10B981', fontSize: 12, fontWeight: '900', marginLeft: 8 },
  controls: { marginTop: 40, width: 260 },
  btnStart: { backgroundColor: '#F59E0B', flexDirection: 'row', padding: 22, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'black', fontSize: 18, fontWeight: '900', marginLeft: 10 },
  activeButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  btnPause: { backgroundColor: '#1E293B', padding: 25, borderRadius: 50, borderWidth: 2, borderColor: '#F59E0B' },
  btnStop: { backgroundColor: 'rgba(239, 68, 68, 0.5)', padding: 25, borderRadius: 50, borderWidth: 1, borderColor: '#EF4444' }
});