export default {
	props: ['abrir', 'form'],
	data() {
		return {
			dialogNome: false,
			strNome: '',
			strAcao: '',
			blValidarNome: false,
			rules: {
				required: value => !!value || 'Informe um nome.'
			},
			arRotas: ['parametros'],
		}
	},
	watch: {
		abrir: function() {
			let intOpcao = this.$props.abrir.intOpcao;
			let strAcao = this.$props.abrir.strAcao;
			this.abrirDialogNome(intOpcao, strAcao);
		}
	},
	methods: {
		abrirDialogNome(intOpcao, strAcao = 'Nova') {

			this.$refs.inputNome.reset();
			this.dialogNome = true;
			this.intRota = intOpcao;
			this.strAcao = strAcao;

			setTimeout(() => {
				this.$refs.inputNome.focus();
			}, 0);
		},

		fecharDialogNome(blValidarNome = true, origem = 'Nova') {
			this.blValidarNome = blValidarNome;
			this.$props.form.blSalvar = blValidarNome;

			if (!blValidarNome)
				this.strNome = '';

			let validateNomePreenchido = (this.strNome && this.strNome.trim().length > 0);

			let objOptions = {
				blSalvar: blValidarNome,
				strNome: this.strNome,
			}

			if (!validateNomePreenchido && origem === 'Salvar') {
				let objOptions = {
					blSalvar: false,
					strNome: '',
				}
				this.$emit('set_options', objOptions);
			}

			if (!blValidarNome || validateNomePreenchido) {

				if (origem === 'Salvar' || origem === 'Copiar') {

					if (origem === 'Salvar') {
						setTimeout(() => {
							this.$emit('set_options', objOptions);
						}, 0);
					} else {
						this.$emit('set_options', objOptions);
					}
				}

				if (origem === 'Nova') {

					this.$emit('iniciarForm');
					if (validateNomePreenchido) {
						this.$emit('set_options', objOptions);
					}
				}

				this.dialogNome = false;

				if (origem !== 'Nova' && origem !== 'Copiar') {
					this.$props.form.blSalvar = blValidarNome;
					this.$props.form.strNome = this.strNome;
					this.$emit('salvar');
				}
				this.$router.push({
					name: this.arRotas[this.intRota]
				});

			}
		},

	},
}