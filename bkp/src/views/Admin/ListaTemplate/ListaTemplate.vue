<template>
	<v-container>
		<div class="px-3">
			<v-layout>
				<v-flex xs6>
					<h1>Templates</h1>
				</v-flex>
			</v-layout>

			<v-layout class="mt-3 btn-template" v-for="template in templates" :key=template.id>
				<v-flex xs12>
					<router-link :to="{ name: 'template', params: { id: template.id } }">
						<v-card class="pl-4">
							<v-card-text class="px-0">{{ template.id }} - {{ template.template }}</v-card-text>
						</v-card>
					</router-link>
				</v-flex>
			</v-layout>


		</div>

	</v-container>
</template>

<script src="./ListaTemplate.js"></script>

<style lang="scss">
	@import "./ListaTemplate.scss";
</style>