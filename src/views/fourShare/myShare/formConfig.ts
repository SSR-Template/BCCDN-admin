import type { PlusColumn } from "plus-pro-components";

export const columns: PlusColumn[] = [
  {
    label: "监听端口",
    width: 120,
    prop: "name",
    valueType: "copy",
    tooltip: "监听端口"
  },
  {
    label: "监听协议",
    width: 120,
    prop: "protocol",
    valueType: "select",
    options: [
      {
        label: "不限",
        value: "0",
        color: "red"
      },
      {
        label: "TCP",
        value: "1",
        color: "blue"
      },
      {
        label: "UDP",
        value: "2",
        color: "yellow"
      },
      {
        label: "失败",
        value: "3",
        color: "red"
      }
    ]
  },
  {
    label: "转发组",
    width: 120,
    prop: "protocol",
    valueType: "select",
    options: [
      {
        label: "123",
        value: "0"
      }
    ]
  },
  {
    label: "源 IP",
    width: 120,
    prop: "protocol"
  },
  {
    label: "转发 ID",
    width: 120,
    prop: "protocol"
  },
  {
    label: "转发套餐",
    width: 120,
    valueType: "select",
    prop: "protocol",
    options: [
      {
        label: "1",
        value: "0"
      }
    ]
  },
  {
    label: "转发套餐",
    width: 120,
    valueType: "select",
    prop: "protocol",
    options: [
      {
        label: "不限",
        value: "0"
      },
      {
        label: "是",
        value: "1"
      },
      {
        label: "否",
        value: "2"
      }
    ]
  },
  {
    label: "状态",
    width: 120,
    valueType: "select",
    prop: "protocol",
    options: [
      {
        label: "正常",
        value: "0"
      },
      {
        label: "锁定",
        value: "1"
      },
      {
        label: "流量超额",
        value: "2"
      },
      {
        label: "套餐过期",
        value: "3"
      }
    ]
  }
];
