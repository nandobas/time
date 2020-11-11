export default {
	props: ['abrir'],
	data() {
		return {
			abrirModal: false,
			txtComentario: '',
			rules: {
				required: value => !!value || 'Escreva um comentário.',
				min: value => !!value && value.length >= 10 || 'O comentário deve ter mais de 10 caracteres'
			},
			blTentativa: false,
			btnLoadingEnvio: false,
		}
	},
	watch: {
		abrir: function() {
			this.$refs.textarea.reset();
			this.blTentativa = false;

			this.abrirModal = this.$props.abrir;

			setTimeout(() => {
				this.$refs.textarea.focus();
			}, 0);
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
		submit() {
			this.blTentativa = true;


			if (this.txtComentario && this.txtComentario.trim().length >= 10) {
				this.btnLoadingEnvio = true;
				this.$root.$api.post('EnviarFeedback', {
					tx_feedback: this.txtComentario.trim()
				}).then(
					(response) => {
						this.btnLoadingEnvio = false;
						if (!response.status) {
							Object.noty.error('Falha ao enviar Feedback!');
							return;
						}
						Object.noty.success('Feedback enviado com sucesso!');
						this.$emit('fechar');
					}
				)
			}
		}
	},
}