<template>
<div id="patterns">
  <component :is="currentView"></component>
</div>
</template>

<script>
import Vue from 'vue';
import Patterns from './patterns.vue';
import Iterator from './iterator.vue';
import Adapter from './adapter.vue';

function currentView() {
  let hash = location.hash.replace('#', '');
  return hash ? hash.charAt(0).toUpperCase() + hash.slice(1) : 'Patterns';
}

export default Vue.extend({
  data: function() {
    return {
      currentView: currentView()
    };
  },
  compiled: function() {
    this.$on('select:pattern', component => {
      this.currentView = component;
    });
    this.$on('back', () => {
      this.currentView = 'Patterns';
    });
  },
  components: {
    Patterns,
    Iterator,
    Adapter
  }
});
</script>
