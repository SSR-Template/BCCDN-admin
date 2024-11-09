<script setup lang="ts">
import Segmented, { type OptionsType } from "@/components/ReSegmented";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { computed, ref } from "vue";

const paySelected = ref(0);
const payOptions = computed<Array<OptionsType>>(() => {
  return [
    {
      label: "微信",
      icon: useRenderIcon("ri:wechat-fill"),
      tip: "月光序曲，沉醉于夜的静谧雅致",
      iconAttrs: { fill: paySelected.value === 0 ? "#fff" : "#000" }
    },
    {
      label: "支付宝",
      icon: useRenderIcon("ri:alipay-fill"),
      tip: "同步时光，界面随晨昏自然呼应",
      iconAttrs: { fill: paySelected.value === 1 ? "#fff" : "#000" }
    },
    {
      label: "转账汇款",
      icon: useRenderIcon("ri:bank-card-fill"),
      tip: "同步时光，界面随晨昏自然呼应",
      iconAttrs: { fill: paySelected.value === 2 ? "#fff" : "#000" }
    }
  ];
});
</script>

<template>
  <div>
    <el-card>
      <div class="flex items-center gap-3">
        <div class="size-12 flex-c rounded-full bg-purple-400">
          <component
            :is="useRenderIcon('ri:line-chart-line')"
            :class="['size-6', 'text-white']"
          />
        </div>
        <div>
          <p class="text-[12px]">可用余额</p>
          <strong class="text-purple-500 font-bold text-2xl">¥ 0</strong>
        </div>
      </div>
    </el-card>
    <el-card class="mt-4">
      <template #header>
        <div class="flex items-center gap-2">
          <div class="size-5 flex-c rounded-full bg-gray-400">
            <component
              :is="useRenderIcon('ri:exchange-dollar-fill')"
              :class="['size-6', 'text-white']"
            />
          </div>
          在线充值
        </div>
      </template>

      <el-radio-group v-model="paySelected">
        <el-radio
          v-for="(item, index) in payOptions"
          :key="index"
          :value="index"
          size="large"
          border
        >
          <div class="flex gap-2 items-center">
            {{ item.label }}
            <component :is="item.icon" :class="['size-6', item.iconAttrs]" />
          </div>
        </el-radio>
      </el-radio-group>

      <div class="mt-4 w-[300px]">
        <el-input-number class="!w-full" placeholder="请输入充值金额">
          <template #prefix>
            <span>￥</span>
          </template>
        </el-input-number>
      </div>

      <template #footer>
        <el-button type="primary"> 确认充值 </el-button>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
:deep(.el-input-number__increase) {
  display: none;
}

:deep(.el-input-number__decrease) {
  display: none;
}
</style>
