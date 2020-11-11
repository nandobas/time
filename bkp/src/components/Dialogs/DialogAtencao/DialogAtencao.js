export default {
	props: ['abrir', 'texto'],
	components: {

	},
	data() {
		return {
			abrirModal: false
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

	},
}