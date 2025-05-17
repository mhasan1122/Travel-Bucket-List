# 🌍 WanderList – Travel Bucket List App

A beautiful **React Native frontend-only app** built with Expo. Plan your dream travels by creating a personal bucket list with custom destinations and images from your gallery.

![WanderList Demo](demo.gif) <!-- Optional: replace with your own gif or screenshot -->

---

## ✨ Features

- 📌 Add custom destinations with name, notes, and images
- 🖼️ Pick photos from your device (via `expo-image-picker`)
- 📋 View and manage your travel bucket list
- ✅ Mark destinations as visited
- 🌓 Dark mode support (via Tailwind / NativeWind)
- 💾 Offline storage using AsyncStorage (or MMKV)
- 🗺️ Optional map view of visited places (via `react-native-maps`)

---

## 🛠️ Tech Stack

- **React Native (Expo)**
- **TypeScript**
- **AsyncStorage / MMKV** (local data storage)
- **expo-image-picker** (image input)
- **react-navigation** (screen navigation)
- **NativeWind** (Tailwind CSS styling)
- **react-native-vector-icons** (icons)
- **Lottie** (optional animations)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/wanderlist-app.git
cd wanderlist-app
npm install
npx expo start
````

---

## 📸 Image Picker Example

Uses `expo-image-picker` to select destination images:

```tsx
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.7,
});
```

---

## 📁 Project Structure

```
/screens
  └── AddDestination.tsx
  └── BucketList.tsx
/components
  └── DestinationCard.tsx
/utils
  └── storage.ts
App.tsx
```

---

## 📌 Future Ideas

* Cloud sync support
* Categories & filters (e.g., by continent)
* Travel quote of the day
* Social sharing of your list

---
