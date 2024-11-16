<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  tabs: Array
});
const emits = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  }
});
</script>

<template>
  <div class="rounded-xl p-2 bg-slate-100 flex items-center">
    <div
      v-for="item of tabs"
      :key="item.value"
      :class="[
        'font-bold w-[120px] text-center py-2 rounded-xl text-sm',
        value === item.value ? 'text-[#5570E2] bg-white' : 'text-slate-500'
      ]"
      @click="value = item.value"
    >
      {{ item.label }}
    </div>
  </div>
</template>
