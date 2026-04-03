import React, { useState, useEffect, useRef } from 'react';
import { AppState, Vibration, Alert, Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, ShoppingBag, Settings as SettingsIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UsageStats from 'react-native-usage-stats'; 
import { translations } from './src/translations/i18n';

import HomeScreenFree from './src/screens/free/HomeScreenFree';
import HomeScreenPremium from './src/screens/premium/HomeScreenPremium';
import ShopScreenFree from './src/screens/free/ShopScreenFree';
import ShopScreenPremium from './src/screens/premium/ShopScreenPremium';
import SettingsScreenFree from './src/screens/free/SettingsScreenFree';
import SettingsScreenPremium from './src/screens/premium/SettingsScreenPremium';

const Tab = createBottomTabNavigator();

export default function App() {
  const [langue, setLangue] = useState('fr');
  const [secondes, setSecondes] = useState(1500); 
  const [dureePreferee, setDureePreferee] = useState(1500);
  const [actif, setActif] = useState(false);
  const [jetons, setJetons] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const [estPremium, setEstPremium] = useState(false);
  const [modeSombre, setModeSombre] = useState(true);
  const [appsBloquees, setAppsBloquees] = useState([]);
  const [appsDebloqueesTemporairement, setAppsDebloqueesTemporairement] = useState({}); // { "TikTok": timestamp_expiration }
  
  const t = translations[langue];

  // --- 1. DEMANDE AUTOMATIQUE DES PERMISSIONS AU LANCEMENT ---
  useEffect(() => {
    const verifierEtDemander = async () => {
      try {
        await UsageStats.getForegroundApp(); 
      } catch (e) {
        Alert.alert(t.permTitle, t.permDesc, [
          { text: "OK", onPress: () => Linking.sendIntent('android.settings.USAGE_ACCESS_SETTINGS') }
        ]);
      }
    };
    setTimeout(verifierEtDemander, 2000);
  }, []);

  // --- 2. LE GARDIEN SÉLECTIF AVEC SYSTÈME DE JETONS ---
  useEffect(() => {
    let checkInterval = null;
    if (actif && appsBloquees.length > 0) {
      checkInterval = setInterval(async () => {
        try {
          const currentPackage = await UsageStats.getForegroundApp();
          const BLACKLIST = {
            "TikTok": "com.zhiliaoapp.musically",
            "Instagram": "com.instagram.android",
            "YouTube": "com.google.android.youtube",
            "Facebook": "com.facebook.katana",
            "Snapchat": "com.snapchat.android"
          };

          const appNameDetectee = Object.keys(BLACKLIST).find(key => currentPackage.includes(BLACKLIST[key]));

          if (appNameDetectee && appsBloquees.includes(appNameDetectee)) {
            // VERIFICATION SI L'APP EST ACTUELLEMENT DÉBLOQUÉE PAR UN ACHAT
            const expiration = appsDebloqueesTemporairement[appNameDetectee] || 0;
            const encoreValide = Date.now() < expiration;

            if (!encoreValide) {
              Vibration.vibrate([100, 100], true);
              Alert.alert("🚨 BLOQUÉ", t.dontLeave, [{ text: "RETOUR", onPress: () => Vibration.cancel() }]);
            } else {
              Vibration.cancel();
            }
          } else {
            Vibration.cancel();
          }
        } catch (e) {}
      }, 2000);
    }
    return () => { clearInterval(checkInterval); Vibration.cancel(); };
  }, [actif, appsBloquees, appsDebloqueesTemporairement]);

  // --- 3. LOGIQUE D'ACHAT DE TEMPS DANS LE SHOP ---
  const debloquerApp = (appName, minutes, prix) => {
    if (jetons >= prix) {
      setJetons(prev => prev - prix);
      const expiration = Date.now() + (minutes * 60 * 1000);
      setAppsDebloqueesTemporairement({ ...appsDebloqueesTemporairement, [appName]: expiration });
      Alert.alert("Bravo 🪙", `${t.unlockSuccess} ${minutes} min.`);
    } else {
      Alert.alert("Oups", t.noTokens);
    }
  };

  // Chargement / Sauvegarde / Chrono (Inchangés pour la stabilité)
  useEffect(() => {
    const charger = async () => {
      const sJ = await AsyncStorage.getItem('J');
      const sT = await AsyncStorage.getItem('T');
      const sP = await AsyncStorage.getItem('P');
      const sA = await AsyncStorage.getItem('A');
      if (sJ) setJetons(parseInt(sJ));
      if (sT) setTotalSec(parseInt(sT));
      if (sP === 'true') setEstPremium(true);
      if (sA) setAppsBloquees(JSON.parse(sA));
    };
    charger();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('J', jetons.toString());
    AsyncStorage.setItem('T', totalSec.toString());
    AsyncStorage.setItem('P', estPremium ? 'true' : 'false');
    AsyncStorage.setItem('A', JSON.stringify(appsBloquees));
  }, [jetons, totalSec, estPremium, appsBloquees]);

  const format = (s) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    let int = null;
    if (actif && secondes > 0) int = setInterval(() => setSecondes(s => s - 1), 1000);
    else if (secondes === 0 && actif) {
      setActif(false);
      const gain = estPremium ? 20 : 10;
      setJetons(j => j + gain);
      setTotalSec(prev => prev + dureePreferee);
      Vibration.vibrate([500, 200, 500]);
      setSecondes(dureePreferee);
    }
    return () => clearInterval(int);
  }, [actif, secondes]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: estPremium ? '#F59E0B' : '#6366F1', tabBarStyle: { height: 70, paddingBottom: 12, backgroundColor: (estPremium && modeSombre) ? '#0F172A' : 'white', borderTopWidth: 0 }}}>
        <Tab.Screen name="FocusTab" options={{ title: t.focus, tabBarIcon: ({color}) => <Clock color={color} /> }}>
          {() => estPremium ? 
            <HomeScreenPremium t={t} secondes={secondes} actif={actif} jetons={jetons} totalSecondes={totalSec} appsBloquees={appsBloquees} modeSombre={modeSombre} demarrer={()=>setActif(true)} abandonner={()=>{setActif(false);Vibration.cancel()}} mettreEnPause={()=>{setActif(false);Vibration.cancel()}} format={format} pourcentage={(secondes/dureePreferee)*100} /> : 
            <HomeScreenFree t={t} secondes={secondes} actif={actif} jetons={jetons} totalSecondes={totalSec} appsBloquees={appsBloquees} demarrer={()=>setActif(true)} abandonner={()=>{setActif(false);Vibration.cancel()}} format={format} pourcentage={(secondes/dureePreferee)*100} setEstPremium={setEstPremium} />
          }
        </Tab.Screen>
        <Tab.Screen name="ShopTab" options={{ title: t.shop, tabBarIcon: ({color}) => <ShoppingBag color={color} /> }}>
          {() => estPremium ? 
            <ShopScreenPremium t={t} jetons={jetons} appsBloquees={appsBloquees} toggleApp={(n)=>setAppsBloquees([...appsBloquees,n])} debloquer={debloquerApp} modeSombre={modeSombre} /> : 
            <ShopScreenFree t={t} jetons={jetons} setJetons={setJetons} appsBloquees={appsBloquees} toggleApp={(n)=>setAppsBloquees([n])} debloquer={debloquerApp} />
          }
        </Tab.Screen>
        <Tab.Screen name="SettingsTab" options={{ title: t.settings, tabBarIcon: ({color}) => <SettingsIcon color={color} /> }}>
          {() => estPremium ? 
            <SettingsScreenPremium t={t} langue={langue} changerLangue={setLangue} dureeActuelle={dureePreferee} changerDuree={(d)=>setSecondes(d)} reinitialiser={()=>setJetons(0)} setEstPremium={setEstPremium} modeSombre={modeSombre} setModeSombre={setModeSombre} /> : 
            <SettingsScreenFree t={t} langue={langue} changerLangue={setLangue} dureeActuelle={dureePreferee} changerDuree={(d)=>setSecondes(d)} reinitialiser={()=>setJetons(0)} setEstPremium={setEstPremium} />
          }
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}