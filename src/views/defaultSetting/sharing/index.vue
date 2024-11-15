<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { getSiteGroupList, getDNSAPIList } from "@/api/console";
import {
  getDefaultSiteList,
  creteDefaultSite,
  editDefaultSite,
  optionDefaultSite,
  deleteDefaultSite
} from "@/api/defaultSetting";
import { configList } from "./model";

const isLoading = ref(false);
const siteGroupList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);

const getList = async () => {
  const { count, data } = await getDefaultSiteList({
    ...pagination,
    type: "stream"
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const formData = ref({});

const handleSubmit = async () => {
  const data = {
    ...formData.value,
    type: "stream",
    scope_id:
      formData.value.scope_name === "global" ? 0 : formData.value.scope_id
  };
  if (formData.value.id) {
    await editDefaultSite(formData.value.id, data);
  } else {
    await creteDefaultSite(data);
  }
  ElMessage.success("操作成功");
  modal.value = false;
  formData.value = {};
  getList();
};

const handleEdit = row => {
  formData.value = { ...row };
  modal.value = true;
};

const handleDelete = async id => {
  await deleteDefaultSite(id);
  ElMessage.success("操作成功");
  getList();
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (["enable", "disable"].includes(type)) {
    await optionDefaultSite(
      selection.value.map(i => ({ id: i, enable: type === "enable" ? 1 : 0 }))
    );
  }
  if (type === "delete") {
    await deleteDefaultSite(selection.value.toString());
  }

  ElMessage.success("操作成功");
  getList();
};

onMounted(async () => {
  isLoading.value = true;
  try {
    ({ data: siteGroupList.value } = await getSiteGroupList({ limit: 0 }));
    ({ data: getDNSAPIList.value } = await getDNSAPIList({ limit: 0 }));
    await getList();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="h-full bg-white rounded-xl p-4 flex flex-col gap-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button size="small" type="primary" @click="modal = true"
          >新增</el-button
        >
        <el-button size="small" type="info" @click="handleBatchOption('enable')"
          >启用
        </el-button>
        <el-button
          size="small"
          type="warning"
          @click="handleBatchOption('disable')"
          >禁用</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleBatchOption('delete')"
          >删除</el-button
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
      <el-table-column label="套餐" show-overflow-tooltip>
        <template #default="{ row }">
          {{ configList.find(i => i.value === row.name)?.label }}
        </template>
      </el-table-column>
      <el-table-column label="设置值" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.name === "proxy_cache" ? "点击右侧按钮查看" : row.value }}
        </template>
      </el-table-column>
      <el-table-column label="生效范围" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.scope_name === "global" ? "全局" : "网站分组" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.enable === 1 ? "已开启" : "未开启" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button size="small" type="primary" @click="handleEdit(row)"
              >修改</el-button
            >
            <el-button size="small" type="danger" @click="handleDelete(row.id)"
              >删除</el-button
            >
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

    <el-dialog
      v-model="modal"
      :title="formData.id ? '编辑设置项' : '新增设置项'"
      append-to-body
      @closed="formData = {}"
    >
      <el-form :model="formData" label-width="100">
        <el-form-item label="设置项">
          <el-select v-model="formData.name">
            <el-option
              v-for="item of configList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设置值">
          <el-radio-group
            v-if="formData.name === 'listen_protocol'"
            v-model="formData.value"
          >
            <el-radio label="TCP" value="tcp" />
            <el-radio label="UDP" value="udp" />
          </el-radio-group>
          <el-select
            v-if="formData.name === 'balance_way'"
            v-model="formData.value"
          >
            <el-option label="轮询" value="rr" />
            <el-option label="ip_hash" value="ip_hash" />
            <el-option label="最少连接数" value="least_conn" />
            <el-option label="随机" value="random" />
          </el-select>
          <el-switch
            v-if="formData.name === 'proxy_protocol'"
            v-model="formData.value"
          />
        </el-form-item>
        <el-form-item label="生效范围">
          <el-select v-model="formData.scope_name">
            <el-option label="全局" value="global" />
            <el-option label="网站分组" value="group" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.scope_name === 'group'" label="网站分组">
          <el-select v-model="formData.scope_id">
            <el-option
              v-for="item of siteGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
