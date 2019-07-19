import Simulacoes from '../../../components/Simulacoes/Simulacoes.vue'
import DialogSimulacao from '../../../components/Dialogs/DialogSimulacao/DialogSimulacao.vue'

export default {
	name: "HomeLogado",
	props: ['form'],
	components: {
		Simulacoes,
		DialogSimulacao
	},
	data() {
		return {
			objParam: {},
			abrirDialogNome: {
				'intOpcao': 0,
				'strAcao': null
			},
			arRotas: ['parametros'],
			p_form: []
		}
	},
	watch: {},
	methods: {
		selecionarSimulacao(simulacao) {
			this.$emit('selecionarSimulacao', simulacao);
			localStorage.setItem('_simulacao', JSON.stringify(simulacao));

			this.$router.push({
				name: this.arRotas[0]
			});
		},
		copiarSimulacao(simulacao) {
			this.$emit('selecionarSimulacao', simulacao);

			this.abrirDialogNome = {
				'intOpcao': 0,
				'strAcao': 'Copiar'
			};
			this.p_form = this.form;

		},
		novaSimulacao() {
			this.abrirDialogNome = {
				'intOpcao': 0,
				'strAcao': 'Nova'
			};
			this.p_form = this.form;
		},
		iniciarForm() {
			this.$emit('iniciarForm');
		},
		set_options(objOptions) {
			this.$emit('set_options', objOptions);
		},
		salvar() {
			this.$emit('salvar');
		},
		importarECF() {
			//Object.noty.success('Funcionalidade em desenvolvimento!');
			//Object.noty.error('Ocorreu um erro ao acessar a API, entrar em contato com o desenvolvimento!');
			//Object.noty.info('Funcionalidade em desenvolvimento!');
			Object.noty.info('Funcionalidade em desenvolvimento!');
		}
	},
}