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
import { submitRegister, emailValidCode } from "@/api/user";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import Mail from "@iconify-icons/ri/mail-fill";
import User from "@iconify-icons/ri/user-3-fill";
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
const isAcceptAgreement = ref(false);
const argumentModal = ref(false);

const handleValidCode = async () => {
  await emailValidCode({
    check_exist: 0,
    code: "",
    email: ruleForm.email,
    randstr: "",
    ticket: ""
  });
  message("验证码发送成功", { type: "success" });
};

const onRegister = async formEl => {
  if (!formEl) return;
  if (!isAcceptAgreement.value) {
    message("请先同意协议", { type: "warning" });
    return;
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await submitRegister({
        ...ruleForm,
        phone: "",
        phone_captcha: "",
        qq: "",
        accept_agreement: isAcceptAgreement.value
      });
      message("注册成功", { type: "success" });
      router.replace({ path: "/login" });
    }
  });
};

onKeyStroke(["Enter", "NumpadEnter"], () => {
  onRegister(ruleFormRef.value);
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
            <h2 class="outline-none">{{ `${title}系统注册` }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  v-model="ruleForm.username"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item
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

            <Motion :delay="350">
              <div class="flex">
                <el-checkbox v-model="isAcceptAgreement">
                  <span
                    class="text-primary text-sm"
                    @click="argumentModal = true"
                    >《用户协议、法律声明和隐私政策》</span
                  >
                </el-checkbox>
              </div>
            </Motion>

            <Motion :delay="400">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onRegister(ruleFormRef)"
              >
                同意条款并注册
              </el-button>
            </Motion>

            <Motion :delay="450">
              <div
                class="text-right text-sm text-primary mt-4"
                @click="router.replace('/login')"
              >
                已有账号？去登录
              </div>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog v-model="argumentModal" title="用户协议、法律声明和隐私政策">
      <div>这里填写协议内容</div>
    </el-dialog>
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
