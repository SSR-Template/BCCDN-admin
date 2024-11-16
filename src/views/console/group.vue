<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getSiteGroupList,
  createSiteGroup,
  editSiteGroup,
  deleteSiteGroup
} from "@/api/console.js";

const router = useRouter();
const isLoading = ref(false);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getSiteGroupList({
    ...pagination
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const formData = ref({});
const handleCreate = async () => {
  if (formData.value.id) {
    await editSiteGroup(formData.value.id, formData.value);
  } else {
    await createSiteGroup(formData.value);
  }
  ElMessage.success("操作成功");
  modal.value = false;
  getList();
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (type === "delete") {
    await Promise.all(selection.value.map(i => deleteSiteGroup(i.id)));
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  await deleteSiteGroup(id);
  ElMessage.success("删除成功");
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
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button size="small" type="success" @click="modal = true"
          >新增
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleBatchOption('delete')"
          >删除
        </el-button>
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
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button
              size="small"
              type="primary"
              @click="
                () => {
                  formData = { ...row };
                  modal = true;
                }
              "
              >修改
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)"
              >删除
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

    <el-dialog
      v-model="modal"
      :title="formData.id ? '编辑分组' : '新增分组'"
      append-to-body
      @close="formData = {}"
    >
      <el-form :model="formData" label-width="100" label-position="left">
        <el-form-item label="名称">
          <el-input
            v-model="formData.name"
            placeholder="请输入名称"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.des"
            :rows="5"
            placeholder="请输入备注"
            style="width: 220px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
