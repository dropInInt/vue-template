<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar
      :style="{ width: sidebar ? '210px' : '54px' }"
      class="sidebar-container"
    />
    <div
      :class="{ hasTagsView: needTagsView }"
      class="main-container"
      :style="{ marginLeft: sidebar ? '210px' : '54px' }"
    >
      <div>
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ResizeMixin from './mixin/ResizeHandler'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import TagsView from './components/TagsView'
import Settings from './components/Settings'
import AppMain from './components/AppMain'
// 右侧切换主题
import RightPanel from '@/components/RightPanel'

export default {
  name: 'BasicLayout',
  mixins: [ResizeMixin],
  components: {
    Sidebar,
    Navbar,
    RightPanel,
    TagsView,
    Settings,
    AppMain
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      showSettings: state => state.settings.showSettings,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '320px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('changeSidebar')
    }
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    display: table;
    clear: both;
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 210px);
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
