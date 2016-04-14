<template>
<div id="iterotar">
  <h1>イテレータパターン</h1>
  <div class="content">
    {{{content}}}
  </div>
</div>
<back></back>
</template>

<script>
import Vue from 'vue';
import Back from './back.vue';
import content from './contents/iterator.md';

export default Vue.extend({
  data: function() {
    return {
      content: content
    }
  },
  components: {
    Back
  }
});
</script>
