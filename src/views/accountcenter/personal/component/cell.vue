<script setup lang="ts">
import type { Component } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({
  name: "PersonalCell"
});

defineProps({
  iconClass: {
    type: String
  },
  icon: {
    type: [String, Object] as PropType<string | Component>
  },
  title: {
    type: String
  },
  desc: {
    type: String
  },
  bindType: {
    type: Boolean
  }
});
</script>

<template>
  <div class="flex items-center gap-4 py-3 px-2">
    <div class="size-16 flex justify-center items-center bg-gray-100">
      <component
        :is="useRenderIcon(icon)"
        :class="['w-[30px] h-[30px]', iconClass]"
      />
    </div>
    <div class="flex-1 flex flex-col gap-2 justify-evenly">
      <strong>{{ title }}</strong>
      <el-text class="!self-start" size="small" type="info">{{ desc }}</el-text>
    </div>
    <el-button type="primary">立即绑定</el-button>
  </div>
</template>
