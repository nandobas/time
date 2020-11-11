<template>
	<div class="admin">
		<Menu></Menu>
		<v-content>
			<router-view>
			</router-view>
		</v-content>
	</div>
</template>

<style lang="scss">
	@import "./Admin.scss";
</style>
<script src="./Admin.js"></script>