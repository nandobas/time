import Header from "@/components/Header/Header.vue";
import Meses from "@/models/Meses";
import Unmask from "@/services/Unmask.js";

export default {
	name: "ComparativoAbas",
	props: [
		"form",
		"arMeses",
		"intUltimoMes",
		"intPage",
		"preResult"
	],
	components: {
		Header
	},
	data() {
		return {
			arCnaes: {
				sn: [],
				lp: [],
				lr: []
			},
			arTributos: ["irpj", "csll", "cofins", "pis", "cpp", "ipi"],
			arMensagens: [],
			intMes: 0,
			calculou: false,
			intIndexCnae: 0,
			intIndexSegmento: 0
		};
	},
	watch: {
		preResult: function() {
			if (
				this.$props.preResult.result_sn !== "" &&
				this.$props.preResult.result_real !== "" &&
				this.$props.preResult.result_lp !== ""
			) {
				this.calcular();
			}
		},
		intIndexCnae: function() {
			this.calcular();
		},
		intIndexSegmento: function() {
			this.calcular();
		}
	},
	mounted() {
		this.calcular();
	},
	methods: {
		calcular() {
			this.arCnaes["sn"] = this.$props.preResult.result_sn;
			this.arCnaes["sn"] = this.arCnaes["sn"][
				this.intIndexCnae
			].arValidacoes[this.intIndexSegmento];
			this.arCnaes["lp"] = this.$props.preResult.result_lp;
			this.arCnaes["lr"] = this.$props.preResult.result_real;

			this.calculou = true;
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
		verificarMostrarCampo(strCampo) {
			if (
				this.arCnaes["sn"][this.intIndexCnae].arValidacoes[
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
		getTotalAno(regime) {
			let unmask = new Unmask();
			let flTotal = 0;
			if (regime == "SN") {
				let receitas = this.arCnaes["sn"].arReceitas;
				//let receitas = this.filtrarReceitasSn();
				receitas.forEach(receita => {
					flTotal =
						flTotal +
						parseFloat(unmask.unmask(this.calcularTotal(receita)));
				});
			}
			if (regime == "LR") {
				let receitas = this.filtrarReceitasLr;
				receitas.forEach(receita => {
					flTotal = flTotal + parseFloat(unmask.unmask(receita));
				});
			}
			if (regime == "LP") {
				let receitas = this.filtrarReceitasLp;
				receitas.forEach(receita => {
					flTotal = flTotal + parseFloat(unmask.unmask(receita));
				});
			}
			return this.formatarValor(flTotal);
		},
		getTotalTrimestre(regime, trimestre) {
			let unmask = new Unmask();
			let flTotal = 0;
			let ini = 0;
			let fim = 2;

			if (trimestre == 2) {
				ini = 3;
				fim = 5;
			}
			if (trimestre == 3) {
				ini = 6;
				fim = 8;
			}
			if (trimestre == 4) {
				ini = 9;
				fim = 11;
			}

			if (regime == "SN") {
				let receitas = this.filtrarReceitasSn;
				receitas.forEach((receita, mes) => {
					if (mes >= ini && mes <= fim)
						flTotal =
						flTotal +
						parseFloat(
							unmask.unmask(this.calcularTotal(receita))
						);
				});
			}
			if (regime == "LR") {
				let receitas = this.filtrarReceitasLr;
				receitas.forEach((receita, mes) => {
					if (mes >= ini && mes <= fim)
						flTotal = flTotal + parseFloat(unmask.unmask(receita));
				});
			}
			if (regime == "LP") {
				let receitas = this.filtrarReceitasLp;
				receitas.forEach((receita, mes) => {
					if (mes >= ini && mes <= fim)
						flTotal = flTotal + parseFloat(unmask.unmask(receita));
				});
			}
			return this.formatarValor(flTotal);
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
				this.arCnaes["sn"][0].arValidacoes[0].ultimo_mes_receita + 1;

			let arMeses = [];

			for (let i = 0; i < intMeses; i++) {
				arMeses[i] = 0;
			}

			return arMeses;
		},
		changeMes(indexMes) {
			this.intMes = indexMes;
		},
		verificarMostrarTributo(strTributo) {
			if (
				this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional.dados
				.ate_mi &&
				!this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional
				.dados.ate_mi.linhaInfo[strTributo]
			)
				return false;

			if (
				this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional.dados
				.acima_mi &&
				!this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional
				.dados.acima_mi.linhaInfo[strTributo]
			)
				return false;

			if (
				this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional.dados
				.ate_me &&
				!this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional
				.dados.ate_me.linhaInfo[strTributo]
			)
				return false;

			return true;
		},
		somaTributosSN(strTributo) {
			const unmask = new Unmask();
			let valor = 0;

			if (this.verificarMostrarTributo(strTributo)) {
				valor = unmask.unmask(
					this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional
					.arr_linha_final[strTributo].vlr_tributo
				);

				return Number(valor)
					.toLocaleString("pt-BR", {
						minimumFractionDigits: 2,
						style: "currency",
						currency: "BRL"
					})
					.slice(3);
			}
		}
	},
	computed: {
		arMesesFiltrado() {
			return this.$props.arMeses.slice(0, this.$props.intUltimoMes + 1);
		},
		totalTributosSN() {
			let arTotal = [];
			if (
				this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional.dados
				.ate_mi &&
				this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional.dados
				.ate_me
			) {
				this.arTributos.forEach(strTributo => {
					let valor = this.somaTributosSN(strTributo);

					if (valor) {
						arTotal.push({
							valor: valor,
							tributo: strTributo
						});
					}
				});

				if (
					this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional
					.dados.ate_mi.linhaValor.icms
				) {
					arTotal.push({
						valor: this.somaTributosSN("icms"),
						tributo: "icms"
					});
				} else {
					arTotal.push({
						valor: '-',
						tributo: "icms"
					});
				}
				if (
					this.arCnaes["sn"].arReceitas[this.intMes].simplesNacional
					.dados.ate_mi.linhaValor.iss
				) {
					arTotal.push({
						valor: this.somaTributosSN("iss"),
						tributo: "iss"
					});
				} else {
					arTotal.push({
						valor: '-',
						tributo: "iss"
					});
				}
				arTotal.push({
					valor: this.somaTributosSN("total"),
					tributo: "total"
				});
				return arTotal;
			}

			return [];
		},

		totalTributosLP() {
			let arTotal = [];
			let mes = this.intMes + 1;
			let valorTotal = 0;

			let arCnaeValidacao = [];
			this.$props.preResult.result_sn.forEach((arcnae, idxcnae) => {
				arcnae.arValidacoes.forEach((arvalida, idxvalida) => {

					this.$props.preResult.result_lp.arCnaes.forEach((arTemp, idxtemp) => {
						if (arcnae.idcnae === arTemp.idcnae && arvalida.id === arTemp.obValidacao.id) {

							if (typeof arCnaeValidacao[idxcnae] == 'undefined')
								arCnaeValidacao[idxcnae] = [];
							arCnaeValidacao[idxcnae][idxvalida] = arTemp;
						}
					});
				});
			});
			let obReceita = arCnaeValidacao[this.intIndexCnae][this.intIndexSegmento].arReceitas.porCnae;

			let valor = 0;

			valor = obReceita.irpj.irpj.mensal[mes] ?
				parseFloat(obReceita.irpj.irpj.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "irpj"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.csll.csll.mensal[mes] ?
				parseFloat(obReceita.csll.csll.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "csll"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.indiretos.cofins.mensal[mes] ?
				parseFloat(obReceita.indiretos.cofins.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "cofins"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.indiretos.pis.mensal[mes] ?
				parseFloat(obReceita.indiretos.pis.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "pis"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.cpp.mensal.mensal[mes] ?
				parseFloat(obReceita.cpp.mensal.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "cpp"
			});
			valorTotal += valor;

			if (this.verificarMostrarTributo('ipi')) {

				valor = 0;
				valor = obReceita.indiretos.ipi.mensal[mes] ?
					parseFloat(obReceita.indiretos.ipi.mensal[mes]) :
					0;
				arTotal.push({
					valor: this.formatarValor(valor),
					tributo: "ipi"
				});
				valorTotal += valor;
			}

			valor = 0;
			valor = obReceita.indiretos.iss.mensal[mes] ?
				parseFloat(obReceita.indiretos.iss.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "iss"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.indiretos.icms.mensal[mes] ?
				parseFloat(obReceita.indiretos.icms.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "icms"
			});
			valorTotal += valor;

			arTotal.push({
				valor: this.formatarValor(valorTotal),
				tributo: "total"
			});
			return arTotal;
		},

		totalTributosLR() {
			let arTotal = [];
			let mes = this.intMes + 1;
			let valorTotal = 0;

			let arCnaeValidacao = [];
			this.$props.preResult.result_sn.forEach((arcnae, idxcnae) => {
				arcnae.arValidacoes.forEach((arvalida, idxvalida) => {

					this.$props.preResult.result_real.arCnaes.forEach((arTemp, idxtemp) => {
						if (arcnae.idcnae === arTemp.idcnae && arvalida.id === arTemp.obValidacao.id) {

							if (typeof arCnaeValidacao[idxcnae] == 'undefined')
								arCnaeValidacao[idxcnae] = [];
							arCnaeValidacao[idxcnae][idxvalida] = arTemp;
						}
					});
				});
			});
			let obReceita = arCnaeValidacao[this.intIndexCnae][this.intIndexSegmento].arReceitas.porCnae;

			let valor = 0;
			valor = obReceita.irpj.irpj.mensal[mes] ?
				parseFloat(obReceita.irpj.irpj.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "irpj"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.csll.csll.mensal[mes] ?
				parseFloat(obReceita.csll.csll.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "csll"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.indiretos.cofins.mensal[mes] ?
				parseFloat(obReceita.indiretos.cofins.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "cofins"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.indiretos.pis.mensal[mes] ?
				parseFloat(obReceita.indiretos.pis.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "pis"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.cpp.mensal.mensal[mes] ?
				parseFloat(obReceita.cpp.mensal.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "cpp"
			});
			valorTotal += valor;



			if (this.verificarMostrarTributo('ipi')) {

				valor = 0;
				valor = obReceita.indiretos.ipi.mensal[mes] ?
					parseFloat(obReceita.indiretos.ipi.mensal[mes]) :
					0;
				arTotal.push({
					valor: this.formatarValor(valor),
					tributo: "ipi"
				});
				valorTotal += valor;
			}

			valor = 0;
			valor = obReceita.indiretos.iss.mensal[mes] ?
				parseFloat(obReceita.indiretos.iss.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "iss"
			});
			valorTotal += valor;

			valor = 0;
			valor = obReceita.indiretos.icms.mensal[mes] ?
				parseFloat(obReceita.indiretos.icms.mensal[mes]) :
				0;
			arTotal.push({
				valor: this.formatarValor(valor),
				tributo: "icms"
			});
			valorTotal += valor;

			arTotal.push({
				valor: this.formatarValor(valorTotal),
				tributo: "total"
			});
			return arTotal;
		},
		filtrarReceitasSn() {
			return this.arCnaes["sn"][this.intIndexCnae].arValidacoes[
				this.intIndexSegmento
			].arReceitas;
		},
		filtrarReceitasLr() {
			let arTotal = [];

			for (let i = 1; i <= 12; i++) {
				let obReceita = this.arCnaes["lr"].arReceitas.acumulado;

				let vlrTotal = 0;
				vlrTotal += obReceita.irpj ?
					parseFloat(obReceita.irpj.irpjTotal.mensal[i]) :
					0;
				vlrTotal += obReceita.csll ?
					parseFloat(obReceita.csll.csll.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.pis ?
					parseFloat(obReceita.indiretos.pis.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.cofins ?
					parseFloat(obReceita.indiretos.cofinsTotal.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.ipi ?
					parseFloat(obReceita.indiretos.ipi.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.iss ?
					parseFloat(obReceita.indiretos.iss.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.icms ?
					parseFloat(obReceita.indiretos.icms.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.cpp ?
					parseFloat(obReceita.indiretos.cpp.mensal.mensal[i]) :
					0;
				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		},
		filtrarReceitasLp() {
			let arTotal = [];

			for (let i = 1; i <= 12; i++) {
				let obReceita = this.arCnaes["lp"].arReceitas.acumulado;

				let vlrTotal = 0;
				vlrTotal += obReceita.irpj ?
					parseFloat(obReceita.irpj.irpj.mensal[i]) :
					0;
				vlrTotal += obReceita.csll ?
					parseFloat(obReceita.csll.csll.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.pis ?
					parseFloat(obReceita.indiretos.pis.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.cofins ?
					parseFloat(obReceita.indiretos.cofins.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.ipi ?
					parseFloat(obReceita.indiretos.ipi.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.iss ?
					parseFloat(obReceita.indiretos.iss.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.icms ?
					parseFloat(obReceita.indiretos.icms.mensal[i]) :
					0;
				vlrTotal += obReceita.indiretos.cpp ?
					parseFloat(obReceita.indiretos.cpp.mensal[i]) :
					0;

				arTotal.push(this.formatarValor(vlrTotal));
			}

			return arTotal;
		}
	}
};