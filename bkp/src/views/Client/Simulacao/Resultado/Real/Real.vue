<template>
	<div class="real">

		<Header titulo="Lucro Real"></Header>
		<div class="icone-area btn-imprimir" style="display:block;">
			<a class="link" @click="seletorImpressao">
				<span v-if="carrega_impressao">...aguarde</span>
				<span v-else>
					<v-icon>mdi-printer-settings</v-icon>
					<span>Imprimir</span>
				</span>
			</a>
		</div>

		<v-alert type="warning" class="mt-3" :value="true" v-if="false">
			<span>em desenvolvimento...</span>
		</v-alert>
		<v-layout row justify-center v-if="obDados == null" class="ma-5 pa-5">
			<v-progress-circular indeterminate :size="70" :width="5"></v-progress-circular>
		</v-layout>
		<v-layout v-else wrap>
			<div class="navigation-tabs">
				<div class="cnaes">
					<div v-for="(abaResultado, indexAbasResultado) in arAbasResultadoByOrdem" :key="'abaResult'+indexAbasResultado" :class="['cnae', intIndexAba == abaResultado.id ? 'active': '']" @click="setIndexAba(abaResultado.id);">
						<div class="descricao">{{ abaResultado.label }}</div>
					</div>
				</div>
			</div>

			<div v-for="(cnae, indexCnae) in obDados.arCnaes" :key="'impedimento_'+indexCnae">
				<v-alert v-if="cnae.impedimento" type="warning" icon="mdi-information" class="mt-4" :value="true">
					<span v-html="cnae.impedimento.texto"></span>
				</v-alert>
			</div>
			<div class="area-tabela aba_resultado" v-if="intIndexAba === 0 || carrega_impressao">
				<table class="tabela mb-4">
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TRIBUTO</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj">
						<td class="coluna legenda text-sm-left" width="120px;">
							IRPJ
							<v-icon @click="mostrarMemoria('irpj', 'irpj')">mdi-information</v-icon>
						</td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'irpjTotal')" :key="'lp_mensal_irpj'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll">
						<td class="coluna legenda text-sm-left">
							CSLL
							<v-icon @click="mostrarMemoria('csll', 'csll')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('csll', 'csllSaldo')" :key="'lp_mensal_csll'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda pl-1 pr-1" v-for="(vlTotal, index) in calcularTotaisIReCS" :key="'lp_total_ircs'+index">{{ vlTotal }}</td>
					</tr>
				</table>

				<table class="tabela mb-4">
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TRIBUTO</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.pis">
						<td class="coluna legenda text-sm-left" width="120px;">
							PIS
							<v-icon @click="mostrarMemoria('pis_cofins', 'pisTotal')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'pisTotal', false)" :key="'lp_mensal_pis'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.cofins">
						<td class="coluna legenda text-sm-left">
							COFINS
							<v-icon @click="mostrarMemoria('pis_cofins', 'cofinsTotal')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'cofinsTotal', false)" :key="'lp_mensal_cofins'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda" v-for="(vlTotal, index) in calcularTotaisPISCOFINS" :key="'lp_total_picofins'+index">{{ vlTotal }}</td>
					</tr>
				</table>

				<table class="tabela mb-4">
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TRIBUTO</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left" width="120px;">
							IPI
							<v-icon @click="mostrarMemoria('ipi', 'ipi')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('ipi', 'ipi', false)" :key="'lp_mensal_ipi'+index">
							<span v-if="obDados.arReceitas.acumulado.ipi.ipi.mostra">{{ formatarValor(impostoMensal) }}</span>
							<span v-else>-</span>
						</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left" width="120px;">
							ISS
							<v-icon @click="mostrarMemoria('iss', 'iss')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('iss', 'iss', false)" :key="'lp_mensal_iss'+index">
							<span v-if="obDados.arReceitas.acumulado.iss.iss.mostra">{{ formatarValor(impostoMensal) }}</span>
							<span v-else>-</span>
						</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left" width="120px;">
							ICMS
							<v-icon @click="mostrarMemoria('icms', 'icms')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('icms', 'icms', false)" :key="'lp_mensal_icms'+index">
							<span v-if="obDados.arReceitas.acumulado.icms.icms.mostra">{{ formatarValor(impostoMensal) }}</span>
							<span v-else>-</span>
						</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda" v-for="(vlTotal, index) in calcularTotais" :key="'lp_total'+index">{{ vlTotal }}</td>
					</tr>
				</table>
				<table class="tabela mb-4">
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TRIBUTO</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.cpp">
						<td class="coluna legenda text-sm-left" width="120px;">
							CPP
							<v-icon @click="mostrarMemoria('cpp', 'cpp')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('cpp', 'cpp', false)" :key="index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda" v-for="(vlTotal, index) in calcularTotalCpp" :key="'lp_total'+index">{{ vlTotal }}</td>
					</tr>
				</table>
			</div>


			<div class="area-tabela aba_resultado" v-if="intIndexAba === 7 || carrega_impressao">
				<table class="tabela dre  mb-4">
					<tr class="linha ">
						<td class="coluna  legenda text-sm-left">Descrição</td>
						<td class="coluna legenda">Ano</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.receitaBrutaGeral">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.receitaBrutaGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.receitaBrutaGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'receitaBrutaGeral')" :key="'lp_mensal_receita'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.receitaBrutaGeral">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'receitaBrutaGeral', false)" :key="'lp_mensal_receita'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.receitaBrutaGeral">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'receitaBrutaGeral', true)" :key="'lp_mensal_receita'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tbody v-for="(arCampo, indexCampo) in obDados.arReceitas.acumulado.lucroReal.receita_atividade" :key="'campo'+indexCampo">
						<tr>
							<td class="coluna legenda text-sm-left ">
								<div style="width:213px;padding:0px;">{{arCampo.dre}} </div>
							</td>
							<td class="coluna ">
								<div style="width:42px;padding:0px;">{{ formatarValor(arCampo.anual) }}</div>
							</td>
							<td class="coluna " colspan="3" v-for="(trimestre, idx) in arCampo.trimestral" :key="'trimestre-receita'+idx">
								<div style="width:159px;padding:0px;">{{ formatarValor(trimestre) }}</div>
							</td>

						</tr>

						<tr>
							<td class="coluna legenda text-sm-left">

							</td>
							<td class="coluna ">

							</td>

							<td class="coluna " v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
								<div style="width:37px;padding:0px;">{{ formatarValor(arCampo.mensal[mes.intMes + 1]) }}</div>
							</td>

						</tr>
					</tbody>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.deducoesBruta">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.deducoesBruta.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.deducoesBruta.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'deducoesBruta')" :key="'lp_mensal_deducao_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.deducoesBruta">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'deducoesBruta', false)" :key="'lp_mensal_deducao_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.deducoesBruta">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'deducoesBruta', true)" :key="'lp_mensal_deducao_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.icms.icms.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.icms.icms.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.icms.icms.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('icms', 'icms')" :key="'lp_mensal_icms_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.icms.icms.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('icms', 'icms', false)" :key="'lp_mensal_icms_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.icms.icms.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('icms', 'icms', true)" :key="'lp_mensal_icms_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.ipi.ipi.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.ipi.ipi.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.ipi.ipi.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('ipi', 'ipi')" :key="'lp_mensal_ipi_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.ipi.ipi.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('ipi', 'ipi', false)" :key="'lp_mensal_ipi_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.ipi.ipi.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('ipi', 'ipi', true)" :key="'lp_mensal_ipi_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.pis.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.pis_cofins.pis.dre_mes}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.pis_cofins.pis.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('pis_cofins', 'pis')" :key="'lp_mensal_pis_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.pis.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'pis', false)" :key="'lp_mensal_pis_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.pis.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'pis', true)" :key="'lp_mensal_pis_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.cofins.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.pis_cofins.cofins.dre_mes}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.pis_cofins.cofins.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('pis_cofins', 'cofins')" :key="'lp_mensal_cofins_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.cofins.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'cofins', false)" :key="'lp_mensal_cofins_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.cofins.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'cofins', true)" :key="'lp_mensal_cofins_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.iss.iss.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.iss.iss.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('iss', 'iss')" :key="'lp_mensal_iss_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('iss', 'iss', false)" :key="'lp_mensal_iss_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('iss', 'iss', true)" :key="'lp_mensal_iss_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>


					<tbody v-for="(arCampo, indexCampo) in obDados.arReceitas.acumulado.lucroReal.venda_canc_devolucoes" :key="'campo'+indexCampo">
						<tr>
							<td class="coluna legenda text-sm-left atividades">
								<div class="texto-segmento">(-) {{arCampo.dre}} {{getCnaeValidacao(arCampo.idcnae, arCampo.cod_atividade)}}</div>
								<div class="texto-segmento-hover">(-) {{arCampo.dre}} {{getCnaeValidacao(arCampo.idcnae, arCampo.cod_atividade)}}</div>
							</td>
							<td class="coluna ">
								<div style="width:42px;padding:0px;">{{ formatarValor(arCampo.anual) }}</div>
							</td>
							<td class="coluna " colspan="3" v-for="(trimestre, idx) in arCampo.trimestral" :key="'trimestre-receita'+idx">
								<div style="width:159px;padding:0px;">{{ formatarValor(trimestre) }}</div>
							</td>

						</tr>

						<tr>
							<td class="coluna legenda text-sm-left">

							</td>
							<td class="coluna ">

							</td>

							<td class="coluna " v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
								<div style="width:37px;padding:0px;">{{ formatarValor(arCampo.mensal[mes.intMes + 1]) }}</div>
							</td>

						</tr>
					</tbody>


					<tbody v-for="(arCampo, indexCampo) in obDados.arReceitas.acumulado.lucroReal.desc_inc_abatimentos" :key="'campo'+indexCampo">
						<tr>
							<td class="coluna legenda text-sm-left atividades">
								<div class="texto-segmento">(-) {{arCampo.dre}} {{getCnaeValidacao(arCampo.idcnae, arCampo.cod_atividade)}}</div>
								<div class="texto-segmento-hover">(-) {{arCampo.dre}} {{getCnaeValidacao(arCampo.idcnae, arCampo.cod_atividade)}}</div>
							</td>
							<td class="coluna ">
								<div style="width:42px;padding:0px;">{{ formatarValor(arCampo.anual) }}</div>
							</td>
							<td class="coluna " colspan="3" v-for="(trimestre, idx) in arCampo.trimestral" :key="'trimestre-receita'+idx">
								<div style="width:159px;padding:0px;">{{ formatarValor(trimestre) }}</div>
							</td>

						</tr>

						<tr>
							<td class="coluna legenda text-sm-left">

							</td>
							<td class="coluna ">

							</td>

							<td class="coluna " v-for="mes in arMeses" :key="'meses-receita'+mes.intMes">
								<div style="width:37px;padding:0px;">{{ formatarValor(arCampo.mensal[mes.intMes + 1]) }}</div>
							</td>

						</tr>
					</tbody>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.receitaLiquidaGeral">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.receitaLiquidaGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.receitaLiquidaGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'receitaLiquidaGeral')" :key="'lp_mensal_rec_liq_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.receitaLiquidaGeral">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'receitaLiquidaGeral', false)" :key="'lp_mensal_req_liq_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.receitaLiquidaGeral">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'receitaLiquidaGeral', true)" :key="'lp_mensal_rec_liq_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoProdutosFabricacaoPropriaVendidosGeral.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.custoProdutosFabricacaoPropriaVendidosGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.custoProdutosFabricacaoPropriaVendidosGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'custoProdutosFabricacaoPropriaVendidosGeral')" :key="'lp_mensal_fab_prop_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoProdutosFabricacaoPropriaVendidosGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoProdutosFabricacaoPropriaVendidosGeral', false)" :key="'lp_mensal_fab_prop_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoProdutosFabricacaoPropriaVendidosGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoProdutosFabricacaoPropriaVendidosGeral', true)" :key="'lp_mensal_fabri_prop_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoMercadoriaRevendidaGeral.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.custoMercadoriaRevendidaGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.custoMercadoriaRevendidaGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'custoMercadoriaRevendidaGeral')" :key="'lp_mensal_merc_rev_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoMercadoriaRevendidaGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoMercadoriaRevendidaGeral', false)" :key="'lp_mensal_merc_rev_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoMercadoriaRevendidaGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoMercadoriaRevendidaGeral', true)" :key="'lp_mensal_merc_rev_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoServicosPrestadosGeral.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.custoServicosPrestadosGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.custoServicosPrestadosGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'custoServicosPrestadosGeral')" :key="'lp_mensal_serv_prev_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoServicosPrestadosGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoServicosPrestadosGeral', false)" :key="'lp_mensal_serv_prev_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoServicosPrestadosGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoServicosPrestadosGeral', true)" :key="'lp_mensal_serv_prev_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoUnidadeImobVendidaGeral.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.custoUnidadeImobVendidaGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.custoUnidadeImobVendidaGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'custoUnidadeImobVendidaGeral')" :key="'lp_mensal_imob_vendida_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoUnidadeImobVendidaGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoUnidadeImobVendidaGeral', false)" :key="'lp_mensal_imob_vendida_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoUnidadeImobVendidaGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoUnidadeImobVendidaGeral', true)" :key="'lp_mensal_imob_vendida_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoRecContrucaoGeral.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.custoRecContrucaoGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.custoRecContrucaoGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'custoRecContrucaoGeral')" :key="'lp_mensal_rec_contrucao_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoRecContrucaoGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoRecContrucaoGeral', false)" :key="'lp_mensal_rec_contrucao_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoRecContrucaoGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoRecContrucaoGeral', true)" :key="'lp_mensal_rec_contrucao_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoVSELSGeral.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.custoVSELSGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.custoVSELSGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'custoVSELSGeral')" :key="'lp_mensal_vels_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoVSELSGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoVSELSGeral', false)" :key="'lp_mensal_rec_vels_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.custoVSELSGeral.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'custoVSELSGeral', true)" :key="'lp_mensal_rec_vels_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroBruto">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.lucroBruto.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.lucroBruto.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'lucroBruto')" :key="'lp_mensal_lucrobruto_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroBruto">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'lucroBruto', false)" :key="'lp_mensal_lucrobruto_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroBruto">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'lucroBruto', true)" :key="'lp_mensal_lucrobruto_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.despesasOperacionais">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.despesasOperacionais.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.despesasOperacionais.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'despesasOperacionais')" :key="'lp_mensal_despope_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroBruto">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'despesasOperacionais', false)" :key="'lp_mensal_despope_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.despesasOperacionais">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'despesasOperacionais', true)" :key="'lp_mensal_despope_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.resultadoOperacional">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.resultadoOperacional.dre}}
						</td>
						<td :class="['coluna pl-1 pr-1', obDados.arReceitas.acumulado.lucroReal.resultadoOperacional.anual < 0 ? 'negativo': '']">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.resultadoOperacional.anual) }}</td>
						<td :class="['coluna pl-1 pr-1', impostoMensal < 0 ? 'negativo': '']" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'resultadoOperacional')" :key="'lp_mensal_r_operacional_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.resultadoOperacional">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td :class="['coluna pl-1 pr-1', impostoMensal < 0 ? 'negativo': '']" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'resultadoOperacional', false)" :key="'lp_mensal_r_operacional_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.resultadoOperacional">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td :class="['coluna pl-1 pr-1', impostoMensal < 0 ? 'negativo': '']" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'resultadoOperacional', true)" :key="'lp_mensal_r_operacional_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.outrasReceitas">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.outrasReceitas.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.outrasReceitas.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'outrasReceitas')" :key="'lp_mensal_demais_rec_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.outrasReceitas">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'outrasReceitas', false)" :key="'lp_mensal_demais_rec_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.outrasReceitas">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'outrasReceitas', true)" :key="'lp_mensal_demais_rec_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.outrasDespesas">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.outrasDespesas.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.outrasDespesas.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'outrasDespesas')" :key="'lp_mensal_demais_desp_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.outrasDespesas">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'outrasDespesas', false)" :key="'lp_mensal_demais_desp_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.outrasDespesas">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'outrasDespesas', true)" :key="'lp_mensal_demais_desp_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroLiquido">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroReal.lucroLiquido.dre}}
						</td>
						<td :class="['coluna pl-1 pr-1', obDados.arReceitas.acumulado.lucroReal.lucroLiquido.anual < 0 ? 'negativo': '']">{{ formatarValor(obDados.arReceitas.acumulado.lucroReal.lucroLiquido.anual) }}</td>
						<td :class="['coluna pl-1 pr-1', impostoMensal < 0 ? 'negativo': '']" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroReal', 'lucroLiquido')" :key="'lp_mensal_lucro_liquido_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroLiquido">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td :class="['coluna pl-1 pr-1', impostoMensal < 0 ? 'negativo': '']" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'lucroLiquido', false)" :key="'lp_mensal_lucro_liquido_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroReal.lucroLiquido">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td :class="['coluna pl-1 pr-1', impostoMensal < 0 ? 'negativo': '']" v-for="(impostoMensal, index) in obterImpostoMensal('lucroReal', 'lucroLiquido', true)" :key="'lp_mensal_lucro_liquido_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<!--tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda pl-1 pr-1" v-for="(vlTotal, index) in calcularTotaisIReCS" :key="'lp_total_ircs'+index">{{ vlTotal }}</td>
					</tr-->
				</table>


			</div>

			<!-- Observações-->
			<div class="abaResultado aba_observacoes" v-if="intIndexAba === 1 || carrega_impressao">
				<div class="area-obs" v-if="arMensagens.length > 0">
					<table class="tabela mensagens" v-for="(ar_tipo_fator, tipo_fator) in arMensagens" :key="'msg-'+tipo_fator">
						<tr>
							<td class="coluna legenda text-sm-center" colspan="2" v-if="ar_tipo_fator">{{arDescTipoFator[tipo_fator]}}</td>
						</tr>
						<tr>
							<td>
								<table class="aba" v-for="(ar_aba, idx_aba) in ar_tipo_fator" :key="'msg-'+idx_aba">
									<tr class="linha">
										<td class="coluna texto text-sm-center aba" colspan="2" v-if="ar_aba">{{ar_aba.aba}}</td>
									</tr>
									<tr class="linha" v-if="ar_aba">
										<td>
											<table width="100%" class="observacoes" v-for="(mensagem, idx_msg) in ar_aba.mensagens" :key="'msg-'+idx_msg">
												<tr>
													<td class="coluna texto tipo text-sm-left" width="80%">{{mensagem.label}}</td>
													<td class="coluna texto tipo text-sm-right">{{mensagem.valor}}</td>
												</tr>
												<tr>
													<td colspan="2" class="coluna texto text-sm-left">
														<span v-for="(texto, idx_txt) in mensagem.ar_texto" :key="'txt-'+idx_txt" v-html="texto"></span>
													</td>
												</tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</div>
				<div v-else>
					<v-alert :value="true" class="info-cinza mt-4" color="grey lighten-3" icon="mdi-alert-circle">
						<span class="texto">Sem observações para este resultado.</span>
					</v-alert>
				</div>
			</div>

			<!-- Comparativo-->
			<div class="abaResultado simples_nacional" v-if="intIndexAba === 2 || carrega_impressao">
				<ComparativoAbas :arMeses="arMeses" :intUltimoMes="preResult.result_sn[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita" :preResult="preResult" :form="form" :intIndexCnae="intIndexCnae" :intIndexSegmento="intIndexSegmento"></ComparativoAbas>
			</div>

			<!-- Encargos Folha de Pagamento-->
			<div class="abaResultado aba_encargos" v-if="intIndexAba === 3 || carrega_impressao">
				<FolhaPgto :origem="'real'" :obDados="obDados" :idCnaeFuncionarios="form.idCnaeFuncionarios"></FolhaPgto>
			</div>

			<!-- Enquadramento-->
			<div class="abaResultado aba_enquadramento" v-if="intIndexAba === 4 || carrega_impressao">
				<div class="navigation-tabs">
					<div class="cnaes">
						<div v-for="(tipoEstimativa, indexMensTrimestral) in arMensalTrimestral" :key="'abaMT'+indexMensTrimestral" :class="['cnae', indexMensTrimestral == intIndexMenTrimestral ? 'active': '']" @click="setIndexAba(intIndexAba, indexMensTrimestral);">
							<div class="descricao">{{ tipoEstimativa }}</div>
						</div>
					</div>
				</div>
				<RegimesCnae :key="'regMT'+intIndexMenTrimestral" :repositorio="'lucroRealTrimestral'" :intIndexAba="intIndexAba" :arCnaes="obDados.arCnaes"></RegimesCnae>
			</div>

			<!-- Obrigações-->
			<div class="abaResultado aba_obrigacoes" v-if="intIndexAba === 5 || carrega_impressao">
				<RegimesCnae :repositorio="'pjGeral'" :intIndexAba="intIndexAba" :arCnaes="obDados.arCnaes"></RegimesCnae>
			</div>

			<!-- Constituição-->
			<div class="abaResultado aba_obrigacoes" v-if="intIndexAba === 6 || carrega_impressao">
				<RegimesCnae :repositorio="'constituicao'" :intIndexAba="intIndexAba" :arCnaes="obDados.arCnaes"></RegimesCnae>
			</div>

			<v-dialog v-model="obMemoria.blMostrar" scrollable content-class="dialog-lg">
				<Memoria v-if="(obDados)" :form="form" :arCnaes="obDados.arCnaes" :acumulado="obDados.arReceitas.acumulado" :obFiltro="obMemoria" :obDados="obDados" :idCnaeFuncionarios="form.idCnaeFuncionarios" @fechar="obMemoria.blMostrar = false"></Memoria>
			</v-dialog>

			<v-dialog v-model="blMostrarSeletorImpressao" scrollable>
				<SeletorImpressao :arMeses="arMeses" :arCnaes="preResult.result_sn" :arAbasResultado="arAbasResultado" :intUltimoMes="preResult.result_sn[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita" @fechar="blMostrarSeletorImpressao = false" @setConfigImpressao="setConfigImpressao"></SeletorImpressao>
			</v-dialog>
		</v-layout>
	</div>
</template>

<script src="./Real.js"></script>

<style lang="sass">
	@import "./Real.scss"
</style>