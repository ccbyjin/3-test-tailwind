<script setup>
import {defineProps, defineEmits, computed} from 'vue';

const props = defineProps(['pages', 'selectedPage']);
const emits = defineEmits(['changePage']);

const editedPages = computed({
  get() {
    if (props.pages <= 7) return props.pages;
    if (props.selectedPage < 5) return [1, 2, 3, 4, 5].concat(['...', props.pages]);
    if (props.selectedPage >= props.pages - 4) {
      return [1, '...'].concat([props.pages - 4, props.pages - 3, props.pages - 2, props.pages - 1, props.pages]);
    }
    if (props.selectedPage < props.pages - 4) {
      return [1, '...'].concat([props.selectedPage - 1, props.selectedPage, props.selectedPage + 1]).concat(['...', props.pages]);
    }
  },
})
</script>

<template>
  <button
      class="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button" @click="emits('changePage', props.selectedPage - 1)"
  >
    Previous
  </button>
  <div class="flex items-center gap-2">
    <button
        v-for="(page, index) in editedPages" :key="index"
        class="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        :class="page === props.selectedPage ? 'border focus:ring focus:ring-gray-300 hover:opacity-75 active:opacity-[0.85]' : 'hover:bg-gray-900/10 active:bg-gray-900/20'"
        type="button"
        @click="emits('changePage', typeof page === 'number' ? page : index + 1 < props.selectedPage ? props.selectedPage - 1 : props.selectedPage + 1)"
    >
                <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  {{page}}
                </span>
    </button>
  </div>
  <button
      class="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button" @click="emits('changePage', props.selectedPage + 1)"
  >
    Next
  </button>
</template>

<style scoped>

</style>