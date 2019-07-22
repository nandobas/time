import Api from "@/services/api.js"
import Header from '../../../components/Header/Header.vue';

export default {
	name: "Jogadores",
	components: {
		Header
	},
	data() {
		return {
			date: new Date().toISOString().substr(0, 10),
      		dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
	  		menu1: false,
	  
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
				dt_data_nascimento:'',
				str_posicao:'',
				str_pais:'',
			},
			arClubes:[{'key':1, 'name':'Parana'},{'key':2, 'name':'Sao Paulo'},{'key':3, 'name':'Santa Catarina'}],
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
	},
	computed: {
		
		computedDateFormatted () {
			return this.formatDate(this.date)
		  },

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
	watch: {
		date (val) {
		  this.dateFormatted = this.formatDate(this.date)
		}
	},
	methods: {
		formatDate (date) {
		  if (!date) return null
  
		  const [year, month, day] = date.split('-')
		  return `${day}/${month}/${year}`
		},
		parseDate (date) {
		  if (!date) return null
  
		  const [day, month, year] = date.split('/')
		  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
		},
		novoJogador(){
			this.jogador = {
				int_cod: 0,
				str_nome: '',
				str_escudo:'',
				str_mascote:'',
				str_categoria:''
			};

			this.dialogFormJogador = true;
		},
		selecionaJogador(p_jogador) {
			this.dialogFormJogador = true;
			this.jogador = p_jogador;
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

			var fJogador = new FormData();
			this.$root.$api.createFormData(fJogador, 'data', this.jogador);
			
			this.$root.$api.post('salvar_jogador', 
			fJogador
				).then(

				(response) => {
					this.jogador.int_cod = response.retorno.int_cod;

					setTimeout(() => {
						this.blSalvandoJogador = false;
						this.obterJogador();
					}, 1000);
				}
			);
		}

	}
}