import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Play, Square, Pause, Zap, ShieldCheck } from 'lucide-react-native';
import TokenBadge from '../../components/TokenBadge'; 

export default function HomeScreenPremium({ t, secondes, actif, jetons, totalSecondes, appsBloquees, modeSombre, demarrer, abandonner, mettreEnPause, format, pourcentage }) {
  const isDark = modeSombre;

  return (
    <SafeAreaView style={[styles.container, !isDark && {backgroundColor: '#F8FAFC'}]}>
      <View style={styles.header}>
        <TokenBadge montant={jetons} estPremium={true} modeSombre={isDark} label={t.tokens} />
      </View>
      
      <View style={[styles.mainCard, !isDark && {backgroundColor: 'white', elevation: 10}]}>
        <Zap color="#F59E0B" size={50} fill="#F59E0B" />
        
        <Text style={[styles.timer, !isDark && {color: '#1E293B'}]}>{format(secondes)}</Text>
        
        {/* BARRE DE PROGRESSION GOLD (SANS SVG POUR ÉVITER LE CRASH) */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pourcentage}%` }]} />
        </View>

        <View style={styles.appList}>
          <ShieldCheck color="#10B981" size={18} />
          <Text style={styles.appCount}>{appsBloquees.length} {t.unlocked.toUpperCase()}</Text>
        </View>

        <View style={styles.controls}>
          {!actif ? (
            <TouchableOpacity style={styles.btnStart} onPress={demarrer}>
              <Text style={styles.btnText}>{t.start}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeButtons}>
              <TouchableOpacity style={styles.btnPause} onPress={mettreEnPause}><Pause color="#F59E0B" size={30} /></TouchableOpacity>
              <TouchableOpacity style={styles.btnStop} onPress={abandonner}><Square color="white" fill="white" size={24} /></TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Text style={[styles.statText, !isDark && {color: '#94A3B8'}]}>{t.totalTime.toUpperCase()}: {Math.floor(totalSecondes/60)}m {totalSecondes%60}s</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  header: { position: 'absolute', top: 60 },
  mainCard: { backgroundColor: '#1E293B', width: '88%', padding: 40, borderRadius: 50, alignItems: 'center', borderWidth: 1, borderColor: '#F59E0B' },
  timer: { fontSize: 80, fontWeight: '900', color: 'white', marginVertical: 10 },
  progressBg: { width: '100%', height: 12, backgroundColor: '#334155', borderRadius: 10, marginVertical: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#F59E0B' },
  appList: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  appCount: { color: '#10B981', fontSize: 12, fontWeight: '900', marginLeft: 8 },
  controls: { width: '100%' },
  btnStart: { backgroundColor: '#F59E0B', padding: 22, borderRadius: 25, alignItems: 'center' },
  btnText: { color: 'black', fontSize: 18, fontWeight: '900' },
  activeButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  btnPause: { backgroundColor: '#1E293B', padding: 20, borderRadius: 50, borderWidth: 2, borderColor: '#F59E0B' },
  btnStop: { backgroundColor: '#EF4444', padding: 20, borderRadius: 50 },
  statText: { color: '#475569', fontSize: 11, fontWeight: 'bold', marginTop: 30 }
});