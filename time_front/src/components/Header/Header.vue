<template>
	<v-toolbar class="menu">
		<v-toolbar-items>
			<v-layout row wrap>
				<v-flex xs12>
					<h3>Projeto</h3>
				</v-flex>
				<v-flex xs12>
					<h1>{{ titulo }}</h1>
				</v-flex>
			</v-layout>
		</v-toolbar-items>
	</v-toolbar>

</template>
<script src="./Header.js"></script>
<style lang="scss">
	@import "./Header.scss";
</style>