<script setup>
import { useFirebaseAuth } from 'vuefire'

const activeTab = ref('login')
const email = ref('')
const password = ref('')
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = useFirebaseAuth()

const login = async () => {
  try {
    await signInWithEmailAndPassword(email.value, password.value)
    alert('Zalogowano pomyślnie!')
  } catch (error) {
    alert('Błąd logowania: ' + error.message)
  }
}

const register = async () => {
  try {
    await createUserWithEmailAndPassword(email.value, password.value)
    alert('Rejestracja zakończona sukcesem!')
  } catch (error) {
    alert('Błąd rejestracji: ' + error.message)
  }
}
</script>

<template>
  <div class="auth-container">
    <n-card class="auth-card">
      <n-tabs v-model="activeTab">
        <n-tab name="login" title="Logowanie">
          <form @submit.prevent="login">
            <n-input v-model="email" label="Email" type="email" required />
            <n-input v-model="password" label="Hasło" type="password" required />
            <n-button type="submit" label="Zaloguj się" class="mt-4" />
          </form>
        </n-tab>
        <n-tab name="register" title="Rejestracja">
          <form @submit.prevent="register">
            <n-input v-model="email" label="Email" type="email" required />
            <n-input v-model="password" label="Hasło" type="password" required />
            <n-button type="submit" label="Zarejestruj się" class="mt-4" />
          </form>
        </n-tab>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.auth-card {
  width: 400px;
  padding: 20px;
}
</style>
