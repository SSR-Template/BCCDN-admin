<script setup>
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { onKeyStroke } from "@vueuse/core";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import { useLayout } from "@/layout/hooks/useLayout";
import { bg, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { resetPassword, emailValidCode, phoneValidCode } from "@/api/user";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import Mail from "@iconify-icons/ri/mail-fill";
import Phone from "@iconify-icons/ri/cellphone-fill";
import Valid from "@iconify-icons/ri/pass-valid-fill";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({});
const currentTab = ref("email");

const handleValidCode = async () => {
  if (currentTab.value === "email") {
    await emailValidCode({
      check_exist: 1,
      code: "",
      email: ruleForm.email,
      randstr: "",
      ticket: ""
    });
  } else {
    await phoneValidCode({
      check_exist: 1,
      code: "zppy",
      phone: ruleForm.phone,
      randstr: "",
      ticket: ""
    });
  }
  message("验证码发送成功", { type: "success" });
};

const onReset = async formEl => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (currentTab.value === "email") {
        await resetPassword({
          ...ruleForm,
          phone: "",
          phone_captcha: "",
          reset_by: currentTab.value
        });
      } else {
        await resetPassword({
          ...ruleForm,
          phone_captcha: ruleForm.captcha,
          reset_by: currentTab.value
        });
      }
      message("重置密码成功", { type: "success" });
      router.replace({ path: "/login" });
    }
  });
};

onKeyStroke(["Enter", "NumpadEnter"], () => {
  onReset(ruleFormRef.value);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <Motion>
            <h2 class="outline-none">{{ `${title}系统重置密码` }}</h2>
          </Motion>

          <Motion :delay="100">
            <el-tabs v-model="currentTab">
              <el-tab-pane label="用邮箱重置" name="email" />
              <el-tab-pane label="用手机重置" name="phone" />
            </el-tabs>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="150">
              <el-form-item
                v-if="currentTab === 'email'"
                prop="email"
                :rules="[
                  {
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.email"
                  clearable
                  placeholder="邮箱"
                  :prefix-icon="useRenderIcon(Mail)"
                />
              </el-form-item>
              <el-form-item
                v-else
                prop="phone"
                :rules="[
                  {
                    required: true,
                    message: '请输入手机号',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.phone"
                  clearable
                  placeholder="手机号"
                  :prefix-icon="useRenderIcon(Phone)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <div class="flex gap-x-4">
                <el-form-item
                  class="flex-1"
                  prop="captcha"
                  :rules="[
                    {
                      required: true,
                      message: '请输入验证码',
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    v-model="ruleForm.captcha"
                    clearable
                    placeholder="验证码"
                    :prefix-icon="useRenderIcon(Valid)"
                  />
                </el-form-item>
                <el-button type="primary" @click="handleValidCode"
                  >获取验证码</el-button
                >
              </div>
            </Motion>

            <Motion :delay="250">
              <el-form-item class="flex-1" prop="password">
                <el-input
                  v-model="ruleForm.password"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="300">
              <el-form-item
                class="flex-1"
                prop="rePassword"
                :rules="[
                  {
                    validator(_, value, callback) {
                      if (!value) {
                        callback(new Error('请再次输入密码'));
                      } else if (value !== ruleForm.password) {
                        callback(new Error('两次输入密码不一致'));
                      } else {
                        callback();
                      }
                    }
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.rePassword"
                  clearable
                  show-password
                  placeholder="确认密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="400">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onReset(ruleFormRef)"
              >
                重置新密码
              </el-button>
            </Motion>

            <Motion :delay="450">
              <div
                class="flex items-center justify-end gap-x-4 text-sm text-primary mt-4"
              >
                <div @click="router.push('/register')">注册账号</div>
                <div @click="router.push('/login')">用已有账号登录</div>
              </div>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
