<template>
	<div class="simples_nacional">
		<Header titulo="Simples Nacional"></Header>
		<div class="icone-area btn-imprimir" style="display:block;">
			<a class="link" @click="seletorImpressao">
				<span v-if="carrega_impressao">...aguarde</span>
				<span v-else>
					<v-icon>mdi-printer-settings</v-icon>
					<span>Imprimir</span>
				</span>
			</a>
		</div>
		<v-alert type="warning" class="mt-2" :value="true" v-if="false">
			<span>em desenvolvimento...</span>
		</v-alert>

		<v-layout row justify-center v-if="arCnaes == null" class="ma-5 pa-5">
			<v-progress-circular indeterminate :size="70" :width="5"></v-progress-circular>
		</v-layout>
		<v-layout v-else wrap>
			<div class="navigation-tabs">
				<div class="cnaes">
					<div v-for="(abaResultado, indexAbasResultado) in arAbasResultado" :key="'abaResult'+indexAbasResultado" :class="['cnae', indexAbasResultado == intIndexAba ? 'active': '']" :style="abaResultado==='false' ? 'display:none': ''" @click="setIndexAba(indexAbasResultado);">
						<div class="descricao">{{ abaResultado }}</div>
					</div>
				</div>
			</div>

			<div class="navigation-tabs" v-if="(intIndexAba != 2 && intIndexAba <= 3)">
				<div class="cnaes">
					<div v-for="(c, indexCnae) in arCnaes" :key="'abaCnae'+indexCnae" :class="['cnae', indexCnae == intIndexCnae ? 'active': '']" @click="intIndexCnae = indexCnae; intIndexSegmento = 0">
						<div class="codigo">{{ c.cnae }}</div>
						<div class="descricao">{{ c.descricao }}</div>
					</div>
					<div v-if="!arCnaes[intIndexCnae].impedimento" key="abaCnae_total" :class="['cnae total', 99 == intIndexCnae ? 'active': '']" @click="intIndexCnae = 99; intIndexSegmento = 0">
						<div v-if="calcularTotalCnaes" class="codigo">Total</div>
					</div>
				</div>

				<div class="segmentos" v-if="intIndexCnae != 99 && !arCnaes[intIndexCnae].impedimento">
					<div v-for="(validacao, indexValidacao) in arCnaes[intIndexCnae].arValidacoes" :key="'keyCnaeValidacao'+validacao.id" :class="['segmento', 'industria', intIndexSegmento == indexValidacao ? 'active' : '']" @click="intIndexSegmento = indexValidacao">
						<div class="icone-area">
							<v-icon>mdi-factory</v-icon>
						</div>
						<span class="texto">{{ validacao.texto_validacao }}</span>

						<div class="segmento segmento-hover">
							<div class="icone-area">
								<v-icon>mdi-factory</v-icon>
							</div>
							<span class="texto">{{ validacao.texto_validacao }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="abaResultado aba_resultado" v-if="intIndexAba === 0 || carrega_impressao">
				<div v-if="intIndexCnae != 99 && arCnaes[intIndexCnae].impedimento">
					<v-alert type="warning" icon="mdi-information" class="mt-4" :value="true">
						<span v-html="arCnaes[intIndexCnae].impedimento.texto"></span>
					</v-alert>
				</div>
				<div v-else-if="intIndexCnae != 99" class="area-tabela-sn tabela-resultado">
					<div class="anexo" v-if="alterou_anexo_agrupa">Anexo(s) em
						<template v-for="(mes, idxMes) in this.arMeses">
							<span :key="'a'+idxMes" v-if="((idxMes + 1) < arMeses.length) && mes.existe_receita">{{mes.strAbreviacao}} {{mes.anexo}}</span>
							<span :key="'b'+idxMes" v-if="((idxMes + 1) < arMeses.length) && arMeses[idxMes + 1].existe_receita">, </span>
							<span :key="'c'+idxMes" v-if="((idxMes + 1) == arMeses.length) && mes.existe_receita"> e {{mes.strAbreviacao}} {{mes.anexo}}</span>
						</template>
					</div>
					<div class="anexo" v-else>Anexo {{ arCnaes[intIndexCnae].arValidacoes[intIndexSegmento].anexo }}</div>

					<div class=" tabela-flex" :class="{'auto': arCnaes[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita < 6}">
						<div class="coluna tributo">
							<div @click="blMostrarMemoria = true" class="linha legenda">TRIBUTO</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('IRPJ')">
								IRPJ
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('CSLL')">
								CSLL
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('PIS')">
								PIS
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('COFINS')">
								COFINS
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('IPI')">
								IPI
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('ISS')">
								ISS
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('ICMS')">
								ICMS
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div class="linha legenda link" v-if="verificarMostrarCampo('CPP')">
								CPP
								<v-icon @click="blMostrarMemoria = true">mdi-information</v-icon>
							</div>
							<div @click="blMostrarMemoria = true" class="linha legenda">TOTAL</div>
						</div>
						<div class="coluna" v-for="(receita, indexReceita) in filtrarReceitas" :key="'sn-'+indexReceita">
							<div>
								<div class="linha legenda">{{ arMeses[indexReceita].strAbreviacao }}</div>
								<div class="linha" v-if="verificarMostrarCampo('IRPJ')">{{ obterValor(receita, "IRPJ")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('CSLL')">{{ obterValor(receita, "CSLL")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('PIS')">{{ obterValor(receita, "PIS")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('COFINS')">{{ obterValor(receita, "COFINS")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('IPI')">{{ obterValor(receita, "IPI")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('ISS')">{{ obterValor(receita, "ISS")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('ICMS')">{{ obterValor(receita, "ICMS")}}</div>
								<div class="linha" v-if="verificarMostrarCampo('CPP')">{{ obterValor(receita, "CPP")}}</div>
								<div class="linha total">{{ calcularTotal(receita) }}</div>
							</div>
						</div>
					</div>

					<v-alert v-for="(mensagem, indexMensagem) in arMensagens" :key="'mensagem-'+indexMensagem" type="warning" icon="mdi-information" class="mt-4" :value="true">
						<div class="meses">
							<template v-for="mes in mensagem.arMeses">
								<div class="mes" v-if="arMeses[mes].existe_receita" :key="'mesmensagem'+indexMensagem+'-'+mes">{{ arMeses[mes].strAbreviacao }}</div>
							</template>
						</div>

						<span v-html="mensagem.texto"></span>
					</v-alert>
				</div>
				<div v-else class="area-tabela tabela-resultado">
					<table class="tabela" :class="{'auto': calcularTotalCnaes[0].arMeses.length < 6}">
						<tr class="linha">
							<td class="coluna legenda">TRIBUTO</td>
							<td class="coluna legenda" v-for="(tributo, indexTributo) in calcularTotalCnaes[0].arMeses" :key="'sn_total_mes'+indexTributo">{{ arMeses[indexTributo].strAbreviacao }}</td>
						</tr>
						<tr class="linha" v-for="(tributo, indexTributo) in calcularTotalCnaes" :key="'sn_total_geral'+indexTributo">
							<td class="coluna legenda">{{ tributo.tributo }}</td>
							<td class="coluna" :class="{'legenda': tributo.tributo == 'TOTAL'}" v-for="(impostoMensal, indexMes) in tributo.arMeses" :key="'sn_total_geral_mes'+indexMes">{{ formatarValor(impostoMensal) }}</td>
						</tr>
					</table>
				</div>
			</div>

			<!-- Observações-->
			<div class="abaResultado aba_observacoes" v-if="intIndexAba === 1 || carrega_impressao">
				<div v-if="arMensagens.length > 0">
					<v-alert v-for="(mensagem, indexMensagem) in arMensagens" :key="'mensagem-'+indexMensagem" type="warning" icon="mdi-information" class="mt-4" :value="true">
						<div class="meses">
							<template v-for="mes in mensagem.arMeses">
								<div class="mes" v-if="arMeses[mes].existe_receita" :key="'mesmensagem'+indexMensagem+'-'+mes">{{ arMeses[mes].strAbreviacao }}</div>
							</template>
						</div>

						<span v-html="mensagem.texto"></span>
					</v-alert>
				</div>
				<div v-else>
					<v-alert :value="true" class="info-cinza mt-4" color="grey lighten-3" icon="mdi-alert-circle">
						<span class="texto">Sem observações para este resultado.</span>
					</v-alert>
				</div>
			</div>

			<!-- Comparativo-->
			<div class="abaResultado simples_nacional" v-if="intIndexAba === 2 || carrega_impressao">
				<ComparativoAbas :arMeses="arMeses" :intUltimoMes="arCnaes[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita" :preResult="preResult" :form="form" :intIndexCnae="intIndexCnae" :intIndexSegmento="intIndexSegmento"></ComparativoAbas>
			</div>

			<!-- Enquadramento-->
			<div class="abaResultado aba_enquadramento" v-if="intIndexAba === 4 || carrega_impressao">
				<RegimesCnae :repositorio="'simplesNacionalTributacao'" :intIndexAba="4" :arCnaes="arCnaes"></RegimesCnae>
			</div>

			<!-- Obrigações-->
			<div class="abaResultado aba_obrigacoes" v-if="intIndexAba === 5 || carrega_impressao">
				<RegimesCnae :repositorio="'optanteSimplesNacional'" :intIndexAba="5" :arCnaes="arCnaes"></RegimesCnae>
			</div>

			<!-- Constituição-->
			<div class="abaResultado aba_obrigacoes" v-if="intIndexAba === 6 || carrega_impressao">
				<RegimesCnae :repositorio="'constituicao'" :intIndexAba="6" :arCnaes="arCnaes"></RegimesCnae>
			</div>
		</v-layout>

		<v-dialog v-model="blMostrarMemoria" v-if="arCnaes != null && intIndexCnae != 99" scrollable>
			<Memoria :arMeses="arMeses" :arReceitas="arCnaes[intIndexCnae].arValidacoes[intIndexSegmento].arReceitas" :intUltimoMes="arCnaes[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita" @fechar="blMostrarMemoria = false"></Memoria>
		</v-dialog>

		<v-dialog v-model="blMostrarSeletorImpressao" scrollable>
			<SeletorImpressao v-if="arCnaes != null && intIndexCnae != 99" :arMeses="arMeses" :arCnaes="arCnaes" :arAbasResultado="arAbasResultado" :intUltimoMes="arCnaes[intIndexCnae].arValidacoes[intIndexSegmento].ultimo_mes_receita" @fechar="blMostrarSeletorImpressao = false" @setConfigImpressao="setConfigImpressao"></SeletorImpressao>
		</v-dialog>

		<div class="impressao" ref="impressao"></div>
	</div>
</template>

<script src="./SimplesNacional.js"></script>
<style lang="scss">
	@import "./SimplesNacional.scss";
</style>