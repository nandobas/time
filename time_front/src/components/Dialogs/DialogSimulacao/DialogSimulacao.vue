<template>
	<v-dialog v-model="dialogNome" persistent max-width="350" content-class='dialog-simulacao'>
		<v-icon class="close" @click='dialogNome = false'>mdi-close</v-icon>

		<div class="image-header">
			<img class="icone" src="data:image/svg+xml;base64,
                    PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTggNTgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU4IDU4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGNsYXNzPSIiPjxnPjxnPgoJPGc+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0VGRUJERSIgcG9pbnRzPSI0Ni41LDE0IDMyLjUsMCAxLjUsMCAxLjUsNTggNDYuNSw1OCAgICIgZGF0YS1vcmlnaW5hbD0iI0VGRUJERSIgY2xhc3M9IiI+PC9wb2x5Z29uPgoJCTxnPgoJCQk8cGF0aCBzdHlsZT0iZmlsbDojRDVEMEJCIiBkPSJNMTEuNSwyM2gyNWMwLjU1MiwwLDEtMC40NDcsMS0xcy0wLjQ0OC0xLTEtMWgtMjVjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFTMTAuOTQ4LDIzLDExLjUsMjN6IiBkYXRhLW9yaWdpbmFsPSIjRDVEMEJCIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNENUQwQkIiIGQ9Ik0xMS41LDE1aDEwYzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xaC0xMGMtMC41NTIsMC0xLDAuNDQ3LTEsMVMxMC45NDgsMTUsMTEuNSwxNXoiIGRhdGEtb3JpZ2luYWw9IiNENUQwQkIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggc3R5bGU9ImZpbGw6I0Q1RDBCQiIgZD0iTTM2LjUsMjloLTI1Yy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDI1YzAuNTUyLDAsMS0wLjQ0NywxLTFTMzcuMDUyLDI5LDM2LjUsMjl6IiBkYXRhLW9yaWdpbmFsPSIjRDVEMEJCIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNENUQwQkIiIGQ9Ik0zNi41LDM3aC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgyNWMwLjU1MiwwLDEtMC40NDcsMS0xUzM3LjA1MiwzNywzNi41LDM3eiIgZGF0YS1vcmlnaW5hbD0iI0Q1RDBCQiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBzdHlsZT0iZmlsbDojRDVEMEJCIiBkPSJNMzYuNSw0NWgtMjVjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMjVjMC41NTIsMCwxLTAuNDQ3LDEtMVMzNy4wNTIsNDUsMzYuNSw0NXoiIGRhdGEtb3JpZ2luYWw9IiNENUQwQkIiIGNsYXNzPSIiPjwvcGF0aD4KCQk8L2c+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0Q1RDBCQiIgcG9pbnRzPSIzMi41LDAgMzIuNSwxNCA0Ni41LDE0ICAgIiBkYXRhLW9yaWdpbmFsPSIjRDVEMEJCIiBjbGFzcz0iIj48L3BvbHlnb24+Cgk8L2c+Cgk8Zz4KCQk8Y2lyY2xlIHN0eWxlPSJmaWxsOiM3MUMzODYiIGN4PSI0NC41IiBjeT0iNDYiIHI9IjEyIiBkYXRhLW9yaWdpbmFsPSIjNzFDMzg2IiBjbGFzcz0iIiBkYXRhLW9sZF9jb2xvcj0iIzcxQzM4NiI+PC9jaXJjbGU+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRiIgZD0iTTUwLjUsNDVoLTV2LTVjMC0wLjU1Mi0wLjQ0OC0xLTEtMXMtMSwwLjQ0OC0xLDF2NWgtNWMtMC41NTIsMC0xLDAuNDQ4LTEsMXMwLjQ0OCwxLDEsMWg1djUgICAgYzAsMC41NTIsMC40NDgsMSwxLDFzMS0wLjQ0OCwxLTF2LTVoNWMwLjU1MiwwLDEtMC40NDgsMS0xUzUxLjA1Miw0NSw1MC41LDQ1eiIgZGF0YS1vcmlnaW5hbD0iI0ZGRkZGRiIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBkYXRhLW9sZF9jb2xvcj0iI0ZGRkZGRiI+PC9wYXRoPgoJPC9nPgo8L2c+PC9nPiA8L3N2Zz4=" />
		</div>

		<v-card>
			<v-card-title class="headline">
				<div class="h1">
					{{strAcao}} Simulação
				</div>
			</v-card-title>
			<v-card-text class='pt-2 pb-2'>
				<v-layout row wrap>
					<div class="text-xs-center text">
						Informe um nome para que você possa identificá-la posteriormente
					</div>

					<v-flex xs12 mt-4 mb-0 pb-0>
						<v-text-field autofocus single-line label='Nome' v-model.trim="strNome" ref='inputNome' @keyup.enter="fecharDialogNome()" class='pt-0' outline solo :rules="[blValidarNome ? rules.required : false]">
						</v-text-field>
					</v-flex>
				</v-layout>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<div class="button-area">
					<v-btn v-if="strAcao=='Copiar' || strAcao=='Salvar'" class='outline' @click="dialogNome = false;">
						<span>Cancelar</span>
					</v-btn>
					<v-btn v-else class='outline' @click="fecharDialogNome(false);">
						<span>Iniciar sem salvar</span>
					</v-btn>
					<v-btn @click="fecharDialogNome(true, strAcao)">
						<span v-if="strAcao=='Salvar'">Salvar</span>
						<span v-else>Iniciar</span>
					</v-btn>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script src="./DialogSimulacao.js"></script>
<style lang="scss">
	@import "./DialogSimulacao.scss";
</style>