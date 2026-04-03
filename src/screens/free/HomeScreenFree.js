import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { Play, Square, Target, Flame, Shield, X } from 'lucide-react-native';
import TokenBadge from '../../components/TokenBadge'; 

export default function HomeScreenFree({ t, secondes, actif, jetons, totalSecondes, appsBloquees, demarrer, abandonner, format, pourcentage, setEstPremium }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><TokenBadge montant={jetons} estPremium={false} label={t.tokens} /></View>
      <View style={styles.mainCard}>
        <Target color="#6366F1" size={50} />
        <Text style={styles.timer}>{format(secondes)}</Text>
        <View style={styles.progressBg}><View style={[styles.progressFill, { width: `${pourcentage}%` } ]} /></View>
        {appsBloquees.length > 0 && (
          <View style={styles.blockBadge}><Shield color="#6366F1" size={14} /><Text style={styles.blockText}>{t.blocked}: {appsBloquees[0]}</Text></View>
        )}
        <Text style={styles.instruction}>{actif ? t.dontLeave : t.ready}</Text>
        {!actif ? (
          <TouchableOpacity style={styles.btnStart} onPress={demarrer}><Play color="white" fill="white" size={24} /><Text style={styles.btnText}>{t.start}</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnStop} onPress={abandonner}><Square color="white" fill="white" size={20} /><Text style={styles.btnText}>{t.stop}</Text></TouchableOpacity>
        )}
        {!actif && <View style={styles.stats}><Flame color="#F97316" size={20} /><Text style={styles.statText}>{t.totalTime}: {Math.floor(totalSecondes/60)}m {totalSecondes%60}s</Text></View>}
        {!actif && (
          <TouchableOpacity style={styles.premiumHint} onPress={() => setModalVisible(true)}>
            <Text style={styles.hintText}>Premium = Gains x2 et Cercle Doré ✨</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}><X color="#94A3B8" size={24} /></TouchableOpacity>
            <Text style={styles.modalTitle}>{t.modalTitle}</Text>
            <View style={styles.featuresList}>
              {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((f, i) => (
                <Text key={i} style={styles.featureItem}>{f}</Text>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmBuyBtn} onPress={() => {setModalVisible(false); setEstPremium(true);}}>
              <Text style={styles.confirmBuyText}>{t.confirmBuy}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  header: { position: 'absolute', top: 60 },
  mainCard: { backgroundColor: 'white', width: '88%', padding: 35, borderRadius: 45, alignItems: 'center', elevation: 10 },
  timer: { fontSize: 80, fontWeight: '900', color: '#1E293B' },
  progressBg: { width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 10, marginVertical: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6366F1' },
  blockBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', padding: 8, borderRadius: 10, marginBottom: 15 },
  blockText: { marginLeft: 6, color: '#6366F1', fontWeight: 'bold', fontSize: 12 },
  instruction: { color: '#94A3B8', fontWeight: 'bold', fontSize: 12, marginBottom: 20 },
  btnStart: { backgroundColor: '#6366F1', flexDirection: 'row', padding: 20, borderRadius: 20, width: '100%', justifyContent: 'center', alignItems: 'center' },
  btnStop: { backgroundColor: '#94A3B8', flexDirection: 'row', padding: 20, borderRadius: 20, width: '100%', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  stats: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  statText: { marginLeft: 10, fontWeight: 'bold', color: '#64748B' },
  premiumHint: { marginTop: 25, backgroundColor: '#F5F7FF', padding: 10, borderRadius: 12 },
  hintText: { fontSize: 11, color: '#6366F1', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, paddingBottom: 50, alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-end', padding: 10 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 25 },
  featuresList: { width: '100%', marginBottom: 30 },
  featureItem: { fontSize: 14, color: '#475569', fontWeight: '600', marginBottom: 10, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 15 },
  confirmBuyBtn: { backgroundColor: '#F59E0B', width: '100%', padding: 20, borderRadius: 20, alignItems: 'center' },
  confirmBuyText: { color: 'black', fontWeight: '900', fontSize: 16 }
});