import Header from "@/components/Header/Header.vue";
import Meses from "@/models/Meses";
import Memoria from "./Memoria/Memoria.vue";
import Unmask from "@/services/Unmask.js";
import VueMd5 from "js-md5/src/md5.js";

import ComparativoAbas from "../ComparativoAbas/ComparativoAbas.vue";
import RegimesCnae from "../RegimesCnae/RegimesCnae.vue";
import SeletorImpressao from "../SeletorImpressao/SeletorImpressao.vue";

export default {
	name: "SimplesNacional",
	props: ["form", "intPage", "preResult"],
	components: {
		Header,
		Memoria,
		ComparativoAbas,
		RegimesCnae,
		SeletorImpressao
	},
	data() {
		return {
			arCnaes: null,
			arMensagens: [],
			alterou_anexo: false,
			arMeses: "",
			blMostrarMemoria: false,
			carrega_impressao: false,
			blMostrarSeletorImpressao: false,
			intIndexCnae: 0,
			intIndexSegmento: 0,
			intIndexAba: 0,
			requisicao_hash: "",
			repositorio: "",
			arAbasResultado: [
				"Resultado",
				"Observações",
				"Comparativo",
				"false",
				"Enquadramento",
				"Obrigações Acessórias",
				"Constituição"
			],

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
	mounted() {
		if (localStorage.getItem("sn_hash"))
			this.requisicao_hash = localStorage.getItem("sn_hash");

		this.obterMeses();
		this.calcular();

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
			(requisicao_hash_real !== requisicao_hash &&
				this.$props.preResult.result_real != "") ||
			this.$props.preResult.result_real == ""
		) {
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
					let obDados = response.retorno.original;
					this.$props.preResult.result_real = obDados;

					localStorage.setItem("real_hash", requisicao_hash);
					this.requisicao_hash = requisicao_hash;

					this.setPreResult({
						result_sn: this.$props.preResult.result_sn,
						result_real: obDados,
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
	methods: {
		setIndexAba(idxAba) {
			this.repositorio = "simplesNacionalTributacao";
			if (idxAba == 5) this.repositorio = "optanteSimplesNacional";
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
				this.arCnaes = this.$props.preResult.result_sn;
				this.agruparMensagens();
				return true;
			}

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
					this.requisicao_hash = requisicao_hash;

					this.arCnaes = response.retorno;
					this.$props.preResult.result_sn = this.arCnaes;
					this.$emit("setPreResult", {
						result_sn: this.arCnaes,
						result_real: this.$props.preResult.result_real,
						result_lp: this.$props.preResult.result_lp
					});
					this.agruparMensagens();
				});
		},
		formatarValor(valor) {
			if (!valor) return 0;

			valor = valor.toFixed(2);

			return Number(valor)
				.toLocaleString("pt-BR", {
					minimumFractionDigits: 2,
					style: "currency",
					currency: "BRL"
				})
				.slice(3);
		},
		agruparMensagens() {
			return new Promise(resolve => {
				if (this.intIndexCnae != 99) {
					let arMensagens = [];
					this.arCnaes[this.intIndexCnae].arValidacoes[
						this.intIndexSegmento
					].arReceitas.forEach((receita, index) => {
						//o fator R é pra aparecer antes do resultado
						//tirar o indice do anexo, trazer só o array de mensagens

						let fator_r = false;
						receita.simplesNacional.regras_mensagens.forEach(
							mensagem => {

								if (mensagem.fator_r) {
									fator_r = true;
									this.alterou_anexo = true;
								}


								let indexMensagem = arMensagens.findIndex(
									m => m.texto == mensagem.txt
								);
								let existe_receita = false;
								let anexo = this.arCnaes[this.intIndexCnae].arValidacoes[
									this.intIndexSegmento
								].anexo;

								if (
									receita.rec_mes_mi > 0 ||
									receita.rec_mes_me > 0
								) {
									existe_receita = true;

									if (fator_r) {
										if (anexo == 'III')
											anexo = 'V';
										else
											anexo = 'III';
									}
								}
								this.arMeses[
									index
								].existe_receita = existe_receita;

								this.arMeses[
									index
								].anexo = anexo;

								this.arMeses[
									index
								].fator_r = fator_r

								if (indexMensagem == -1) {
									let obMensagem = {
										arMeses: [index],
										texto: mensagem.txt
									};
									arMensagens.push(obMensagem);
								} else {
									arMensagens[indexMensagem].arMeses.push(
										index
									);
								}
							}
						);
					});

					this.arMensagens = arMensagens;
				}

				resolve(true);
			});
		},
		verificarMostrarCampo(strCampo) {
			if (
				this.arCnaes[this.intIndexCnae].arValidacoes[
					this.intIndexSegmento
				].arReceitas[0].simplesNacional.EXISTE_CAMPO[strCampo] != true
			) {
				return false;
			}

			return true;
		},
		obterValor(receita, strCampo) {
			strCampo = strCampo.toLowerCase();

			let valor = 0;
			let unmask = new Unmask();

			if (receita.simplesNacional.dados["ate_mi"]) {
				valor += unmask.unmask(
					receita.simplesNacional.dados["ate_mi"].linhaValor[strCampo]
					.vlr_tributo
				);
			}

			if (receita.simplesNacional.dados["ate_me"]) {
				valor += unmask.unmask(
					receita.simplesNacional.dados["ate_me"].linhaValor[strCampo]
					.vlr_tributo
				);
			}

			return this.formatarValor(valor);
		},
		calcularTotal(receita) {
			let arKeys = [];
			let unmask = new Unmask();

			if (receita.simplesNacional.dados.ate_mi) {
				arKeys = Object.keys(
					receita.simplesNacional.dados.ate_mi.linhaValor
				);
			} else if (receita.simplesNacional.dados.ate_me) {
				arKeys = Object.keys(
					receita.simplesNacional.dados.ate_me.linhaValor
				);
			} else if (receita.simplesNacional.dados.acima_mi) {
				arKeys = Object.keys(
					receita.simplesNacional.dados.acima_mi.linhaValor
				);
			} else if (receita.simplesNacional.dados.acima_me) {
				arKeys = Object.keys(
					receita.simplesNacional.dados.acima_me.linhaValor
				);
			}

			let total = 0;

			if (receita.simplesNacional.arr_linha_final) {
				return receita.simplesNacional.arr_linha_final["total"]
					.vlr_tributo;

				return this.formatarValor(total);
			}
			arKeys.forEach(key => {
				if (key != "total") {
					if (receita.simplesNacional.dados.ate_mi) {
						total += unmask.unmask(
							receita.simplesNacional.dados.ate_mi.linhaValor[key]
							.vlr_tributo
						);
					}
					if (receita.simplesNacional.dados.ate_me) {
						total += unmask.unmask(
							receita.simplesNacional.dados.ate_me.linhaValor[key]
							.vlr_tributo
						);
					}
					if (receita.simplesNacional.dados.acima_mi) {
						total += unmask.unmask(
							receita.simplesNacional.dados.acima_mi.linhaValor[
								key
							].vlr_tributo
						);
					}
					if (receita.simplesNacional.dados.acima_me) {
						total += unmask.unmask(
							receita.simplesNacional.dados.acima_me.linhaValor[
								key
							].vlr_tributo
						);
					}
				}
			});

			return this.formatarValor(total);
		},
		iniciarMesesTotal() {
			const intMeses =
				this.arCnaes[0].arValidacoes[0].ultimo_mes_receita + 1;

			let arMeses = [];

			for (let i = 0; i < intMeses; i++) {
				arMeses[i] = 0;
			}

			return arMeses;
		},
		iniciarVariaveisTotal() {
			return {
				IRPJ: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				CSLL: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				PIS: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				COFINS: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				IPI: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				ISS: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				ICMS: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				CPP: {
					blMostrar: false,
					arMeses: this.iniciarMesesTotal()
				},
				TOTAL: {
					blMostrar: true,
					arMeses: this.iniciarMesesTotal()
				}
			};
		},
		seletorImpressao() {
			this.arr_validacoes = [];
			if (this.arCnaes.length > 1) {
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
			if (this.configImpressao.abaMarcadas[4].bl_selecionado == 1) {
				this.$root.$api
					.getUrlCompleta(
						"https://www.econeteditora.com.br/ferramentas/regimes_cnae/subAbas.php?aba=" +
						"simplesNacionalTributacao" +
						"&idCnae=" +
						this.arCnaes[this.intIndexCnae].idcnae
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
									"optanteSimplesNacional" +
									"&idCnae=" +
									this.arCnaes[this.intIndexCnae].idcnae
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

			let texto_validacao = this.arCnaes[this.intIndexCnae].arValidacoes[
				this.intIndexSegmento
			].texto_validacao;
			let cnae = this.arCnaes[this.intIndexCnae].cnae;

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
					tipo: "sn",
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
	},
	computed: {
		alterou_anexo_agrupa() {
			console.log(this.alterou_anexo);
			this.agruparMensagens();
			return this.alterou_anexo;
		},
		filtrarReceitas() {
			return this.arCnaes[this.intIndexCnae].arValidacoes[
				this.intIndexSegmento
			].arReceitas.slice(
				0,
				this.arCnaes[this.intIndexCnae].arValidacoes[
					this.intIndexSegmento
				].ultimo_mes_receita + 1
			);
		},
		calcularTotalCnaes() {
			let blMostrarTotal = false;
			let obTributos = this.iniciarVariaveisTotal();

			if (this.arCnaes.length > 1) {
				this.blMostrarTotal = true;
			}

			this.arCnaes.forEach(cnae => {
				if (cnae.arValidacoes.length > 1) {
					blMostrarTotal = true;
				}

				cnae.arValidacoes.forEach(validacao => {
					validacao.arReceitas.forEach((receita, indexReceita) => {
						if (indexReceita <= validacao.ultimo_mes_receita) {
							Object.keys(
								receita.simplesNacional.EXISTE_CAMPO
							).forEach(key => {
								const strChaveValor =
									"vlr_" + key.toLowerCase();

								if (receita.simplesNacional.dados.ate_me) {
									obTributos[key].arMeses[indexReceita] +=
										receita.simplesNacional.dados.ate_me.total_geral[
											strChaveValor
										];
									obTributos[key].blMostrar = true;
								} else if (
									receita.simplesNacional.dados.ate_mi
								) {
									obTributos[key].arMeses[indexReceita] +=
										receita.simplesNacional.dados.ate_mi.total_geral[
											strChaveValor
										];
									obTributos[key].blMostrar = true;
								} else if (
									receita.simplesNacional.dados.acima_me
								) {
									obTributos[key].arMeses[indexReceita] +=
										receita.simplesNacional.dados.acima_me.total_geral[
											strChaveValor
										];
									obTributos[key].blMostrar = true;
								} else {
									obTributos[key].arMeses[indexReceita] +=
										receita.simplesNacional.dados.acima_mi.total_geral[
											strChaveValor
										];
									obTributos[key].blMostrar = true;
								}
							});
						}
					});
				});
			});

			if (!this.blMostrarTotal) {
				return null;
			}

			//return obTributos.map(tributo);

			return Object.keys(obTributos).map(keyTributo => {
				let tributo = obTributos[keyTributo];
				tributo.tributo = keyTributo;

				return tributo;
			});
		}
	}
};