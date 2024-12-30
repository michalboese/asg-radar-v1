<script setup>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const handleRegister = async () => {
  console.log('Próba rejestracji z:', email.value, password.value);

  // Walidacja hasła i jego potwierdzenia
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Hasła nie są takie same.';
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log('Zarejestrowano użytkownika:', userCredential.user);
    successMessage.value = 'Konto zostało utworzone pomyślnie!';
    errorMessage.value = ''; // Wyczyść komunikat błędu
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    errorMessage.value = `Błąd: ${error.message}`;
    successMessage.value = ''; // Wyczyść komunikat sukcesu
  }
};
</script>

<template>
  <div class="register-container">
    <h1>Rejestracja</h1>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" placeholder="Wprowadź email" required />
      </div>
      <div>
        <label for="password">Hasło:</label>
        <input v-model="password" type="password" id="password" placeholder="Wprowadź hasło" required />
      </div>
      <div>
        <label for="confirm-password">Potwierdź hasło:</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirm-password"
          placeholder="Potwierdź hasło"
          required
        />
      </div>
      <button type="submit">Zarejestruj</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p>Masz już konto? <a href="/login">Zaloguj się tutaj</a></p>
  </div>
</template>

<style scoped>
.register-container {
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

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
