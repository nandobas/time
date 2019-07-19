import DialogExcluir from '../../components/Dialogs/DialogExcluirSimulacao/DialogExcluirSimulacao.vue';

export default {
	name: "Simulacoes",
	props: ['form'],
	components: {
		DialogExcluir
	},
	data() {
		return {
			maxPaginas: 5,
			pagination: {
				page: 1,
				paginas: 0,
				sortBy: 'updated_at',
				descending: true,
			},
			dialogRemover: false,
			timeoutPesquisa: true,
			simulacao: {
				id: 0,
				strNome: ''
			},
			strFiltro: '',
			arSimulacoes: [],
		}
	},
	mounted() {
		this.obterSimulacoes();
	},
	computed: {
		filtered: function() {
			let tmpSimulacoes = [];

			if (this.strFiltro == '' || this.strFiltro == null) {
				tmpSimulacoes = this.arSimulacoes;
			} else {
				tmpSimulacoes = this.arSimulacoes.filter(e => {
					if (e.strNome.toLowerCase().indexOf(this.strFiltro.toLowerCase()) > -1) {
						return true;
					}
				});
			}

			this.pagination.paginas = Math.ceil(tmpSimulacoes.length / this.maxPaginas)

			let arSort = tmpSimulacoes.sort((a, b) => {
				const sortA = a['updated_at']
				const sortB = b['updated_at']

				if (this.pagination.descending) {
					if (sortA < sortB) return 1
					if (sortA > sortB) return -1
					return 0
				} else {
					if (sortA < sortB) return -1
					if (sortA > sortB) return 1
					return 0
				}
			})

			return arSort;
		},
	},
	methods: {
		selecionaSimulacao(simulacao) {
			let objSimulacao = JSON.parse(simulacao.jsonSimulacao);
			objSimulacao.id = simulacao.id;
			this.$emit('selecionarSimulacao', objSimulacao);
		},
		copiarSimulacao(simulacao) {
			let objSimulacao = JSON.parse(simulacao.jsonSimulacao);
			objSimulacao.id = 0;
			objSimulacao.strNome = '';
			this.$emit('copiarSimulacao', objSimulacao);
		},
		abrirDialogExcluir(simulacao) {
			this.simulacao = {
				id: simulacao.id,
				strNome: simulacao.strNome
			};
			this.dialogRemover = true;
		},
		fecharDialogExcluir() {
			this.dialogRemover = false;
		},
		obterSimulacoes() {
			this.dialogRemover = false;
			this.timeoutPesquisa = true;

			this.$root.$api.get('ListarSimulacoes').then(
				(response) => {
					this.timeoutPesquisa = false;
					if (response && response.status) {
						this.arSimulacoes = response.response;
					} else {
						this.arSimulacoes = [];
					}
					this.pagination.paginas = Math.round(this.arSimulacoes.length / this.maxPaginas);
					this.loading = false;
					this.dialogRemover = false;
				}
			)
		}
	},
}