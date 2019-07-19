import Api from '../../../services/api';

export default {
	props: ['abrir', 'simulacao'],
	components: {},
	data() {
		return {
			abrirModal: false,
			loading: false
		}
	},
	watch: {
		abrir: function() {
			this.abrirModal = this.$props.abrir;
		},
		abrirModal: function() {
			if (this.abrirModal == false)
				this.fechar();
		}
	},
	methods: {
		fechar() {
			this.$emit('fechar');
		},
		confirmar() {
			this.loading = true;
			this.$root.$api.post('RemoverSimulacao', {
				id: this.$props.simulacao.id
			}).then(
				(response) => {
					this.$emit('obterSimulacoes');
					this.loading = false;
					Object.noty.success('Simulação ['+ this.$props.simulacao.strNome +'] excluída!');
				}
			)
		}
	},
}