<script setup>
import { reactive, watchEffect, defineProps } from "vue";
import { idVerify } from "@/utils/idVerify.js";
import { inputVerify } from "@/utils/inputVerify.js";
import { checkInput, checkUserInput } from "@/utils/checkInput.js";
import axios from "axios";

const emit = defineEmits(["getData"]);
const props = defineProps({
  selectedUser: Object,
});

// 收集用戶輸入資料
const userData = reactive({
  id: "",
  name: "",
  phone: "",
  address: "",
  remark: "",
});

// 清空用戶資料
const clearUserData = () => {
  userData.id = "";
  userData.name = "";
  userData.phone = "";
  userData.address = "";
  userData.remark = "";

  clearErrorMessage();
};

// 將選中的數據傳送至input框中
watchEffect(() => {
  if (props.selectedUser) {
    userData.id = props.selectedUser.id;
    userData.name = props.selectedUser.name;
    userData.phone = props.selectedUser.phone;
    userData.address = props.selectedUser.address;
    userData.remark = props.selectedUser.remark;
  }
});

// 收集錯誤訊息
const errorMessage = reactive({
  id: "",
  name: "",
  phone: "",
  address: "",
});

// 清空錯誤訊息
const clearErrorMessage = () => {
  errorMessage.id = "";
  errorMessage.name = "";
  errorMessage.phone = "";
  errorMessage.address = "";
  document.getElementById("id").readOnly = false; // 解除只读状态
};

// 處理保存數據時的錯誤
const handleError = (error, key = "id") => {
  errorMessage[key] = error.message; // 將錯誤訊息設置到errorMessage中
};

// // 檢查輸入框是否為空，如果為空禁用按鈕
// const disableSaveButton = () => {
//   const saveButton = document.getElementById("saveData");
//   if (!saveButton) return;

//   if (!userData.id || !userData.name || !userData.phone || !userData.address) {
//     saveButton.disabled = true;
//   } else {
//     saveButton.disabled = false;
//   }
// };

// // 啟用保存按鈕
// const enableSaveButton = () => {
//   const saveButton = document.getElementById("saveData");
//   if (saveButton) {
//     saveButton.disabled = false;
//   }
// };

// 保存用戶數據
const saveData = async () => {
  // 清除錯誤訊息
  clearErrorMessage();

  try {
    // 檢查用戶輸入是否包含惡意字符
    if (!checkInput(userData)) {
      return;
    }

    // 檢查用戶id輸入
    if (!userData.id) {
      alert("請選擇您想修改的用戶資料");
      return;
    }

    // 檢查必填項目
    const emptyInputs = inputVerify(userData);
    if (emptyInputs.length > 0) {
      emptyInputs.forEach((item) => {
        handleError({ message: "修改資料不得為空" }, item);
      });
      return;
    }

    // 向後端發送請求檢查用戶id是否存在
    const checkResponse = await axios.get(`/api/users/${userData.id}`);
    const data = checkResponse.data.result;
    if (data.length !== 0) {
      // 用戶id存在，執行保存操作
      const response = await axios.put(`/api/users/${userData.id}`, userData);

      if (response.status === 200) {
        console.log("User updated: ", response.data);
        alert(`身分證字號：${userData.id} 用戶資料更新成功！`);
        clearUserData();
        emit("getData");

        // disableSaveButton();
      }
    } else {
      // 用戶id不存在，提示用戶
      alert(`用戶${userData.id}不存在`);
    }
  } catch (e) {
    console.error("Err! SaveData: ", e);
    alert("保存用戶數據錯誤");
    handleError(e);
  }
};

// 新增用戶
const addNew = async () => {
  // 清除錯誤訊息
  clearErrorMessage();

  // Fetch POST
  try {
    // 檢查用戶輸入是否包含惡意字符
    if (!checkUserInput(userData)) {
      return;
    }

    const userId = userData.id.trim();
    userData.id = userId;

    // 檢查身分證字號
    if (!idVerify(userData.id)) {
      return;
    }

    // 檢查必填項目
    const emptyInputs = inputVerify(userData);
    if (emptyInputs.length > 0) {
      emptyInputs.forEach((item) => {
        handleError({ message: "必填項目未填" }, item);
      });
      return;
    }

    const checkResponse = await axios.get(`/api/users/${userData.id}`);

    const data = checkResponse.data.result;
    console.log(checkResponse);
    console.log(data);
    if (data.length === 0) {
      console.log(checkResponse);
      const response = await axios.post("/api/users", userData);
      if (response.status === 200) {
        clearUserData();
        console.log(`New user added:${userData.id}`, response.data);
        alert("新增用戶成功！");
        emit("getData");
      }
    }else{
        alert(`身分證${userData.id}已存在，請輸入其他身分證`)
        return;
      }
  } catch (e) {
    console.error("Err!! addNew: ", e);
    alert("新增用戶失敗!");
  }
};

function delCheck (userData){
  let msg = `確認刪除
  ID:${userData.id}
  用戶:${userData.name}
  電話:${userData.phone}
  地址:${userData.address}
  備註:${userData.remark}
  
  注意!此操作不可復原!`
  if(confirm(msg) == true){
    return true;
  }else{
    return false;
  }
}

// 刪除用戶
const deleteItem = async () => {
  // 清除錯誤訊息
  clearErrorMessage();

  // id為空處理
  if (userData.id === "") {
      handleError({ message: "請輸入要刪除的身分證字號" }, "id");
      return;
    }

  try {
    // 檢查用戶輸入是否包含惡意字符
    if (!checkUserInput(userData.id)) {
      return;
    }

    const checkResponse = await axios.get(`/api/users/${userData.id}`);
    const data = checkResponse.data;
    if(data.length !== 0){
      const check = delCheck(userData);

      if(check === true){
        const response = await axios.delete(`/api/users/${userData.id}`);
        if (response.status === 200) {
        console.log("User deleted", response.data);
        clearUserData();
        alert("刪除用戶成功！");
        emit("getData");
        }
      } else {
        alert("取消刪除");
        return;
      }
      
    } else if(data.length === 0){
      console.error("User deleted error", response.status);
      alert("用戶不存在");
    }
  } catch (e) {
    console.error("Err!! deleteItem: ", e);
    alert("刪除用戶失敗!");
  }
};

// 查詢用戶資料
const searchData = async () => {
  // 清除錯誤訊息
  clearErrorMessage();

  userData.id = userData.id.trim();
  
  if (userData.id === "") {
    handleError({ message: "請輸入要查詢的身分證字號" }, "id");
    return;
  }

  try {
    // 檢查用戶輸入是否包含惡意字符
    if (!checkUserInput(userData.id)) {
      return;
    }

    const response = await axios.get(`/api/users/${userData.id}`);
    if (response.status === 200) {
      // 填充表單
      const data = response.data.result[0];
      userData.name = data.name;
      userData.phone = data.phone;
      userData.address = data.address;
      userData.remark = data.remark;

      // 設置id輸入框
      if (userData.id) {
        document.getElementById("id").readOnly = true;
      } else {
        // 如果不是直接編輯數據，則將輸入框設置為可編輯狀態
        document.getElementById("id").readOnly = false;
      }

      // // 保存按鈕
      // enableSaveButton();
    }
  } catch (e) {
    console.error("Err!! searchData: ", e);
    if (
      e.response &&
      (e.response.status === 404 || e.response.status === 500)
    ) {
      alert("用戶不存在");
    } else {
      console.error("error to get user by id: ", e);
      alert("查詢用戶失敗");
    }
  }
};
</script>

<template>
  <div class="container h-full">
    <div
      class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border"
    >
      <div class="h-full w-full flex flex-col items-center justify-center">
        <h1 class="text-3xl justify-self-center pt-9 pb-7">個人資料</h1>
        <div
          class="grow w-full pt-2 px-6 flex flex-col content-center overflow-auto"
        >
          <!-- 身分證字號輸入框 -->
          <div class="relative h-10 w-full">
            <input
              placeholder="A123456789"
              id="id"
              v-model="userData.id"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label
              for="id"
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              身分證字號
            </label>
          </div>
          <div
            v-if="errorMessage.id"
            class="shadow-sm overflow-hidden flex items-center p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              class="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
              />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">注意！</span>{{ errorMessage.id }}
            </div>
          </div>

          <!-- 姓名輸入框 -->
          <div class="relative h-10 w-full mt-5">
            <input
              placeholder="王小明"
              id="name"
              v-model="userData.name"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label
              for="name"
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              姓名
            </label>
          </div>
          <div
            v-if="errorMessage.name"
            class="shadow-sm overflow-hidden flex items-center p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              class="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
              />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">注意！</span>{{ errorMessage.name }}
            </div>
          </div>

          <!-- 電話輸入框 -->
          <div class="relative h-10 w-full mt-5">
            <input
              placeholder="0912345678"
              id="phone"
              v-model="userData.phone"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label
              for="phone"
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              電話
            </label>
          </div>
          <div
            v-if="errorMessage.phone"
            class="shadow-sm overflow-hidden flex items-center p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              class="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
              />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">注意！</span>{{ errorMessage.phone }}
            </div>
          </div>

          <!-- 地址 -->
          <div class="relative h-10 w-full mt-5">
            <input
              placeholder="地球台灣"
              id="address"
              v-model="userData.address"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label
              for="address"
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              地址
            </label>
          </div>
          <div
            v-if="errorMessage.address"
            class="shadow-sm overflow-hidden flex items-center p-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              class="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
              />
            </svg>
            <span class="sr-only">Info</span>
            <div>
              <span class="font-medium">注意！</span>{{ errorMessage.address }}
            </div>
          </div>

          <!-- 備註輸入框 -->
          <div class="relative h-10 w-full mt-5">
            <input
              placeholder="珍珠奶茶"
              id="remark"
              v-model="userData.remark"
              class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100"
            />
            <label
              for="remark"
              class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 mb-10"
            >
              備註
            </label>
          </div>
        </div>

        <!--   按鈕：增刪改查   -->
        <div
          class="shrink-0 w-full flex gap-3 justify-between py-4 px-6 border-t border-blue-gray-50 overflow-auto"
        >
          <button
            @click="addNew"
            class="bg-white select-none rounded-lg border border-gray-900 py-2 px-4 text-center whitespace-nowrap align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            新增
          </button>
          <button
            @click="saveData"
            class="bg-white select-none rounded-lg border border-gray-900 py-2 px-4 text-center whitespace-nowrap align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            儲存
          </button>
          <button
            @click="searchData"
            class="bg-white select-none rounded-lg border border-gray-900 py-2 px-4 text-center whitespace-nowrap align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            查詢
          </button>
          <button
            @click="deleteItem"
            class="bg-white select-none rounded-lg border border-gray-900 py-2 px-4 text-center whitespace-nowrap align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            刪除
          </button>
          <button
            @click="clearUserData"
            class="bg-white select-none rounded-lg border border-gray-900 py-2 px-4 text-center whitespace-nowrap align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            清除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
