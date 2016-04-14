<template>
<button @click="onBack">back</button>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onBack: function() {
      this.$dispatch('back');
      location.hash = '';
    }
  }
});
</script>
