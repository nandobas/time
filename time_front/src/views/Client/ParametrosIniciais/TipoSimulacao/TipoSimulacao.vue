<template>
	<div class="tipo-simulacao">

		<fieldset>
			<legend>
				<div>
					<span class="titulo">Que tipo de simulação você deseja fazer?</span>
				</div>
			</legend>

			<v-radio-group v-model="form.tipoSimulacao.intTipoSimulacao" column>
				<v-radio v-for='ts in arOpcoes.arTipoSimulacao' :key="'ts'+ts.value" :label='ts.descricao' :value='ts.value'></v-radio>
			</v-radio-group>
		</fieldset>
		<fieldset v-if='form.tipoSimulacao.intTipoSimulacao == 1'>
			<legend>
				<div>
					<span class="titulo">Qual o regime tributário atual?</span>
				</div>
			</legend>

			<v-radio-group v-model="form.tipoSimulacao.intRegime" column>
				<v-radio v-for='ts in arOpcoes.arRegime' :key="'ts'+ts.value" :label='ts.descricao' :value='ts.value'></v-radio>
			</v-radio-group>
		</fieldset>
		<fieldset>
			<legend>
				<div>
					<span class="titulo">Selecione o período</span>
				</div>
			</legend>

			<v-radio-group v-model="form.tipoSimulacao.intPeriodo" column>
				<v-radio v-for='ts in arOpcoes.arPeriodo' :key="'ts'+ts.value" :label='ts.descricao' :value='ts.value'></v-radio>
			</v-radio-group>
		</fieldset>
		<fieldset>
			<legend>
				<div>
					<span class="titulo">Selecione o estado</span>
				</div>
			</legend>

			<v-flex xs12 sm4 d-flex pt-2>
				<v-select :items="arEstados" item-text='estado' item-value='uf' v-model='form.tipoSimulacao.estado' label='Selecione o estado' outline solo>
				</v-select>
			</v-flex>
		</fieldset>

		<!--
		<v-layout row wrap class="mb-2">
			<v-flex xs12 class='titulo'>
				Que tipo de simulação você deseja fazer?
			</v-flex>

			<v-radio-group v-model="form.tipoSimulacao.blEmpresaNova" column>
				<v-radio label="Simular enquadramento tributário para uma Nova Empresa" color="primary" value="1">
				</v-radio>
				<v-radio label="Simular tributação de Empresa já existente em outros Regimes Tributários" color="primary" value="0"></v-radio>
			</v-radio-group>
		</v-layout>
		<v-layout row wrap v-if='form.tipoSimulacao.blEmpresaNova == 0' class="mb-2">
			<v-flex xs12 class='titulo'>
				Qual o regime tributário atual?
			</v-flex>

			<v-radio-group v-model="form.tipoSimulacao.intRegime" column>
				<v-radio label="Simples Nacional" color="primary" value="1"></v-radio>
				<v-radio label="Lucro Presumido" color="primary" value="2"></v-radio>
				<v-radio label="Lucro Real" color="primary" value="3"></v-radio>
			</v-radio-group>
		</v-layout>
		<v-layout row wrap class="mb-2">
			<v-flex xs12 class='titulo'>
				Selecione o período
			</v-flex>

			<v-radio-group v-model="form.tipoSimulacao.blMostrarMeses" column>
				<v-radio label="Quero inserir o valor relativo a um mês. O sistema fará a projeção trimestral." color="primary" value="0"></v-radio>
				<v-radio label="Quero inserir valores mensais, detalhando as informações relativas aos meses de Janeiro a Dezembro." color="primary" value="1"></v-radio>
			</v-radio-group>
		</v-layout>
		<v-layout row wrap>
			<v-flex xs12 class='titulo'>
				Selecione o estado
			</v-flex>

			<v-flex xs12 sm4 d-flex pt-2>
				<v-select :items="arEstados" item-text='estado' item-value='uf' v-model='form.tipoSimulacao.estado' label='Selecione o estado' outline solo>
				</v-select>
			</v-flex>
		</v-layout>
    -->
	</div>
</template>
<script src="./TipoSimulacao.js"></script>
<style lang="scss">
	@import "./TipoSimulacao.scss";
</style>