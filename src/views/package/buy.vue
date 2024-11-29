<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getPackageList,
  getPackageGroupList,
  checkPackage,
  createPackage
} from "@/api/package";

const router = useRouter();
const isLoading = ref(false);
const searchForm = reactive({
  mine: "",
  group: ""
});
const packageGroupList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getPackageList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const formData = ref({});

const handleCheck = async () => {
  const { data } = await checkPackage(formData.value.id, formData.value);
  formData.value.orgin_price = data.orgin_price;
  formData.value.new_price = data.new_price;
};

const handleBuy = async () => {
  await createPackage({
    ...formData.value,
    package: formData.value.id
  });
  ElMessage.success("购买成功");
  modal.value = false;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    ({ data: packageGroupList.value } = await getPackageGroupList({
      limit: 0
    }));
    searchForm.group = packageGroupList.value[0].id;
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
        <el-button
          v-for="item of packageGroupList"
          :key="item.id"
          size="small"
          :type="searchForm.group === item.id ? 'primary' : 'default'"
          @click="
            () => {
              searchForm.group = item.id;
              pagination.page = 1;
              getList();
            }
          "
        >
          {{ item.name }}
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      size="small"
      :data="tableData"
      style="width: 100%; height: 0; flex: 1"
    >
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column prop="name" label="套餐" show-overflow-tooltip />
      <el-table-column label="流量" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.traffic === -1 ? "不限制" : `${row.traffic}Mbps` }}
        </template>
      </el-table-column>
      <el-table-column label="连接数" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.connection === -1 ? "不限制" : row.connection }}
        </template>
      </el-table-column>
      <el-table-column label="域名数/主域名数" show-overflow-tooltip>
        <template #default="{ row }">
          {{
            `${row.domain === -1 ? "不限制" : row.domain}/${row.main_domain === -1 ? "不限制" : row.main_domain}`
          }}
        </template>
      </el-table-column>
      <el-table-column label="HTTP端口数" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.http_port === -1 ? "不限制" : row.http_port }}
        </template>
      </el-table-column>
      <el-table-column label="转发端口数" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.stream_port === -1 ? "不限制" : row.stream_port }}
        </template>
      </el-table-column>
      <el-table-column label="自定义CC规则" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.custom_cc_rule === 1 ? "支持" : "不支持" }}
        </template>
      </el-table-column>
      <el-table-column label="WebSocket" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.websocket === 1 ? "支持" : "不支持" }}
        </template>
      </el-table-column>
      <el-table-column
        label="月价(元)"
        prop="month_price"
        show-overflow-tooltip
      />
      <el-table-column
        label="季价(元)"
        prop="quarter_price"
        show-overflow-tooltip
      />
      <el-table-column
        label="年价(元)"
        prop="year_price"
        show-overflow-tooltip
      />
      <el-table-column label="购买" width="100" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button
              size="small"
              type="primary"
              @click="
                () => {
                  formData.id = row.id;
                  formData.name = row.name;
                  modal = true;
                }
              "
            >
              购买
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
      :title="`购买${formData.name}套餐`"
      append-to-body
    >
      <el-form :model="formData" label-width="100" label-position="left">
        <el-form-item label="购买时长">
          <el-select
            v-model="formData.duration"
            style="width: 220px"
            @change="handleCheck"
          >
            <el-option label="月付" value="month" />
            <el-option label="季度付" value="quarter" />
            <el-option label="年付" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义名称">
          <el-input v-model="formData.name" style="width: 220px" />
        </el-form-item>
        <el-form-item v-if="formData.orgin_price" label="订单金额">
          {{ formData.orgin_price }}元
        </el-form-item>
        <el-form-item
          v-if="formData.orgin_price && formData.new_price"
          label="优惠金额"
        >
          {{ formData.orgin_price - formData.new_price }}元
        </el-form-item>
        <el-form-item v-if="formData.new_price" label="应付金额">
          {{ formData.new_price }}元
        </el-form-item>
        <el-form-item label="优惠码">
          <el-input
            v-model="formData.coupon_code"
            style="width: 220px"
            @blur="handleCheck"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleBuy">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
