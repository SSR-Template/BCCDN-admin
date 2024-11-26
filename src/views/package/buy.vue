<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import {
  useTable,
  PlusTable,
  PlusColumn,
  FieldValues,
  PlusDialogForm
} from "plus-pro-components";
import "plus-pro-components/es/components/table/style/css";
import "plus-pro-components/es/components/dialog-form/style/css";
import { getPackageList, postPackage, checkPackage } from "@/api/package";
import { ElMessage } from "element-plus";

const visible = ref(false);
const values = ref<FieldValues>({});
const detailModelInfo = ref<FieldValues>({});
const showMoney = ref<FieldValues>({});

const packageSelect = ref(0);
const packageOptions = computed(() => {
  return [
    {
      label: "特殊行业【套餐-非不可描述】"
    },
    {
      label: "新香港超防-【套餐】"
    },
    {
      label: "移动CDN过屏蔽-【套餐】"
    },
    {
      label: "香港线路大带宽-【套餐】"
    },
    {
      label: "常规版-不允许有任何违规【套餐】"
    }
  ];
});

const { tableData, buttons } = useTable();

buttons.value = [
  {
    text: "购买",
    props() {
      return {
        type: "primary"
      };
    },
    code: "primary",
    onClick: params => {
      visible.value = true;
      detailModelInfo.value = params.row;
    }
  }
];

const tableConfig: PlusColumn[] = [
  {
    label: "套餐",
    width: 220,
    prop: "name"
  },
  {
    label: "流量(GB)",
    prop: "traffic",
    width: 120,
    formatter: value => {
      return value === -1 ? "不限制" : value;
    }
  },
  {
    label: "带宽",
    prop: "bandwidth",
    width: 120,
    formatter: value => {
      return value === -1 ? "不限制" : value;
    }
  },
  {
    label: "连接数",
    prop: "connection",
    width: 120,
    formatter: value => {
      return value === -1 ? "不限制" : value;
    }
  },
  {
    label: "域名数 / 主域名数",
    prop: "domain",
    width: 150,
    render: (value, { row }) => {
      return `${row.domain} / ${row.main_domain === -1 ? "不限制" : row.main_domain}`;
    }
  },
  {
    label: "HTTP端口数",
    prop: "http_port",
    width: 80
  },
  {
    label: "转发端口数",
    prop: "stream_port",
    width: 80
  },
  {
    label: "自定义CC规则",
    prop: "stream_port",
    width: 80,
    formatter: value => {
      return value === 1 ? "支持" : "不支持";
    }
  },
  {
    label: "Websocket",
    prop: "websocket",
    width: 80,
    formatter: value => {
      return value === 1 ? "支持" : "不支持";
    }
  },
  {
    label: "月价(元)",
    width: 120,
    prop: "month_price"
  },
  {
    label: "季价(元)",
    width: 120,
    prop: "quarter_price"
  },
  {
    label: "年价(元)",
    width: 120,
    prop: "year_price"
  }
];

const formConfig: PlusColumn[] = [
  {
    label: "购买时长",
    width: 120,
    prop: "duration",
    valueType: "select",
    options: [
      {
        label: "月付",
        value: "month"
      },
      {
        label: "季付",
        value: "quarter"
      },
      {
        label: "年付",
        value: "year"
      }
    ],
    fieldProps() {
      checkCoupon();
      return {};
    }
  },
  {
    label: "自定义名称",
    width: 120,
    prop: "name",
    valueType: "input"
  },
  {
    label: "优惠码",
    width: 120,
    prop: "coupon_code",
    valueType: "input"
  },
  {
    label: "订单金额",
    width: 120,
    prop: "orderMoney",
    valueType: "input",
    fieldProps() {
      return {
        readonly: true
      };
    }
  },
  {
    label: "优惠金额",
    width: 120,
    prop: "couponMoney",
    valueType: "input",
    fieldProps() {
      return {
        readonly: true
      };
    }
  },
  {
    label: "应付金额",
    width: 120,
    prop: "payMoney",
    valueType: "input",
    fieldProps() {
      return {
        readonly: true
      };
    }
  }
];

const getTableData = () => {
  getPackageList(packageSelect.value + 1).then(res => {
    tableData.value = res.data;
  });
};

const submit = () => {
  postPackage({
    coupon_code: values.value.coupon_code,
    package: detailModelInfo.value.id,
    duration: values.value.duration,
    name: values.value.name
  }).then(res => {
    if (res.code === 0) {
      ElMessage.success("购买成功");
      visible.value = false;
      getTableData();
    } else {
      ElMessage.error(res.msg);
    }
  });
};

const dialogConfig = computed(() => {
  return {
    title: "购买套餐",
    okText: "确定",
    cancelText: "取消"
  };
});

const checkCoupon = () => {
  checkPackage(detailModelInfo.value.id, {
    coupon_code: values.value.coupon_code,
    duration: values.value.duration
  }).then(res => {
    if (res.data.err) {
      ElMessage.error(res.data.err);
      showMoney.value = {};
      return;
    }
    values.value["orderMoney"] =
      res.data?.[`${values.value.duration}_price`] || 0;
    values.value["couponMoney"] = res.data?.id_verify || 0;
    values.value["payMoney"] = res.data?.new_price || 0;
    values.value["name"] = res.data?.name || 0;
    showMoney.value = res.data;
  });
};

onMounted(getTableData);

watchEffect(getTableData);
</script>
<template>
  <el-card>
    <template #header> 购买套餐 </template>
    <el-radio-group v-model="packageSelect" class="mb-4" size="default">
      <el-radio
        v-for="(item, index) in packageOptions"
        :key="index"
        :value="index"
        size="large"
        border
      >
        <div class="flex gap-2 items-center">
          {{ item.label }}
        </div>
      </el-radio>
    </el-radio-group>
    <PlusDialogForm
      v-model:visible="visible"
      v-model="values"
      width="500px"
      :dialog="dialogConfig"
      :form="{ columns: formConfig, labelWidth: '100px' }"
      @confirm="submit"
    />
    <PlusTable
      default-size="large"
      :columns="tableConfig"
      :table-data="tableData"
      :drag-sortable="false"
      :title-bar="false"
      :action-bar="{
        label: '购买',
        buttons: buttons,
        type: 'button'
      }"
    >
      <template #density-icon> <div /> </template>

      <template #title>
        <el-button type="primary">新增</el-button>
        <el-button type="info">启用</el-button>
        <el-button type="warning">禁用</el-button>
        <el-button type="danger">删除</el-button>
      </template>
    </PlusTable>
  </el-card>
</template>
