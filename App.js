import React, { useState, useEffect, useRef } from 'react';
import { AppState, Vibration, Alert, NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, ShoppingBag, Settings as SettingsIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORT DU BLOQUEUR RÉEL
import UsageStats from 'react-native-usage-stats-manager';

// Import des traductions
import { translations } from './src/translations/i18n';

// Import des écrans
import HomeScreenFree from './src/screens/free/HomeScreenFree';
import ShopScreenFree from './src/screens/free/ShopScreenFree';
import SettingsScreenFree from './src/screens/free/SettingsScreenFree';
import HomeScreenPremium from './src/screens/premium/HomeScreenPremium';
import ShopScreenPremium from './src/screens/premium/ShopScreenPremium';
import SettingsScreenPremium from './src/screens/premium/SettingsScreenPremium';

const Tab = createBottomTabNavigator();

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [langue, setLangue] = useState('fr');
  const [dureePreferee, setDureePreferee] = useState(1500); 
  const [secondes, setSecondes] = useState(1500); 
  const [actif, setActif] = useState(false);
  const [jetons, setJetons] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const [estPremium, setEstPremium] = useState(false);
  const [modeSombre, setModeSombre] = useState(true);
  const [appsBloquees, setAppsBloquees] = useState([]);
  
  const etaitActifAvantQuitter = useRef(false);
  const t = translations[langue];

  // --- TRADUCTEUR DE TEMPS (00:00) ---
  const format = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- LE GARDIEN (BLOCAGE PHYSIQUE) ---
  // Cette fonction tourne en boucle pendant le focus
  useEffect(() => {
    let intervalGardien = null;

    if (actif && appsBloquees.length > 0) {
      intervalGardien = setInterval(async () => {
        try {
          // On demande quelle application est ouverte à l'écran
          const currentApp = await UsageStats.getForegroundApp();
          
          // Noms techniques des apps à surveiller
          const BLACKLIST = {
            "TikTok": "com.zhiliaoapp.musically",
            "Instagram": "com.instagram.android",
            "YouTube": "com.google.android.youtube",
            "Facebook": "com.facebook.katana",
            "Snapchat": "com.snapchat.android"
          };

          // On vérifie si l'app ouverte est dans notre liste de blocage
          const estInterdite = appsBloquees.some(appNom => {
            const packageId = BLACKLIST[appNom];
            return currentApp && currentApp.includes(packageId);
          });

          if (estInterdite) {
            Vibration.vibrate(2000);
            // On affiche l'alerte. Sur Android, l'alerte système force 
            // le focus à revenir sur notre application FocusFlow.
            Alert.alert("🚨 " + t.blockTitle, t.dontLeave);
          }
        } catch (e) {
          console.log("Permission UsageStats non accordée");
        }
      }, 2000); // Vérification toutes les 2 secondes
    }
    return () => clearInterval(intervalGardien);
  }, [actif, appsBloquees, t]);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const charger = async () => {
      try {
        const sL = await AsyncStorage.getItem('L');
        const sP = await AsyncStorage.getItem('EST_PREMIUM');
        const sMS = await AsyncStorage.getItem('MS');
        const sJ = await AsyncStorage.getItem('J');
        const sT = await AsyncStorage.getItem('T');
        const sD = await AsyncStorage.getItem('D');
        const sA = await AsyncStorage.getItem('A');
        
        if (sL) setLangue(sL);
        if (sP === 'true') setEstPremium(true);
        if (sMS === 'false') setModeSombre(false);
        if (sJ) setJetons(parseInt(sJ));
        if (sT) setTotalSec(parseInt(sT));
        if (sA) setAppsBloquees(JSON.parse(sA));
        if (sD) { setDureePreferee(parseInt(sD)); setSecondes(parseInt(sD)); }
      } catch (e) {}
    };
    charger();
  }, []);

  // --- SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => {
    AsyncStorage.setItem('J', jetons.toString());
    AsyncStorage.setItem('T', totalSec.toString());
    AsyncStorage.setItem('EST_PREMIUM', estPremium ? 'true' : 'false');
    AsyncStorage.setItem('MS', modeSombre ? 'true' : 'false');
    AsyncStorage.setItem('L', langue);
    AsyncStorage.setItem('D', dureePreferee.toString());
    AsyncStorage.setItem('A', JSON.stringify(appsBloquees));
  }, [jetons, totalSec, estPremium, modeSombre, langue, dureePreferee, appsBloquees]);

  // --- LOGIQUE DE SÉLECTION DES APPS ---
  const toggleApp = (name) => {
    if (appsBloquees.includes(name)) {
      setAppsBloquees(appsBloquees.filter(a => a !== name));
    } else {
      const limit = estPremium ? 5 : 1;
      if (appsBloquees.length < limit) {
        setAppsBloquees([...appsBloquees, name]);
      } else {
        Alert.alert("Limite", estPremium ? t.premiumLimit : t.upgradeAdv);
      }
    }
  };

  const reinitialiser = () => {
    Alert.alert(t.confirmReset, "", [{ text: t.cancel }, { text: "OK", onPress: async () => {
      setJetons(0); setTotalSec(0); setAppsBloquees([]); setSecondes(1500); setDureePreferee(1500);
      await AsyncStorage.multiRemove(['J', 'T', 'A']);
    }}]);
  };

  // --- ANTI-TRICHE (SI ON QUITTE L'APP) ---
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next.match(/inactive|background/) && actif) { 
        etaitActifAvantQuitter.current = true; 
        setActif(false); 
      }
      if (next === 'active' && etaitActifAvantQuitter.current) {
        Vibration.vibrate(1000);
        setJetons(prev => Math.max(0, prev - 5));
        Alert.alert("⚠️ FOCUS BRISÉ", `${t.dontLeave}\nSanction : -5 jetons 🪙`);
        etaitActifAvantQuitter.current = false; 
        setSecondes(dureePreferee);
      }
    });
    return () => sub.remove();
  }, [actif, dureePreferee, t.dontLeave]);

  // --- CHRONOMÈTRE ---
  useEffect(() => {
    let int = null;
    if (actif && secondes > 0) {
      int = setInterval(() => setSecondes(s => s - 1), 1000);
    } else if (secondes === 0 && actif) {
      setActif(false);
      const gain = estPremium ? 20 : 10;
      setJetons(j => j + gain);
      setTotalSec(prev => prev + dureePreferee);
      Vibration.vibrate([500, 200, 500]);
      Alert.alert("🏆 BRAVO !", `+${gain} ${t.tokens}`);
      setSecondes(dureePreferee);
    }
    return () => clearInterval(int);
  }, [actif, secondes]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: estPremium ? '#F59E0B' : '#6366F1', 
        tabBarStyle: { height: 70, paddingBottom: 12, backgroundColor: (estPremium && modeSombre) ? '#0F172A' : 'white', borderTopWidth: 0 }
      }}>
        
        {/* ONGLET FOCUS */}
        <Tab.Screen name="FocusTab" options={{ title: t.focus, tabBarIcon: ({color}) => <Clock color={color} /> }}>
          {() => estPremium ? (
            <HomeScreenPremium 
              t={t} secondes={secondes} actif={actif} jetons={jetons} 
              totalSecondes={totalSec} appsBloquees={appsBloquees} 
              modeSombre={modeSombre} demarrer={()=>setActif(true)} 
              abandonner={()=>{setActif(false);setSecondes(dureePreferee)}} 
              mettreEnPause={()=>setActif(false)} 
              format={format} pourcentage={(secondes/dureePreferee)*100} 
            />
          ) : (
            <HomeScreenFree 
              t={t} secondes={secondes} actif={actif} jetons={jetons} 
              totalSecondes={totalSec} appsBloquees={appsBloquees} 
              demarrer={()=>setActif(true)} 
              abandonner={()=>{setActif(false);setSecondes(dureePreferee)}} 
              format={format} pourcentage={(secondes/dureePreferee)*100} 
              setEstPremium={setEstPremium} 
            />
          )}
        </Tab.Screen>

        {/* ONGLET BOUTIQUE */}
        <Tab.Screen name="ShopTab" options={{ title: t.shop, tabBarIcon: ({color}) => <ShoppingBag color={color} /> }}>
          {() => estPremium ? 
            <ShopScreenPremium t={t} appsBloquees={appsBloquees} toggleApp={toggleApp} modeSombre={modeSombre} /> : 
            <ShopScreenFree t={t} jetons={jetons} setJetons={setJetons} appsBloquees={appsBloquees} toggleApp={toggleApp} />
          }
        </Tab.Screen>

        {/* ONGLET RÉGLAGES */}
        <Tab.Screen name="SettingsTab" options={{ title: t.settings, tabBarIcon: ({color}) => <SettingsIcon color={color} /> }}>
          {() => estPremium ? 
            <SettingsScreenPremium t={t} langue={langue} changerLangue={setLangue} dureeActuelle={dureePreferee} changerDuree={(d)=>{setDureePreferee(d);setSecondes(d)}} reinitialiser={reinitialiser} setEstPremium={setEstPremium} modeSombre={modeSombre} setModeSombre={setModeSombre} /> : 
            <SettingsScreenFree t={t} langue={langue} changerLangue={setLangue} dureeActuelle={dureePreferee} changerDuree={(d)=>{setDureePreferee(d);setSecondes(d)}} reinitialiser={reinitialiser} setEstPremium={setEstPremium} />
          }
        </Tab.Screen>

      </Tab.Navigator>
    </NavigationContainer>
  );
}