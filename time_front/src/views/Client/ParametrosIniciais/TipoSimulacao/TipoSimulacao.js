export default {
	props: ['form', 'arOpcoes'],
	components: {},
	data() {
		return {
			arEstados: []
		}
	},
	mounted() {
		this.obterEstados();
	},
	methods: {
		obterEstados() {
			this.$root.$api.get('ListarEstados').then(
				(response) => {
					this.arEstados = response.response;
				}
			)
		}
	},
}