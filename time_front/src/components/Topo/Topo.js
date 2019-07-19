import DialogSimulacao from '../../components/Dialogs/DialogSimulacao/DialogSimulacao.vue'

export default {
	name: "Topo",
	props: ['blSalvandoSimulacao', 'form'],
	components: {
		DialogSimulacao
	},
	data() {
		return {
			strNome: '',
			abrirDialogNome: {
				'intOpcao': 0,
				'strAcao': null
			}
		}
	},
	mounted() {
		this.strNome = localStorage.getItem('nome_usuario');
	},
	methods: {
		novaSimulacao() {
			this.abrirDialogNome = {
				'intOpcao': 0,
				'strAcao': 'Salvar'
			};
		},
		iniciarForm() {
			this.$emit('iniciarForm');
		},
		setOptions(objOptions) {
			this.$emit('setOptions', objOptions);
		},
		salvar() {
			this.$emit('salvar');
		},
		logout() {
			localStorage.removeItem('token');
			localStorage.removeItem('nome_usuario');
			localStorage.removeItem('HASH_USER');

			this.$router.push({
				name: 'home'
			});
		}
	},
}