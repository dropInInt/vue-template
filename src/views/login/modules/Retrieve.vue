<template>
  <a-form
    class="user-layout-login"
    style="padding-top: 10px;"
    :form="form"
    @submit="handleSubmit"
    autocomplete="off"
    v-if="!changePsw"
  >
    <!-- <h2 style="padding: 0 0 32px 0;">忘记密码</h2> -->
    <a-tabs
      :activeKey="customActiveKey"
      :tabBarStyle="{ textAlign: 'center', borderBottom: '1px solid #DFE3E7', margin: '7px 0 20px 0', fontWeight: 'bold', color: '#787F9A'}"
      @change="handleTabClick"
    >
      <a-tab-pane key="tab2" tab="手机验证">
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="请输入手机号"
            v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]"
          ></a-input>
        </a-form-item>
        <a-row>
          <div style="padding-right: 10px;display: inline-block; width: 178px;">
            <a-form-item>
              <a-input
                size="large"
                type="text"
                placeholder="请输入验证码"
                v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
              ></a-input>
            </a-form-item>
          </div>
          <button
            class="sendBtn"
            tabindex="-1"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
          ></button>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="tab1" tab="邮箱验证">
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="请输入邮箱"
            v-decorator="['email', {rules: [{ required: true, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱' }], validateTrigger: 'change'}]"
          ></a-input>
        </a-form-item>
        <a-row>
          <div style="padding-right: 10px;display: inline-block;width: 178px;">
            <a-form-item>
              <a-input
                size="large"
                type="text"
                placeholder="请输入验证码"
                v-decorator="['captchaEmail', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
              ></a-input>
            </a-form-item>
          </div>
          <button
            class="sendBtn"
            tabindex="-1"
            :disabled="stateEmail.smsSendBtn"
            @click.stop.prevent="getCaptchaEmail"
            v-text="!stateEmail.smsSendBtn && '获取验证码' || (stateEmail.time+' s')"
          ></button>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <a-form-item style="margin:7px 0 0 0; text-align: center;" class="noborder">
      <a-row :gutter="24">
        <a-col :span="8" style="height: auto;margin-bottom: -10px;">
          <a class="handleLogin" @click="handleLogin">&lt;返回登录</a>
        </a-col>
        <a-col :span="16">
          <a-button size="large" htmlType="submit" class="login-button">提交</a-button>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
  <modify-psw v-else :mobileObj="mobileObj" @handleLogin="handleLogin" />
</template>

<script>
// import { getAuthCode, checkMobile } from "@/api/auth";
import { sendVerifyCode, checkPhone, sendMail, checkEmail } from '@/api/login'
import ModifyPsw from './ModifyPsw'

export default {
  name: 'Retrieve',
  components: { ModifyPsw },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  data () {
    return {
      confirmDirty: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      stateEmail: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      isTel: true,
      registerBtn: false,
      captcha: '',
      mobileObj: {},
      changePsw: false,
      pswStatus1: false,
      pswStatus2: false,
      isMobile: false,
      customActiveKey: 'tab2',
      interval: null,
      params: {}
    }
  },
  computed: {
  },
  methods: {
    handleTabClick (key) {
      this.customActiveKey = key
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      let validateStatus = true
      this.form.validateFields((err, values) => {
        if (_that.customActiveKey === 'tab1') {
          _that.params = {
            mail: values.email,
            verificationCode: values.captchaEmail
          }
        } else {
          _that.params = {
            mobile: values.mobile,
            verificationCode: values.captcha
          }
        }
        if (err) {
          if (_that.customActiveKey === 'tab1') {
            if (err.email || err.captchaEmail) {
              validateStatus = false
            }
          } else {
            if (err.mobile || err.captcha) {
              validateStatus = false
            }
          }
        }
        if (validateStatus) {
          if (_that.customActiveKey === 'tab1') {
            checkEmail(_that.params).then(res => {
              if (res.code === 200) {
                _that.$notification.success({
                  message: '验证成功'
                })
                _that.mobileObj = {
                  mail: values.email,
                  verificationCode: values.captchaEmail,
                  tab: _that.customActiveKey
                }
                this.changePsw = true
              } else {
                _that.$notification.error({
                  message: res.message
                })
              }
            })
          } else {
            checkPhone(_that.params).then(res => {
              if (res.code === 200) {
                _that.$notification.success({
                  message: '验证成功'
                })
                _that.mobileObj = {
                  mobile: values.mobile,
                  verificationCode: values.captcha,
                  tab: _that.customActiveKey
                }
                this.changePsw = true
              } else {
                _that.$notification.error({
                  message: res.message
                })
              }
            })
          }
        }
      })
    },
    handleLogin () {
      this.$emit('handleLogin')
    },
    getCaptcha (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this
      const _that = this
      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true
          const hide = this.$message.loading('验证码发送中..', 0)
          const params = {
            mobile: values.mobile,
            type: 'forget'
          }
          sendVerifyCode(params)
            .then(res => {
              setTimeout(hide, 2500)
              if (res.code !== 200) {
                state.smsSendBtn = false
                state.time = 60
                setTimeout(hide)
                _that.$notification['error']({
                  message: '提示',
                  description: res.message,
                  duration: 8
                })
              } else {
                state.smsSendBtn = true
                _that.interval = window.setInterval(() => {
                  if (state.time-- <= 0) {
                    state.time = 60
                    state.smsSendBtn = false
                    window.clearInterval(_that.interval)
                  }
                }, 1000)
                setTimeout(hide)
                this.$notification['success']({
                  message: '提示',
                  description: '验证码发送成功',
                  duration: 8
                })
              }
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(_that.interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    getCaptchaEmail (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        stateEmail
      } = this
      const _that = this
      validateFields(['email'], { force: true }, (err, values) => {
        if (!err) {
          stateEmail.smsSendBtn = true
          const hide = this.$message.loading('验证码发送中..', 0)
          const params = {
            email: values.email,
            type: 'forget'
          }
          sendMail(params)
            .then(res => {
              setTimeout(hide, 2500)
              if (res.code !== 200) {
                stateEmail.smsSendBtn = false
                stateEmail.time = 60
                setTimeout(hide)
                _that.$notification['error']({
                  message: '提示',
                  description: res.message,
                  duration: 8
                })
              } else {
                stateEmail.smsSendBtn = true
                _that.interval = window.setInterval(() => {
                  if (stateEmail.time-- <= 0) {
                    stateEmail.time = 60
                    stateEmail.smsSendBtn = false
                    window.clearInterval(_that.interval)
                  }
                }, 1000)
                setTimeout(hide)
                this.$notification['success']({
                  message: '提示',
                  description: '验证码发送成功',
                  duration: 8
                })
              }
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(_that.interval)
              stateEmail.time = 60
              stateEmail.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.user-layout-login {
  padding: 10px 40px 30px 40px;
  box-sizing: border-box;
  .ant-tabs-nav {
    .ant-tabs-tab {
      &:active {
        color: #f68524;
      }
    }
  }
  .sendBtn {
    color: #333;
    width: 82px;
    height: 36px;
    border: 1px solid #dfe3e7;
    display: inline-block;
    text-align: center;
    border-radius: 4px;
    font-size: 12px;
    line-height: 34px;
    vertical-align: top;
    margin-top: 3px;
    cursor: pointer;
    text-align: center;
    background: #fff;
  }
  label {
    font-size: 14px;
  }
  h2 {
    color: #fff;
    font-size: 14px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #1fa9e8;
    border-radius: 8px 8px 0 0;
    margin: 0 -40px;
    font-weight: bold;
  }

  .forge-password {
    font-size: 12px;
    text-align: right;
    float: right;
  }

  button.login-button {
    font-size: 14px;
    height: 36px;
    width: 80px;
    margin: 0 auto;
    color: white;
    border-radius: 4px;
    background: #f68524 !important;
    color: #fff;
    border: none;
    float: right;
  }

  .ant-form-item {
    margin-bottom: 10px;
    label.user-name {
      font-size: 14px;
      color: rgba(147, 147, 147, 1);
      line-height: 19px;
      display: inline-block;
    }
    label.ant-checkbox-wrapper {
      span {
        font-size: 14px;
        color: rgba(141, 156, 176, 1);
      }
      .forge-password {
        color: rgba(62, 77, 168, 1);
      }
    }
  }
  .ant-form-item-children {
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    position: relative;
    box-sizing: border-box;
    padding: 0 0 0 56px;
    height: 58px;
    .ant-input-affix-wrapper {
      width: 100%;
      height: 36px;
      line-height: 34px;
      border-color: #dfe3e7;
      font-size: 12px;
      font-weight: bold;
      color: rgba(84, 97, 130, 1);
      background: white;
      display: inline-block;
      .ant-input-prefix {
        .anticon {
          font-size: 14px;
        }
      }
      .ant-input {
        height: 36px;
        line-height: 36px;
        &.ant-input-lg {
          font-size: 12px !important;
        }
        &:not(:first-child) {
          background: white;
          padding-left: 40px;
        }
      }
      .iconfont {
        color: #dfe3e7;
        font-size: 18px;
        cursor: pointer;
        &:hover {
          color: #1fa9e8;
        }
      }
    }
    .ant-input {
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #dfe3e7;
      border-radius: 0;
      text-indent: 10px;
    }
    label.user-name {
      position: absolute;
      left: 0;
      top: 20px;
    }
  }
  .noborder {
    .ant-form-item-children {
      border: none;
      padding: 0;
    }
  }
  .ant-input {
    border: none;
    background: white;
    line-height: 32px;
    padding: 4px;
    min-height: 36px;
    color: rgba(84, 97, 130, 1);
    font-size: 12px;
    font-weight: bold;
    &:not(:first-child) {
      background: white;
      padding-left: 40px;
    }
    &::-webkit-input-placeholder {
      color: #475f7b;
      font-weight: bold;
    }
    &:-moz-placeholder {
      color: #475f7b;
      font-weight: bold;
    }
    &::-moz-placeholder {
      color: #475f7b;
      font-weight: bold;
    }
    &:-ms-input-placeholder {
      color: #475f7b;
      font-weight: bold;
    }
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
  .ant-tabs-bar {
    margin: 0 0 20px 0 !important;
    .ant-tabs-nav {
      width: 100% !important;
      border-bottom: 1px solid rgba(246, 246, 248, 1);
      .ant-tabs-tab {
        width: 200px;
        margin: 0;
        padding: 0 0 14px 0;
        color: rgba(147, 147, 147, 1);
        font-size: 14px;
        &.ant-tabs-tab-active {
          color: #f68524;
          font-weight: bold;
        }
      }
      .ant-tabs-ink-bar-animated {
        bottom: 0;
        background-color: #f68524 !important;
        width: 100%;
        height: 2px;
      }
    }
    .ant-tabs-nav-animated {
      width: 100% !important;
    }
  }
}
.handleLogin {
  color: #64b3cc;
  display: inline-block;
  margin-top: -10px;
  font-size: 12px;
}

.getCaptcha {
  width: 100%;
  text-align: right;
  display: inline-block;
  line-height: 56px;
  color: rgba(62, 77, 168, 1);
  &:hover {
    color: #60c697;
  }
}
</style>
