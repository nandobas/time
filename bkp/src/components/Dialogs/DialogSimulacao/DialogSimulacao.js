export default {
	props: ["abrir", "form"],
	data() {
		return {
			dialogNome: false,
			strNome: "",
			strAcao: "",
			blValidarNome: false,
			rules: {
				required: value => !!value || "Informe um nome."
			},
			arRotas: ["parametros"]
		};
	},
	watch: {
		abrir: function() {
			let intOpcao = this.$props.abrir.intOpcao;
			let strAcao = this.$props.abrir.strAcao;
			this.abrirDialogNome(intOpcao, strAcao);
		}
	},
	methods: {
		abrirDialogNome(intOpcao, strAcao = "Nova") {
			this.$refs.inputNome.reset();
			this.dialogNome = true;
			this.intRota = intOpcao;
			this.strAcao = strAcao;

			setTimeout(() => {
				this.$refs.inputNome.focus();
			}, 0);
		},

		fecharDialogNome(blValidarNome, origem) {
			this.blValidarNome = blValidarNome;
			let blValido =
				this.strNome && this.strNome.trim().length > 0 ? true : false;
			let blFechar = true;

			if (!blValidarNome) {
				this.$emit("iniciarForm");
			} else {
				if (blValido == true) {
					if (origem === "Nova") {
						this.$emit("iniciarForm", this.strNome);
					} else if (origem === "Copiar") {
						this.$emit("copiarSimulacao", this.strNome);
						this.dialogNome = false;
						return true;
					} else {
						this.$emit("setNome", this.strNome);
					}
				} else blFechar = false;
			}

			if (blFechar) {
				this.strNome = "";
				this.dialogNome = false;

				if (origem !== "Salvar") {
					this.$router.push({
						name: this.arRotas[this.intRota]
					});
				}
			}
		}
	}
};