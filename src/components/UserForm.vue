<script setup>
import { computed, defineEmits, defineProps } from "vue";
import FormPage from "@/components/FormPage.vue";
import { exportToExcel } from "../utils/exportUtils.js";
import { exportToPdf } from "../utils/exportUtils.js";
import axios from "axios";

// 定義組件屬性
const props = defineProps(["userData", "searchVal", "selectedPage", "allUser"]);
// 定義組件事件
const emits = defineEmits([
  "clickUser", // 點擊用戶事件
  "searchData", // 搜尋數據事件
  "changeSearch", // 改變搜尋事件
  "changeSort", // 改變排序事件
  "changePage", // 改變頁數事件
]);

// 處理用戶點擊事件
const handleClick = (user) => {
  emits("clickUser", user);
};

// 搜尋內容的計算屬性
const searchValue = computed({
  get() {
    return props.searchVal.trim(); // 返回修剪過的搜尋值
  },
  set(val) {
    emits("changeSearch", val); // 當搜尋值改變時，發出 changeSearch 事件
  },
});

// 傳遞頁數的函數
const changePage = (page) => {
  emits("changePage", page); // 發出 changePage 事件並傳遞頁數
};

// 匯出全部用戶資料到 Excel 的函數
const exportAllToExcel = async () => {
  try {
    // 發送 GET 請求獲取所有用戶資料
    // 調用 exportToExcel 方法並傳遞 allUser
    const response = await axios.get("api/users");
    if (response.status === 200) {
      // 調用 exportToExcel 方法並傳遞 allUser 資料
      await exportToExcel(response.data.allUser);
      console.log("Excel匯出成功"); // 打印成功訊息
    }
  } catch (e) {
    console.error("Error to export Data: ", e);
    alert("Excel下載失敗");
  }
};

// 匯出全部用戶資料到 PDF 的函數
const exportAllToPDF = async () => {
  try {
    // 調用 exportToExcel 方法並傳遞 allUser
    const response = await axios.get("api/users");
    if (response.status === 200) {
      // 調用 exportToPdf 方法並傳遞 allUser 資料
      await exportToPdf(response.data.allUser);
      console.log("PDF匯出成功");
    }
  } catch (e) {
    console.error("Error to export Data: ", e);
    alert("PDF下載失敗");
  }
};

// 計算 tempData 的屬性
const tempData = computed({
  get() {
    const arr = props.userData?.result; // 獲取 userData 的結果數組
    if (!arr || arr.length === 0) return []; // 如果結果數組不存在或為空，返回空數組
    const keys = Object.keys(arr[0]); // 獲取數組中第一個元素的鍵
    const times = 4 - arr.length; // 計算需要填充的次數，使數組長度達到 4
    for (let i = 0; i < times; i++) {
      const tp = {};
      keys.forEach((key) => {
        tp[key] = null; // 為每個鍵設置值為 null
      });
      arr.push(tp); // 將填充對象推入數組
    }
    return arr; // 返回填充後的數組
  },
});
</script>

<template>
  <form class="container h-full" @submit.prevent>
    <div
      class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border"
    >
      <!-- Header -->
      <div
        class="shrink-0 relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border"
      >
        <div class="flex flex-col justify-between gap-8 mb-4">
          <div>
            <h5
              class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900"
            >
              Member
            </h5>
            <p
              class="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700"
            >
              These are details about the members
            </p>
          </div>
          <div class="flex w-full gap-2 shrink-0">
            <div class="grow">
              <div class="relative h-10 w-full min-w-[200px]">
                <div
                  class="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                <input
                  v-model="searchValue"
                  class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  @keyup.enter="emits('searchData', searchVal)"
                />
                <label
                  class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                >
                  Search
                </label>
              </div>
            </div>

            <!--EXCEL-->
            <button
              class="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              @click="exportAllToExcel()"
            >
              <svg
                aria-hidden="true"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              EXCEL
            </button>

            <!--PDF-->
            <button
              class="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              @click="exportAllToPDF()"
            >
              <svg
                aria-hidden="true"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="grow p-6 px-0 overflow-y-hidden">
        <table class="h-full w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <button
                  class="sortButton flex"
                  @click="emits('changeSort', 'id')"
                >
                  <p
                    class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
                  >
                    身分證字號
                  </p>
                  <svg
                    aria-hidden="true"
                    class="w-3 h-3 ms-1.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                    />
                  </svg>
                </button>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <button
                  class="sortButton flex"
                  @click="emits('changeSort', 'name')"
                >
                  <p
                    class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
                  >
                    姓名
                  </p>
                  <svg
                    aria-hidden="true"
                    class="w-3 h-3 ms-1.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                    />
                  </svg>
                </button>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <button
                  class="sortButton flex"
                  @click="emits('changeSort', 'phone')"
                >
                  <p
                    class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
                  >
                    電話
                  </p>
                  <svg
                    aria-hidden="true"
                    class="w-3 h-3 ms-1.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"
                    />
                  </svg>
                </button>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
                >
                  地址
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
                >
                  備註
                </p>
              </th>
              <th class="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"
                ></p>
              </th>
            </tr>
          </thead>
          <!--          表格內容-->
          <tbody>
            <tr v-for="user in tempData" :key="user.id" class="h-1/4">
              <td class="p-4 border-b border-blue-gray-50">
                <div class="flex items-center gap-3">
                  <p
                    class="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900"
                  >
                    {{ user.id }}
                  </p>
                </div>
              </td>
              <td class="p-4 border-b border-blue-gray-50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
                >
                  {{ user.name }}
                </p>
              </td>
              <td class="p-4 border-b border-blue-gray-50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
                >
                  {{ user.phone }}
                </p>
              </td>
              <td class="p-4 border-b border-blue-gray-50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
                >
                  {{ user.address }}
                </p>
              </td>
              <td class="p-4 border-b border-blue-gray-50">
                <p
                  class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
                >
                  {{ user.remark }}
                </p>
              </td>
              <td class="p-4 border-b border-blue-gray-50">
                <button
                  v-if="user.id"
                  class="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  @click="handleClick(user)"
                >
                  <span
                    class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  >
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
                      ></path>
                    </svg>
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- page -->
      <div
        class="flex items-center justify-between p-4 border-t border-blue-gray-50"
      >
        <FormPage
          :pages="props.userData.pages"
          :selected-page="props.selectedPage"
          @change-page="changePage"
        />
      </div>
    </div>
  </form>
</template>

<style scoped></style>
