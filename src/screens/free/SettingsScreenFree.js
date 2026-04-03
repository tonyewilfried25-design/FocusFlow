import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Crown, Trash2, Timer, X } from 'lucide-react-native';

export default function SettingsScreenFree({ t, langue, changerLangue, dureeActuelle, changerDuree, setEstPremium, reinitialiser }) {
  const [modalVisible, setModalVisible] = useState(false);
  const choix = [{ m: 25, s: 1500 }, { m: 15, s: 900 }];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.settings}</Text>
      <ScrollView style={{ width: '100%', paddingHorizontal: 25 }}>
        <TouchableOpacity style={styles.premiumBtn} onPress={() => setModalVisible(true)}>
          <Crown color="white" size={24} /><Text style={styles.premiumText}>{t.buyPremium}</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>{t.lang.toUpperCase()}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity onPress={() => changerLangue('fr')} style={[styles.langBtn, langue === 'fr' && styles.langActive]}><Text>🇫🇷 FR</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => changerLangue('en')} style={[styles.langBtn, langue === 'en' && styles.langActive]}><Text>🇺🇸 EN</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>TIMER</Text>
        {choix.map((i) => (
          <TouchableOpacity key={i.m} style={[styles.card, dureeActuelle === i.s && styles.cardActive]} onPress={() => changerDuree(i.s)}>
            <Timer color={dureeActuelle === i.s ? "#6366F1" : "#94A3B8"} size={20} />
            <Text style={[styles.cardLabel, dureeActuelle === i.s && {color: '#6366F1'}]}>{i.m} min</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.resetBtn} onPress={reinitialiser}><Trash2 color="#EF4444" size={20} /><Text style={{color: '#EF4444', fontWeight: 'bold', marginLeft: 10}}>{t.reset}</Text></TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <div style={styles.modalContent}>
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
          </div>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 80, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  premiumBtn: { backgroundColor: '#6366F1', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 30, justifyContent: 'center' },
  premiumText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#94A3B8', marginBottom: 10, marginTop: 10 },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  langBtn: { padding: 12, backgroundColor: 'white', borderRadius: 15, flex: 1, alignItems: 'center', elevation: 2 },
  langActive: { borderWidth: 2, borderColor: '#6366F1' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardActive: { borderWidth: 2, borderColor: '#6366F1' },
  cardLabel: { marginLeft: 15, fontWeight: 'bold' },
  resetBtn: { marginTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, paddingBottom: 50, alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-end', padding: 10 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 25 },
  featuresList: { width: '100%', marginBottom: 30 },
  featureItem: { fontSize: 14, color: '#475569', fontWeight: '600', marginBottom: 10, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 15 },
  confirmBuyBtn: { backgroundColor: '#F59E0B', width: '100%', padding: 20, borderRadius: 20, alignItems: 'center' },
  confirmBuyText: { color: 'black', fontWeight: '900', fontSize: 16 }
});