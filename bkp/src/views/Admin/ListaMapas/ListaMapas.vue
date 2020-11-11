<template>
	<v-container>
		<div class="px-3">
			<v-layout>
				<v-flex xs6>
					<h1>Mapas</h1>
				</v-flex>
			</v-layout>

			<v-layout class="mt-3 btn-template" v-for="mapa in mapas" :key=mapa.id>
				<v-flex xs12>
					<router-link :to="{ name: 'mapa', params: { id: mapa.id } }">
						<v-card class="pl-4">
							<v-card-text class="px-0">{{ mapa.id }} - {{ mapa.nome }}</v-card-text>
						</v-card>
					</router-link>
				</v-flex>
			</v-layout>


		</div>

	</v-container>
</template>

<script src="./ListaMapas.js"></script>

<style lang="scss">
	@import "./ListaMapas.scss";
</style>