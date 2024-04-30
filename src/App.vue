<script setup>
import UserForm from "@/components/UserForm.vue";
import InputForm from "@/components/InputForm.vue";

import axios from "axios";
import { onMounted } from "vue";
onMounted(async () => {
  // const res = await axios.post("/api/users", {
  //   id: "A123456789",
  //   name: "Test",
  //   phone: "0900123456",
  //   address: "TEST",
  //   remark: "no",
  // });
  // console.log(res);
//
});
</script>

<template>
  <div class="flex p-10 h-screen">
    <div class="flex flex-col pr-5 w-1/3 items-center justify-center">
      <InputForm />
    </div>
    <UserForm />
  </div>
</template>

<style scoped></style>
