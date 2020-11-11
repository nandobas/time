import Unmask from "@/services/Unmask.js";
import Meses from "@/models/Meses.js";
import FolhaPgto from "../../FolhaPgto/FolhaPgto.vue";

export default {
	name: "memoria_lp",
	props: ["form", "arCnaes", "acumulado", "obFiltro", "obDados", "idCnaeFuncionarios"],
	components: {
		FolhaPgto
	},
	data() {
		return {
			arMeses: new Meses().arMeses,
			blEfeito: false,
			intIndexCnae: 0
		};
	},
	created() {},
	methods: {
		aplicarEfeito() {
			this.blEfeito = true;

			setTimeout(() => {
				this.blEfeito = false;
			}, 1000);
		},
		fechar() {
			this.$emit("fechar");
		},
		formatarValor(valor) {
			valor = parseFloat(valor).toFixed(2);

			return Number(valor)
				.toLocaleString("pt-BR", {
					minimumFractionDigits: 2,
					style: "currency",
					currency: "BRL"
				})
				.slice(3);
		}
	},
	computed: {
		montaMemoria() {
			let arLegenda = {
				lucroPresumido: "Lucro Presumido",
				irpj: "IRPJ",
				csll: "CSLL",
				pis_cofins: "PIS/COFINS",
				cpp: "CPP",
				icms: "ICMS",
				iss: "ISS",
				ipi: "IPI"
			};
			let arMemoria = [];

			Object.keys(
				this.acumulado
			).forEach(keyGrupo => {
				if (keyGrupo == this.$props.obFiltro.strGrupo) {
					let arReceitas = this.acumulado[keyGrupo];

					let obMemoria = {
						titulo: arLegenda[keyGrupo],
						arDetalhes: []
					};

					Object.keys(arReceitas).forEach(keyDetalhe => {
						let detalhe = arReceitas[keyDetalhe];

						if (detalhe.por_cnae) {
							Object.keys(
								this.$props.arCnaes
							).forEach(c => {
								c = this.$props.arCnaes[c];

								if (detalhe.idxName) {
									let dre = c.arReceitas.porCnae[keyGrupo][detalhe.idxName].dre + ' ' + c.obValidacao.texto_validacao;
									let anual = c.arReceitas.porCnae[keyGrupo][detalhe.idxName].anual;
									let trimestral = c.arReceitas.porCnae[keyGrupo][detalhe.idxName].trimestral;
									let mensal = c.arReceitas.porCnae[keyGrupo][detalhe.idxName].mensal;
									let acumulado = c.arReceitas.porCnae[keyGrupo][detalhe.idxName].acumulado;

									let newDetalhe = {
										'dre': dre,
										'anual': anual,
										'trimestral': trimestral,
										'mensal': mensal,
										'acumulado': acumulado,
										'por_cnae': true

									};
									obMemoria.arDetalhes.push(newDetalhe);
								}
							});

						} else {
							obMemoria.arDetalhes.push(detalhe);
						}
					});

					arMemoria.push(obMemoria);
				}
			});

			return arMemoria;
		}
	}
};