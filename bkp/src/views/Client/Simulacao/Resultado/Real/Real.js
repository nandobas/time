import Header from "@/components/Header/Header.vue";
import Meses from "@/models/Meses";
import Memoria from "./Memoria/Memoria.vue";
import VueMd5 from "js-md5/src/md5.js";
import Unmask from "@/services/Unmask.js";

import ComparativoAbas from "../ComparativoAbas/ComparativoAbas.vue";
import RegimesCnae from "../RegimesCnae/RegimesCnae.vue";
import FolhaPgto from "../FolhaPgto/FolhaPgto.vue";
import SeletorImpressao from "../SeletorImpressao/SeletorImpressao.vue";

export default {
	name: "lucro-real",
	props: ["form", "intPage", "preResult"],
	components: {
		Header,
		Memoria,
		ComparativoAbas,
		RegimesCnae,
		FolhaPgto,
		SeletorImpressao
	},
	data() {
		return {
			obDados: null,
			arMeses: "",
			intIndexCnae: 0,
			intIndexSegmento: 0,
			intIndexAba: 0,
			intIndexMenTrimestral: 0,
			carrega_impressao: false,
			blMostrarSeletorImpressao: false,
			keyDialogMemoria: 1,
			requisicao_hash: "",
			repositorio: "",
			obMemoria: {
				blMostrar: false,
				strImposto: "",
				strGrupo: ""
			},
			arAbasResultado: [{
					"id": 0,
					"label": "Resultado",
					"ordem": 0
				},
				{
					"id": 1,
					"label": "Observações",
					"ordem": 2
				},
				{
					"id": 2,
					"label": "Comparativo",
					"ordem": 3
				},
				{
					"id": 3,
					"label": "Encargos Folha de Pagamento",
					"ordem": 4
				},
				{
					"id": 4,
					"label": "Enquadramento",
					"ordem": 5
				},
				{
					"id": 5,
					"label": "Obrigações Acessórias",
					"ordem": 6
				},
				{
					"id": 6,
					"label": "Constituição",
					"ordem": 7
				},
				{
					"id": 7,
					"label": "DRE",
					"ordem": 1
				},
			],
			arMensalTrimestral: [
				"Lucro real - Trimestral",
				"Lucro real - Mensal"
			],
			arMensagens: [],
			arDescTipoFator: {
				1: "ADIÇÕES AO LUCRO LÍQUIDO - Instrução Normativa RFB nº 1.700/2017 - Anexo I",
				0: "EXCLUSÕES DO LUCRO LÍQUIDO - Instrução Normativa RFB nº 1.700/2017 - Anexo II"
			},

			configImpressao: [],
			ar_cnaes: [],
			arr_validacoes: [],
			max_idx_cnaes: 0,
			max_validacao: false,
			max_cnaes: true,
			idx_cnae: 0,
			idx_validacao: 0
		};
	},
	watch: {
		intIndexCnae() {
			this.agruparMensagens();
		},
		intIndexSegmento() {
			this.agruparMensagens();
		}
	},
	async updated() {
		if (this.max_cnaes === false) {
			if (this.max_validacao) {
				this.arr_validacoes = [];
				this.idx_cnae++;

				setTimeout(async () => {
					this.ativaTrocaCnae(this.idx_cnae);
					await this.stepAba();
				}, 100);
			} else {
				this.idx_validacao++;
				await this.stepAba();
				setTimeout(async () => {
					this.ativaTrocaCnae(this.idx_cnae + 1);
					await this.stepAba();
				}, 100);
			}
		}
	},
	mounted() {
		if (localStorage.getItem("real_hash"))
			this.requisicao_hash = localStorage.getItem("real_hash");

		this.obterMeses();
		this.calcular();
		this.agruparMensagens();

		let requisicao_hash_sn = "";
		let requisicao_hash_real = "";
		let requisicao_hash_lp = "";

		this.$props.form.campos[0].arCnaes.forEach((arCnae, idxCnae) => {
			arCnae.arValidacoes.forEach((arValidacao, idxValidacao) => {
				let escop = this.lodash.cloneDeep(
					this.$props.form.escopo[arCnae.idcnae][idxValidacao][0].A
				);
				if (this.$props.form.escopo[arCnae.idcnae][idxValidacao][0].A) {
					this.aliquotas = escop;
				}
			});
		});

		let requisicao_hash = VueMd5(
			JSON.stringify({
				rbt12: this.$props.form.rbt12,
				abas: this.$props.form.campos,
				cnaes: this.$props.form.cnaes,
				tipoSimulacao: this.$props.form.tipoSimulacao,
				cnaesIncidenciaIpiIss: this.$props.form.cnaesIncidenciaIpiIss,
				idCnaeFuncionarios: this.$props.form.idCnaeFuncionarios,
				valorFap: this.$props.form.valorFap,
				aliquotas: this.aliquotas
			})
		);
		if (localStorage.getItem("sn_hash")) {
			requisicao_hash_sn = localStorage.getItem("sn_hash");
		}
		if (localStorage.getItem("real_hash")) {
			requisicao_hash_real = localStorage.getItem("real_hash");
		}
		if (localStorage.getItem("lp_hash")) {
			requisicao_hash_lp = localStorage.getItem("lp_hash");
		}

		if (
			(requisicao_hash_sn !== requisicao_hash &&
				this.$props.preResult.result_sn != "") ||
			this.$props.preResult.result_sn == ""
		) {
			this.$root.$api
				.post("calculo/simples_nacional", {
					rbt12: this.$props.form.rbt12,
					abas: this.otimizarDadosAba(),
					cnaes: this.$props.form.cnaes,
					tipoSimulacao: this.$props.form.tipoSimulacao,
					cnaesIncidenciaIpiIss: this.$props.form
						.cnaesIncidenciaIpiIss,
					idCnaeFuncionarios: this.$props.form.idCnaeFuncionarios,
					valorFap: this.$props.form.valorFap,
					aliquotas: this.aliquotas
				})
				.then(response => {
					localStorage.setItem("sn_hash", requisicao_hash);

					let arCnaes = response.retorno;
					this.$props.preResult.result_sn = arCnaes;
					this.setPreResult({
						result_sn: arCnaes,
						result_real: this.$props.preResult.result_real,
						result_lp: this.$props.preResult.result_lp
					});
				});
		}
		if (
			(requisicao_hash_lp !== requisicao_hash &&
				this.$props.preResult.result_lp != "") ||
			this.$props.preResult.result_lp == ""
		) {
			this.$root.$api
				.post("calculo/lucro_presumido", {
					rbt12: this.$props.form.rbt12,
					abas: this.otimizarDadosAba(),
					cnaes: this.$props.form.cnaes,
					tipoSimulacao: this.$props.form.tipoSimulacao,
					cnaesIncidenciaIpiIss: this.$props.form
						.cnaesIncidenciaIpiIss,
					idCnaeFuncionarios: this.$props.form.idCnaeFuncionarios,
					valorFap: this.$props.form.valorFap,
					aliquotas: this.aliquotas
				})
				.then(response => {
					let obDados = response.retorno.original;
					this.$props.preResult.result_lp = obDados;

					localStorage.setItem("lp_hash", requisicao_hash);
					this.requisicao_hash = requisicao_hash;

					this.setPreResult({
						result_sn: this.$props.preResult.result_sn,
						result_real: this.$props.preResult.result_real,
						result_lp: obDados
					});
				});
		}
		if (
			requisicao_hash_sn == requisicao_hash &&
			requisicao_hash_real == requisicao_hash &&
			requisicao_hash_lp == requisicao_hash
		) {
			this.obterMeses();
			this.calculou = true;
		}
	},
	computed: {
		arAbasResultadoByOrdem() {
			var byOrdem = this.arAbasResultado.slice(0);
			byOrdem.sort(function(a, b) {
				return a.ordem - b.ordem;
			});
			return byOrdem;
		},
		calcularTotaisIReCS() {
			let arTotal = [];

			let vlrTotal = 0;
			for (let i = 1; i <= 12; i++) {
				let obReceita = this.obDados.arReceitas.acumulado;

				vlrTotal += obReceita.irpj ?
					parseFloat(obReceita.irpj.irpjTotal.mensal[i]) :
					0;
				vlrTotal += obReceita.csll ?
					parseFloat(obReceita.csll.csllSaldo.mensal[i]) :
					0;

				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		},
		calcularTotaisPISCOFINS() {
			let arTotal = [];

			for (let i = 1; i <= 12; i++) {
				let vlrTotal = 0;
				let obReceita = this.obDados.arReceitas.acumulado;

				vlrTotal += obReceita.pis_cofins.pis ?
					parseFloat(obReceita.pis_cofins.pisTotal.mensal[i]) :
					0;
				vlrTotal += obReceita.pis_cofins.cofinsTotal ?
					parseFloat(obReceita.pis_cofins.cofinsTotal.mensal[i]) :
					0;

				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		},
		calcularTotaisCPP() {
			let arTotal = [];

			for (let i = 1; i <= 12; i++) {
				let obReceita = this.obDados.arReceitas.acumulado;

				let vlrTotal = 0;
				vlrTotal += obReceita.cpp.mensal.mensal ?
					parseFloat(obReceita.cpp.mensal.mensal[i]) :
					0;

				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		},
		calcularTotais() {
			let arTotal = [];

			for (let i = 1; i <= 12; i++) {
				let obReceita = this.obDados.arReceitas.acumulado;

				let vlrTotal = 0;
				vlrTotal += obReceita.ipi.ipi.ativar ?
					parseFloat(obReceita.ipi.ipi.mensal[i]) :
					0;
				vlrTotal += obReceita.iss.iss.ativar ?
					parseFloat(obReceita.ipi.iss.mensal[i]) :
					0;
				vlrTotal += obReceita.icms.icms.ativar ?
					parseFloat(obReceita.icms.icms.mensal[i]) :
					0;

				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		},
		calcularTotalCpp() {
			let arTotal = [];

			let obReceita = this.obDados.arReceitas.acumulado;
			for (let i = 1; i <= 12; i++) {

				let vlrTotal = 0;
				vlrTotal += obReceita.cpp ?
					parseFloat(obReceita.cpp.cpp.mensal[i]) :
					0;

				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		}
	},
	methods: {
		setIndexAba(idxAba, idxMenTrimestral = 0) {
			this.intIndexMenTrimestral = idxMenTrimestral; //somente para atualizar o index

			this.repositorio = "lucroRealTrimestral";
			if (idxMenTrimestral == 1) this.repositorio = "lucroRealEstimativa";

			if (idxAba == 5) this.repositorio = "pjGeral";
			this.intIndexAba = idxAba;
		},
		setPreResult(preResult) {
			this.$emit("setPreResult", preResult);
		},
		obterMeses() {
			let obMeses = new Meses();
			let intMesInicio =
				this.$props.form.tipoSimulacao.intTipoSimulacao == 1 ?
				this.$props.form.tipoSimulacao.intMesInicio :
				0;

			this.arMeses = obMeses.obterPorInicio(intMesInicio);
		},
		otimizarDadosAba() {
			let arAbas = [];
			this.$props.form.campos.forEach(arAba => {
				let arCnaes = [];

				arAba.arCnaes.forEach(arCnae => {
					let tmpValidacoes = this.lodash.cloneDeep(
						arCnae.arValidacoes
					);

					tmpValidacoes.forEach(arValidacao => {
						arValidacao.texto_validacao = null;
						arValidacao.arMeses.forEach(arMes => {
							arMes.arBlocos.forEach(Bloco => {
								Bloco.bloco = null;
								Bloco.arCampos.forEach(Campo => {
									Campo.labelCampo = null;
									Campo.nota_adicao_bc_presumido = null;
									Campo.nota_altera_valor = null;
									Campo.nota_ircs = null;
									Campo.nota_pis_cofins = null;
									Campo.txtAjuda = null;
									Campo.formula = null;
								});
							});
						});
					});
					arCnaes.push({
						arCodigoAtividade: arCnae.arCodigoAtividade,
						arValidacoes: tmpValidacoes,
						idcnae: arCnae.idcnae
					});
				});
				arAbas.push({
					id: arAba.id,
					arCnaes: arCnaes
				});
			});
			return arAbas;
		},
		calcular() {

			this.$props.form.campos[0].arCnaes.forEach((arCnae, idxCnae) => {
				arCnae.arValidacoes.forEach((arValidacao, idxValidacao) => {
					let escop = this.lodash.cloneDeep(
						this.$props.form.escopo[arCnae.idcnae][idxValidacao][0].A
					);
					if (this.$props.form.escopo[arCnae.idcnae][idxValidacao][0].A) {
						this.aliquotas = escop;
					}
				});
			});

			let requisicao_hash = VueMd5(
				JSON.stringify({
					rbt12: this.$props.form.rbt12,
					abas: this.$props.form.campos,
					cnaes: this.$props.form.cnaes,
					tipoSimulacao: this.$props.form.tipoSimulacao,
					cnaesIncidenciaIpiIss: this.$props.form
						.cnaesIncidenciaIpiIss,
					idCnaeFuncionarios: this.$props.form.idCnaeFuncionarios,
					valorFap: this.$props.form.valorFap,
					aliquotas: this.aliquotas
				})
			);

			if (this.requisicao_hash == requisicao_hash) {
				this.obDados = this.$props.preResult.result_real;
				return true;
			}

			let dados = this.lodash.cloneDeep(this.$props.form);
			dados.escopo = null;

			this.$root.$api
				.post("calculo/lucro_real", {
					rbt12: this.$props.form.rbt12,
					abas: this.otimizarDadosAba(),
					cnaes: this.$props.form.cnaes,
					tipoSimulacao: this.$props.form.tipoSimulacao,
					cnaesIncidenciaIpiIss: this.$props.form
						.cnaesIncidenciaIpiIss,
					idCnaeFuncionarios: this.$props.form.idCnaeFuncionarios,
					valorFap: this.$props.form.valorFap,
					aliquotas: this.aliquotas
				})
				.then(response => {
					this.obDados = response.retorno.original;
					this.$props.preResult.result_real = this.obDados;

					localStorage.setItem("real_hash", requisicao_hash);
					this.requisicao_hash = requisicao_hash;

					this.$emit("setPreResult", {
						result_sn: this.$props.preResult.result_sn,
						result_real: this.obDados,
						result_lp: this.$props.preResult.result_lp
					});
				});
		},
		obterImpostoMensal(strGrupo, strImposto, acumulado = true) {
			if (acumulado) {
				let array = this.obDados.arReceitas.acumulado[strGrupo][
					strImposto
				].acumulado;

				return Object.keys(array).map(mes => {
					return this.obDados.arReceitas.acumulado[strGrupo][
						strImposto
					].acumulado[mes];
				});
			} else {
				let array = this.obDados.arReceitas.acumulado[strGrupo][
					strImposto
				].mensal;

				return Object.keys(array).map(mes => {
					return this.obDados.arReceitas.acumulado[strGrupo][
						strImposto
					].mensal[mes];
				});
			}
		},
		obterImpostoTrimestral(strGrupo, strImposto) {
			let array = this.obDados.arReceitas.acumulado[strGrupo][
				strImposto
			].trimestral;

			return Object.keys(array).map(periodo => {
				return this.obDados.arReceitas.acumulado[strGrupo][
					strImposto
				].trimestral[periodo];
			});
		},
		formatarValor(valor) {
			valor = parseFloat(valor).toFixed(2);
			let negativo = '';
			if (valor < 0)
				negativo = '-';
			return negativo + Number(valor)
				.toLocaleString("pt-BR", {
					minimumFractionDigits: 2,
					style: "currency",
					currency: "BRL"
				})
				.slice(3);
		},
		mostrarMemoria(strGrupo, strImposto) {
			this.obMemoria.strImposto = strImposto;
			this.obMemoria.strGrupo = strGrupo;
			this.keyDialogMemoria++;

			this.obMemoria.blMostrar = true;
		},
		getCnaeValidacao(p_idcnae, p_idvalidacao) {
			let retorno = '';

			this.obDados.arCnaes.forEach((arCnae, idxCnae) => {

				if (parseInt(arCnae.idcnae) === p_idcnae && parseInt(arCnae.obValidacao.id) === p_idvalidacao) {

					if (retorno == '')
						retorno = arCnae;
				}
			});
			return retorno.obValidacao.texto_validacao;
		},
		agruparMensagens() {
			let unmask = new Unmask();
			let arMensagens = [];
			let tipo_fator = null;
			this.$props.form.campos.forEach((arAbas, idxAba) => {
				arAbas.arCnaes.forEach((arCnaes, idxCnae) => {
					arCnaes.arValidacoes.forEach(
						(arValidacoes, idxValidacao) => {
							arValidacoes.arMeses[0].arBlocos.forEach(
								(arBlocos, idxBloco) => {
									arBlocos.arCampos.forEach(
										(Campo, idxCampo) => {
											let valor = 0;
											let obMensagem = [];
											let arMsg = [];

											arValidacoes.arMeses.forEach(
												(mes, idxMes) => {
													let Campo =
														arValidacoes.arMeses[
															idxMes
														].arBlocos[idxBloco]
														.arCampos[idxCampo];
													if (
														(Campo.nota_ircs ||
															Campo.nota_pis_cofins) &&
														(Campo.valor !=
															"R$ 0,00" &&
															Campo.valor != "0")
													) {
														if (Campo.nota_ircs)
															arMsg[
																Campo.nota_ircs.id
															] =
															"<p> " +
															Campo.nota_ircs
															.nota +
															"</p>";

														if (
															Campo.nota_pis_cofins
														)
															arMsg[
																Campo.nota_pis_cofins.id
															] =
															"<p> " +
															Campo
															.nota_pis_cofins
															.nota +
															"</p>";

														valor += unmask.unmask(
															Campo.valor
														);
														obMensagem[idxCampo] = {
															ar_texto: arMsg,
															label: Campo.labelCampo,
															valor: "R$ " +
																this.formatarValor(
																	valor
																)
														};
													}
												}
											);

											if (valor > 0) {
												tipo_fator = 1;
												if (Campo.blExclusaoIRCS == 1)
													tipo_fator = 0;
												if (Campo.blAdicaoIRCS == 1)
													tipo_fator = 1;

												if (
													typeof arMensagens[
														tipo_fator
													] == "undefined"
												)
													arMensagens[
														tipo_fator
													] = [];

												if (
													typeof arMensagens[
														tipo_fator
													][arAbas.id] == "undefined"
												) {
													arMensagens[tipo_fator][
														arAbas.id
													] = [];
													arMensagens[tipo_fator][
														arAbas.id
													].mensagens = [];
													arMensagens[tipo_fator][
														arAbas.id
													].aba = arAbas.aba;
												}
												arMensagens[tipo_fator][
													arAbas.id
												].mensagens.push(
													obMensagem[idxCampo]
												);
											}
										}
									);
								}
							);
						}
					);
				});
			});
			this.arMensagens = arMensagens;
		},
		seletorImpressao() {
			this.arr_validacoes = [];
			if (this.obDados.arCnaes.length > 1) {
				setTimeout(() => {
					setTimeout(() => {
						this.idx_cnae = 0;
						this.idx_validacao = 0;
						this.intIndexCnae = 0;
						this.intIndexSegmento = 0;
						this.blMostrarSeletorImpressao = true;
					}, 2000);
					this.idx_cnae = 1;
					this.intIndexCnae = 1;
				}, 1000);
			} else {
				this.blMostrarSeletorImpressao = true;
			}
		},
		async stepAba() {
			this.max_validacao = false;

			if (
				this.arr_validacoes.length >=
				this.configImpressao.vlMarcadas[this.intIndexCnae].arValidacoes
				.length
			) {
				this.max_validacao = true;

				this.idx_validacao = 0;
				this.arValidacoes = [];

				this.idx_cnae++;
				return true;
			}

			let arr_resultado = [];
			let tmpSegmento = this.configImpressao.vlMarcadas[this.intIndexCnae]
				.arValidacoes[this.intIndexSegmento];

			if (this.configImpressao.abaMarcadas[0].bl_selecionado == 1) {
				let Area = "aba_resultado";
				arr_resultado.push({
					aba: "resultado",
					html: document.getElementsByClassName(Area)[0].innerHTML
				});
			}

			if (this.configImpressao.abaMarcadas[1].bl_selecionado == 1) {
				let Area = "aba_observacoes";
				arr_resultado.push({
					aba: "observações",
					html: document.getElementsByClassName(Area)[0].innerHTML
				});
			}

			if (this.configImpressao.abaMarcadas[2].bl_selecionado == 1) {
				let Area = "aba_comparativo";
				arr_resultado.push({
					aba: "comparativo",
					html: document.getElementsByClassName(Area)[0].innerHTML
				});
			}

			if (this.configImpressao.abaMarcadas[3].bl_selecionado == 1) {
				let Area = "aba_encargos";
				arr_resultado.push({
					aba: "encargos",
					html: document.getElementsByClassName(Area)[0].innerHTML
				});
			}
			if (this.configImpressao.abaMarcadas[4].bl_selecionado == 1) {
				this.$root.$api
					.getUrlCompleta(
						"https://www.econeteditora.com.br/ferramentas/regimes_cnae/subAbas.php?aba=" +
						"lucroRealTrimestral" +
						"&idCnae=" +
						this.$props.preResult.result_sn[this.intIndexCnae]
						.idcnae
					)
					.then(response => {
						if (response) {
							arr_resultado.push({
								aba: "enquadramento",
								html: response
							});
						}

						if (
							this.configImpressao.abaMarcadas[5]
							.bl_selecionado == 1
						) {
							this.$root.$api
								.getUrlCompleta(
									"https://www.econeteditora.com.br/ferramentas/regimes_cnae/subAbas.php?aba=" +
									"pjGeral" +
									"&idCnae=" +
									this.$props.preResult.result_sn[
										this.intIndexCnae
									].idcnae
								)
								.then(response => {
									if (response) {
										arr_resultado.push({
											aba: "obrigações",
											html: response
										});
									}
								});
						}
					});
			}

			let texto_validacao = this.$props.preResult.result_sn[
				this.intIndexCnae
			].arValidacoes[this.intIndexSegmento].texto_validacao;
			let cnae = this.$props.preResult.result_sn[this.intIndexCnae].cnae;

			if (tmpSegmento.bl_selecionado !== 1) arr_resultado = [];

			this.arr_validacoes.push({
				bl_selecionado: tmpSegmento.bl_selecionado,
				nome: texto_validacao,
				ar_resultado: arr_resultado
			});
			if (this.ar_cnaes.length < this.max_idx_cnaes)
				this.ar_cnaes.push({
					cnae: cnae,
					arr_validacoes: this.arr_validacoes
				});
			return true;
		},
		ativaTrocaCnae(p_idx) {
			if (this.ar_cnaes.length >= this.max_idx_cnaes) {
				this.max_cnaes = true;

				this.carrega_impressao = false;
				this.blMostrarSeletorImpressao = false;
				this.$emit("registraResultado", {
					tipo: "real",
					html: this.ar_cnaes
				});

				return false;
			}

			setTimeout(() => {
				if (this.ar_cnaes.length < this.max_idx_cnaes) {
					this.intIndexCnae = p_idx;
				}
				if (this.max_validacao === false) {
					this.intIndexSegmento++;
				}
			}, 200);
		},
		setConfigImpressao(p_configImpressao) {
			this.max_cnaes = false;
			this.max_idx_cnaes = p_configImpressao.vlMarcadas.length;

			setTimeout(() => {
				this.carrega_impressao = true;
			}, 100);
			this.configImpressao = p_configImpressao;
		}
	}
};