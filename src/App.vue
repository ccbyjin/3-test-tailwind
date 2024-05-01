<script setup>
import UserForm from '@/components/UserForm.vue';
import InputForm from '@/components/InputForm.vue';

import { onMounted, ref } from 'vue';
import axios from 'axios';

const userData = ref([]);

const getData = async () => {
  try {
    const response = await axios.get('/api/users');
    if (response.status === 200) userData.value = response.data;
  } catch (e) {
    console.error('Err!! GET user data:', e);
  }
};

// 在組件創建時獲取用戶數據
onMounted(async () => {
  await getData();
});
</script>

<template>
  <div class="flex gap-5 p-10 h-screen">
    <div class="flex flex-col w-1/3 items-center justify-center">
      <InputForm @get-data="getData" />
    </div>

    <div class="w-2/3 h-full">
      <UserForm :user-data="userData" />
    </div>
  </div>
</template>

<style scoped></style>
