<script setup>
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { getSiteRealtimeStatics } from "@/api/console";
import { getStreamUsageStatistics } from "@/api/fourShare";
import useEcharts from "@/hooks/useEcharts";
import Tabs from "@/components/Tabs/index.vue";

const currentTab = ref("basic");
const dateType = ref("1");
const searchFormData = reactive({
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

const handleDateChange = val => {
  if (val === "custom") return;

  searchFormData.start = dayjs()
    .subtract(+val, "hour")
    .format("YYYY-MM-DD HH:mm:ss");
};

const bandwidthRef = ref(null);
const trafficRef = ref(null);
const reqRef = ref(null);
const qpsRef = ref(null);
const reqCacheRef = ref(null);
const byteCacheRef = ref(null);
const status4xxRef = ref(null);
const status5xxRef = ref(null);
const backendBandwidthRef = ref(null);
const backendTrafficRef = ref(null);
const backendTimeRef = ref(null);
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
    name: "单位：MB",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const reqOption = ref({
  title: {
    text: "访问次数"
  },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const qpsOption = ref({
  title: {
    text: "QPS"
  },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const reqCacheOption = ref({
  title: {
    text: "请求命中率"
  },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：%",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const byteCacheOption = ref({
  title: {
    text: "子节命中率"
  },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：%",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const status4xxOption = ref({
  title: {
    text: "4xx状态码"
  },
  legend: {},
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：次",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const status5xxOption = ref({
  title: {
    text: "5xx状态码"
  },
  legend: {},
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：次",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line"
    }
  ]
});
const backendBandwidthOption = ref({
  title: {
    text: "回源带宽"
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
const backendTrafficOption = ref({
  title: {
    text: "回源流量"
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
const backendTimeOption = ref({
  title: {
    text: "回源耗时"
  },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "单位：秒",
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
useEcharts(reqRef, reqOption);
useEcharts(qpsRef, qpsOption);
useEcharts(reqCacheRef, reqCacheOption);
useEcharts(byteCacheRef, byteCacheOption);
useEcharts(status4xxRef, status4xxOption);
useEcharts(status5xxRef, status5xxOption);
useEcharts(backendBandwidthRef, backendBandwidthOption);
useEcharts(backendTrafficRef, backendTrafficOption);
useEcharts(backendTimeRef, backendTimeOption);

const getData = async () => {
  if (currentTab.value === "basic") {
    const bandwidth = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "bandwidth"
    });
    const traffic = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "traffic"
    });
    const req = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "req"
    });
    const qps = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "qps"
    });
    bandwidthOption.value.xAxis.data = bandwidth.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    bandwidthOption.value.series[0].data = bandwidth.data.map(i => i[1]);
    trafficOption.value.xAxis.data = traffic.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    trafficOption.value.series[0].data = traffic.data.map(i => i[1]);
    reqOption.value.xAxis.data = req.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    reqOption.value.series[0].data = req.data.map(i => i[1]);
    qpsOption.value.xAxis.data = qps.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    qpsOption.value.series[0].data = qps.data.map(i => i[1]);
  } else if (currentTab.value === "quantity") {
    const reqCache = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "req-cache-status"
    });
    const byteCache = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "byte-cache-status"
    });
    const status4xx = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "status-4xx"
    });
    const status5xx = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "status-5xx"
    });
    reqCacheOption.value.xAxis.data = reqCache.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    reqCacheOption.value.series[0].data = reqCache.data.map(i => i[1]);
    byteCacheOption.value.xAxis.data = byteCache.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    byteCacheOption.value.series[0].data = byteCache.data.map(i => i[1]);
    status4xxOption.value.xAxis.data = status4xx.data[0]?.value.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    status4xxOption.value.series = status4xx.data.map(i => ({
      name: i.name,
      data: i.value.map(j => j[1]),
      type: "line"
    }));
    status5xxOption.value.xAxis.data = status5xx.data[0]?.value.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    status5xxOption.value.series = status5xx.data.map(i => ({
      name: i.name,
      data: i.value.map(j => j[1]),
      type: "line"
    }));
  } else if (currentTab.value === "backend") {
    const backendBandwidth = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "backend-bandwidth"
    });
    const backendTraffic = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "backend-traffic"
    });
    const backendTime = await getSiteRealtimeStatics({
      ...searchFormData,
      type: "backend-resp-time"
    });
    backendBandwidthOption.value.xAxis.data = backendBandwidth.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    backendBandwidthOption.value.series[0].data = backendBandwidth.data.map(
      i => i[1]
    );
    backendTrafficOption.value.xAxis.data = backendTraffic.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    backendTrafficOption.value.series[0].data = backendTraffic.data.map(
      i => i[1]
    );
    backendTimeOption.value.xAxis.data = backendTime.data.map(i =>
      dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
    );
    backendTimeOption.value.series[0].data = backendTime.data.map(i => i[1]);
  }
};
watch(currentTab, () => getData());

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <Tabs
      v-model="currentTab"
      :tabs="[
        {
          label: '基础数据',
          value: 'basic'
        },
        {
          label: '质量监控',
          value: 'quantity'
        },
        {
          label: '回源监控',
          value: 'backend'
        }
      ]"
    />
    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchFormData.domain"
        placeholder="输入域名，多个空格分隔"
        style="width: 220px"
      />
      <el-input
        v-model="searchFormData.server_port"
        placeholder="监听端口"
        style="width: 220px"
      />
      <el-radio-group v-model="dateType" @change="handleDateChange">
        <el-radio-button value="1">1小时实时</el-radio-button>
        <el-radio-button value="6">近6小时</el-radio-button>
        <el-radio-button value="12">近12小时</el-radio-button>
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
    <template v-if="currentTab === 'basic'">
      <div class="h-[300px] flex">
        <div ref="bandwidthRef" class="h-full w-0 flex-1" />
        <div ref="trafficRef" class="h-full w-0 flex-1" />
      </div>
      <div class="h-[300px] flex">
        <div ref="reqRef" class="h-full w-0 flex-1" />
        <div ref="qpsRef" class="h-full w-0 flex-1" />
      </div>
    </template>
    <template v-if="currentTab === 'quantity'">
      <div class="h-[300px] flex">
        <div ref="reqCacheRef" class="h-full w-0 flex-1" />
        <div ref="byteCacheRef" class="h-full w-0 flex-1" />
      </div>
      <div class="h-[300px] flex">
        <div ref="status4xxRef" class="h-full w-0 flex-1" />
        <div ref="status5xxRef" class="h-full w-0 flex-1" />
      </div>
    </template>
    <template v-if="currentTab === 'backend'">
      <div class="h-[300px] flex">
        <div ref="backendBandwidthRef" class="h-full w-0 flex-1" />
        <div ref="backendTrafficRef" class="h-full w-0 flex-1" />
      </div>
      <div class="h-[300px] flex">
        <div ref="backendTimeRef" class="h-full w-0 flex-1" />
        <div class="h-full w-0 flex-1" />
      </div>
    </template>
  </div>
</template>
