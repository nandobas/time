<template>
	<div class="home-logado">
		<p class='mb-0'>Bem vindo ao</p>

		<h1>Simulador de Planejamento Tributário Econet</h1>

		<div class='text'>
			Você pode iniciar uma nova simulação
		</div>

		<div class="button-area">
			<v-btn @click='novaSimulacao()' class='mt-2'>
				<div class="icon">
					<v-icon>mdi-pencil</v-icon>
				</div>
				<span>
					Simulação manual
				</span>
			</v-btn>
			<router-link to="/simulacao/ecf" class='mt-2'>
				<div class="icon">
					<v-icon>mdi-file-upload</v-icon>
				</div>
				<span>
					Importar ECF
				</span>
			</router-link>
		</div>

		<div class='text'>
			Ou selecionar uma simulação salva
		</div>

		<Simulacoes @selecionarSimulacao='selecionarSimulacao' @copiarSimulacao='copiarSimulacao'></Simulacoes>
		<DialogSimulacao :abrir='abrirDialogNome' :form="p_form" @iniciarForm='iniciarForm' @set_options='set_options' @salvar='salvar'></DialogSimulacao>
	</div>
</template>
<script src="./HomeLogado.js"></script>
<style lang="scss">
	@import "./HomeLogado.scss";
</style>