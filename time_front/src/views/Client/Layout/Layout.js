import Menu from '../../../components/Menu/Menu.vue'
import Topo from '../../../components/Topo/Topo.vue'
import Api from '../../../services/api'

export default {
	name: "Layout",
	components: {
		Menu,
		Topo
	},
	data() {
		return {
			form: null,
			blSalvandoSimulacao: false
		}
	},
	mounted() {
		if (localStorage.getItem('_simulacao')) {
			this.recuperarLocalStorage();
		} else {
			this.iniciarForm();
			this.$router.push({
				name: 'homeLogado'
			});
		}
	},
	methods: {
		iniciarForm() {
			this.form = {
				id: 0,
				blSalvar: false,
				strNome: '',
				tipoSimulacao: {
					intTipoSimulacao: null,
					intRegime: null,
					intPeriodo: null,
					estado: null,
				},
				cnaes: [],
				id_cnaes: [],
				cnaesIncidenciaIpiIss: [],
				blDesatualizado: false
			};
		},
		recuperarLocalStorage() {
			this.form = JSON.parse(localStorage.getItem('_simulacao'));
		},
		set_options(objOptions) {
			this.form.blSalvar = objOptions.blSalvar;
			this.form.strNome = objOptions.strNome;
			this.salvar();
		},
		salvar() {
			if (this.form.blSalvar) {
				this.blSalvandoSimulacao = true;
				this.$root.$api.post('SalvarSimulacao', this.form).then(
					(response) => {
						this.form.id = response.retorno.id;

						localStorage.setItem('_simulacao', JSON.stringify(this.form));

						setTimeout(() => {
							this.blSalvandoSimulacao = false;
						}, 1000);
					}
				)
			}
			return true;
		},
		selecionarSimulacao(simulacao) {
			this.form = simulacao;
		}
	},
}