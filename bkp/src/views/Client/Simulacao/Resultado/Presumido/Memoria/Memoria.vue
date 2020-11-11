<template>
	<div :class="['memoria_lp', blEfeito ? 'efeito' : '']">
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


				<table class="table memoria">
					<thead>
						<tr>
							<td class="background titulo" colspan="14">{{ grupo.titulo }}</td>
						</tr>
						<tr>
							<td class="background text-sm-left">
								DRE - Descrição
							</td>
							<td class="background">
								Ano
							</td>
							<td class="background" v-for="mes in arMeses" :key="'meses'+mes.intMes">
								{{ mes.strNome }}
							</td>
						</tr>
					</thead>
					<tbody v-for="(detalhe, indexDetalhe) in grupo.arDetalhes" :key="'detalhe'+indexDetalhe">
						<tr v-if="!detalhe.memoria_false">
							<td v-if="detalhe.por_cnae" class="background text-sm-left atividades">
								<div class="texto-segmento"> {{detalhe.dre}} </div>
								<div class="texto-segmento-hover"> {{detalhe.dre}} </div>
							</td>
							<td v-else class="background text-sm-left">
								<div>{{ detalhe.dre }} <span v-if="detalhe.memoria_trimestre">DEVIDO NO TRIMESTRE</span></div>
							</td>
							<td>
								{{ formatarValor(detalhe.anual) }}
							</td>
							<td colspan="3" v-for="(trimestre, idx) in detalhe.trimestral" :key="'trimestre-receita'+idx">
								{{ formatarValor(trimestre) }}
							</td>

						</tr>
						<tr v-if="!detalhe.memoria_false && !detalhe.memoria_trimestre">
							<td>
							</td>
							<td>
							</td>
							<td v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
								{{ formatarValor(detalhe.mensal[mes.intMes + 1]) }}
							</td>
						</tr>
						<tr v-if="!detalhe.memoria_false && !detalhe.memoria_trimestre">
							<td>
							</td>
							<td>
							</td>
							<td v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
								{{ formatarValor(detalhe.acumulado[mes.intMes + 1]) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- Encargos Folha de Pagamento-->
			<div v-if="obFiltro.strGrupo == 'cpp'">
				<FolhaPgto :origem="'presumido'" :obDados="obDados" :idCnaeFuncionarios="idCnaeFuncionarios"></FolhaPgto>
			</div>

			<div class="btn-area">
				<button class="btn" @click="fechar()">Fechar</button>
			</div>
		</v-card>
	</div>
</template>

<script src="./Memoria.js"></script>

<style lang="sass">
	@import "./MemoriaPresumido.scss"
</style>