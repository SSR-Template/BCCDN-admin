<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getDNSAPIList,
  createDNSAPI,
  editDNSAPI,
  deleteDNSAPI
} from "@/api/console";
import {
  createFourShare,
  optionFourShare,
  deleteFourShare
} from "@/api/fourShare";
import { dnsApiList } from "@/model";

const router = useRouter();
const isLoading = ref(false);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getDNSAPIList({
    ...pagination
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const formData = ref({
  auth: {}
});
const handleCreate = async () => {
  if (formData.value.id) {
    await editDNSAPI(formData.value.id, formData.value);
  } else {
    await createDNSAPI(formData.value);
  }
  ElMessage.success("创建成功");
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
    await deleteDNSAPI(selection.value.map(i => i.id).toString());
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  await deleteFourShare(id);
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
          >新增</el-button
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
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" show-overflow-tooltip />
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
      :title="formData.id ? '编辑DNS API' : '新增DNS API'"
      append-to-body
      @close="formData = { auth: {} }"
    >
      <el-form :model="formData" label-width="100" label-position="left">
        <el-form-item label="名称">
          <el-input
            v-model="formData.name"
            style="width: 220px"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.des"
            style="width: 220px"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="DNS">
          <el-select v-model="formData.type" style="width: 220px">
            <el-option
              v-for="item of dnsApiList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="验证信息">
          <div class="flex flex-col gap-y-4">
            <template v-if="formData.type === 'CloudFlare'">
              <el-input
                v-model="formData.auth.CF_Key"
                placeholder="KEY"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.CF_Email"
                placeholder="EMAIL"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'DNSPod.cn'">
              <el-input
                v-model="formData.auth.DP_Id"
                placeholder="ID"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.DP_Key"
                placeholder="Token"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'DNSPod.com'">
              <el-input
                v-model="formData.auth.DPI_Id"
                placeholder="ID"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.DPI_Key"
                placeholder="Token"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'DNS.LA'">
              <el-input
                v-model="formData.auth.LA_Ak"
                placeholder="APP ID"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.LA_Sk"
                placeholder="APP Secret"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'GoDaddy.com'">
              <el-input
                v-model="formData.auth.GD_Key"
                placeholder="Key"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.GD_Secret"
                placeholder="Secret"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'Aliyun'">
              <el-input
                v-model="formData.auth.Ali_Key"
                placeholder="Key"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.Ali_Secret"
                placeholder="Secret"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'cloudns.net'">
              <el-input
                v-model="formData.auth.CLOUDNS_SUB_AUTH_ID"
                placeholder="SUB AUTH ID"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.CLOUDNS_AUTH_PASSWORD"
                placeholder="AUTH PASSWORD"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'Name.com'">
              <el-input
                v-model="formData.auth.Namecom_Username"
                placeholder="Username"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.Namecom_Token"
                placeholder="token"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'Namecheap'">
              <el-input
                v-model="formData.auth.NAMECHEAP_USERNAME"
                placeholder="USERNAME"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.NAMECHEAP_API_KEY"
                placeholder="API KEY"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.NAMECHEAP_SOURCEIP"
                placeholder="SOURCE IP"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'jdcloud.com'">
              <el-input
                v-model="formData.auth.JD_ACCESS_KEY_ID"
                placeholder="ACCESS KEY ID"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.JD_ACCESS_KEY_SECRET"
                placeholder="ACCESS KEY SECRET"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'Namesilo.com'">
              <el-input
                v-model="formData.auth.Namesilo_Key"
                placeholder="KEY"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'DNS.COM'">
              <el-input
                v-model="formData.auth.dns_com_key"
                placeholder="API KEY"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.dns_com_secret"
                placeholder="API Secret"
                style="width: 220px"
              />
            </template>
            <template v-if="formData.type === 'dnsdun'">
              <el-input
                v-model="formData.auth.Dnsdun_uid"
                placeholder="UID"
                style="width: 220px"
              />
              <el-input
                v-model="formData.auth.Dnsdun_api_key"
                placeholder="API_KEY"
                style="width: 220px"
              />
            </template>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
