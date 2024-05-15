<script setup>
import UserForm from "@/components/UserForm.vue"; // 引入用戶表單組件
import InputForm from "@/components/InputForm.vue"; // 引入輸入表單組件

import { onMounted, ref } from "vue";
import axios from "axios";

const userData = ref([]); // 定義用戶數據的ref
const searchVal = ref(""); // 定義搜索值的ref
const selectedUser = ref(null); // 定義選定用戶的ref
const selectedPage = ref(1); // 定義當前頁碼的ref
const allUser = ref([]); // 定義所有用戶的ref

const queryData = async () => {
  try {
    const response = await axios.get(`/api/users/${searchVal.value}`, {
      params: { page: selectedPage.value },
    }); // 發送帶有搜索值和頁碼的請求
    if (response.status === 200) {
      // 如果請求成功
      // 填充表單
      userData.value = response.data; // 將返回的用戶數據填充至userData
    }
  } catch (e) {
    console.error("Err!! searchData: ", e);
    if (e.response.status === 404) {
      alert("用戶不存在");
    } else {
      console.log("error to get user by id: ", e);
      alert("查詢用戶失敗");
    }
  }
};

// 獲取該用戶資料
const handleUserClick = (user) => {
  selectedUser.value = user; // 更新選定的用戶

  // 檢查是否為直接編輯數據
  if (selectedUser.value.id) {
    // 如果是，將ID欄位設置為只讀
    document.getElementById("id").readOnly = true; // 設置ID欄位為只讀
  }
};

// 在組件創建時獲取用戶數據
onMounted(async () => {
  await queryData(); // 創建時執行queryData函數
});

// 修改搜尋
const changeSearch = async (val) => {
  searchVal.value = val; // 更新搜索值
  await queryData(); // 執行queryData函數
};

// 排序
const direction = ref("DESC"); // 定義排序方向的ref
const sortBy = (type) => {
  if (direction.value === "DESC") {
    // 如果排序方向為降序
    userData.value.result.sort((a, b) => (a[type] > b[type] ? 1 : -1)); // 根據類型進行降序排序
    direction.value = "ASC"; // 更新排序方向為升序
  } else if (direction.value === "ASC") {
    // 如果排序方向為升序
    userData.value.result.sort((a, b) => (a[type] < b[type] ? 1 : -1)); // 根據類型進行升序排序
    direction.value = "DESC"; // 更新排序方向為降序
  }
};

// 頁數查找
const changePage = async (page) => {
  if (page < 1 || page > userData.value.pages) return; // 如果頁碼超出範圍，則返回
  selectedPage.value = page; // 更新當前頁碼
  await queryData();
};
</script>

<template>
  <div class="flex gap-5 p-10 h-screen">
    <!-- 左側表單 -->
    <div class="flex flex-col w-1/3 items-center justify-center">
      <!-- 傳遞事件和選定用戶至InputForm組件 -->
      <InputForm @get-data="queryData" :selectedUser="selectedUser" />
    </div>

    <!-- 右側用戶表單 -->
    <div class="w-2/3 h-full">
      <UserForm
        :user-data="userData"
        :all-user="allUser"
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
