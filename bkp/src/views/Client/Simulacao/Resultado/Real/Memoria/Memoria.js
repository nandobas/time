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
		}
	},
	computed: {
		montaMemoria() {
			let arLegenda = {
				lucroReal: "Lucro Real",
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
						obMemoria.arDetalhes.push(arReceitas[keyDetalhe]);
					});

					arMemoria.push(obMemoria);
				}
			});

			return arMemoria;
		}
	}
};