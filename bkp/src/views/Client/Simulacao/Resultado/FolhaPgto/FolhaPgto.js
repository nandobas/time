import DialogAjuda from "../../../../../components/Dialogs/DialogAjuda/DialogAjuda.vue";

export default {
	props: ["obDados", "idCnaeFuncionarios", "origem"],
	components: {
		DialogAjuda
	},
	data() {
		return {
			vlrTotalAliquota: 0,
			vlrTotalCpp: 0,
			vlrTotalFolha: 0,
			vlrTotalFolha20: 0,
			dadosModal: {
				abrir: false,
				dados: ""
			},
			txtAjudaRAT: "CPP 205 + Terceiros do CNAE Principal + RAT do CNAE com maior npumero de funcionários, multiplicado pelo FAP informado pelo usuário ou atribuído pelo sistema.",
			txtAjudaFAP: "Artigo 10 da Lei n&deg; 10.666/2003 e Resolução CNPS n&deg; 1.316/2010."
		};
	},
	mounted() {
		this.vlrTotalAliquota = this.$props.obDados.arReceitas.acumulado.cpp.cppInfoGeral.total.aliquota;
		this.vlrTotalCpp = this.$props.obDados.arReceitas.acumulado.cpp.cpp.anual;
		this.vlrTotalFolha = this.$props.obDados.arReceitas.acumulado.cpp.cppInfoGeral.folhaCnae.geral.anual;
		this.vlrTotalFolha20 = this.$props.obDados.arReceitas.acumulado.cpp.cppInfoGeral.cpp20.anual;
	},
	computed: {

		cppCnaeMaiorFuncionarios() {

			let cpp = [];

			this.$props.obDados.arCnaes.forEach(c => {
				if (this.$props.idCnaeFuncionarios === c.idcnae) {
					cpp = c.arReceitas.porCnae.cpp;
				}
			});

			return cpp;

		},
		cnaesOrdemPrincipal() {
			let arOrdenado = [];
			this.$props.obDados.arCnaes.forEach(c => {
				let maior_func = 0;
				if (this.$props.idCnaeFuncionarios === c.idcnae) {
					maior_func = 1;
				}

				arOrdenado[c.idcnae] = {
					idcnae: c.idcnae,
					cnae: c.cnae,
					maior_func: maior_func,
					cpp: c.arReceitas.porCnae.cpp,
					folhaCnae: c.arReceitas.porCnae.cpp.folhaCnae[c.idcnae]
				};


			});


			if (set_maior_func === false) {
				for (let i = 0; i < arOrdenado.length; i++) {
					let c = arOrdenado[i];
					if (c) {
						arOrdenado[c.idcnae].maior_func = 1;
						break;
					}
				}
			}
			console.log(arOrdenado);
			/*
						arOrdenado.sort(function(x, y) {
							if (x.principal < y.principal) return 1;
							if (x.principal > y.principal) return -1;
							return 0;
						});*/
			return arOrdenado;
		}
	},
	methods: {
		formatarValor(valor, casas = 2) {
			valor = parseFloat(valor).toFixed(casas);

			return Number(valor)
				.toLocaleString("pt-BR", {
					minimumFractionDigits: casas,
					style: "currency",
					currency: "BRL"
				})
				.slice(3);
		},
		abrirDialogAjuda(p_titulo, p_txtAjuda) {
			this.dadosModal.dados = {
				titulo: p_titulo,
				texto: p_txtAjuda
			};
			this.dadosModal.abrir = true;
		},
		fecharDialog() {
			this.dadosModal.abrir = false;
		}
	}
};