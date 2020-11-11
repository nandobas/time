<template>
	<div :class="['memoria_real', blEfeito ? 'efeito' : '']">
		<v-card>
			<div class="navigation-tabs">
				<div class="cnaes">
					<div v-for="(c, indexCnae) in arCnaes" :key="'abaCnae'+indexCnae" class="cnae">
						<div class="codigo">{{ c.cnae }}</div>
						<div class="descricao">{{ c.descricao }}</div>
						<div class="descricao segmentos">{{ c.obValidacao.texto_validacao }}</div>
					</div>
				</div>
			</div>
			<div class="area-tabela" v-for="(grupo, indexGrupo) in montaMemoria" :key="'grupo'+indexGrupo">
				<table class="table memoria" v-for="(detalhe, indexDetalhe) in grupo.arDetalhes" :key="'detalhe'+indexDetalhe">
					<tr v-if="indexDetalhe == 0">
						<td class="background titulo" colspan="20">{{ grupo.titulo }}</td>
					</tr>
					<tr v-if="indexDetalhe == 0">
						<td class="background text-sm-left">
							<div style="width:127px;padding:0px;">DRE - Descrição</div>
						</td>
						<td class="background">
							<div style="width:58px;padding:0px;">Ano</div>
						</td>
						<td class="background" v-for="mes in arMeses" :key="'meses'+mes.intMes">
							<div style="width:61px;padding:0px;">{{ mes.strNome }}</div>
						</td>
					</tr>
					<tr v-if="!detalhe.memoria_false && !detalhe.esconde_trimestre">
						<td class="background text-sm-left">
							<div style="width:127px;padding:0px;">{{ detalhe.dre }} <span v-if="detalhe.memoria_trimestre">DEVIDO NO TRIMESTRE</span></div>
						</td>
						<td>
							<div style="width:60px;padding:0px;" :class="['coluna pl-1 pr-1', detalhe.anual < 0 ? 'negativo': '']">{{ formatarValor(detalhe.anual) }}</div>
						</td>
						<td colspan="3" v-for="(trimestre, idx) in detalhe.trimestral" :key="'trimestre-receita'+idx">
							<div style="width:227px;padding:0px;" :class="['coluna pl-1 pr-1', trimestre < 0 ? 'negativo': '']">{{ formatarValor(trimestre) }}</div>
						</td>

					</tr>
					<tr v-if="!detalhe.memoria_false && !detalhe.esconde_mes">
						<td class="background text-sm-left">
							<div style="width:127px;padding:0px;"><span v-if="detalhe.dre_mes">{{detalhe.dre_mes}}</span></div>
						</td>
						<td>
							<div style="width:60px;padding:0px;" :class="['coluna pl-1 pr-1', detalhe.anual < 0 ? 'negativo': '']"><span v-if="detalhe.esconde_trimestre">{{ formatarValor(detalhe.anual) }}</span></div>
						</td>
						<td v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
							<div style="width:61px;padding:0px;" :class="['coluna pl-1 pr-1', detalhe.mensal[mes.intMes + 1] < 0 ? 'negativo': '']">{{ formatarValor(detalhe.mensal[mes.intMes + 1]) }}</div>
						</td>
					</tr>
					<tr v-if="!detalhe.memoria_false && !detalhe.esconde_mes_acumulado">
						<td class="background text-sm-left">
							<div style="width:127px;padding:0px;"><span v-if="detalhe.dre_mes_acumulado">{{detalhe.dre_mes_acumulado}}</span></div>
						</td>
						<td>
							<div style="width:60px;padding:0px;" :class="['coluna pl-1 pr-1', detalhe.anual < 0 ? 'negativo': '']"><span v-if="detalhe.esconde_trimestre">{{ formatarValor(detalhe.anual) }}</span></div>
						</td>
						<td v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
							<div style="width:61px;padding:0px;" :class="['coluna pl-1 pr-1', detalhe.acumulado[mes.intMes + 1] < 0 ? 'negativo': '']">{{ formatarValor(detalhe.acumulado[mes.intMes + 1]) }}</div>
						</td>
					</tr>
				</table>
			</div>
			<!-- Encargos Folha de Pagamento-->
			<div v-if="obFiltro.strGrupo == 'cpp'">
				<FolhaPgto :origem="'real'" :obDados="obDados" :idCnaeFuncionarios="idCnaeFuncionarios"></FolhaPgto>
			</div>

			<div class="btn-area">
				<button class="btn" @click="fechar()">Fechar</button>
			</div>
		</v-card>
	</div>
</template>

<script src="./Memoria.js"></script>

<style lang="sass">
	@import "./MemoriaReal.scss"
</style>