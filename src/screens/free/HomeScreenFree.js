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
        <Text style={styles.instruction}>{actif ? t.dontLeave : t.ready}</Text>
        {appsBloquees.length > 0 && <View style={styles.blockBadge}><Shield color="#6366F1" size={14} /><Text style={styles.blockText}>{t.blocked}: {appsBloquees[0]}</Text></View>}
        
        {!actif ? (
          <TouchableOpacity style={styles.btnStart} onPress={demarrer}><Play color="white" fill="white" size={24} /><Text style={styles.btnText}>{t.start}</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnStop} onPress={abandonner}><Square color="white" fill="white" size={20} /><Text style={styles.btnText}>{t.stop}</Text></TouchableOpacity>
        )}
        {!actif && (
            <TouchableOpacity style={styles.paywallBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.paywallTxt}>{t.buyPremium}</Text>
            </TouchableOpacity>
        )}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.close} onPress={() => setModalVisible(false)}><X color="#94A3B8" /></TouchableOpacity>
            <Text style={styles.mTitle}>{t.modalTitle}</Text>
            <View style={{width: '100%', marginBottom: 20}}>
                {[t.feature1, t.feature2, t.feature3, t.feature4, t.feature5, t.feature6].map((f, i) => (
                    <Text key={i} style={styles.mFeat}>{f}</Text>
                ))}
            </View>
            <TouchableOpacity style={styles.mConfirm} onPress={() => {setModalVisible(false); setEstPremium(true)}}><Text style={styles.mConfirmTxt}>{t.confirmBuy}</Text></TouchableOpacity>
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
  instruction: { color: '#94A3B8', fontWeight: 'bold', fontSize: 12, marginBottom: 15 },
  blockBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', padding: 8, borderRadius: 10, marginBottom: 15 },
  blockText: { marginLeft: 6, color: '#6366F1', fontWeight: 'bold', fontSize: 12 },
  btnStart: { backgroundColor: '#6366F1', padding: 20, borderRadius: 20, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnStop: { backgroundColor: '#94A3B8', padding: 20, borderRadius: 20, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  paywallBtn: { marginTop: 25, backgroundColor: '#EEF2FF', padding: 12, borderRadius: 15 },
  paywallTxt: { color: '#6366F1', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, alignItems: 'center' },
  close: { alignSelf: 'flex-end' },
  mTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },
  mFeat: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, width: '100%', marginBottom: 8, fontWeight: '600' },
  mConfirm: { backgroundColor: '#F59E0B', width: '100%', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  mConfirmTxt: { fontWeight: '900', color: 'black' }
});