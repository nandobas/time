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
			dialogFormJogador: false,
			dialogRemover: false,
	  
			maxPaginas: 5,
			pagination: {
				page: 1,
				paginas: 0,
				sortBy: 'updated_at',
				descending: true,
			},
			timeoutPesquisa: true,
			jogador:{	
				int_cod: 0,
				int_cod_clube: 0,
				str_nome: '',
				int_idade:7,
				str_posicao:'',
				str_pais:'',
			},
			selected_clube:[],
			arClubes:[],
			arPosicoes:[
			'Goleiro',
			'Zagueiro',
			'Lateral direito',
			'Lateral esquerdo',
			'Líbero',
			'Volante',
			'Ala direito',
			'Ala esquerdo',
			'Meia-armador',
			'Médio Centro',
			'Meio-campo Lateral direito',
			'Meio-campo Lateral esquerdo',
			'Meia Ofensivo',
			'Atacante',
			'Segundo Atacante',
			'Centroavante'
			],
			strFiltro: '',
			arJogadores: [],
		}
	},
	mounted() {
		this.obterJogadores();
		this.obterClubes();
	},
	computed: {

		filtered: function() {
			let tmpJogadores = [];

			if (this.strFiltro == '' || this.strFiltro == null) {
				tmpJogadores = this.arJogadores;
			} else {
				tmpJogadores = this.arJogadores.filter(e => {
					if (e.str_nome.toLowerCase().indexOf(this.strFiltro.toLowerCase()) > -1) {
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
		novoJogador(){
			this.jogador = {
				int_cod: 0,
				int_cod_clube: 0,
				str_nome: '',
				int_idade:7,
				str_posicao:'',
				str_pais:''
			};
			selected_clube = [];
			this.dialogFormJogador = true;
		},
		selecionaJogador(p_jogador) {
			this.dialogFormJogador = true;
			this.jogador = p_jogador;

			let int_cod_clube = p_jogador.int_cod_clube;
			
			let objSelectedClube = [];
			this.arClubes.forEach(function(value, key) {
				console.log(int_cod_clube);
				console.log(value);
				if(int_cod_clube == value.int_cod)
				objSelectedClube = value;
			});
			this.selected_clube = objSelectedClube;
		},
		abrirDialogExcluir(p_jogador) {
			this.jogador = {
				int_cod: p_jogador.int_cod,
				str_jogador: p_jogador.str_nome
			};
			this.dialogRemover = true;
		},
		fecharDialogExcluir() {
			this.dialogRemover = false;
		},
		obterJogadores() {
			this.dialogRemover = false;
			this.timeoutPesquisa = true;
			this.$root.$api = new Api();
			this.$root.$api.get('jogadores').then(
				(response) => {
					this.timeoutPesquisa = false;
					if (response && response.status) {
						this.arJogadores = response.retorno;
					} else {
						this.arJogadores = [];
					}
					this.pagination.paginas = Math.round(this.arJogadores.length / this.maxPaginas);
					this.loading = false;
					this.dialogRemover = false;
				}
			)
		},
		confirmaExclusao(){

			this.blSalvandoJogador = true;

			var fJogador = new FormData();
			this.$root.$api.createFormData(fJogador, 'data', this.jogador);
			
			this.$root.$api.post('remover_jogador', 
			fClube
				).then(

				(response) => {
					setTimeout(() => {
						this.blSalvandoJogador = false;
						this.dialogRemover = false;
						this.obterJogadores();
					}, 1000);
				}
			);
		},
		salvarJogador() {

			this.blSalvandoJogador = true;
			this.jogador.int_cod_clube = this.selected_clube.int_cod;

			var fJogador = new FormData();
			this.$root.$api.createFormData(fJogador, 'data', this.jogador);

			this.$root.$api.post('salvar_jogador', 
			fJogador
				).then(

				(response) => {
					this.jogador.int_cod = response.retorno.int_cod;

					setTimeout(() => {
						this.blSalvandoJogador = false;
						this.obterJogadores();
					}, 1000);
				}
			);
		},
		obterClubes() {
			this.$root.$api = new Api();
			this.$root.$api.get('clubes').then(
				(response) => {
					if (response && response.status) {
						this.arClubes = response.retorno;
					} else {
						this.arClubes = [];
					}
				}
			)
		}

	}
}