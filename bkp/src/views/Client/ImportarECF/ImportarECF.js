import Api from '../../../services/api'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import {
	exists
} from 'fs';

export default {
	name: "ImportarECF",
	props: ['form'],
	components: {
		vueDropzone: vue2Dropzone
	},
	data() {
		return {
			file: '',
			msgs: '',
			retornoArquivo: false,
			arquivoValido: false,
			blLoadingImportar: false,
			intPage: 1,
			dropzoneOptions: {
				url: 'https://httpbin.org/post',
				thumbnailWidth: 150,
				maxFilesize: 1024,
				maxFiles: 1,
				acceptedFiles: '.txt',
				headers: {
					"My-Awesome-Header": "header value"
				},
				dictDefaultMessage: "<i aria-hidden='true' class='v-icon mdi mdi-file-upload theme--light mdi-36px'></i>Arraste seu arquivo ECF aqui ou <span class='pesquisar'>pesquise</span>",
				//dictInvalidFileType: "Você não sabe que não pode usar esse tipo de arquivo.",
				addedfile: function(file, Done) {
					if (file.name.indexOf(".txt") >= 0) {
						Done();
						//alert('ok!!');
					} else {
						let nome = file.name;
						// not okay !
						alert('Não!!');
						this.removeFile(file);
					}
				},
			}
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