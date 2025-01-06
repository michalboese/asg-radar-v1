<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { object, string, ref as yupRef, type InferType } from 'yup'; // Yup
import type { FormSubmitEvent } from '#ui/types'; // Nuxt UI Typy
import { useUsersStore } from '@/stores/usersStore';

const auth = getAuth();
const errorMessage = ref('');

const firebaseErrorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Podane dane uwierzytelniające są nieprawidłowe, nieprawidłowo sformułowane lub wygasły.',
  'auth/user-not-found': 'Nie znaleziono użytkownika z tym adresem e-mail.',
  'auth/wrong-password': 'Podano nieprawidłowe hasło.',
  'auth/email-already-in-use': 'Ten adres e-mail jest już używany.',
  'auth/weak-password': 'Hasło musi mieć co najmniej 6 znaków.',
  'auth/invalid-email': 'Podany adres e-mail jest nieprawidłowy.',
  // Dodaj więcej kodów błędów według potrzeby
};

const items = ref([
  { key: 'login', label: 'Logowanie' },
  { key: 'register', label: 'Rejestracja' },
  { key: 'reset-password', label: 'Resetuj hasło' },
]);

definePageMeta({
  layout: 'default',
});

// Schematy walidacji z Yup
const loginSchema = object({
  email: string().email('Podaj poprawny adres email').required('Email jest wymagany'),
  password: string().min(6, 'Hasło musi mieć co najmniej 6 znaków').required('Hasło jest wymagane'),
});

const registerSchema = object({
  nickName: string().required('Nick jest wymagany'),
  email: string().email('Podaj poprawny adres email').required('Email jest wymagany'),
  password: string().min(6, 'Hasło musi mieć co najmniej 6 znaków').required('Hasło jest wymagane'),
  confirmPassword: string()
    .oneOf([yupRef('password')], 'Hasła muszą być identyczne')
    .required('Powtórzenie hasła jest wymagane'),
  firstName: string().required('Imię jest wymagane'),
  lastName: string().required('Nazwisko jest wymagane'),
  birthDate: string().required('Data urodzenia jest wymagana'),
});

const resetPasswordSchema = object({
  email: string().email('Podaj poprawny adres email').required('Email jest wymagany'),
});

// Typy danych oparte na schematach Yup
type LoginSchema = InferType<typeof loginSchema>;
type RegisterSchema = InferType<typeof registerSchema>;
type ResetPasswordSchema = InferType<typeof resetPasswordSchema>;

// Stany formularzy
const loginForm = reactive<LoginSchema>({
  email: '',
  password: '',
});

const registerForm = reactive<RegisterSchema>({
  nickName: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  birthDate: '',
});

const resetPasswordForm = reactive<ResetPasswordSchema>({
  email: '',
});

// Funkcje obsługi formularzy
const handleLogin = async (data: LoginSchema) => {
  console.log('Próba logowania z:', data.email, data.password);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    console.log('Zalogowano użytkownika:', userCredential.user);
    navigateTo('/');
  } catch (error) {
    const firebaseErrorCode = (error as any).code; // Pobierz kod błędu Firebase
    errorMessage.value = firebaseErrorMessages[firebaseErrorCode] || 'Wystąpił nieznany błąd.';
    console.error('Błąd logowania:', error);
  }
};

const handleRegister = async (data: RegisterSchema) => {
  const usersStore = useUsersStore();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: data.nickName,
    });

    const newUser = {
      email: data.email,
      nickname: data.nickName,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      birthDate: data.birthDate ? Timestamp.fromDate(new Date(data.birthDate)) : null,
      role: 'user' as 'user' | 'organizer' | 'admin', // Poprawienie typu role
    };

    await usersStore.addUser(newUser, user.uid);

    navigateTo('/');
  } catch (error) {
    const firebaseErrorCode = (error as any).code;
    errorMessage.value = firebaseErrorMessages[firebaseErrorCode] || 'Wystąpił nieznany błąd.';
    console.error('Błąd rejestracji:', error);
  }
};

const handleResetPassword = async (data: ResetPasswordSchema) => {
  console.log('Przypomnienie hasła dla:', data.email);
  // Dodaj logikę resetowania hasła
};

// Obsługa wysłania formularza
async function onSubmit(event: FormSubmitEvent<any> & { formKey: string }) {
  const { formKey, data } = event;

  if (formKey === 'login') {
    await handleLogin(data as LoginSchema);
  } else if (formKey === 'register') {
    await handleRegister(data as RegisterSchema);
  } else if (formKey === 'forgot-password') {
    await handleResetPassword(data as ResetPasswordSchema);
  }
}
</script>

<template>
  <div class="layout">
  <ClientOnly>
    <template #fallback>
      <div class="loading-spinner"></div>
    </template>
    <UTabs :items="items" class="w-full mt-10">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <h2>{{ item.label }}</h2>
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </template>

          <UForm
            :schema="item.key === 'login' ? loginSchema : item.key === 'register' ? registerSchema : resetPasswordSchema"
            :state="item.key === 'login' ? loginForm : item.key === 'register' ? registerForm : resetPasswordForm"
            :form-key="item.key"
            @submit="(event) => onSubmit({ ...event, formKey: item.key })"
          >
            <div v-if="item.key === 'login'" class="space-y-3">
              <UFormGroup label="Email" name="email">
                <UInput v-model="loginForm.email" type="email" />
              </UFormGroup>
              <UFormGroup label="Hasło" name="password">
                <UInput v-model="loginForm.password" type="password" />
              </UFormGroup>
            </div>

            <div v-else-if="item.key === 'register'" class="space-y-3">
              <UFormGroup label="Ksywka" name="nickName">
                <UInput v-model="registerForm.nickName" />
              </UFormGroup>
              <UFormGroup label="Email" name="email">
                <UInput v-model="registerForm.email" type="email" />
              </UFormGroup>
              <UFormGroup label="Imię" name="firstName">
                <UInput v-model="registerForm.firstName" />
              </UFormGroup>
              <UFormGroup label="Nazwisko" name="lastName">
                <UInput v-model="registerForm.lastName" />
              </UFormGroup>
              <UFormGroup label="Data urodzenia" name="birthDate">
                <UInput v-model="registerForm.birthDate" type="date" />
              </UFormGroup>
              <UFormGroup label="Hasło" name="password">
                <UInput v-model="registerForm.password" type="password" />
              </UFormGroup>
              <UFormGroup label="Powtórz hasło" name="confirmPassword">
                <UInput v-model="registerForm.confirmPassword" type="password" />
              </UFormGroup>
            </div>

            <div v-else-if="item.key === 'reset-password'" class="space-y-3">
              <UFormGroup label="Email" name="email">
                <UInput v-model="resetPasswordForm.email" type="email" />
              </UFormGroup>
            </div>        
            <div class="flex justify-end mt-6">
              <UButton type="submit">
                {{ item.key === 'login' ? 'Zaloguj' : item.key === 'register' ? 'Zarejestruj' : 'Resetuj hasło' }}
              </UButton>
            </div>
          </UForm>
        </UCard>
      </template>
    </UTabs>
  </ClientOnly>
</div>
</template>

<style scoped>

.layout {
  width: 520px;
  height: 75vh;
  margin: 0px auto 50px;
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

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #e56969;
  margin-top: 10px;
}
</style>
