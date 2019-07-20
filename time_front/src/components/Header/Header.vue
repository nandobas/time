<template>
	<v-layout row wrap>
		<div class="flex sm12 md6 bloco">

			<p>Bem vindo</p>

			<h1>Projeto - Time de Futebol</h1>

			<div class="text">
				<span>{{titulo}}</span> 
			</div>

		</div>
		<div class="button-area">
			<v-btn @click="abreFormClubes();">Clubes</v-btn>
			<v-btn @click="abreFormJogadores();">Jogadores</v-btn>
			<v-btn @click="downloadFile();">Download</v-btn>
		</div>
	</v-layout>

</template>
<script src="./Header.js"></script>
<style lang="scss">
	@import "./Header.scss";
</style>