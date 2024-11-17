<script setup lang="ts">
import Tabs from "@/components/Tabs/index.vue";
import { onMounted, reactive, ref } from "vue";
import { getJobList, createJob } from "@/api/console";
import { ElMessage } from "element-plus";

const typeList = [
  {
    label: "全部类型",
    value: "clean_url,clean_dir,pre_cache_url"
  },
  {
    label: "刷新目录",
    value: "clean_dir"
  },
  {
    label: "刷新URL",
    value: "clean_url"
  },
  {
    label: "预缓存URL",
    value: "pre_cache_url"
  }
];

const currentTab = ref("cache");
const tableData = ref([]);
const searchForm = reactive({
  type: "clean_url,clean_dir,pre_cache_url"
});
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const formData = ref({});
const handleCrate = async () => {
  const lines = formData.value.url.split("\n");
  await createJob(
    lines.map(url => ({
      type: formData.value.type,
      data: { url }
    }))
  );
  ElMessage.success("操作成功");
  formData.value = {};
  getList();
  currentTab.value = "optionRecord";
};

const getList = async () => {
  const { count, data } = await getJobList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl gap-y-4 flex flex-col h-full">
    <Tabs
      v-model="currentTab"
      :tabs="[
        {
          label: '刷新缓存',
          value: 'cache'
        },
        {
          label: '操作记录',
          value: 'optionRecord'
        }
      ]"
    />
    <template v-if="currentTab === 'cache'">
      <el-form :model="formData" label-position="left" label-width="100">
        <el-form-item label="操作类型">
          <el-radio-group v-model="formData.type">
            <el-radio
              v-for="item of typeList.slice(1)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            v-model="formData.url"
            type="textarea"
            :rows="10"
            placeholder="一行一条URL"
            style="width: 500px"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" class="w-[200px]" @click="handleCrate"
        >提交</el-button
      >
    </template>
    <template v-if="currentTab === 'optionRecord'">
      <div class="flex items-center gap-x-4">
        <el-select v-model="searchForm.type" style="width: 220px">
          <el-option
            v-for="item of typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchForm.key1"
          placeholder="URL或域名"
          style="width: 220px"
        />
        <el-button type="primary" class="ml-3" @click="getList">搜索</el-button>
        <el-button @click="searchForm = {}">重置</el-button>
      </div>
      <el-table
        size="small"
        :data="tableData"
        style="width: 100%; height: 0; flex: 1"
      >
        <el-table-column prop="task_id" label="任务ID" show-overflow-tooltip />
        <el-table-column label="类型" show-overflow-tooltip>
          <template #default="{ row }">
            {{ typeList.find(i => i.value === row.type)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="key2" label="URL" show-overflow-tooltip />
        <el-table-column label="状态" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.state === "done" ? "完成" : "未完成" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="create_at2"
          label="创建时间"
          show-overflow-tooltip
        />
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
    </template>
  </div>
</template>
