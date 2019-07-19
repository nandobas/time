import Api from '../../../services/api'

export default {
	name: "ImportarECF",
	props: ['form'],
	components: {},
	data() {
		return {
			file: '',
			msgs: '',
			retornoArquivo: false,
			arquivoValido: false,
			blLoadingImportar: false,
			intPage: 1,
		}
	},
	watch: {},
	methods: {
		onClickImportar: function() {

			let formData = new FormData();
			var that = this;

			this.file = this.$refs.myFiles.files;
			formData.append('file', this.file[0]);

			if (this.file != '' && typeof this.file !== 'undefined' && this.file != null) {
				this.blLoadingImportar = true;
				this.$root.$api
					.file('ImportarECF', formData)
					.then(response => {
						if (typeof response.dados.mensagens !== 'undefined' && response.dados.mensagens !== null) {
							this.msgs = response.dados.mensagens;
						}
						//limpar campo arquivo
						that.$refs.fileinput.reset();
						//exibir nova popup com status de retorno
						if (response.dados.status == 1) {
							that.retornoArquivo = "<div class='alert alert-success'>" + response.dados.mensagem + "<div>";
						} else {
							that.retornoArquivo = "<div class='alert alert-danger'>" + response.dados.mensagem + "<div>";
						}

						that.blLoadingImportar = false;
					})
					.catch((response) => {
						that.blLoadingImportar = false;
					});
			} else {
				that.retornoArquivo = "<br><br><div class='alert alert-danger'>Selecione um arquivo!<div>";
			}
		},
	},
}