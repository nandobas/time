<template>
	<div :class="['memoria_sn', blEfeito ? 'efeito' : '']">
		<v-card>
			<div class="navigation-tabs">
				<div class="meses">
					<div :class="['mes', intMes == indexMes ? 'active' : '']" v-for="(mes, indexMes) in arMesesFiltrado" :key="'mes-'+indexMes" @click="changeMes(indexMes)">{{ arMesesFiltrado.length > 6 ? mes.strAbreviacao : mes.strNome }}</div>
				</div>
			</div>
			<div class="explicacao mb-1 formula">
				<span class="text-center"><b>Anexo em {{arMesesFiltrado[intMes].strNome}}</b>: {{arMesesFiltrado[intMes].anexo}}</span>
			</div>

			<div class="explicacao mb-1 formula">
				<span class="text-center">O valor devido é calculado aplicando a alíquota efetiva sobre a receita mensal. A alíquota efetiva é determinada da seguinte forma:</span>

				<strong>(RBT12 x Aliq - PD) / RBT12</strong>
				<span class="legenda">
					RBT12:
					receita bruta acumulada nos doze meses anteriores ao período de apuração,
					Aliq:
					alíquota nominal constante dos Anexos I a V,
					PD: parcela a deduzir constante dos Anexos I a V
				</span>
			</div>

			<div class="explicacao mb-1">
				<span class="mb">
					Os percentuais de cada tributo devido serão calculados mediante a multiplicação da alíquota efetiva pelo percentual de repartição previsto também no anexo de enquadramento.
					<br />(
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp" target="_blank">Lei Complementar n° 123/2006</a>,
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp#art18" target="_blank">art. 18</a> e
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp#art18_p1" target="_blank">§§ 1°</a> a
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp#art18_p1b" target="_blank">1°-B</a>).
				</span>
			</div>
			<div class="explicacao mb-1">
				<span>
					Eventual diferença centesimal entre o total dos percentuais e a alíquota efetiva será transferida para o tributo com maior percentual de repartição na respectiva faixa de receita bruta.
					<br />(
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp" target="_blank">Lei Complementar n° 123/2006</a>,
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp#art18" target="_blank">art. 18</a>,
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp#art18_p1b" target="_blank">§1°-B</a>,
					<a href="http://www.econeteditora.com.br/bdi/lei/06/lei123_complementar_2006.asp#art18_p1b_ii" target="_blank">II</a>).
				</span>
			</div>

			<div class="area-tabela">
				<table class="faixa" v-for="(header, indexFaixa) in this.arrFaixas" :key="'header-'+indexFaixa">
					<thead v-if="(arrFaixas[indexFaixa])">
						<th v-html="header.FAIXA"></th>
					</thead>
					<tbody v-if="(arrFaixas[indexFaixa])">
						<tr>
							<td v-html="header.ALIQUOTA"></td>
						</tr>
						<tr>
							<td v-html="header.CALCULO"></td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="area-tabela mb-4">
				<table class="memoria">
					<thead>
						<th v-if="quebraColuna()"></th>
						<th>Faturamento</th>

						<th>Total</th>
						<th v-if="verificarMostrarTributo('irpj')">IRPJ</th>
						<th v-if="verificarMostrarTributo('csll')">CSLL</th>
						<th v-if="verificarMostrarTributo('cofins')">COFINS</th>
						<th v-if="verificarMostrarTributo('pis')">PIS/PASEP</th>
						<th v-if="verificarMostrarTributo('cpp')">CPP</th>
						<th v-if="verificarMostrarTributo('ipi')">IPI</th>
						<th v-if="verificarMostrarTributo('icms')">ICMS</th>
						<th v-if="verificarMostrarTributo('iss')">ISS</th>
					</thead>
					<tbody>
						<tr v-if="arReceitas[intMes].simplesNacional.dados.ate_mi">
							<td>
								<div v-if="quebraColuna()">
									<div class="quebra">
										<div style="height:30%;width:260px;"></div>
										<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.rotulo.info_rotulo.rotulo"></div>
									</div>
								</div>
								<div v-else>
									{{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.rotulo.info_rotulo.rotulo }}
									<br />
									<strong>{{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.rotulo.info_rotulo.valor }}</strong>
								</div>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.irpj.exibe_excedente">
								<div class="quebra">
									<div style="height:30px;"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.percent.perc.bkp_receita_ate_sub"></div>
									<div style="height:81px;"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.percent.perc.bkp_receita_acima_sub"></div>
								</div>
							</td>
							<td>
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.total"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.irpj">
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.irpj"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.csll">
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.csll"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.cofins">
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.cofins"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.pis">
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.pis"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.cpp">
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.cpp"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.ipi">
								<Padrao :tributo="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.ipi"></Padrao>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms">
								<span v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.aliq_tributo }}</span>
								<div v-else class="quebra">
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.legenda_01"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.parc_receita_ate_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.legenda_02"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.aliq_icms"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.calc_receita_ate_sub"></div>

									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.legenda_03"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.parc_receita_acima_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.legenda_04"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.aliq_exce"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.icms.vlr_efetiva_excedente"></div>
								</div>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss">
								<span v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.aliq_tributo }}</span>
								<div v-else class="quebra">
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.legenda_01"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.parc_receita_ate_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.legenda_02"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.aliq_efetiva_sub"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.calc_receita_ate_sub"></div>

									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.legenda_03"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.parc_receita_acima_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.legenda_04"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.aliq_exce"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.iss.vlr_efetiva_excedente"></div>
								</div>
							</td>
						</tr>
						<tr v-if="arReceitas[intMes].simplesNacional.dados.ate_mi" class="total">
							<td></td>
							<td v-if="quebraColuna()">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.soma_receita_dividida.valor }}</td>
							<td>R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.total.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.irpj">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.irpj.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.csll">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.csll.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.cofins">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.cofins.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.pis">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.pis.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.cpp">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.cpp.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaInfo.ipi">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.ipi.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.icms">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.icms.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.iss">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_mi.linhaValor.iss.vlr_tributo }}</td>
						</tr>

						<tr v-if="arReceitas[intMes].simplesNacional.dados.acima_mi">
							<td>
								{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.rotulo.info_rotulo.rotulo }}
								<br />
								<strong>{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.rotulo.info_rotulo.valor }}</strong>
							</td>

							<td v-if="quebraColuna()"></td>
							<td>{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.total.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.irpj">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.irpj.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.csll">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.csll.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.cofins">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.cofins.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.pis">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.pis.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.cpp">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.cpp.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.ipi">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.ipi.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms">
								<span v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.aliq_tributo }}</span>
								<div v-else class="quebra">
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.legenda_01"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.parc_receita_ate_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.legenda_02"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.aliq_icms"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.calc_receita_ate_sub"></div>

									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.legenda_03"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.parc_receita_acima_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.legenda_04"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.aliq_exce"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.icms.vlr_efetiva_excedente"></div>
								</div>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss">
								<span v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.aliq_tributo }}</span>
								<div v-else class="quebra">
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.legenda_01"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.parc_receita_ate_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.legenda_02"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.aliq_efetiva_sub"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.calc_receita_ate_sub"></div>

									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.legenda_03"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.parc_receita_acima_sub"></div>
									<div class="texto" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.legenda_04"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.aliq_exce"></div>
									<div class="valor" v-html="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.iss.vlr_efetiva_excedente"></div>
								</div>
							</td>
						</tr>
						<tr v-if="arReceitas[intMes].simplesNacional.dados.acima_mi" class="total">
							<td></td>
							<td v-if="quebraColuna()">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.soma_receita_dividida.valor }}</td>
							<td>R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.total.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.irpj">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.irpj.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.csll">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.csll.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.cofins">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.cofins.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.pis">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.pis.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.cpp">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.cpp.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaInfo.ipi">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.ipi.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.icms">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.icms.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.iss">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_mi.linhaValor.iss.vlr_tributo }}</td>
						</tr>

						<tr v-if="arReceitas[intMes].simplesNacional.dados.ate_me">
							<td>
								{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.rotulo.info_rotulo.rotulo }}
								<br />
								<strong>{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.rotulo.info_rotulo.valor }}</strong>
							</td>

							<td v-if="quebraColuna()"></td>
							<td>{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.total.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.irpj">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.irpj.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.csll">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.csll.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.cofins">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.cofins.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.pis">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.pis.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.cpp">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.cpp.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.ipi">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.ipi.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.icms">
								<span v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.icms.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.icms.aliq_tributo }}</span>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.iss">
								<span v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.iss.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.iss.aliq_tributo }}</span>
							</td>
						</tr>
						<tr v-if="arReceitas[intMes].simplesNacional.dados.ate_me" class="total">
							<td></td>
							<td v-if="quebraColuna()">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.soma_receita_dividida.valor }}</td>
							<td>R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.total.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.irpj">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.irpj.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.csll">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.csll.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.cofins">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.cofins.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.pis">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.pis.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.cpp">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.cpp.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaInfo.ipi">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.ipi.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.icms">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.icms.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.iss">R$ {{ arReceitas[intMes].simplesNacional.dados.ate_me.linhaValor.iss.vlr_tributo }}</td>
						</tr>

						<tr v-if="arReceitas[intMes].simplesNacional.dados.acima_me">
							<td>
								{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.rotulo.info_rotulo.rotulo }}
								<br />
								<strong>{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.rotulo.info_rotulo.valor }}</strong>
							</td>

							<td v-if="quebraColuna()"></td>
							<td>{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.total.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.irpj">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.irpj.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.csll">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.csll.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.cofins">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.cofins.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.pis">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.pis.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.cpp">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.cpp.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.ipi">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.ipi.aliq_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.icms">
								<span v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.icms.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.icms.aliq_tributo }}</span>
							</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.iss">
								<span v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.iss.aliq_tributo">{{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.iss.aliq_tributo }}</span>
							</td>
						</tr>
						<tr v-if="arReceitas[intMes].simplesNacional.dados.acima_me" class="total">
							<td></td>
							<td v-if="quebraColuna()">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.soma_receita_dividida.valor }}</td>
							<td>R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.total.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.irpj">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.irpj.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.csll">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.csll.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.cofins">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.cofins.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.pis">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.pis.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.cpp">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.cpp.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaInfo.ipi">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.ipi.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.icms">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.icms.vlr_tributo }}</td>
							<td v-if="arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.iss">R$ {{ arReceitas[intMes].simplesNacional.dados.acima_me.linhaValor.iss.vlr_tributo }}</td>
						</tr>
						<tr v-if="totalTributos.length > 0" class="total">
							<td></td>
							<td v-if="quebraColuna()">R$ {{ arReceitas[intMes].simplesNacional.arr_linha_final.soma_receita_dividida.valor }}</td>
							<td v-for="(tributo, indexTotal) in totalTributos" :key="'memoria_sn_total'+indexTotal">R$ {{ tributo }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="btn-area">
				<button class="btn" @click="fechar()">Fechar</button>
			</div>
		</v-card>
	</div>
</template>

<script src="./Memoria.js"></script>

<style lang="sass">
	@import "./Memoria.scss"
</style>