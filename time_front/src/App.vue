<template>
	<v-app>
		<router-view />
	</v-app>
</template>

<script>
	import Api from "@/services/api.js"
	export default {
		name: 'App',
		components: {},
		data() {
			return {
				//
				isSetToken: false,
			}
		},
		watch: {},
		mounted: function() {
			Object.noty = this.$noty;
			this.$root.$api = new Api();

			this.$router.push({
				name: 'home'
			});
		},
	}
</script>