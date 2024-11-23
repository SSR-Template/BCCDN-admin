<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getSubscribeMessage,
  getSubscribeMessageDetail
} from "@/api/accountcenter";
import { messageList } from "@/model";

const router = useRouter();
const isLoading = ref(false);
const searchForm = reactive({});
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getSubscribeMessage({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const detail = ref(null);

const handleDetail = async id => {
  ({ data: detail.value } = await getSubscribeMessageDetail(id));
  modal.value = true;
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
    <div class="flex items-center gap-x-4">
      <el-select
        v-model="searchForm.type"
        placeholder="消息类型"
        style="width: 220px"
      >
        <el-option
          v-for="item of messageList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="searchForm.user_package_id"
        placeholder="用户套餐ID"
        style="width: 220px"
      />
      <el-input
        v-model="searchForm.site_id"
        placeholder="网站ID"
        style="width: 220px"
      />
      <el-button type="primary" class="ml-3" @click="getList">搜索</el-button>
      <el-button @click="searchForm = {}">重置</el-button>
    </div>
    <el-table
      v-loading="isLoading"
      size="small"
      :data="tableData"
      style="width: 100%; height: 0; flex: 1"
    >
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column label="类型" show-overflow-tooltip>
        <template #default="{ row }">
          {{ messageList.find(i => i.value === row.type)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <el-table-column
        label="用户套餐ID"
        prop="user_package_id"
        show-overflow-tooltip
      />
      <el-table-column label="网站ID" prop="site_id" show-overflow-tooltip />
      <el-table-column
        label="创建时间"
        prop="update_at2"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button size="small" type="primary" @click="handleDetail(row.id)"
              >详情
            </el-button>
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

    <el-dialog v-model="modal" title="新增转发" append-to-body>
      <el-form label-width="100" label-position="left">
        <el-form-item label="标题">
          <div>{{ detail?.title }}</div>
        </el-form-item>
        <el-form-item label="邮件内容">
          <div v-html="detail?.content" />
        </el-form-item>
        <el-form-item label="短信内容">
          <div v-html="detail?.phone_content" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
