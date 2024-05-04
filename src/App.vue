<script setup>
import UserForm from '@/components/UserForm.vue';
import InputForm from '@/components/InputForm.vue';

import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';

const userData = ref([]);
const searchVal = ref('');
const selectedUser = ref(null);
const selectedPage = ref(1);

const queryData = async () => {
  try {
    const response = await axios.get(`/api/users/${searchVal.value}`, {params: { page: selectedPage.value }});
    if(response.status === 200){
      // 填充表單
      userData.value = response.data;
    }
  } catch (e) {
    console.error('Err!! searchData: ', e);
    if(e.response.status === 404){
      alert('用戶不存在');
    }else{
      console.log('error to get user by id: ', e);
      alert('查詢用戶失敗');
    }
  }
}

// 獲取該用戶資料
const handleUserClick = (user) => {
  selectedUser.value = user;
};

// 在組件創建時獲取用戶數據
onMounted(async () => {
  await queryData();
});

// 修改搜尋
const changeSearch = async (val) => {
  searchVal.value = val;
  await queryData();
}

// 排序
const direction = ref('DESC');
const sortBy = (type) => {
  if (direction.value === 'DESC') {
    userData.value.result.sort((a, b) => a[type] > b[type] ? 1 : -1 );
    direction.value = 'ASC';
  } else if (direction.value === 'ASC') {
    userData.value.result.sort((a, b) => a[type] < b[type] ? 1 : -1 );
    direction.value = 'DESC';
  }
}

// 頁數查找
const changePage = async (page) => {
  if (page < 1 || page > userData.value.pages) return;
  selectedPage.value = page;
  await queryData();
}
</script>

<template>
  <div class="flex gap-5 p-10 h-screen">
    <div class="flex flex-col w-1/3 items-center justify-center">
      <InputForm @get-data="queryData" :selectedUser="selectedUser"/>
    </div>

    <div class="w-2/3 h-full">
      <UserForm
          :user-data="userData"
          :searchVal="searchVal"
          :selectedPage="selectedPage"
          @clickUser="handleUserClick"
          @searchData="queryData"
          @changeSearch="changeSearch"
          @changeSort="sortBy"
          @change-page="changePage"
      />
    </div>
  </div>
</template>

<style scoped></style>
