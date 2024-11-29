<script setup>
import { getOverview, getMessage, getUserInfo } from "@/api/welcome";
import { getSigninList } from "@/api/accountcenter";
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { getSiteRealtimeStatics } from "@/api/console.js";
import useEcharts from "@/hooks/useEcharts.js";

const overviewInfo = ref({});
const messageList = ref([]);
const userInfo = ref({});
const logList = ref([]);

const dateType = ref("1");
const searchFormData = reactive({
  start: dayjs().subtract(1, "hour").format("YYYY-MM-DD HH:mm:ss"),
  end: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  type: "traffic"
});
const statisticInfo = ref({
  bandwidth: "0.00",
  traffic: "0.00",
  req: 0
});

const handleDateChange = val => {
  searchFormData.start = dayjs()
    .subtract(+val, "hour")
    .format("YYYY-MM-DD HH:mm:ss");
  getData();
};

const chartRef = ref(null);
const chartOption = ref({
  title: {
    text: ""
  },
  tooltip: {
    trigger: "axis"
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    name: "",
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line",
      smooth: true
    }
  ]
});
useEcharts(chartRef, chartOption);

const getData = async () => {
  const { data } = await getSiteRealtimeStatics(searchFormData);
  chartOption.value.xAxis.data = data.map(i =>
    dayjs(i[0]).format("YYYY-MM-DD HH:mm:ss")
  );
  chartOption.value.series[0].data = data.map(i => i[1]);
  switch (searchFormData.type) {
    case "traffic":
      chartOption.value.title.text = "流量";
      chartOption.value.yAxis.name = "单位：MB";
      break;
    case "bandwidth":
      chartOption.value.title.text = "带宽";
      chartOption.value.yAxis.name = "单位：Kbps";
      break;
    case "req":
      chartOption.value.title.text = "请求次数";
      chartOption.value.yAxis.name = "";
      break;
  }

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
  statisticInfo.value = {
    bandwidth: (
      bandwidth.data.map(i => i[1]).sort((a, b) => b - a)[0] / 1024
    ).toFixed(2),
    traffic: (
      traffic.data.map(i => i[1]).reduce((pre, cur) => pre + cur, 0) / 1024
    ).toFixed(2),
    req: req.data.map(i => i[1]).reduce((pre, cur) => pre + cur, 0)
  };
};

onMounted(async () => {
  ({ data: overviewInfo.value } = await getOverview());
  ({ data: messageList.value } = await getMessage({ type: "announcement" }));
  ({ data: userInfo.value } = await getUserInfo());
  ({ data: logList.value } = await getSigninList({ page: 1, limit: 2 }));
  getData();
});
</script>

<template>
  <div class="flex gap-x-4 h-full">
    <div class="space-y-4 flex-1 flex flex-col">
      <div class="flex items-center gap-x-4">
        <div
          class="flex-1 flex items-center h-[136px] rounded-xl px-4 gap-x-4 bg-white"
        >
          <img
            class="size-[46px]"
            src="https://cdn.sudun.com/users/img/fwgl1.2f3d1bca.svg"
          />
          <div>
            <div class="text-slate-500 text-sm">接入域名数</div>
            <div class="space-x-2">
              <span class="text-2xl font-bold">{{
                overviewInfo.domain_count
              }}</span>
              <span>个</span>
            </div>
          </div>
        </div>
        <div
          class="flex-1 flex items-center h-[136px] rounded-xl px-4 gap-x-4 bg-white"
        >
          <img
            class="size-[46px]"
            src="https://cdn.sudun.com/users/img/fwgl2.14eaadce.svg"
          />
          <div>
            <div class="text-slate-500 text-sm">转发端口数</div>
            <div class="space-x-2">
              <span class="text-xl font-bold">{{
                overviewInfo.stream_port_count
              }}</span>
              <span>个</span>
            </div>
          </div>
        </div>
        <div
          class="flex-1 flex items-center h-[136px] rounded-xl px-4 gap-x-4 bg-white"
        >
          <img
            class="size-[46px]"
            src="https://cdn.sudun.com/users/img/fwgl3.6205d921.svg"
          />
          <div>
            <div class="text-slate-500 text-sm">证书总数</div>
            <div class="space-x-2">
              <span class="text-xl font-bold">{{
                overviewInfo.cert_count
              }}</span>
              <span>个</span>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="flex-1 bg-white rounded-xl p-4 flex flex-col gap-y-4">-->
      <!--        <div class="font-bold">公告</div>-->
      <!--        <div v-for="item of messageList" :key="item">{{ item }}</div>-->
      <!--        <div v-if="!messageList.length">暂无公告</div>-->
      <!--      </div>-->
      <div class="flex-1 bg-white rounded-xl p-4 flex flex-col gap-y-4">
        <div class="flex items-center justify-between">
          <div class="font-bold">数据趋势</div>
          <el-radio-group v-model="dateType" @change="handleDateChange">
            <el-radio-button value="1">近1小时</el-radio-button>
            <el-radio-button value="24">近24小时</el-radio-button>
            <el-radio-button value="168">近7天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="w-full h-[86px] rounded-lg relative">
          <img
            class="size-full z-1 rounded-lg"
            src="https://cdn.sudun.com/users/img/fwgl_bg.337df05e.png"
          />
          <div class="absolute top-0 left-0 bottom-0 right-0 z-10 flex">
            <div class="flex-1 flex items-center justify-center gap-x-4">
              <div
                class="size-[56px] bg-white/30 rounded-full flex items-center justify-center"
              >
                <img
                  class="size-8"
                  src="https://cdn.sudun.com/users/img/fwgl4.9ba4f5d4.svg"
                />
              </div>
              <div class="flex flex-col justify-between text-white">
                <div class="text-xs font-bold">峰值带宽</div>
                <div class="space-x-2">
                  <span class="text-2xl">{{ statisticInfo.bandwidth }}</span>
                  <span class="text-xs">bps</span>
                </div>
              </div>
            </div>
            <div class="flex-1 flex items-center justify-center gap-x-4">
              <div
                class="size-[56px] bg-white/30 rounded-full flex items-center justify-center"
              >
                <img
                  class="size-8"
                  src="https://cdn.sudun.com/users/img/fwgl5.a44bebcf.svg"
                />
              </div>
              <div class="flex flex-col justify-between text-white">
                <div class="text-xs font-bold">总流量</div>
                <div class="space-x-2">
                  <span class="text-2xl">{{ statisticInfo.traffic }}</span>
                  <span class="text-xs">GB</span>
                </div>
              </div>
            </div>
            <div class="flex-1 flex items-center justify-center gap-x-4">
              <div
                class="size-[56px] bg-white/30 rounded-full flex items-center justify-center"
              >
                <img
                  class="size-8"
                  src="https://cdn.sudun.com/users/img/fwgl6.218bd701.svg"
                />
              </div>
              <div class="flex flex-col justify-between text-white">
                <div class="text-xs font-bold">总请求数量</div>
                <div class="space-x-2">
                  <span class="text-2xl">{{ statisticInfo.req }}</span>
                  <span class="text-xs">次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <el-radio-group v-model="searchFormData.type" @change="getData">
            <el-radio-button value="traffic">流量</el-radio-button>
            <el-radio-button value="bandwidth">带宽</el-radio-button>
            <el-radio-button value="req">请求数</el-radio-button>
          </el-radio-group>
          <router-link
            to="/console/statistics/realtime"
            class="text-primary text-xs"
          >
            查看详情
          </router-link>
        </div>
        <div ref="chartRef" class="h-[300px] w-full" />
      </div>
    </div>
    <div
      class="bg-white rounded-xl p-4 flex flex-col gap-y-4 w-[400px] text-sm"
    >
      <div class="font-bold">个人信息</div>
      <div>
        您好，<span class="font-bold">{{ userInfo.name }}</span>
      </div>
      <el-tag type="primary" class="w-[200px]">IP: {{ logList[0]?.ip }}</el-tag>
      <div class="text-xs text-slate-500">
        最后登录：{{ logList[1]?.create_at2 }}
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">ID</div>
        <div class="font-bold">{{ overviewInfo.uid }}</div>
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">实名认证</div>
        <div v-if="overviewInfo.cert_verified" class="font-bold">已实名</div>
        <router-link v-else to="/accountcenter">
          <el-tag type="warning">未实名，点击去认证</el-tag>
        </router-link>
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">余额</div>
        <div class="font-bold">{{ overviewInfo.balance }}元</div>
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">待续费</div>
        <div class="font-bold">{{ overviewInfo.renew }}</div>
      </div>
    </div>
  </div>
</template>
