<script setup lang="ts">
import { computed, ref } from "vue";
import FormTitle from "@/components/FormTitle/index.vue";

const DNSSelect = ref();
const certificateSelect = ref(0);
const certificateOptions = computed(() => {
  return [
    {
      label: "系统默认设置"
    },
    {
      label: "Let's Encrypt"
    },
    {
      label: "ZeroSSL"
    },
    {
      label: "BuyPass.com"
    }
  ];
});
</script>
<template>
  <el-card>
    <template #header> 证书设置 </template>
    <form-title title="证书类型" class="mb-4" />

    <el-radio-group v-model="certificateSelect">
      <el-radio
        v-for="(item, index) in certificateOptions"
        :key="index"
        :value="index"
        size="large"
        border
      >
        <div class="flex gap-2 items-center">
          {{ item.label }}
        </div>
      </el-radio>
    </el-radio-group>

    <form-title title="证书类型" class="mt-8 mb-4" />

    <el-select v-model="DNSSelect" class="!w-60" placeholder="不选择" />
    <el-text type="info" class="mt-4">
      可用于在网站列表一键申请证书时使用的dns api
    </el-text>
  </el-card>
</template>
