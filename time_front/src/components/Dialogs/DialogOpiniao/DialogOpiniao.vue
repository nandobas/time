<template>
	<v-dialog v-model="abrirModal" persistent max-width="60%" content-class='dialog-opiniao'>
		<div class="image-header">
			<v-icon class="icone">mdi-comment</v-icon>
		</div>

		<v-icon class="close" @click='fechar()'>mdi-close</v-icon>

		<v-card>
			<v-card-title class="headline">
				<div class="h1">
					Sua opinião é muito importante
				</div>
			</v-card-title>
			<v-card-text class='pb-2'>
				<v-layout row wrap>
					<div class="text-xs-center text">
						Nos ajude a melhorar cada vez mais e realizar alterações relevantes para facilitar o seu dia-a-dia no uso dessa ferramenta.
					</div>

					<v-flex xs12 pt-3 pl-2 pr-2>
						<v-textarea outline label="Escreva seu comentário" autofocus ref='textarea' :rules="[rules.required, blTentativa ? rules.min : true]" v-model='txtComentario'></v-textarea>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12 class="button-steps" pl-2 pr-2>
						<v-btn :disabled="btnLoadingEnvio" @click='submit()' class='send right mr-0'>
							<span v-if="btnLoadingEnvio">
								<v-layout row justify-center align-center>
									<v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
								</v-layout>
							</span>
							<span v-else>Enviar</span>
							<div class="icon">
								<v-icon>mdi-send</v-icon>
							</div>
						</v-btn>
					</v-flex>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script src="./DialogOpiniao.js"></script>
<style lang="scss">
	@import "./DialogOpiniao.scss";
</style>