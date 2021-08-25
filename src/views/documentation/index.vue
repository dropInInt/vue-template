<template>
  <div><textarea class="editor-content" v-html="content" /></div>
</template>
<script>
export default {
  name: 'Documentation',
  data () {
    return {
      content: '1121'
    }
  }
}
</script>
