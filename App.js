import React, { useState, useEffect, useRef } from 'react';
import { AppState, Vibration, Alert, NativeModules } from 'react-native';
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
  const t = translations[langue];

  // --- LE GARDIEN DE BLOCAGE RÉEL ---
  useEffect(() => {
    let checkInterval = null;
    if (actif && appsBloquees.length > 0) {
      checkInterval = setInterval(async () => {
        try {
          const currentApp = await UsageStats.getForegroundApp();
          const BLACKLIST = {
            "TikTok": "com.zhiliaoapp.musically",
            "Instagram": "com.instagram.android",
            "YouTube": "com.google.android.youtube",
            "Facebook": "com.facebook.katana",
            "Snapchat": "com.snapchat.android"
          };
          
          const estInterdite = appsBloquees.some(app => currentApp.includes(BLACKLIST[app]));
          
          if (estInterdite) {
            Vibration.vibrate(1000);
            Alert.alert("🚨 " + t.blockTitle, t.dontLeave);
          }
        } catch (e) {}
      }, 2000);
    }
    return () => clearInterval(checkInterval);
  }, [actif, appsBloquees, t]);

  const format = (s) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  useEffect(() => {
    const charger = async () => {
      const sL = await AsyncStorage.getItem('L');
      const sP = await AsyncStorage.getItem('EST_PREMIUM');
      const sJ = await AsyncStorage.getItem('J');
      const sT = await AsyncStorage.getItem('T');
      const sA = await AsyncStorage.getItem('A');
      const sD = await AsyncStorage.getItem('D');
      if (sL) setLangue(sL);
      if (sP === 'true') setEstPremium(true);
      if (sJ) setJetons(parseInt(sJ));
      if (sT) setTotalSec(parseInt(sT));
      if (sA) setAppsBloquees(JSON.parse(sA));
      if (sD) { setDureePreferee(parseInt(sD)); setSecondes(parseInt(sD)); }
    };
    charger();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('J', jetons.toString());
    AsyncStorage.setItem('T', totalSec.toString());
    AsyncStorage.setItem('EST_PREMIUM', estPremium ? 'true' : 'false');
    AsyncStorage.setItem('L', langue);
    AsyncStorage.setItem('A', JSON.stringify(appsBloquees));
  }, [jetons, totalSec, estPremium, appsBloquees]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: estPremium ? '#F59E0B' : '#6366F1', tabBarStyle: { height: 70, paddingBottom: 12, backgroundColor: (estPremium && modeSombre) ? '#0F172A' : 'white', borderTopWidth: 0 }}}>
        <Tab.Screen name="FocusTab" options={{ title: t.focus, tabBarIcon: ({color}) => <Clock color={color} /> }}>
          {() => estPremium ? 
            <HomeScreenPremium t={t} secondes={secondes} actif={actif} jetons={jetons} totalSecondes={totalSec} appsBloquees={appsBloquees} modeSombre={modeSombre} demarrer={()=>setActif(true)} abandonner={()=>{setActif(false);setSecondes(dureePreferee)}} mettreEnPause={()=>setActif(false)} format={format} pourcentage={(secondes/dureePreferee)*100} /> : 
            <HomeScreenFree t={t} secondes={secondes} actif={actif} jetons={jetons} totalSecondes={totalSec} appsBloquees={appsBloquees} demarrer={()=>setActif(true)} abandonner={()=>{setActif(false);setSecondes(dureePreferee)}} format={format} pourcentage={(secondes/dureePreferee)*100} setEstPremium={setEstPremium} />
          }
        </Tab.Screen>
        <Tab.Screen name="ShopTab" options={{ title: t.shop, tabBarIcon: ({color}) => <ShoppingBag color={color} /> }}>
          {() => estPremium ? 
             <ShopScreenPremium t={t} appsBloquees={appsBloquees} toggleApp={(n)=>{if(appsBloquees.includes(n)) setAppsBloquees(appsBloquees.filter(a=>a!==n)); else if(appsBloquees.length<5) setAppsBloquees([...appsBloquees,n]);}} modeSombre={modeSombre} /> : 
             <ShopScreenFree t={t} jetons={jetons} setJetons={setJetons} appsBloquees={appsBloquees} toggleApp={(n)=>{if(appsBloquees.includes(n)) setAppsBloquees(appsBloquees.filter(a=>a!==n)); else if(appsBloquees.length<1) setAppsBloquees([...appsBloquees,n]);}} />
          }
        </Tab.Screen>
        <Tab.Screen name="SettingsTab" options={{ title: t.settings, tabBarIcon: ({color}) => <SettingsIcon color={color} /> }}>
          {() => estPremium ? 
            <SettingsScreenPremium t={t} langue={langue} changerLangue={setLangue} dureeActuelle={dureePreferee} changerDuree={(d)=>{setDureePreferee(d);setSecondes(d)}} reinitialiser={()=>setJetons(0)} setEstPremium={setEstPremium} modeSombre={modeSombre} setModeSombre={setModeSombre} /> : 
            <SettingsScreenFree t={t} langue={langue} changerLangue={setLangue} dureeActuelle={dureePreferee} changerDuree={(d)=>{setDureePreferee(d);setSecondes(d)}} reinitialiser={()=>setJetons(0)} setEstPremium={setEstPremium} />
          }
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}