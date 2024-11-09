<script lang="ts" setup>
import { ref } from "vue";
import { useTable, PlusTable, PlusSearch } from "plus-pro-components";
import "plus-pro-components/es/components/table/style/css";
import "plus-pro-components/es/components/search/style/css";
import { type PlusColumn, type FieldValues } from "plus-pro-components";
import { Download, Printer, Setting } from "@element-plus/icons-vue";

interface TableRow {
  id: number;
  name: string;
  status: string;
  tag: string;
  time: Date;
}

const state = ref<FieldValues>({
  status: "1",
  name: ""
});

const searchRef = ref();

const TestServe = {
  getList: async () => {
    const data = Array.from({ length: 3 }).map((item, index) => {
      return {
        id: index,
        name: index + "name",
        status: String(index % 3),
        tag:
          index === 1
            ? "success"
            : index === 2
              ? "warning"
              : index === 3
                ? "info"
                : "danger",
        time: new Date()
      };
    });
    return {
      data: data as TableRow[]
    };
  }
};

const { tableData } = useTable<TableRow[]>();

const tableConfig: PlusColumn[] = [
  {
    label: "名称",
    prop: "name"
  },
  {
    label: "状态",
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "未解决",
        value: "0"
      },
      {
        label: "已解决",
        value: "1"
      },
      {
        label: "解决中",
        value: "2"
      },
      {
        label: "失败",
        value: "3"
      }
    ]
  },
  {
    label: "标签",
    prop: "tag",
    valueType: "tag",
    fieldProps: (value: string) => {
      return { type: value };
    }
  },
  {
    label: "时间",
    prop: "time",
    valueType: "date-picker"
  }
];

const columns: PlusColumn[] = [
  {
    label: "名称",
    width: 120,
    prop: "name",
    valueType: "copy",
    tooltip: "我是名称"
  },
  {
    label: "状态",
    width: 120,
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red"
      },
      {
        label: "已解决",
        value: "1",
        color: "blue"
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow"
      },
      {
        label: "失败",
        value: "3",
        color: "red"
      }
    ]
  }
];

const getList = async (values?: FieldValues) => {
  try {
    const { data } = await TestServe.getList();
    tableData.value = data;
  } catch (error) {}
};
getList();

const handlePrint = () => {
  window.print();
};

const handleReset = () => {
  state.value = {};
};
</script>

<template>
  <el-card shadow="always">
    <template #header>
      <div class="flex">
        <PlusSearch
          ref="searchRef"
          v-model="state"
          :hasLabel="false"
          :has-footer="false"
          :columns="columns"
          :row-props="{ gutter: 10 }"
          :col-props="{
            span: 12
          }"
          @search="getList"
          @reset="handleReset"
        />
        <el-button type="primary" @click="() => searchRef.handleSearch()">
          搜索
        </el-button>
        <el-button type="default" @click="() => searchRef.handleReset()">
          重制
        </el-button>
      </div>
    </template>

    <PlusTable
      default-size="large"
      :columns="tableConfig"
      :table-data="tableData"
      :drag-sortable="false"
      :title-bar="{ title: '表格标题', columnSetting: { dragSort: false } }"
      :has-toolbar="true"
    >
      <template #density-icon> <div /> </template>

      <template #toolbar>
        <el-button type="primary" circle :icon="Download" />
        <el-button type="primary" circle :icon="Printer" @click="handlePrint" />
      </template>
      <template #column-settings-icon>
        <el-button class="ml-3" type="primary" circle :icon="Setting" />
      </template>

      <template #title>
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </template>
    </PlusTable>
  </el-card>
</template>
