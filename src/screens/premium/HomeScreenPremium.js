import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Play, Square, Pause, Zap } from 'lucide-react-native';
import TokenBadge from '../../components/TokenBadge'; 

// On tente d'importer le dessin, si ça rate on utilise un remplaçant
let Svg, Circle;
try {
  const SvgLib = require('react-native-svg');
  Svg = SvgLib.default;
  Circle = SvgLib.Circle;
} catch (e) {
  console.log("SVG non disponible");
}

const { width } = Dimensions.get('window');
const TAILLE = width * 0.7;

export default function HomeScreenPremium({ t, secondes, actif, jetons, totalSecondes, modeSombre, demarrer, abandonner, mettreEnPause, format, pourcentage }) {
  const isDark = modeSombre;

  return (
    <SafeAreaView style={[styles.container, !isDark && {backgroundColor: '#F8FAFC'}]}>
      <View style={styles.header}><TokenBadge montant={jetons} estPremium={true} modeSombre={isDark} label={t.tokens} /></View>
      
      <View style={styles.mainContent}>
        <View style={styles.timerWrapper}>
          {/* SI LE DESSIN EXISTE, ON L'AFFICHE, SINON BARRE SIMPLE */}
          {Svg ? (
            <Svg width={TAILLE} height={TAILLE}>
              <Circle cx={TAILLE/2} cy={TAILLE/2} r={(TAILLE/2)-10} stroke={isDark ? "#1E293B" : "#E2E8F0"} strokeWidth="10" fill="transparent" />
              <Circle cx={TAILLE/2} cy={TAILLE/2} r={(TAILLE/2)-10} stroke="#F59E0B" strokeWidth="10" fill="transparent" strokeDasharray={2 * Math.PI * ((TAILLE/2)-10)} strokeDashoffset={(2 * Math.PI * ((TAILLE/2)-10)) - ( (2 * Math.PI * ((TAILLE/2)-10)) * pourcentage / 100 )} strokeLinecap="round" rotation="-90" origin={`${TAILLE/2}, ${TAILLE/2}`} />
            </Svg>
          ) : (
            <View style={{height: 10, width: 200, backgroundColor: '#E2E8F0'}} />
          )}

          <View style={styles.centerContent}>
            <Zap color="#F59E0B" size={40} fill="#F59E0B" />
            <Text style={[styles.timerText, !isDark && {color: '#1E293B'}]}>{format(secondes)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          {!actif ? (
            <TouchableOpacity style={styles.btnStart} onPress={demarrer}><Text style={styles.btnText}>{t.start}</Text></TouchableOpacity>
          ) : (
            <View style={styles.activeButtons}>
              <TouchableOpacity style={styles.btnPause} onPress={mettreEnPause}><Pause color="#F59E0B" /></TouchableOpacity>
              <TouchableOpacity style={styles.btnStop} onPress={abandonner}><Square color="white" fill="white" /></TouchableOpacity>
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
  timerText: { fontSize: 60, fontWeight: '900', color: 'white' },
  controls: { marginTop: 50, width: 250 },
  btnStart: { backgroundColor: '#F59E0B', padding: 20, borderRadius: 30, alignItems: 'center' },
  btnText: { color: 'black', fontWeight: '900', fontSize: 18 },
  activeButtons: { flexDirection: 'row', justifyContent: 'space-evenly' },
  btnPause: { backgroundColor: '#1E293B', padding: 20, borderRadius: 50, borderWidth: 2, borderColor: '#F59E0B' },
  btnStop: { backgroundColor: '#EF4444', padding: 20, borderRadius: 50 }
});