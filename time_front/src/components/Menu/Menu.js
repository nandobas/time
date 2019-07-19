import DialogOpiniao from '../Dialogs/DialogOpiniao/DialogOpiniao.vue';

export default {
	name: "Menu",
	components: {
		DialogOpiniao
	},
	data() {
		return {
			items: [{
					title: 'Início',
					icon: 'home-outline',
					url: '/simulacao',
				},
				{
					title: 'Simulação',
					icon: 'pencil-outline',
					subMenu: [{
						title: "Outras despesas operacionais das atividades em geral",
						url: "/novo/meritocracia/eventos"
					}, {
						title: "Gestão",
						url: "/novo/meritocracia/gestao",
					}, {
						title: "Painel",
						url: "/novo/meritocracia/painel"
					}, {
						title: "Relatórios",
						url: "/novo/meritocracia/relatorios"
					}]
				},
				{
					title: 'Resultados',
					icon: 'file-check-outline',
					subMenu: [{
							title: "Simples Nacional",
							url: "/novo/meritocracia/eventos"
						},
						{
							title: "Lucro Presumido",
							url: "/novo/meritocracia/eventos"
						},
						{
							title: "Lucro Real",
							url: "/novo/meritocracia/eventos"
						},
						{
							title: "Comparativo",
							url: "/novo/meritocracia/eventos"
						}
					]
				},
			],
			mini: false,
			drawer: true,
			strNome: '',
			dialogOpiniao: false
		}
	},
	mounted() {
		this.strNome = localStorage.getItem('nome_usuario');
	},
	methods: {
		abrirDialogOpiniao() {
			this.dialogOpiniao = true;
		},
		fecharDialogOpiniao() {
			this.dialogOpiniao = false;
		}
	},
}