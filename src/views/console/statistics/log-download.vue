<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getLogList, createJob, getJobList } from "@/api/console";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import Tabs from "@/components/Tabs/index.vue";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const tabList = [
  {
    label: "日志查询",
    value: "list"
  },
  {
    label: "申请记录",
    value: "apply"
  }
];

const router = useRouter();
const isLoading = ref(false);
const searchForm = reactive({
  start: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
  end: dayjs().add(1, "day").startOf("day").format("YYYY-MM-DD HH:mm:ss")
});
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const currentTab = ref("list");

watch(currentTab, () => {
  pagination.page = 1;
  getList();
});

const getList = async () => {
  if (currentTab.value === "list") {
    ({ count: pagination.count, data: tableData.value } = await getLogList({
      ...pagination,
      ...searchForm,
      start: searchForm.start
        ? dayjs(searchForm.start).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      end: searchForm.end
        ? dayjs(searchForm.end).format("YYYY-MM-DD HH:mm:ss")
        : undefined
    }));
  } else {
    ({ count: pagination.count, data: tableData.value } = await getJobList({
      ...pagination,
      type: "down_http_access_log"
    }));
  }
};

const handleApply = async () => {
  await createJob({
    type: "down_http_access_log",
    data: {
      start: searchForm.start
        ? dayjs(searchForm.start).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      end: searchForm.end
        ? dayjs(searchForm.end).format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      host: ""
    }
  });
  ElMessage.success("申请成功，下载链接请到申请记录中等待获取");
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await getList();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="h-full bg-white rounded-xl p-4 flex flex-col gap-y-4">
    <Tabs v-model="currentTab" :tabs="tabList" />
    <template v-if="currentTab === 'list'">
      <div class="flex items-center gap-2 flex-wrap">
        <el-date-picker
          v-model="searchForm.start"
          type="datetime"
          placeholder="起始时间"
          style="width: 220px"
        />
        <el-date-picker
          v-model="searchForm.end"
          type="datetime"
          placeholder="结束时间"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.node_id"
          placeholder="节点ID"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.host"
          placeholder="域名"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.server_port"
          placeholder="端口"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.req_uri"
          placeholder="URI"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.addr"
          placeholder="客户IP"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.status"
          placeholder="状态码"
          style="width: 220px"
        />
        <el-select
          v-model="searchForm.cache_status"
          placeholder="缓存命中"
          style="width: 220px"
        >
          <el-option label="命中" value="HIT" />
          <el-option label="未命中" value="MISS" />
        </el-select>
        <el-button type="primary" class="ml-3" @click="getList">搜索</el-button>
        <el-button @click="searchForm = {}">重置</el-button>
        <el-button class="ml-3" @click="handleApply">申请下载</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        size="small"
        :data="tableData"
        style="width: 100%; height: 0; flex: 1"
      >
        <el-table-column label="时间" show-overflow-tooltip>
          <template #default="{ row }">
            {{
              dayjs(row.time, "DD/MMM/YYYY:HH:mm:ss Z", "en").format(
                "YYYY-MM-DD HH:mm:ss"
              )
            }}
          </template>
        </el-table-column>
        <el-table-column prop="host" label="域名" show-overflow-tooltip />
        <el-table-column
          prop="server_port"
          label="端口"
          show-overflow-tooltip
        />
        <el-table-column prop="protocol" label="协议" show-overflow-tooltip />
        <el-table-column prop="method" label="方法" show-overflow-tooltip />
        <el-table-column prop="req_uri" label="URI" show-overflow-tooltip />
        <el-table-column prop="status" label="状态码" show-overflow-tooltip />
        <el-table-column prop="addr" label="客户IP" show-overflow-tooltip />
        <el-table-column label="地理位置" show-overflow-tooltip />
        <el-table-column
          prop="user_agent"
          label="浏览器"
          show-overflow-tooltip
        />
        <el-table-column
          prop="up_resp_time"
          label="回源耗时"
          show-overflow-tooltip
        />
        <el-table-column
          prop="up_recv"
          label="返回字节数"
          show-overflow-tooltip
        />
        <el-table-column
          prop="cache_status"
          label="缓存命中"
          show-overflow-tooltip
        />
        <el-table-column prop="nid" label="节点ID" show-overflow-tooltip />
      </el-table>
    </template>
    <el-table
      v-else
      v-loading="isLoading"
      size="small"
      :data="tableData"
      style="width: 100%; height: 0; flex: 1"
    >
      <el-table-column prop="id" label="任务ID" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="申请时间"
        show-overflow-tooltip
      />
      <el-table-column label="日志时间" show-overflow-tooltip>
        <template #default="{ row }">
          {{ `${JSON.parse(row.data).start} - ${JSON.parse(row.data).end}` }}
        </template>
      </el-table-column>
      <el-table-column label="日志域名" show-overflow-tooltip />
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.state === "done" ? "已完成" : "未完成" }}
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="进度" show-overflow-tooltip />
      <el-table-column width="200" fixed="right" label="操作">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button size="small" type="primary">下载</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      size="small"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.count"
      @change="getList"
    />
  </div>
</template>
