<script setup>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const auth = getAuth();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  console.log('Próba logowania z:', email.value, password.value);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('Zalogowano użytkownika:', userCredential.user);
    navigateTo('/');
  } catch (error) {
    console.error('Błąd logowania:', error);
    errorMessage.value = `Błąd: ${error.message}`;
  }
};
</script>

<template>
  <ClientOnly>
  <div class="login-container">
    <h1>Logowanie</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" placeholder="Wprowadź email" required />
      </div>
      <div>
        <label for="password">Hasło:</label>
        <input v-model="password" type="password" id="password" placeholder="Wprowadź hasło" required />
      </div>
      <button type="submit">Zaloguj</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p>Nie masz konta? <a href="/register">Zarejestruj się tutaj</a></p>
  </div>
</ClientOnly>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
