<script setup>
import { defineProps, defineEmits, computed } from "vue";

// 定義組件的屬性，'pages' 表示總頁數，'selectedPage' 表示當前選中的頁面
const props = defineProps(["pages", "selectedPage"]);
// 定義組件發出的事件，這裡只有一個 'changePage' 事件，用於通知頁面變更
const emits = defineEmits(["changePage"]);

// 計算屬性 'editedPages'，根據不同的條件生成頁碼列表
const editedPages = computed({
  get() {
    // 如果頁數小於等於7，直接返回所有頁碼
    if (props.pages <= 7) return props.pages;

    // 如果當前選中的頁面小於5，顯示前5頁和最後一頁
    if (props.selectedPage < 5)
      return [1, 2, 3, 4, 5].concat(["...", props.pages]);

    // 如果當前選中的頁面接近末尾，顯示前1頁、省略號和最後5頁
    if (props.selectedPage >= props.pages - 4) {
      return [1, "..."].concat([
        props.pages - 4,
        props.pages - 3,
        props.pages - 2,
        props.pages - 1,
        props.pages,
      ]);
    }

    // 如果當前選中的頁面在中間位置，顯示前1頁、省略號、當前頁的前後各一頁和最後一頁
    if (props.selectedPage < props.pages - 4) {
      return [1, "..."]
        .concat([
          props.selectedPage - 1,
          props.selectedPage,
          props.selectedPage + 1,
        ])
        .concat(["...", props.pages]);
    }
  },
});
</script>

<template>
  <!-- 上一頁按鈕，當前頁面減一 -->
  <button
    class="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    type="button"
    @click="emits('changePage', props.selectedPage - 1)"
  >
    Previous
  </button>

  <!-- 頁碼按鈕列表 -->
  <div class="flex items-center gap-2">
    <button
      v-for="(page, index) in editedPages"
      :key="index"
      class="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      :class="
        page === props.selectedPage
          ? 'border focus:ring focus:ring-gray-300 hover:opacity-75 active:opacity-[0.85]'
          : 'hover:bg-gray-900/10 active:bg-gray-900/20'
      "
      type="button"
      @click="
        emits(
          'changePage',
          typeof page === 'number'
            ? page
            : index + 1 < props.selectedPage
              ? props.selectedPage - 1
              : props.selectedPage + 1,
        )
      "
    >
      <span
        class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      >
        {{ page }}
      </span>
    </button>
  </div>

  <!-- 下一頁按鈕，當前頁面加一 -->
  <button
    class="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    type="button"
    @click="emits('changePage', props.selectedPage + 1)"
  >
    Next
  </button>
</template>

<style scoped></style>
