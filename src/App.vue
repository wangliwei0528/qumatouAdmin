<template>
  <div id="app" class="layout">
  	<transition name="fade" mode="out-in">
    	<router-view/>
		</transition>
  </div>
</template>

<script>
export default {
	name: 'app'
}
</script>

<style>
	@import 'assets/common.css';
</style>