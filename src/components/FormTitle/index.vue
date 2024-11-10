<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ""
  }
});
</script>
<template>
  <div
    class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
  >
    {{ title }}
  </div>
</template>
