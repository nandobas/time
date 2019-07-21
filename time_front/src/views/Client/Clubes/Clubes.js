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
			maxPaginas: 5,
			pagination: {
				page: 1,
				paginas: 0,
				sortBy: 'updated_at',
				descending: true,
			},
			dialogRemover: false,
			timeoutPesquisa: true,
			clube: {
				int_cod: 0,
				str_nome: ''
			},
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
		selecionaClube(clube) {
			let objClube = JSON.parse(clube);
			objClube.int_cod = clube.id;
		},
		abrirDialogExcluir(clube) {
			this.clube = {
				int_cod: clube.int_cod,
				str_nome: clube.str_nome
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
		salvarClube() {

			this.blSalvandoClube = true;
			this.$root.$api.post('salvar_clube', this.form).then(

				(response) => {
					this.form.int_cod = response.retorno.int_cod;

					setTimeout(() => {
						this.blSalvandoClube = false;
					}, 1000);
				}
			);
		}

	}
}