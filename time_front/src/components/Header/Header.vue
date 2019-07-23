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
			<v-btn @click="downloadFile();" :disabled="timeoutDownload">
				
				<span v-if='timeoutDownload'>
					<v-layout row justify-center align-center>
						<v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
					</v-layout>
				</span>
				<span v-else>
					Download
				</span>
				
			</v-btn>
		</div>
	</v-layout>

</template>
<script src="./Header.js"></script>
<style lang="scss">
	@import "./Header.scss";
</style>