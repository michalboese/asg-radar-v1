<script setup lang="ts">
import { useCollection } from 'vuefire';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useUsersStore } from '@/stores/usersStore';

const usersStore = useUsersStore();
await usersStore.fetchAllUsers();
const chatContainer = ref<HTMLElement | null>(null);

const auth = getAuth();

const currentUser = computed(() => usersStore.users.find(user => user.email === auth.currentUser?.email));
  
// Połączenie z kolekcją w Firestore
const messagesCollection = collection(useFirestore(), 'messages');
const messages = useCollection(messagesCollection);

const eventId = useParam('event');

const filteredMessages = computed(() => {
  return messages.value
    .filter(message => message.eventId === eventId)
    .sort((a, b) => a.timestamp - b.timestamp);
});

// Stan lokalny wiadomości
const newMessage = ref('');

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    console.log('Wysyłam wiadomość:', eventId);
    await addDoc(messagesCollection, {
      eventId: eventId,
      content: newMessage.value,
      username: currentUser.value?.firstName + ' ' + currentUser.value?.lastName,
      email: currentUser.value?.email,
      timestamp: serverTimestamp(),
    });
    newMessage.value = '';
    await nextTick();
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  }
};

onMounted(() => {
  if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
});
</script>

<template>
  <div class="chat" ref="chatContainer">
    <div v-for="message in filteredMessages" :key="message.id" class="flex flex-col pr-4">
      <div v-if="message.email === currentUser?.email" class="myMessage ml-auto mt-4"> 
        {{ message.username }}: {{ message.content }}
      </div>
      <div v-else class="message mr-auto mt-4">
        {{ message.username }}: {{ message.content }}
      </div>
    </div>
  </div>
  <form @submit.prevent="sendMessage">
    <div class="flex flex-row gap-4 mt-4">
      <UInput v-model="newMessage" placeholder="Napisz wiadomość" class="w-full"/>
      <UButton icon="i-heroicons-chevron-right" type="submit"/>
    </div>
  </form>
</template>
  
  <style scoped lang="scss">  
@use "@/assets/styles/colors.scss";

  .chat{
    height: 600px;
    overflow-y: scroll;
  }

  .message {
    padding: 8px;
    border-radius: 8px;
    border: 2px solid colors.$primary;
    color: colors.$primary;
    max-width: 70%;
    overflow-wrap: break-word;
  }

  .myMessage {
    padding: 8px;
    border-radius: 8px;
    color: black;
    background-color: colors.$primary;
    max-width: 70%;
    overflow-wrap: break-word;
  }

  </style>
  