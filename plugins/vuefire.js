export default defineNuxtPlugin(() => {
    const firebaseApp = useFirebaseApp();
  
    if (!firebaseApp) {
      console.error('Firebase App nie została zainicjalizowana.');
      return;
    }
  
    console.log('Firebase App Initialized:', firebaseApp.name); // Powinien wyświetlić "[DEFAULT]"
  });