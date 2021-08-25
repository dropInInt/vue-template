<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
}
</script>
<style>
#app {
  height: 100%;
}

.allotConfirm .ant-btn-primary {
  background-color: #f68524 !important;
  border-color: #f68524 !important;
}
.allotConfirm .ant-btn-primary:hover {
  color: #fff !important;
}
.allotConfirm .ant-btn:hover {
  border-color: #f68524 !important;
  color: #f68524;
}

.ant-modal-wrap {
  z-index: 1113 !important;
}
.ant-select-dropdown {
  z-index: 1114 !important;
}
.ant-tooltip {
  z-index: 1114 !important;
}
.ant-calendar-picker-container{
    z-index: 1114 !important;
}
</style>
