<script setup>
import { ElMessage } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getCertList,
  getDNSAPIList,
  createCert,
  getCertDetail,
  editCert,
  deleteCert,
  optionCert
} from "@/api/console";
import { certTypeList, certExpireList, certStatusList } from "@/model";

const isLoading = ref(false);
const isExpendSearch = ref(false);
const searchForm = reactive({});
const dnsAPIList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getCertList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const createType = ref("single");
const formData = ref({
  type: "custom"
});
const handleCreate = async () => {
  const tasks = [];
  if (createType.value === "batch") {
    const domains = formData.value.domain.split("\n");
    domains.forEach(item => {
      tasks.push(
        formData.value.id
          ? editCert(formData.value.id, formData.value)
          : createCert(formData.value)
      );
    });
  } else {
    tasks.push(
      formData.value.id
        ? editCert(formData.value.id, formData.value)
        : createCert(formData.value)
    );
  }
  await Promise.all(tasks);
  ElMessage.success("操作成功");
  formData.value = {
    type: "custom"
  };
  createType.value = "single";
  modal.value = false;
  getList();
};
const handleEdit = async row => {
  ({ data: formData.value } = await getCertDetail(row.id));
  modal.value = true;
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (["enable", "disable"].includes(type)) {
    await optionCert(
      selection.value.map(i => ({
        id: i.id,
        enable: type === "enable" ? 1 : 0
      }))
    );
  }

  if (type === "enforceDisable") {
    await Promise.all(
      selection.value.map(i =>
        optionCert({
          id: i.id,
          force_disable: 1,
          enable: 0
        })
      )
    );
  }

  if (type === "resign") {
    await optionCert(
      selection.value.map(i => ({
        id: i.id,
        reissue: 1
      }))
    );
  }

  if (["enableAutoResign", "disableAutoResign"].includes(type)) {
    await optionCert(
      selection.value.map(i => ({
        id: i.id,
        auto_renew: type === "enableAutoResign" ? 1 : 0
      }))
    );
  }

  if (type === "delete") {
    await deleteCert(selection.value.map(i => i.id).toString());
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  await deleteCert(id);
  ElMessage.success("删除成功");
  getList();
};

onMounted(async () => {
  isLoading.value = true;
  try {
    ({ data: dnsAPIList.value } = await getDNSAPIList({
      limit: 0
    }));
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
    <div v-show="isExpendSearch" class="flex gap-x-4">
      <el-input
        v-model="searchForm.domains"
        type="textarea"
        :rows="3"
        placeholder="多域名(一行一个 精确搜索)"
        style="width: 220px"
      />
      <div class="flex-1 flex flex-wrap items-center gap-4">
        <el-input
          v-model="searchForm.id"
          placeholder="证书ID"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.name"
          placeholder="证书名称"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.des"
          placeholder="证书备注"
          style="width: 220px"
        />
        <el-select
          v-model="searchForm.type"
          placeholder="证书类型"
          style="width: 220px"
        >
          <el-option
            v-for="item of certTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.dnsapi"
          placeholder="DNS API"
          style="width: 220px"
        >
          <el-option
            v-for="item of dnsAPIList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="searchForm.expire"
          placeholder="到期时间"
          style="width: 220px"
        >
          <el-option
            v-for="item of certExpireList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="searchForm.enable"
          placeholder="启用"
          style="width: 220px"
        >
          <el-option label="不限" value="" />
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
        <el-select
          v-model="searchForm.issue_state"
          placeholder="签发状态"
          style="width: 220px"
        >
          <el-option
            v-for="item of certStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button size="small" type="success" @click="modal = true"
          >新增</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleBatchOption('enable')"
          >启用</el-button
        >
        <el-button
          size="small"
          type="warning"
          @click="handleBatchOption('disable')"
          >禁用</el-button
        >
        <el-button
          size="small"
          type="warning"
          @click="handleBatchOption('enforceDisable')"
          >强制禁用</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleBatchOption('delete')"
          >删除</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleBatchOption('resign')"
          >重签</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleBatchOption('enableAutoResign')"
          >自动续签</el-button
        >
        <el-button
          size="small"
          type="warning"
          @click="handleBatchOption('disableAutoResign')"
          >取消续签</el-button
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
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column label="类型" show-overflow-tooltip>
        <template #default="{ row }">
          {{ certTypeList.find(i => i.value === row.type)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="domain" label="域名" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="创建时间"
        show-overflow-tooltip
      />
      <el-table-column
        prop="expire_time2"
        label="到期时间"
        show-overflow-tooltip
      />
      <el-table-column label="类型" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.auto_renew === 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="启用" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.enable === 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          {{ certStatusList.find(i => i.value === row.issue_state)?.label }}
        </template>
      </el-table-column>
      <el-table-column prop="task_ret" label="失败原因" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button size="small" type="primary" @click="handleEdit(row)">
              修改</el-button
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
      :title="formData.id ? '编辑证书' : '新增证书'"
      append-to-body
    >
      <div class="space-y-4">
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          数量
        </div>
        <el-radio-group
          v-model="createType"
          @change="formData.type = $event === 'single' ? 'custom' : 'zerossl'"
        >
          <el-radio value="single">单个</el-radio>
          <el-radio value="batch">批量</el-radio>
        </el-radio-group>
        <el-form :model="formData" label-width="100" label-position="left">
          <template v-if="createType === 'single'">
            <el-form-item label="名称">
              <el-input v-model="formData.name" style="width: 220px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.des" style="width: 220px" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="formData.type" style="width: 220px">
                <el-option
                  v-for="item of certTypeList.slice(1)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <el-form-item v-else label="类型">
            <el-select v-model="formData.type" style="width: 220px">
              <el-option
                v-for="item of certTypeList.slice(2)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <template v-if="formData.type === 'custom'">
            <el-form-item label="证书">
              <el-input v-model="formData.cert" type="textarea" :rows="5" />
            </el-form-item>
            <el-form-item label="密钥">
              <el-input v-model="formData.key" type="textarea" :rows="5" />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="域名">
              <el-input
                v-model="formData.domain"
                :type="createType === 'single' ? 'input' : 'textarea'"
                :rows="5"
              />
            </el-form-item>
            <el-form-item label="DNS API">
              <el-select v-model="formData.dnsapi" style="width: 220px">
                <el-option
                  v-for="item of dnsAPIList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
