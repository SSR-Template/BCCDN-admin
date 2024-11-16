<script setup>
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref } from "vue";
import { getFourShareList, getStreamStatistics } from "@/api/fourShare";
import useEcharts from "@/hooks/useEcharts";
import Tabs from "@/components/Tabs/index.vue";

const fourShareList = ref([]);
const dateType = ref("1");
const searchFormData = reactive({
  type: "stream-bandwidth",
  start: dayjs().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss"),
  end: dayjs().format("YYYY-MM-DD HH:mm:ss")
});
const customDate = computed({
  get() {
    return [searchFormData.start, searchFormData.end];
  },
  set(val) {
    searchFormData.start = dayjs(val[0]).format("YYYY-MM-DD HH:mm:ss");
    searchFormData.end = dayjs(val[1]).format("YYYY-MM-DD HH:mm:ss");
  }
});

const bandwidthRef = ref(null);
const trafficRef = ref(null);
const bandwidthOption = ref({
  title: {
    text: "带宽"
  },
  tooltip: {
    trigger: "axis"
  },
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
  tooltip: {
    trigger: "axis"
  },
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
  const bandwidth = await getStreamStatistics(searchFormData);
  const traffic = await getStreamStatistics({
    ...searchFormData,
    type: "stream-traffic"
  });
  bandwidthOption.value.xAxis.data = bandwidth.data.map(i =>
    dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
  );
  bandwidthOption.value.series[0].data = bandwidth.data.map(i => i[1]);
  trafficOption.value.xAxis.data = traffic.data.map(i =>
    dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
  );
  trafficOption.value.series[0].data = traffic.data.map(i => i[1]);
};

const handleDateChange = val => {
  if (val === "custom") return;

  searchFormData.start = dayjs()
    .subtract(+val, "hour")
    .format("YYYY-MM-DD HH:mm:ss");
};

onMounted(async () => {
  const { data } = await getFourShareList({ limit: 0 });
  fourShareList.value = data.map(i =>
    JSON.parse(i.listen)
      .map(j => `${j.port}/${j.protocol}`)
      .join(" ")
  );
  getData();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <Tabs
      v-model="searchFormData.type"
      :tabs="[{ label: '带宽流量', value: 'stream-bandwidth' }]"
    />
    <template v-if="searchFormData.type === 'stream-bandwidth'">
      <div class="flex items-center gap-x-4">
        <el-select
          v-model="searchFormData.port"
          multiple
          placeholder="选择端口"
          style="width: 220px"
        >
          <el-option
            v-for="item of fourShareList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-radio-group v-model="dateType" @change="handleDateChange">
          <el-radio-button value="1">1小时实时</el-radio-button>
          <el-radio-button value="6">近6小时</el-radio-button>
          <el-radio-button value="12">近12小时</el-radio-button>
          <el-radio-button value="custom">自定义</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-if="dateType === 'custom'"
          v-model="customDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="起始时间"
          end-placeholder="结束时间"
          style="width: 500px; flex-grow: 0"
        />
        <el-button type="primary" @click="getData">搜索</el-button>
      </div>
      <div class="h-0 flex-1 flex">
        <div ref="bandwidthRef" class="w-0 flex-1 h-full" />
        <div ref="trafficRef" class="w-0 flex-1 h-full" />
      </div>
    </template>
  </div>
</template>
