<template>
	<div>
		<Menu></Menu>

		<v-content>
			<v-container v-if='form'>
				<Topo :form='form' :blSalvandoSimulacao='blSalvandoSimulacao' @iniciarForm='iniciarForm' @set_options='set_options' @salvar='salvar'>
				</Topo>

				<router-view :form='form' @set_options='set_options' @salvar='salvar' @selecionarSimulacao='selecionarSimulacao' @iniciarForm='iniciarForm'></router-view>
			</v-container>
		</v-content>
	</div>

</template>
<script src="./Layout.js"></script>