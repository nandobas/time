<template>
	<v-dialog v-model="abrirModal" persistent max-width="350" content-class='dialog-simulacao dialog-excluir'>
		<div class="image-header">
			<v-icon class="icone">mdi-delete</v-icon>
		</div>

		<v-card>
			<v-card-title class="headline">
				<div class="h1">
					Excluir simulação
				</div>

				<div class="text-xs-center text">
					Deseja excluir a simulação {{ simulacao.strNome }}?
				</div>
				<span class="info error text-xs-center mb-3">
					* Não será possível recuperá-la após a exclusão
				</span>
			</v-card-title>
			<v-card-actions>
				<v-spacer></v-spacer>
				<div class="button-area">
					<v-btn class='outline' @click="fechar()" :disabled="loading"><span>Cancelar</span></v-btn>

					<v-btn @click="confirmar" :disabled="loading">
						<span>
							<div v-if="loading">
								<v-layout row justify-center align-center>
									<v-progress-circular indeterminate :size="20" :width="2" color="white"></v-progress-circular>
								</v-layout>
							</div>
							<div v-else>Confirmar</div>
						</span>
					</v-btn>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script src="./DialogExcluirSimulacao.js"></script>
<style lang="scss" scoped>
	@import "./DialogExcluirSimulacao.scss";
</style>