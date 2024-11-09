<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import Cell from "./component/cell.vue";

defineOptions({
  name: "AccountCenterPersonal"
});

const { userAvatar } = useNav();
</script>

<template>
  <div class="flex w-full items-start gap-4">
    <el-card class="flex-1" shadow="always">
      <template #header> 基本信息 </template>
      <div class="flex gap-4">
        <el-avatar shape="circle" :size="100" fit="cover" :src="userAvatar" />
        <div class="flex flex-col gap-2 justify-evenly">
          <p>
            <el-tag type="primary">ID: ceshi</el-tag>
          </p>
          <p>
            <el-tag type="success">登录方式：账号登录</el-tag>
          </p>
        </div>
      </div>
      <el-card class="mt-4" shadow="never">
        账户余额
        <el-text class="mx-1" size="large" type="warning">¥ 0</el-text></el-card
      >
    </el-card>
    <el-card class="flex-1" shadow="always">
      <template #header> 认证方式 </template>
      <Cell
        icon-class="text-red-500"
        icon="ep:user"
        title="未认证"
        desc="请尽快完成实名认证，否则可能会影响部分功能使用。"
      />
      <Cell
        icon="ep:iphone"
        icon-class="text-orange-500"
        title="未绑定"
        desc="绑定的手机可用于找回账号及接收通知"
      />
      <Cell
        icon="ri:mail-line"
        icon-class="text-blue-500"
        title="ceshi@gmail.com"
        desc="您已绑定安全邮箱"
      />
      <Cell
        icon="ri:shield-keyhole-line"
        icon-class="text-green-500"
        title="登录安全设置"
        desc="可设置登录白名单，开启登录验证码"
      />
    </el-card>
  </div>
</template>
