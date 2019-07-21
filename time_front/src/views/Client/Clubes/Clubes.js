import Api from "@/services/api.js"
import Header from '../../../components/Header/Header.vue';

export default {
	name: "Clubes",
	components: {
		Header
	},
	data() {
		return {
			strTitulo: 'Clubes',
			blSalvandoClube: false,	
			dialogFormCLube: false,
			dialogRemover: false,
	  
			maxPaginas: 5,
			pagination: {
				page: 1,
				paginas: 0,
				sortBy: 'updated_at',
				descending: true,
			},
			timeoutPesquisa: true,
			form:{},
			clube: {
				int_cod: 0,
				str_nome: '',
				str_escudo:'',
				str_mascote:'',
				str_categoria:''
			},
			arCategorias:[
				'Sub-7','Sub-8','Sub-9','Sub-11','Sub-13','Sub-15','Sub-17',
				'Sub-20','Adulto','Veterano'
			],
			strFiltro: '',
			arClubes: [],
		}
	},
	mounted() {
		this.obterClubes();
	},
	computed: {
		filtered: function() {
			let tmpClubes = [];

			if (this.strFiltro == '' || this.strFiltro == null) {
				tmpClubes = this.arClubes;
			} else {
				tmpClubes = this.arClubes.filter(e => {
					if (e.str_nome.toLowerCase().indexOf(this.strFiltro.toLowerCase()) > -1) {
						return true;
					}
				});
			}

			this.pagination.paginas = Math.ceil(tmpClubes.length / this.maxPaginas)

			let arSort = tmpClubes.sort((a, b) => {
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
		novoClube(){
			this.clube = {
				int_cod: 0,
				str_nome: '',
				str_escudo:'',
				str_mascote:'',
				str_categoria:''
			};

			this.dialogFormCLube = true;
		},
		selecionaClube(p_clube) {
			this.dialogFormCLube = true;
			this.clube = p_clube;
		},
		abrirDialogExcluir(p_clube) {
			this.clube = {
				int_cod: p_clube.int_cod,
				str_nome: p_clube.str_nome
			};
			this.dialogRemover = true;
		},
		fecharDialogExcluir() {
			this.dialogRemover = false;
		},
		obterClubes() {
			this.dialogRemover = false;
			this.timeoutPesquisa = true;
			this.$root.$api = new Api();
			this.$root.$api.get('clubes').then(
				(response) => {
					this.timeoutPesquisa = false;
					if (response && response.status) {
						this.arClubes = response.retorno;
					} else {
						this.arClubes = [];
					}
					this.pagination.paginas = Math.round(this.arClubes.length / this.maxPaginas);
					this.loading = false;
					this.dialogRemover = false;
				}
			)
		},
		confirmaExclusao(){

			this.blSalvandoClube = true;

			var fClube = new FormData();
			this.$root.$api.createFormData(fClube, 'data', this.clube);
			
			this.$root.$api.post('remover_clube', 
			fClube
				).then(

				(response) => {
					setTimeout(() => {
						this.blSalvandoClube = false;
						this.dialogRemover = false;
						this.obterClubes();
					}, 1000);
				}
			);
		},
		salvarClube() {

			this.blSalvandoClube = true;

			var fClube = new FormData();
			this.$root.$api.createFormData(fClube, 'data', this.clube);
			
			this.$root.$api.post('salvar_clube', 
			fClube
				).then(

				(response) => {
					this.clube.int_cod = response.retorno.int_cod;

					setTimeout(() => {
						this.blSalvandoClube = false;
						this.obterClubes();
					}, 1000);
				}
			);
		}

	}
}