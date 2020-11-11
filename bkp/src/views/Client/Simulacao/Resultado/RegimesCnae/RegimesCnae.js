import Header from "@/components/Header/Header.vue";

export default {
	props: ["repositorio", "intIndexAba", "arCnaes"],
	components: {
		Header
	},
	data() {
		return {
			consultou: false,
			html_enquadramento: "",
			html_obrigacoes: "",
			idcnae: 0,
			intIndexCnae: 0
		};
	},
	watch: {
		idcnae: function() {
			this.consultar();
		},
		intIndexAba: function() {
			this.consultar();
		},
		intIndexCnae: function() {
			this.consultar();
		}
	},
	created() {
		this.idcnae = this.$props.arCnaes[this.intIndexCnae].idcnae;

		let jquery = document.createElement("script");
		jquery.setAttribute(
			"src",
			"https://www.econeteditora.com.br/ferramentas/regimes_cnae/jquery-3.1.1.min.js"
		);
		document.head.appendChild(jquery);

		let funcoes = document.createElement("script");
		funcoes.setAttribute(
			"src",
			"https://www.econeteditora.com.br/ferramentas/regimes_cnae/funcoes.js"
		);
		funcoes.setAttribute(
			"language",
			"javascript"
		);
		document.body.appendChild(funcoes);



	},
	mounted() {
		this.consultar();
	},
	computed: {
		listaCnae() {
			let arLista = [];
			let idcnae = 0;
			this.$props.arCnaes.forEach(cnae => {
				if (idcnae != cnae.idcnae) {
					arLista.push(cnae);
					idcnae = cnae.idcnae;
				}
			});

			return arLista;
		}
	},
	methods: {
		consultar() {
			//listaCnae();
			this.idcnae = this.$props.arCnaes[this.intIndexCnae].idcnae;

			if (this.$props.intIndexAba === 4) {
				this.$root.$api
					.getUrlCompleta(
						"https://www.econeteditora.com.br/ferramentas/regimes_cnae/subAbas.php?aba=" +
						this.$props.repositorio +
						"&idCnae=" +
						this.idcnae
					)
					.then(response => {
						this.consultou = false;

						if (response) {
							this.html_enquadramento = response;
						} else {
							this.html_enquadramento = "";
						}
						this.consultou = true;
					});
			} else if (this.$props.intIndexAba === 5) {
				this.$root.$api
					.getUrlCompleta(
						"https://www.econeteditora.com.br/ferramentas/regimes_cnae/subAbas.php?aba=" +
						this.$props.repositorio +
						"&idCnae=" +
						this.idcnae
					)
					.then(response => {
						this.consultou = false;

						if (response) {
							this.html_obrigacoes = response; //.replace(/span_link_detalhes_2/i, "W3Schools");
						} else {
							this.html_obrigacoes = "";
						}
						this.consultou = true;
					});
			} else if (this.$props.intIndexAba === 6) {
				this.$root.$api
					.getUrlCompleta(
						"https://www.econeteditora.com.br/ferramentas/regimes_cnae/abas.php?aba=constituicao" +
						"&idCnae=" +
						this.idcnae
					)
					.then(response => {
						this.consultou = false;
						if (response) {

							this.html_obrigacoes = response; //.replace(/span_link_detalhes_2/i, "W3Schools");
							carregaSubAbas('naturezaJuridica', this.idcnae, {
								id: 'aba_1'
							})

							jQuery(".label_click").click(function() {
								carregaSubAbas(jQuery(this).data('aba'), this.idcnae, jQuery(this));
							});

						} else {
							this.html_obrigacoes = "";
						}
						this.consultou = true;
					});
			}
		}
	}
};