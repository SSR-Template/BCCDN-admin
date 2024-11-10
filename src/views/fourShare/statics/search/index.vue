<script setup lang="ts">
import { computed, ref } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";

const dateType = ref("1");
const tableData = ref([]);
const customerDate = ref([]);
const isCustomer = computed(() => dateType.value === "customer");

const bandwidthRef = ref();
const { setOptions: setBandwidthOptions } = useECharts(bandwidthRef);

setBandwidthOptions({
  title: {
    text: "带宽"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "line",
      symbol: "triangle",
      symbolSize: 20,
      lineStyle: {
        color: "#5470C6",
        width: 4,
        type: "dashed"
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: "#EE6666",
        color: "yellow"
      }
    }
  ]
});
</script>

<template>
  <el-card shadow="always">
    <template #header>带宽流量</template>
    <el-space :size="0">
      <el-radio-group v-model="dateType" size="large">
        <el-radio-button label="1小时实况" value="1" />
        <el-radio-button label="近6小时" value="6" />
        <el-radio-button label="近12小时" value="12" />
        <el-radio-button v-if="!isCustomer" label="自定义" value="customer" />
      </el-radio-group>
      <el-date-picker
        v-if="isCustomer"
        v-model="customerDate"
        size="large"
        class="h-full"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-space>
    <br />
    <el-space class="w-full mt-6" justify="center" wrap>
      <el-text type="primary">峰值：0.00 Kbps</el-text>
      <el-text type="success">95%值计费：0.00 Kbps</el-text>
    </el-space>
    <div ref="bandwidthRef" class="w-full h-[330px] my-4" />
    <el-table :data="tableData">
      <el-table-column prop="content" label="时间" show-overflow-tooltip />
      <el-table-column prop="action" label="带宽" show-overflow-tooltip />
    </el-table>
  </el-card>
</template>
