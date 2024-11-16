<script setup>
import { ElMessage } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getDomainList, optionDomain } from "@/api/console";

const router = useRouter();
const isLoading = ref(false);
const isExpendSearch = ref(false);
const searchForm = reactive({});
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getDomainList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (type === "sync") {
    await optionDomain(
      selection.value.map(i => ({
        id: i.id
      }))
    );
  }

  ElMessage.success("操作成功");
  getList();
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
    <div class="flex items-center">
      <el-input
        v-model="searchForm.domain"
        placeholder="域名(模糊搜索)"
        style="width: 220px"
      />
      <el-button type="primary" class="ml-3" @click="getList">搜索</el-button>
      <el-button @click="searchForm = {}">重置</el-button>
      <el-button type="primary" @click="isExpendSearch = !isExpendSearch">
        {{ isExpendSearch ? "收起" : "展开" }}
        <el-icon class="ml-2">
          <ArrowUp v-if="isExpendSearch" />
          <ArrowDown v-else />
        </el-icon>
      </el-button>
    </div>
    <div v-show="isExpendSearch" class="flex flex-wrap items-center gap-4">
      <el-input
        v-model="searchForm.site_id"
        placeholder="网站ID"
        style="width: 220px"
      />
      <el-select
        v-model="searchForm.dnsapi_state"
        placeholder="DNS API"
        style="width: 220px"
      >
        <el-option label="不限" value="" />
        <el-option label="已设置" value="set" />
        <el-option label="未设置" value="not-set" />
      </el-select>
      <el-select
        v-model="searchForm.task_state"
        placeholder="任务状态"
        style="width: 220px"
      >
        <el-option label="正常" value="done" />
        <el-option label="待同步" value="pending" />
        <el-option label="同步中" value="process" />
        <el-option label="同步失败" value="failed" />
      </el-select>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button
          size="small"
          type="success"
          @click="handleBatchOption('sync')"
          >重新同步解析</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      size="small"
      :data="tableData"
      style="width: 100%; height: 0; flex: 1"
      @selection-change="selection = $event"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column prop="site_id" label="网站ID" show-overflow-tooltip />
      <el-table-column prop="cname" label="域名" show-overflow-tooltip />
      <el-table-column label="解析状态" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.state ? "未完成" : "已完成" }}
        </template>
      </el-table-column>
      <el-table-column label="自动解析(DNSAPI)" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.dns_api ? "已设置" : "未设置" }}
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
