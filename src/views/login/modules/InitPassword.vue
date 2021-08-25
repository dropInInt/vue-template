<template>
  <div>
    <a-form class="resetpsw" :form="form" @submit="handleSubmit" autocomplete="off">
      <h2>初始密码重置</h2>
      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入新密码"
          :style="{ height: '36px !important' }"
          v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="确认新密码"
          :style="{ height: '36px !important' }"
          v-decorator="['password2', {rules: [{ required: true, message: '6-20位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
      <a-form-item style="margin:20px 0 10px 0; text-align: center;" class="noborder">
        <a-button class="bindPhone-button" htmlType="submit">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { updatePassword } from '@/api/login'
export default {
  name: 'InitPassword',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handlePasswordCheck (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            oPassword: '123456',
            password: values.password2,
            sysUserCode: _that.$store.userDatas.sysUserCode
          }
          updatePassword(params).then(res => {
            if (res.code === 200) {
              _that.$notification.success({
                message: '手机绑定成功'
              })
              this.phone = values.mobile
              this.$emit('nextStep', '4')
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
      if (value) {
        if (value.length < 6) {
          callback(new Error('密码不符合规范'))
        } else {
          if (level >= 2) {
            callback()
          } else {
            callback(new Error('密码不符合规范'))
          }
        }
      } else {
        callback()
      }
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
