<template>
<ul>
  <li v-for="pattern in patterns">
    <a :href="`#${pattern.hash}`" @click="onSelect(pattern.component)">{{ pattern.name }}</a>
  </li>
</ul>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data: function() {
    return {
      patterns: [
        {
          name: 'イテレータパターン',
          component: 'Iterator',
          hash: 'iterator'
        },
        {
          name: 'アダプタパターン',
          component: 'Adapter',
          hash: 'adapter'
        }
      ]
    };
  },
  methods: {
    onSelect: function(component) {
      this.$dispatch('select:pattern', component);
    }
  }
});
</script>

<style lang="stylus">
a
  cursor pointer
</style>
