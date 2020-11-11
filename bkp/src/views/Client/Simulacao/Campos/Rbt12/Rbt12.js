import Header from "../../../../../components/Header/Header.vue";
import Meses from "@/models/Meses";
import Unmask from "@/services/Unmask";

export default {
	name: "Parametros",
	props: ["form"],
	components: {
		Header
	},
	data() {
		return {
			blMostrarFolhaPagamento: false,
			keyTotal: 0,
			money: {
				decimal: ",",
				thousands: ".",
				prefix: "R$ ",
				precision: 2,
				masked: false,
				unmaskedVar: true
			}
		};
	},
	created() {
		this.blMostrarFolhaPagamento = this.$props.form.campos[0].arCnaes.some(
			cnae =>
			cnae.arCodigoAtividade.some(
				codAtividade => codAtividade == 34 || codAtividade == 37
			)
		);

		if (!this.$props.form.rbt12) {
			let rbt12 = new Array();
			let arMeses = new Meses().obterPorInicio(
				this.$props.form.tipoSimulacao.intMesInicio
			);

			arMeses.forEach(mes => {
				rbt12.push({
					intMes: mes.intMes,
					strMes: mes.strNome,
					vlReceitaMi: 0,
					vlReceitaMe: 0,
					vlFolha: 0
				});
			});

			rbt12.push({
				strMes: "Total",
				vlReceitaMi: 0,
				vlReceitaMe: 0,
				vlFolha: 0
			});

			this.$props.form.rbt12 = rbt12;

			if (this.$refs.refContainer)
				this.totalWidth = this.$refs.refContainer.clientWidth + "px";
		}
	},
	methods: {
		obterClasse() {
			switch (this.$props.form.tipoSimulacao.intRegime) {
				case 0:
					return "simples-nacional";
				case 1:
					return "lucro-presumido";
				case 2:
					return "lucro-real";
			}
		},
		changeValor(event) {
			if (event.key === "Tab" || event.key === "Shift") {
				return;
			}

			const obUnmask = new Unmask();
			const intUltimo = this.$props.form.rbt12.length - 1;

			let vlTotalReceitaMi = 0;
			let vlTotalReceitaMe = 0;
			let vlTotalFolha = 0;

			this.$nextTick(function() {
				this.$props.form.rbt12.forEach((mes, index) => {
					if (index < intUltimo) {
						vlTotalReceitaMi =
							vlTotalReceitaMi + obUnmask.unmask(mes.vlReceitaMi);

						vlTotalReceitaMe =
							vlTotalReceitaMe + obUnmask.unmask(mes.vlReceitaMe);

						vlTotalFolha =
							vlTotalFolha + obUnmask.unmask(mes.vlFolha);
					}
				});

				this.$props.form.rbt12[intUltimo].vlReceitaMe = parseFloat(
					vlTotalReceitaMe
				).toFixed(2);
				this.$props.form.rbt12[intUltimo].vlReceitaMi = parseFloat(
					vlTotalReceitaMi
				).toFixed(2);
				this.$props.form.rbt12[intUltimo].vlFolha = parseFloat(
					vlTotalFolha
				).toFixed(2);
			});
		},
		changeTotal(event, strCampo) {
			if (event.key === "Tab" || event.key === "Shift") {
				return;
			}

			this.$nextTick(function() {
				const obUnmask = new Unmask();
				const intUltimo = this.$props.form.rbt12.length - 1;

				const vlTotalReceitaMe = obUnmask.unmask(
					this.$props.form.rbt12[intUltimo].vlReceitaMe
				);
				const vlTotalReceitaMi = obUnmask.unmask(
					this.$props.form.rbt12[intUltimo].vlReceitaMi
				);
				const vlTotalFolha = obUnmask.unmask(
					this.$props.form.rbt12[intUltimo].vlFolha
				);

				const vlReceitaMe = (vlTotalReceitaMe / intUltimo).toFixed(2);
				const vlReceitaMi = (vlTotalReceitaMi / intUltimo).toFixed(2);
				const vlFolha = (vlTotalFolha / intUltimo).toFixed(2);

				this.$props.form.rbt12.forEach((mes, index) => {
					if (index < intUltimo) {
						if (strCampo === "me") mes.vlReceitaMe = vlReceitaMe;
						else if (strCampo === "mi")
							mes.vlReceitaMi = vlReceitaMi;
						else if (strCampo === "folha") mes.vlFolha = vlFolha;
					}
				});
			});
		},
		voltar() {
			this.$router.push({
				name: "parametros"
			});
		},
		avancar() {
			this.$props.form.blLiberarCampos = true;
			this.$emit("atualizarMenu");

			//console.log(this.$props.form.campos[0].slug_rota);

			this.$router.push({
				name: "valores",
				params: {
					slug: this.$props.form.campos[0].slug_rota
				}
			});
		}
	}
};