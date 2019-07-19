import Header from '../../../components/Header/Header.vue'
import TipoSimulacao from './TipoSimulacao/TipoSimulacao.vue'
import Atividades from './Atividades/Atividades.vue'
import OutrasInformacoes from './OutrasInformacoes/OutrasInformacoes.vue'
import DialogIncidenciaIpiIss from '../../../components/Dialogs/DialogIncidenciaIpiIss/DialogIncidenciaIpiIss.vue'

export default {
	name: "Parametros",
	props: ['form'],
	components: {
		Header,
		TipoSimulacao,
		Atividades,
		OutrasInformacoes,
		DialogIncidenciaIpiIss
	},
	data() {
		return {
			intPage: 1,
			keyAvancarOutrasInformacoes: 0,
			blHabilitarBotaoOutrasInformacoes: false,
			abrirDialogIncidenciaIpiIss: false,
			arOpcoes: {
				arTipoSimulacao: [{
						value: 0,
						descricao: 'Simular enquadramento tributário para uma Nova Empresa'
					},
					{
						value: 1,
						descricao: 'Simular tributação de Empresa já existente em outros Regimes Tributários'
					}
				],
				arRegime: [{
						value: 0,
						descricao: 'Simples Nacional'
					},
					{
						value: 1,
						descricao: 'Lucro Presumido'
					},
					{
						value: 2,
						descricao: 'Lucro Real'
					}
				],
				arPeriodo: [{
						value: 0,
						descricao: 'Quero inserir o valor relativo a um mês. O sistema fará a projeção trimestral.'
					},
					{
						value: 1,
						descricao: 'Quero inserir valores mensais, detalhando as informações relativas aos meses de Janeiro a Dezembro.'
					}
				]
			},
		}
	},
	mounted() {
		if (this.$props.form.strNome == null) {
			this.intPage = 1;
			this.dialogNome = true;
		}
	},
	methods: {
		validarTipoSimulacao() {
			let localForm = this.$props.form.tipoSimulacao;

			if (localForm.intTipoSimulacao == null || localForm.intPeriodo == null || localForm.estado == null)
				return false;

			if (localForm.intTipoSimulacao == 1 && localForm.intRegime == null)
				return false;

			return true;
		},
		validarAtividades() {
			return this.$props.form.cnaes.length > 0;
		},
		validarOutrasInformacoes() {
			let blValido = true;

			this.$props.form.cnaes.forEach(cnae => {
				if (cnae.validacoes) {
					cnae.validacoes.titulos_validacoes.forEach(tv => {
						let arAtivos = tv.validacoes.filter(v => {
							return (v.blHide == 0 || v.blMostrarImportant == 1) && v.blOcultarImportant == 0
						})

						if (arAtivos.length > 0 && !arAtivos.some(a => {
								return a.blMarcado == 1
							})) {
							blValido = false;
						}
					});
				}
			});

			this.keyAvancarOutrasInformacoes = new Date().getTime();
			this.blHabilitarBotaoOutrasInformacoes = blValido;
		},
		avancar(intPage) {
			this.intPage = intPage;
			this.salvar();
		},
		salvar() {
			this.$emit('salvar');
		},
		verificarIncidenciaIpiIss() {
			let arIncidencia = [];

			this.$props.form.cnaes.forEach(cnae => {
				cnae.validacoes.titulos_validacoes.forEach(tv => {
					if (tv.validacoes.some(v => v.blMarcado == 1 && v.blIncidenciaIPIISS == 1)) {
						arIncidencia.push({
							idcnae: cnae.idcnae,
							cnae: cnae.cnae,
							descricao: cnae.descricao,
							blIncidencia: 0
						})
					}
				})
			})

			this.$props.form.cnaesIncidenciaIpiIss = arIncidencia;

			if (arIncidencia.length > 0)
				this.abrirDialogIncidenciaIpiIss = true;
		},
		confirmarIncidenciaIpiIss() {
			this.$props.form.cnaesIncidenciaIpiIss = this.$props.form.cnaesIncidenciaIpiIss.filter(c => {
				return c.blIncidencia == 1;
			});

			this.fecharDialogIncidenciaIpiIss();
			console.log(this.$props.form.cnaesIncidenciaIpiIss);
		},
		fecharDialogIncidenciaIpiIss() {
			this.abrirDialogIncidenciaIpiIss = false;
		},
	},
}