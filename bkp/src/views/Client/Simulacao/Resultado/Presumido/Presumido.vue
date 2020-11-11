<template>
	<div class="presumido">
		<Header titulo="Lucro Presumido"></Header>
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

			<div class="area-obs aba_resultado" v-if="intIndexAba === 0 || carrega_impressao">
				<table class="tabela mb-4">
					<tr class="linha">
						<td class="coluna legenda text-sm-left">&nbsp;</td>
						<td colspan="3" class="coluna legenda">PRIMEIRO TRIMESTRE</td>
						<td colspan="3" class="coluna legenda">SEGUNDO TRIMESTRE</td>
						<td colspan="3" class="coluna legenda">TERCEIRO TRIMESTRE</td>
						<td colspan="3" class="coluna legenda">QUARTO TRIMESTRE</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TRIBUTO</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj">
						<td class="coluna legenda text-sm-left" width="120px;">
							IRPJ
							<v-icon @click="mostrarMemoria('irpj', 'irpj')">mdi-information</v-icon>
						</td>
						<td class="coluna" colspan="3" v-for="(impostoTrimestre, index) in obterImpostoTrimestral('irpj', 'irpj')" :key="'lp_trimestral_irpj'+index">{{ formatarValor(impostoTrimestre) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll">
						<td class="coluna legenda text-sm-left">
							CSLL
							<v-icon @click="mostrarMemoria('csll', 'csll')">mdi-information</v-icon>
						</td>
						<td class="coluna" colspan="3" v-for="(impostoTrimestre, index) in obterImpostoTrimestral('csll', 'csll')" :key="'lp_trimestral_csll'+index">{{ formatarValor(impostoTrimestre) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda" colspan="3" v-for="(vlTotal, index) in calcularTotaisTrimestre" :key="'lp_total_tri'+index">{{ vlTotal }}</td>
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
							<v-icon @click="mostrarMemoria('pis_cofins', 'pis')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'pis', false)" :key="'lp_mensal_irpj'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.cofins">
						<td class="coluna legenda text-sm-left">
							COFINS
							<v-icon @click="mostrarMemoria('pis_cofins', 'cofins')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('pis_cofins', 'cofins', false)" :key="'lp_mensal_irpj'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TOTAL</td>
						<td class="coluna legenda" v-for="(vlTotal, index) in calcularTotaisPisCofins" :key="'piscofins_total'+index">{{ vlTotal }}</td>
					</tr>
				</table>
				<table class="tabela mb-4" v-if="obDados.arReceitas.acumulado.iss.iss.mostra || obDados.arReceitas.acumulado.icms.icms.mostra || obDados.arReceitas.acumulado.ipi.ipi.mostra">
					<tr class="linha">
						<td class="coluna legenda text-sm-left">TRIBUTO</td>
						<td class="coluna legenda" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.ipi.ipi.ativar">
						<td class="coluna legenda text-sm-left" style="min-width:120px;" width="120px;">
							IPI
							<v-icon @click="mostrarMemoria('ipi', 'ipi')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('ipi', 'ipi', false)" :key="'lp_mensal_irpj'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.iss.iss.mostra">
						<td class="coluna legenda text-sm-left" width="120px;">
							ISS
							<v-icon @click="mostrarMemoria('iss', 'iss')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('iss', 'iss', false)" :key="'lp_mensal_irpj'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.icms.icms.mostra">
						<td class="coluna legenda text-sm-left" width="120px;">
							ICMS
							<v-icon @click="mostrarMemoria('icms', 'icms')">mdi-information</v-icon>
						</td>
						<td class="coluna" v-for="(impostoMensal, index) in obterImpostoMensal('icms', 'icms', false)" :key="'lp_mensal_irpj'+index">{{ formatarValor(impostoMensal) }}</td>
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
						<td class="coluna  legenda text-sm-left" width="190px;">Descrição</td>
						<td class="coluna legenda" width="50px">Ano</td>
						<td class="coluna legenda" width="50px" v-for="mes in arMeses" :key="'lp_mes'+mes.intMes">{{ mes.strAbreviacao }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.receitaBruta">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroPresumido.receitaBruta.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroPresumido.receitaBruta.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroPresumido', 'receitaBruta')" :key="'lp_mensal_receita'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.receitaBruta">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'receitaBruta', false)" :key="'lp_mensal_receita'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.receitaBruta">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'receitaBruta', true)" :key="'lp_mensal_receita'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tbody v-for="(arCampo, indexCampo) in obDados.arReceitas.acumulado.lucroPresumido.receita_atividade" :key="'campo'+indexCampo">
						<tr>
							<td class="coluna legenda text-sm-left">
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

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.outrasReceitas">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroPresumido.outrasReceitas.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroPresumido.outrasReceitas.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroPresumido', 'outrasReceitas')" :key="'lp_mensal_demais_rec_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.outrasReceitas">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'outrasReceitas', false)" :key="'lp_mensal_demais_rec_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.outrasReceitas">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'outrasReceitas', true)" :key="'lp_mensal_demais_rec_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.deducoesBruta">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroPresumido.deducoesBruta.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroPresumido.deducoesBruta.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroPresumido', 'deducoesBruta', true)" :key="'lp_mensal_deducao_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.deducoesBruta">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'deducoesBruta', false)" :key="'lp_mensal_deducao_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.deducoesBruta">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'deducoesBruta', true)" :key="'lp_mensal_deducao_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<!--tr class="linha" v-if="obDados.arReceitas.acumulado.indiretos.ipi">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.indiretos.ipi.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.indiretos.ipi.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('indiretos', 'ipi')" :key="'lp_mensal_ipi_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.indiretos.ipi">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('indiretos', 'ipi', false)" :key="'lp_mensal_ipi_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.indiretos.ipi">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('indiretos', 'ipi', true)" :key="'lp_mensal_ipi_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr-->

					<!--tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.cancelamentosGeral">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroPresumido.cancelamentosGeral.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroPresumido.cancelamentosGeral.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroPresumido', 'cancelamentosGeral')" :key="'lp_mensal_canceladas_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.cancelamentosGeral">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'cancelamentosGeral', false)" :key="'lp_mensal_canceladas_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.cancelamentosGeral">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'cancelamentosGeral', true)" :key="'lp_mensal_canceladas_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr-->


					<tbody v-for="(arCampo, indexCampo) in obDados.arReceitas.acumulado.lucroPresumido.venda_canc_devolucoes" :key="'campo'+indexCampo">
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


					<tbody v-for="(arCampo, indexCampo) in obDados.arReceitas.acumulado.lucroPresumido.desc_inc_abatimentos" :key="'campo'+indexCampo">
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

					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.receitaLiquida">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.lucroPresumido.receitaLiquida.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.lucroPresumido.receitaLiquida.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('lucroPresumido', 'receitaLiquida')" :key="'lp_mensal_rec_liq_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.receitaLiquida">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'receitaLiquida', false)" :key="'lp_mensal_req_liq_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.lucroPresumido.receitaLiquida">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('lucroPresumido', 'receitaLiquida', true)" :key="'lp_mensal_rec_liq_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<!--
					<tr class="linha">
						<td class="coluna legenda text-sm-left">
							<b>IMPOSTO DE RENDA</b>
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>1º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>2º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>3º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>4º TRIMESTRE</b></td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.presuncaoIr">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.presuncaoIr.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.irpj.presuncaoIr.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('irpj', 'presuncaoIr')" :key="'lp_mensal_irpj_p_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.presuncaoIr">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'presuncaoIr', false)" :key="'lp_mensal_irpj_p_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.presuncaoIr">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'presuncaoIr', true)" :key="'lp_mensal_irpj_p_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.baseCalculoIrpj">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.baseCalculoIrpj.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.irpj.baseCalculoIrpj.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('irpj', 'baseCalculoIrpj')" :key="'lp_mensal_irpj_base_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.baseCalculoIrpj">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'baseCalculoIrpj', false)" :key="'lp_mensal_irpj_base_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.baseCalculoIrpj">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'baseCalculoIrpj', true)" :key="'lp_mensal_irpj_base_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.irpj">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.irpj.dre}} DEVIDO NO TRIMESTRE
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.irpj.irpj.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('irpj', 'irpj')" :key="'lp_mensal_irpj_irpj_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.irpj">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.irpj.dre}} DEVIDO NO MÊS ACUMULADO
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'irpj', true)" :key="'lp_mensal_irpj_irpj_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.irpjAdicional">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.irpjAdicional.dre}} DEVIDO NO TRIMESTRE
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.irpj.irpjAdicional.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('irpj', 'irpjAdicional')" :key="'lp_mensal_irpj_adicional_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.irpjAdicional">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.irpjAdicional.dre}} DEVIDO NO MÊS ACUMULADO
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'irpjAdicional', true)" :key="'lp_mensal_irpj_adicional_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.irpjTotal">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.irpjTotal.dre}} DEVIDO NO TRIMESTRE
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.irpj.irpjTotal.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('irpj', 'irpjAdicional')" :key="'lp_mensal_irpj_total_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.irpj.irpjTotal">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.irpj.irpjTotal.dre}} DEVIDO NO MÊS ACUMULADO
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('irpj', 'irpjTotal', true)" :key="'lp_mensal_irpj_total_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha">
						<td class="coluna legenda text-sm-left">
							<b>CONTRIBUIÇÃO SOCIAL</b>
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>1º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>2º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>3º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>4º TRIMESTRE</b></td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll.presuncaoCsll">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.csll.presuncaoCsll.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.csll.presuncaoCsll.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('csll', 'presuncaoCsll')" :key="'lp_mensal_presun_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll.presuncaoCsll">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('csll', 'presuncaoCsll', false)" :key="'lp_mensal_presun_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll.presuncaoCsll">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('csll', 'presuncaoCsll', true)" :key="'lp_mensal_presun_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll.csll">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.csll.csll.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.csll.csll.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('csll', 'csll')" :key="'lp_mensal_cslls_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll.csll">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('csll', 'csll', false)" :key="'lp_mensal_csll_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.csll.csll">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('csll', 'csll', true)" :key="'lp_mensal_csll_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>

					<tr class="linha">
						<td class="coluna legenda text-sm-left">
							<b>INDIRETOS</b>
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>1º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>2º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>3º TRIMESTRE</b></td>
						<td class="coluna pl-1 pr-1" colspan="3"><b>4º TRIMESTRE</b></td>
					</tr>

					<tr class="linha" v-if="obDados.arReceitas.acumulado.pis_cofins.pis.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.pis_cofins.pis.dre}}
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
							{{obDados.arReceitas.acumulado.pis_cofins.cofins.dre}}
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

					<tr class="linha" v-if="obDados.arReceitas.acumulado.iss.iss.mostra">
						<td class="coluna legenda text-sm-left">
							{{obDados.arReceitas.acumulado.iss.iss.dre}}
						</td>
						<td class="coluna pl-1 pr-1">{{ formatarValor(obDados.arReceitas.acumulado.iss.iss.anual) }}</td>
						<td class="coluna pl-1 pr-1" colspan="3" v-for="(impostoMensal, index) in obterImpostoTrimestral('iss', 'iss')" :key="'lp_mensal_iss_t'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.iss.iss.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('iss', 'iss', false)" :key="'lp_mensal_iss_m'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr>
					<tr class="linha" v-if="obDados.arReceitas.acumulado.iss.iss.mostra">
						<td class="coluna legenda text-sm-left">
						</td>
						<td class="coluna pl-1 pr-1"></td>
						<td class="coluna pl-1 pr-1" v-for="(impostoMensal, index) in obterImpostoMensal('iss', 'iss', true)" :key="'lp_mensal_iss_a'+index">{{ formatarValor(impostoMensal) }}</td>
					</tr-->
				</table>


			</div>

			<!-- Observações-->
			<div class="abaResultado aba_observacoes" v-if="intIndexAba === 1 || carrega_impressao">
				<div v-if="obDados.arNotas">
					<v-alert v-for="(mensagem, indexMensagem) in obDados.arNotas" :key="'mensagem-'+indexMensagem" type="warning" icon="mdi-information" class="mt-4" :value="true">


						<span v-html="mensagem"></span>
					</v-alert>
				</div>
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
						<span class="texto">Sem outras observações para este resultado.</span>
					</v-alert>
				</div>
			</div>

			<!-- Comparativo-->
			<div class="abaResultado simples_nacional" v-if="intIndexAba === 2 || carrega_impressao">
				<ComparativoAbas :arMeses="arMeses" :intUltimoMes="preResult.result_sn[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita" :preResult="preResult" :form="form" :intIndexCnae="intIndexCnae" :intIndexSegmento="intIndexSegmento"></ComparativoAbas>
			</div>

			<!-- Encargos Folha de Pagamento-->
			<div class="abaResultado aba_encargos" v-if="intIndexAba === 3 || carrega_impressao">
				<FolhaPgto :origem="'presumido'" :obDados="obDados" :idCnaeFuncionarios="form.idCnaeFuncionarios"></FolhaPgto>
			</div>

			<!-- Enquadramento-->
			<div class="abaResultado aba_enquadramento" v-if="intIndexAba === 4 || carrega_impressao">
				<RegimesCnae :repositorio="'lucroPresumido'" :intIndexAba="intIndexAba" :arCnaes="obDados.arCnaes"></RegimesCnae>
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

<script src="./Presumido.js"></script>

<style lang="sass">
	@import "./Presumido.scss"
</style>