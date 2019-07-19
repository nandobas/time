import DialogAjuda from '../../../../components/Dialogs/DialogAjuda/DialogAjuda.vue'
import DialogAtencao from '../../../../components/Dialogs/DialogAtencao/DialogAtencao.vue'
import DialogAtencaoModel from '../../../../models/DialogAtencaoModel'

export default {
	props: ['form', 'intPage'],
	components: {
		DialogAjuda,
		DialogAtencao
	},
	data() {
		return {
			intPageValidacao: 1,
			blLoading: false,
			arExpansionPanel: [],
			dadosModal: {
				abrir: false,
				dados: {
					titulo: '',
					texto: ''
				}
			},
			arDadosModalAtencao: [],
			keyCard: 0,
			keyPanel: 0,
		}
	},
	mounted() {
		this.keyCard = new Date().getTime();
	},
	methods: {
		obterValidacoes() {
			this.$refs.top.scrollTop = 0;

			if (this.$props.form.id_cnaes.length > 0) {
				this.blLoading = true;

				this.$root.$api.post('ValidacoesCnae', {
					id_cnaes: this.$props.form.id_cnaes
				}).then(
					(response) => {
						this.$props.form.id_cnaes = new Array();
						this.arExpansionPanel = new Array();

						let arValidacoes = response.response;

						arValidacoes.forEach(v => {
							let index = this.$props.form.cnaes.findIndex(c => {
								return c.idcnae == v.id_cnae
							});

							this.$props.form.cnaes[index].validacoes = v;
							this.$props.form.cnaes[index].validacoes_marcadas = new Array();
							this.arExpansionPanel.push(true);
						});

						this.$emit('validarOutrasInformacoes');
						this.blLoading = false;
					}
				)
			} else
				this.$emit('validarOutrasInformacoes');
		},
		ocultarBody(cnae) {
			return cnae.validacoes.titulos_validacoes.length == 0
		},
		abrirTodos() {
			this.arExpansionPanel = new Array();

			this.$props.form.cnaes.forEach(c => {
				this.arExpansionPanel.push(true);
			});

			this.keyPanel = new Date().getTime();

			console.log(this.$props.form);
		},
		abrirDialogAjuda(cnae, index) {
			//gambi pra não mudar o estado da expansão ao abrir o modal
			this.arExpansionPanel[index] = !this.arExpansionPanel[index];

			this.dadosModal.dados.titulo = cnae.cnae + ' - ' + cnae.descricao;
			this.dadosModal.dados.texto = cnae.validacoes.fluxo.txFixo;
			this.dadosModal.abrir = true;
		},
		fecharDialogAjuda() {
			this.dadosModal.abrir = false;
		},
		abrirDialogAtencao(popup) {
			let obDialogAtencaoModel = new DialogAtencaoModel();
			obDialogAtencaoModel.texto = popup.mensagem;

			this.arDadosModalAtencao.push(obDialogAtencaoModel);
		},
		fecharDialogAtencao() {
			this.arDadosModalAtencao.shift();
		},
		verificaMostrarGrupo(tituloValidacao) {
			return tituloValidacao.validacoes.some(v => v.blHide != 1);
		},
		verificarCenarioPopup(cnae, id_validacao) {
			cnae.validacoes.cenarios_popups.forEach(cp => {
				if (!cp.cenario.some(c => !cnae.validacoes_marcadas.includes(c)) && cp.cenario.some(c => c == id_validacao)) {
					this.abrirDialogAtencao(cp.popup);
				}
			});
		},
		resetarAtributosValidacao(cnae, id) {
			cnae.validacoes.titulos_validacoes.forEach(tv => {
				tv.validacoes.forEach(v => {
					if (v.blMostrarImportant == 1 & v.id != id) {
						v.blMarcado = 0;
						this.removerValidacao(cnae, v);
					}

					v.blDesabilitado = 0;
					v.blMostrarImportant = 0;
					v.blOcultarImportant = 0;
				})
			});

			this.keyCard = new Date().getTime();
		},
		aplicarCenariosValidacao(cnae, id) {
			this.resetarAtributosValidacao(cnae, id);

			cnae.validacoes.cenarios_validacao.forEach(cv => {
				if (!cv.cenario.some(c => !cnae.validacoes_marcadas.includes(c))) {
					cnae.validacoes.titulos_validacoes.forEach(tv => {
						tv.validacoes.forEach(v => {
							let blAlterou = false;

							if (cv.desabilitar && cv.desabilitar.some(d => d == v.id_validacao)) {
								if (v.blMarcado == 1) {
									blAlterou = true;
									v.blMarcado = 0;
									this.removerValidacao(cnae, v);
								}

								v.blDesabilitado = 1;
							}

							if (cv.ocultar && cv.ocultar.some(d => d == v.id_validacao)) {
								if (v.blMarcado == 1) {
									blAlterou = true;
									v.blMarcado = 0;
									this.removerValidacao(cnae, v);
								}

								v.blOcultarImportant = 1;
							}

							if (cv.mostrar && cv.mostrar.some(d => d == v.id_validacao)) {
								v.blMostrarImportant = 1;
							}

							if (blAlterou) {
								//this.keyCard = new Date().getTime();
								this.aplicarCenariosValidacao(cnae, id);
							}
						})
					})
				}
			})

			this.$emit('validarOutrasInformacoes');
		},
		removerValidacao(cnae, validacao) {
			let index = cnae.validacoes_marcadas.findIndex(vm => {
				return vm == validacao.id_validacao;
			})

			cnae.validacoes_marcadas.splice(index, 1);
		},
		marcaValidacao(event, cnae, validacao) {
			if (event) {
				if (validacao.id_popup)
					this.abrirDialogAtencao(validacao.popup);

				cnae.validacoes_marcadas.push(validacao.id_validacao)
				this.verificarCenarioPopup(cnae, validacao.id_validacao);
			} else {
				this.removerValidacao(cnae, validacao);
			}

			this.aplicarCenariosValidacao(cnae, validacao.id);
		},

	},
	watch: {
		intPage: function() {
			if (this.$props.intPage == 3) {
				this.obterValidacoes();

				if (this.$props.form.id_cnaes.length == 0) {
					this.abrirTodos();
				}
			}
		}
	},
}