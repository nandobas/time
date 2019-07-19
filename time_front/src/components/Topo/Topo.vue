<template>
	<v-toolbar color="primary" class='topo'>

		<DialogSimulacao :abrir='abrirDialogNome' :form="form" @setOptions='setOptions' @salvar='salvar'></DialogSimulacao>

		<v-toolbar-items v-if="$route.name != 'homeLogado'">
			<v-btn icon class='align-left no-ripple btn-salvar-simulacao' :class="{'salvando': blSalvandoSimulacao}" @click="form.strNome ? salvar() : novaSimulacao()" :disabled="blSalvandoSimulacao">
				<v-tooltip bottom open-delay="0" close-delay="0">
					<template v-slot:activator="{ on }">
						<span v-on='on'>
							<v-icon>mdi-content-save</v-icon>

							<font class="nome-simulacao">
								{{ form.strNome ? form.strNome : 'Salvar simulação' }}
							</font>
						</span>
					</template>
					<span>
						Salvar simulação
					</span>
				</v-tooltip>
			</v-btn>
		</v-toolbar-items>
		<v-spacer></v-spacer>
		<v-toolbar-items>
			<div class="nome-usuario">
				{{ strNome }}
			</div>

			<v-btn icon class='align-right' @click='logout()'>


				<v-tooltip bottom open-delay="0" close-delay="0">
					<template v-slot:activator="{ on }">
						<v-icon v-on='on'>mdi-logout</v-icon>
					</template>
					<span>
						Sair
					</span>
				</v-tooltip>
			</v-btn>
		</v-toolbar-items>
	</v-toolbar>
</template>
<script src="./Topo.js"></script>
<style lang="scss">
	@import "./Topo.scss";
</style>