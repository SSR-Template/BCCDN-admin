<script setup>
import {
  getMyPackageList,
  getMyPackageUsage,
  getMyPackageUpgradeList,
  getMyPackageChargePrice,
  chargeMyPackage
} from "@/api/package";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import FormTitle from "@/components/FormTitle/index.vue";

const pagination = reactive({
  page: 1,
  limit: 1
});
const tableData = ref([]);
const usageTableData = ref([]);
const upgradeTableData = ref([]);
const choosePackage = ref(null);
const detailModal = ref(false);
const chargeModal = ref(false);
const chargeForm = reactive({
  duration: "month",
  coupon_code: ""
});

const handleOptions = async (type, row) => {
  if (type === "detail") {
    const { data } = await getMyPackageUsage(row.id);
    choosePackage.value = {
      ...row,
      ...data
    };
    ({ data: upgradeTableData.value } = await getMyPackageUpgradeList(row.id));
    usageTableData.value = [
      {
        label: "流量(GB)",
        totalUsage: "不限",
        usage: data.traffic_usage
      },
      {
        label: "域名数",
        totalUsage: "不限",
        usage: data.domain_usage
      },
      {
        label: "主域名数",
        totalUsage: "不限",
        usage: data.main_domain_usage
      },
      {
        label: "HTTP端口数",
        totalUsage: "不限",
        usage: data.http_port_usage
      },
      {
        label: "转发端口数",
        totalUsage: "不限",
        usgae: data.stream_port_usage
      }
    ];
    detailModal.value = true;
  } else if (type === "charge") {
    const { data } = await getMyPackageChargePrice(row.id, chargeForm);
    choosePackage.value = data;
    chargeModal.value = true;
  }
};

const getList = async () => {
  const { data } = await getMyPackageList(pagination);
  tableData.value = data;
};

const handleCharge = async () => {
  await chargeMyPackage(choosePackage.value.id, chargeForm);
  ElMessage.success("充值成功");
  getList();
};

onMounted(() => {
  getList();
});
</script>

<template>
  <div class="h-[calc(100%-48px)] p-4">
    <div class="h-full bg-white p-4 rounded-xl flex flex-col gap-y-4">
      <el-table
        :data="tableData"
        style="width: 100%; height: 0; flex: 1"
        size="small"
        :header-cell-style="{
          backgroundColor: '#f9fafc',
          color: '#000',
          padding: '8px 0'
        }"
        :cell-style="{
          padding: '8px 0'
        }"
      >
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column prop="name" label="套餐名称" show-overflow-tooltip />
        <el-table-column
          prop="start_at2"
          label="购买时间"
          show-overflow-tooltip
        />
        <el-table-column
          prop="end_at2"
          label="到期时间"
          show-overflow-tooltip
        />
        <el-table-column width="350" fixed="right" label="操作">
          <template #default="{ row }">
            <div class="flex items-center gap-x-1">
              <el-button
                type="primary"
                size="small"
                @click="handleOptions('detail', row)"
                >详情</el-button
              >
              <el-button
                type="success"
                size="small"
                @click="handleOptions('charge', row)"
                >续费</el-button
              >
              <el-button type="warning" size="small">升降配</el-button>
              <el-button type="primary" size="small">改名</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="detailModal" title="套餐详情" append-to-body>
    <div class="space-y-4">
      <form-title title="使用情况" />
      <el-table
        border
        :data="usageTableData"
        :header-cell-style="{
          backgroundColor: '#f9fafc',
          color: '#000',
          padding: '12px 0',
          textAlign: 'center'
        }"
        :cell-style="{
          padding: '12px 0',
          textAlign: 'center'
        }"
      >
        <el-table-column prop="label" show-overflow-tooltip />
        <el-table-column
          prop="totalUsage"
          label="总额度"
          show-overflow-tooltip
        />
        <el-table-column prop="usage" label="已使用" show-overflow-tooltip />
      </el-table>
      <form-title title="套餐详情" />
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div>名称:</div>
        <div>{{ choosePackage.name }}</div>
        <div>基础套餐ID:</div>
        <div>{{ choosePackage.id }}</div>
        <div>流量(GB):</div>
        <div>不限</div>
        <div>带宽:</div>
        <div>不限</div>
        <div>连接数:</div>
        <div>不限</div>
        <div>域名数:</div>
        <div>不限</div>
        <div>主域名数:</div>
        <div>不限</div>
        <div>HTTP端口数:</div>
        <div>不限</div>
        <div>转发端口数:</div>
        <div>不限</div>
        <div>自定义CC规则:</div>
        <div>允许</div>
        <div>Websocket:</div>
        <div>允许</div>
        <div>HTTP3:</div>
        <div>允许</div>
        <div>到期时间:</div>
        <div>{{ choosePackage.end_at2 }}</div>
      </div>
      <form-title title="升级包" />
      <el-table
        border
        :data="upgradeTableData"
        :header-cell-style="{
          backgroundColor: '#f9fafc',
          color: '#000',
          padding: '12px 0',
          textAlign: 'center'
        }"
        :cell-style="{
          padding: '12px 0',
          textAlign: 'center'
        }"
      >
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column
          prop="package_up_name"
          label="名称"
          show-overflow-tooltip
        />
        <el-table-column prop="type" label="类型" show-overflow-tooltip />
        <el-table-column prop="amount" label="数值" show-overflow-tooltip />
        <el-table-column prop="package_up" label="数量" show-overflow-tooltip />
        <el-table-column
          prop="user_package"
          label="总数"
          show-overflow-tooltip
        />
      </el-table>
    </div>
    <template #footer>
      <el-button @click="detailModal = false">取消</el-button>
      <el-button type="primary" @click="detailModal = false">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="chargeModal" title="续费" appen-to-body :width="500">
    <el-form :model="chargeForm">
      <el-form-item label="续费时长">
        <el-select v-model="chargeForm.duration">
          <el-option label="一个月" value="month" />
          <el-option label="三个月" value="quarter" />
          <el-option label="一年" value="year" />
        </el-select>
      </el-form-item>
      <el-form-item label="价格" label-position="top">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>原价:</div>
          <div>1元</div>
          <div>基础套餐:</div>
          <div>1元</div>
          <div>升级包:</div>
          <div>0元</div>
          <div>实际支付:</div>
          <div>1元</div>
        </div>
      </el-form-item>
      <el-form-item label="优惠码">
        <el-input v-model="chargeForm.coupon_code" placeholder="请输入优惠码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="chargeModal = false">取消</el-button>
      <el-button type="primary" @click="handleCharge">确定</el-button>
    </template>
  </el-dialog>
</template>
