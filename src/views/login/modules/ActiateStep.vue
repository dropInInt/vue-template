<template>
  <div>
    <div class="stepForm" v-if="stepStatus === '1'">
      <h4>您正在对帐号{{ account }}进行激活操作</h4>
      <a-form :form="form" @submit="handleSubmit" autocomplete="off">
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="请输入手机号"
            v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]"
          ></a-input>
        </a-form-item>
        <a-row>
          <div style="width: 238px; padding-right: 10px;display: inline-block;">
            <a-form-item>
              <a-input
                size="large"
                type="text"
                placeholder="请输入验证码"
                v-decorator="['verifyCode', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
              ></a-input>
            </a-form-item>
          </div>
          <div
            class="sendBtn"
            tabindex="-1"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
          ></div>
        </a-row>
        <a-form-item style="margin:7px 0 0 0; text-align: center;" class="noborder">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-button size="large" htmlType="submit" class="bindPhone-button">绑定</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </div>
    <!-- <div class="stepForm" v-else-if="stepStatus === '2'">
      <div class="bindSuccess">
        <span>
          <i class="iconfont icon-check"></i>
        </span>
        <h4>帐号{{ account }}已绑定手机{{ phone }}</h4>
        <a-button class="bindPhone-button" @click="nextStep('3')">下一步</a-button>
      </div>
    </div>
    <div class="stepForm" v-else-if="stepStatus === '3'">
      <InitPassword @nextStep="nextStep"></InitPassword>
    </div>-->
    <!-- <div class="stepForm" v-else-if="stepStatus === '4'">
      <div class="bindSuccess pswsuccess">
        <span>
          <i class="iconfont icon-check"></i>
        </span>
        <h4>密码设置完成</h4>
        <a-button class="bindPhone-button" @click="goLogin">登录</a-button>
      </div>
    </div>-->
    <div class="stepForm" v-else-if="stepStatus === '4'">
      <div class="bindSuccess">
        <span>
          <i class="iconfont icon-check"></i>
        </span>
        <h4>帐号{{ account }}已绑定手机{{ phone }}</h4>
      </div>
      <a-button class="bindPhone-button" @click="goLogin">登录</a-button>
    </div>
  </div>
</template>
<script>
import { sendVerifyCode, bindMobile } from '@/api/login'
import InitPassword from './InitPassword'
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'ActicateStep',
  components: {
    InitPassword
  },
  data () {
    return {
      stepStatus: '1',
      form: this.$form.createForm(this),
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false,
      pswStatus1: false,
      pswStatus2: false,
      complete: false,
      account: this.$store.userDatas.userName,
      phone: '11111'
    }
  },
  mounted () {
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    goLogin () {
      window.location = '/dashboard/home/homePage'
    },
    getCaptcha (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          const params = {
            mobile: values.mobile,
            type: 'bind'
          }
          sendVerifyCode(params)
            .then(res => {
              setTimeout(hide, 2500)
              if (res.code !== 200) {
                state.smsSendBtn = false
                state.time = 60
                setTimeout(hide)
                this.$notification['error']({
                  message: '提示',
                  description: res.message,
                  duration: 8
                })
              } else {
                state.smsSendBtn = true
                const interval = window.setInterval(() => {
                  if (state.time-- <= 0) {
                    state.time = 60
                    state.smsSendBtn = false
                    window.clearInterval(interval)
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
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    requestFailed (err) {
      this.errMsg = err.message
      this.$notification['error']({
        message: '错误',
        description:
          err.message ||
          ((err.response || {}).data || {}).msg ||
          '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    nextStep (step) {
      this.stepStatus = step
      this.$emit('nextStep', this.stepStatus)
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            mobile: values.mobile,
            sysUserCode: _that.$store.userDatas.sysUserCode,
            verificationCode: values.verifyCode,
            type: 'bind'
          }

          bindMobile(params).then(res => {
            if (res.code === 200) {
              _that.$notification.success({
                message: '手机绑定成功'
              })
              this.phone = values.mobile
              this.stepStatus = '4'
              this.$emit('nextStep', this.stepStatus)
            } else {
              _that.$notification.error({
                message: res.message
              })
            }
          })
        }
      })
    },
    handlePasswordLevel (rule, value, callback) {
      let level = 0
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (value.length < 6) {
        callback(new Error('密码不符合规范'))
      } else {
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
          }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          callback(new Error('密码不符合规范'))
        }
      }
    },
    handlePasswordInputClick () {
      // if (!this.isMobile()) {
      //   this.state.passwordLevelChecked = true
      //   return
      // }
      this.state.passwordLevelChecked = false
    },
    handlePasswordCheck (rule, value, callback) {
      const password = this.formPSW.getFieldValue('password')
      // console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    }
  }
}
</script>
<style lang="less" scoped>
.stepForm {
  h4 {
    font-size: 14px;
    margin-bottom: 30px;
  }
  .ant-input {
    width: 100%;
    font-size: 12px !important;
    height: 36px !important;
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
  .sendBtn {
    color: #1fa9e8;
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
  }
  .bindPhone-button {
    font-size: 14px;
    height: 42px;
    width: 100%;
    display: inline-block;
    margin: 0 auto;
    color: white;
    border-radius: 4px;
    background: #1fa9e8 !important;
    color: #fff;
    border: none;
  }
  .bindSuccess {
    span {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-block;
      background: #52c41a;
      color: #fff;
      text-align: center;
      line-height: 40px;
      margin: 38px 0 0 40px;
      .iconfont {
        font-weight: bold;
      }
    }
    h4 {
      display: inline-block;
      width: 173px;
      margin-left: 30px;
      position: relative;
      top: 18px;
      line-height: 35px;
    }
    .bindPhone-button {
      margin-top: 70px;
    }
  }
  .resetpsw {
    h2 {
      font-size: 14px;
      margin-bottom: 30px;
      text-align: center;
    }
    .ant-form-item {
      margin-bottom: 20px;
      .ant-btn {
        margin-top: 10px;
      }
    }
  }
  .pswsuccess {
    h4 {
      top: 0;
    }
  }
}
</style>
