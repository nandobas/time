import Api from "@/services/api.js"
import Header from '../../../components/Header/Header.vue';

export default {
	name: "Jogadores",
	components: {
		Header
	},
	data() {
		return {
			strTitulo: 'Jogadores',
			blSalvandoJogador: false,			
			maxPaginas: 5,
			pagination: {
				page: 1,
				paginas: 0,
				sortBy: 'updated_at',
				descending: true,
			},
			dialogRemover: false,
			timeoutPesquisa: true,
			jogador: {
				id: 0,
				strNome: ''
			},
			strFiltro: '',
			arJogadores: [],
		}
	},
	mounted() {
		//this.obterJogadores();
	},
	computed: {
		filtered: function() {
			let tmpJogadores = [];

			if (this.strFiltro == '' || this.strFiltro == null) {
				tmpJogadores = this.arJogadores;
			} else {
				tmpJogadores = this.arJogadores.filter(e => {
					if (e.strNome.toLowerCase().indexOf(this.strFiltro.toLowerCase()) > -1) {
						return true;
					}
				});
			}

			this.pagination.paginas = Math.ceil(tmpJogadores.length / this.maxPaginas)

			let arSort = tmpJogadores.sort((a, b) => {
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
		selecionaJogador(jogador) {
			let objJogador = JSON.parse(jogador);
			objSimulacao.id = jogador.id;
		},
		abrirDialogExcluir(jogador) {
			this.jogador = {
				id: jogador.id,
				strNome: jogador.strNome
			};
			this.dialogRemover = true;
		},
		fecharDialogExcluir() {
			this.dialogRemover = false;
		},
		obterJogadores() {
			this.dialogRemover = false;
			this.timeoutPesquisa = true;

			this.$root.$api.get('jogadores').then(
				(response) => {
					this.timeoutPesquisa = false;
					if (response && response.status) {
						this.arJogadores = response.response;
					} else {
						this.arJogadores = [];
					}
					this.pagination.paginas = Math.round(this.arJogadores.length / this.maxPaginas);
					this.loading = false;
					this.dialogRemover = false;
				}
			)
		},
		salvarJogador() {

			this.blSalvandoJogador = true;
			this.$root.$api.post('salvar_jogador', this.form).then(

				(response) => {
					this.form.id = response.retorno.id;

					setTimeout(() => {
						this.blSalvandoJogador = false;
					}, 1000);
				}
			);
		}

	}
}