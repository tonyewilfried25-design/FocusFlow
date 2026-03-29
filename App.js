{
  "expo": {
    "name": "FocusFlow",
    "slug": "focusflow",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "android": {
      "package": "com.tonye.focusflow",
      "permissions": [
        "PACKAGE_USAGE_STATS",
        "SYSTEM_ALERT_WINDOW",
        "VIBRATE"
      ],
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "extra": {
      "eas": {
        "projectId": "V3544654f-9919-4c1f-990c-eea818c29056"
      }
    },
    "owner": "tonye01",
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": ["https://www.jitpack.io"]
          }
        }
      ]
    ]
  }
}