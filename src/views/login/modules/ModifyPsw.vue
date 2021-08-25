<template>
  <a-form
    class="user-layout-login"
    :form="form"
    @submit="handleSubmit"
    autocomplete="off"
    v-if="!complete"
  >
    <!-- <h2></h2> -->
    <div class="pswTip">输入6-20个字符，密码应至少包含数字、大小写字母及特殊字符中的两种</div>
    <!-- <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
      <template slot="content">
        <div :style="{ width: '160px' }" >
          <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
          <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
          <div style="margin-top: 10px;">
            <span>请输入6-20个数字、字母、特殊字符组成的密码(区分大小写)。</span>
          </div>
        </div>
    </template>-->
    <a-form-item>
      <a-input
        size="large"
        :type=" pswStatus1 ? 'text' : 'password' "
        @click="handlePasswordInputClick"
        autocomplete="false"
        placeholder="请输入新密码"
        v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
      >
        <i
          slot="suffix"
          :class=" pswStatus1 ? 'iconfont icon-psw-see' : 'iconfont icon-psw-unsee' "
          :style="{ color: 'rgba(0,0,0,.25)' }"
          @click="pswStatus1 = !pswStatus1"
        />
      </a-input>
    </a-form-item>
    <!-- </a-popover> -->
    <a-form-item>
      <a-input
        size="large"
        :type=" pswStatus2 ? 'text' : 'password' "
        autocomplete="false"
        placeholder="确认新密码"
        v-decorator="['password2', {rules: [{ required: true, message: '6-20位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
      >
        <i
          slot="suffix"
          :class=" pswStatus2 ? 'iconfont icon-psw-see' : 'iconfont icon-psw-unsee' "
          :style="{ color: 'rgba(0,0,0,.25)' }"
          @click="pswStatus2 = !pswStatus2"
        />
      </a-input>
    </a-form-item>
    <a-form-item style="margin:20px 0 10px 0; text-align: center;" class="noborder">
      <a-button size="large" type="primary" htmlType="submit" class="login-button">提交</a-button>
    </a-form-item>
  </a-form>
  <div v-else>
    <div class="successTip">
      <div class="successIcon">
        <i class="iconfont icon-check"></i>
      </div>
      <div class="successText">密码重置完成</div>
      <a-button @click="goLogin">去登录</a-button>
    </div>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { pswByPhone, pswByEmail } from '@/api/login'
// import { getAuthCode, resetByMobile } from '@/api/auth'
// import notification from 'ant-design-vue/es/notification'
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
  name: 'ModifyPsw',
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mixins: [mixinDevice],
  props: {
    mobileObj: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
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
      complete: false
    }
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
      this.$emit('handleLogin')
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
      if (value) {
        if (value.length > 5) {
          if (level >= 2) {
            callback()
          } else {
            callback(new Error('密码不符合规范'))
          }
        } else {
          callback(new Error('密码不符合规范'))
        }
      } else {
        callback()
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (_that.mobileObj.tab === 'tab1') {
            const params = {
              mail: _that.mobileObj.mail,
              password: values.password,
              verificationCode: _that.mobileObj.verificationCode
            }
            pswByEmail(params).then(res => {
              if (res.code === 200) {
                _that.$notification.success({
                  message: '提示',
                  description: '重置密码成功'
                })
                this.complete = true
              } else {
                _that.$notification.error({
                  message: '错误提示',
                  description: res.message || '重置密码失败'
                })
              }
            })
          } else {
            const params = {
              mobile: _that.mobileObj.mobile,
              password: values.password,
              verificationCode: _that.mobileObj.verificationCode
            }
            pswByPhone(params).then(res => {
              if (res.code === 200) {
                _that.$notification.success({
                  message: '提示',
                  description: '重置密码成功'
                })
                this.complete = true
              } else {
                _that.$notification.error({
                  message: '错误提示',
                  description: res.message || '重置密码失败'
                })
              }
            })
          }
        }
      })
    },
    handlePasswordInputClick () {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
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
  // watch: {
  //   'state.passwordLevel' (val) {
  //     console.log(val)
  //   }
  // }
}
</script>

<style scoped lang="less">
.user-layout-login {
  padding: 30px 40px 30px 40px;
  box-sizing: border-box;
  .pswTip {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 12px;
    color: #727e8c;
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
    margin-bottom: 15px;
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
      border: none;
      border-bottom: 1px solid #dfe3e7;
      font-size: 12px;
      border-radius: 0;
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
          color: rgba(62, 77, 168, 1);
          font-weight: bold;
        }
      }
      .ant-tabs-ink-bar-animated {
        bottom: 0;
        background-color: rgba(62, 77, 168, 1);
        width: 100%;
        height: 2px;
      }
    }
    .ant-tabs-nav-animated {
      width: 100% !important;
    }
  }
}
.iconfont {
  font-size: 32px;
}
.ant-input-affix-wrapper .ant-input-suffix {
  right: 0;
}
.getCaptcha {
  width: 100%;
  text-align: right;
  display: inline-block;
}
.successTip {
  width: 400px;
  height: 234px;
  background: #fff;
  border-radius: 8px;
  text-align: center;
  padding: 40px 0;
  .successIcon {
    width: 80px;
    height: 80px;
    background: #65b930;
    border-radius: 50%;
    line-height: 80px;
    text-align: center;
    color: #fff;
    margin: 0 auto;
  }
  .successText {
    margin-top: 17px;
    color: #727e8c;
  }
  .ant-btn {
    margin-top: 10px;
    color: #25abea;
    font-size: 12px;
    border-color: #dfe3e7;
  }
}
</style>
