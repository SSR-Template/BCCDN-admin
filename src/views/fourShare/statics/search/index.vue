<script setup>
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getStreamUsageStatistics } from "@/api/fourShare";
import useEcharts from "@/hooks/useEcharts";
import Tabs from "@/components/Tabs/index.vue";

const searchList = ref([]);
const dateType = ref("1");
const searchFormData = reactive({
  cate: "stream",
  type: "bandwidth",
  start: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD")
});
const customDate = computed({
  get() {
    return [searchFormData.start, searchFormData.end];
  },
  set(val) {
    searchFormData.start = dayjs(val[0]).format("YYYY-MM-DD");
    searchFormData.end = dayjs(val[1]).format("YYYY-MM-DD");
  }
});

const bandwidthRef = ref(null);
const trafficRef = ref(null);
const bandwidthOption = ref({
  title: {
    text: "带宽"
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：Kbps",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const trafficOption = ref({
  title: {
    text: "流量"
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：KB",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
useEcharts(bandwidthRef, bandwidthOption);
useEcharts(trafficRef, trafficOption);

const getData = async () => {
  if (searchFormData.type === "bandwidth") {
    const bandwidth = await getStreamUsageStatistics(searchFormData);
    searchList.value = bandwidth.data;
    bandwidthOption.value.xAxis.data = bandwidth.data.map(i => i.date);
    bandwidthOption.value.series[0].data = bandwidth.data.map(i => i.value);
  } else if (searchFormData.type === "traffic") {
    const traffic = await getStreamUsageStatistics(searchFormData);
    searchList.value = traffic.data;
    trafficOption.value.xAxis.data = traffic.data.map(i => i.date);
    trafficOption.value.series[0].data = traffic.data.map(i => i.value);
  }
};
watch(
  () => searchFormData.type,
  () => getData()
);

const handleDateChange = val => {
  if (val === "custom") return;

  searchFormData.start = dayjs()
    .subtract(+val, "day")
    .format("YYYY-MM-DD HH:mm:ss");
};

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <Tabs
      v-model="searchFormData.type"
      :tabs="[
        {
          label: '带宽',
          value: 'bandwidth'
        },
        {
          label: '流量',
          value: 'traffic'
        }
      ]"
    />
    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchFormData.user_package"
        placeholder="输入套餐ID，多个空格分隔"
        style="width: 220px"
      />
      <el-input
        v-model="searchFormData.res"
        placeholder="输入端口，如8000/TCP，多个空格分隔"
        style="width: 220px"
      />
      <el-radio-group v-model="dateType" @change="handleDateChange">
        <el-radio-button value="0">今天</el-radio-button>
        <el-radio-button value="1">昨天</el-radio-button>
        <el-radio-button value="7">近7天</el-radio-button>
        <el-radio-button value="30">近30天</el-radio-button>
        <el-radio-button value="custom">自定义</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-if="dateType === 'custom'"
        v-model="customDate"
        type="datetime"
        range-separator="至"
        start-placeholder="起始时间"
        end-placeholder="结束时间"
        style="width: 500px; flex-grow: 0"
      />
      <el-button type="primary" @click="getData">搜索</el-button>
    </div>
    <template v-if="searchFormData.type === 'bandwidth'">
      <div ref="bandwidthRef" class="h-[300px] w-full" />
    </template>
    <template v-if="searchFormData.type === 'traffic'">
      <div ref="trafficRef" class="h-[300px] w-full" />
    </template>
    <el-table
      size="small"
      :data="searchList"
      style="width: 100%; height: 0; flex: 1"
    >
      <el-table-column label="时间" prop="date" />
      <el-table-column label="带宽" prop="value" />
    </el-table>
  </div>
</template>
