<script setup>
defineProps({
  value: String
});
</script>

<template>
  <div
    class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
  >
    {{ value }}
  </div>
</template>
