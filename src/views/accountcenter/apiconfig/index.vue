<script setup lang="ts">
import {
  genApiConfig,
  getApiConfig,
  putApiConfig,
  removeApiConfig
} from "@/api/accountcenter";
import { onMounted, reactive, ref } from "vue";

const configEnable = ref(false);
const loading = ref(false);

const apiConfig = reactive({
  api_key: "",
  api_secret: "",
  ip: ""
});

const beforeChange = async () => {
  loading.value = true;
  const fn = configEnable.value ? removeApiConfig : genApiConfig;

  await fn();
  loading.value = false;

  return Promise.resolve(true);
};

const getConfig = async () => {
  loading.value = true;
  const res = await getApiConfig();
  configEnable.value = Boolean(res.data);
  if (configEnable.value) {
    apiConfig.api_key = res.data.api_key;
    apiConfig.api_secret = res.data.api_secret;
    apiConfig.ip = res.data.ip || "";
  }
  loading.value = false;
};

const onChangIp = async () => {
  await putApiConfig(apiConfig.ip);
};

onMounted(getConfig);
</script>

<template>
  <el-card>
    <template #header> API密钥设置 </template>
    <el-space size="large">
      <div>密钥状态</div>
      <el-switch
        v-model="configEnable"
        size="large"
        inline-prompt
        active-text="开启"
        inactive-text="关闭"
        :before-change="beforeChange"
      />
    </el-space>

    <br />
    <el-space v-if="configEnable" class="mt-6" size="large">
      <el-card shadow="always">
        <template #header>api_key</template>
        <div>{{ apiConfig.api_key }}</div>
      </el-card>
      <el-card shadow="always">
        <template #header>api_secret</template>
        <div>{{ apiConfig.api_secret }}</div>
      </el-card>
      <el-card shadow="always">
        <template #header>ip 白名单</template>
        <el-input
          v-model="apiConfig.ip"
          placeholder="多个 IP 请用 ｜ 分割"
          @blur="onChangIp"
        />
      </el-card>
    </el-space>
  </el-card>
</template>
