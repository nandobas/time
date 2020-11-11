import DialogOpiniao from "../Dialogs/DialogOpiniao/DialogOpiniao.vue";

export default {
    name: "Menu",
    props: ["form", "resultadoHtml"],
    components: {
        DialogOpiniao
    },
    data() {
        return {
            items: [
                {
                    title: "Início",
                    icon: "home-outline",
                    url: "/simulacao"
                },
                {
                    title: "Simulação",
                    icon: "pencil-outline",
                    subMenu: []
                }
            ],
            mini: false,
            drawer: true,
            strNome: "",
            dialogOpiniao: false
        };
    },
    mounted() {
        this.strNome = localStorage.getItem("nome_usuario");
    },
    methods: {
        abrirDialogOpiniao() {
            this.dialogOpiniao = true;
        },
        fecharDialogOpiniao() {
            this.dialogOpiniao = false;
        },
        atualizar(form, p_origem) {
            let arMenus = [];

            if (form && form.tipoSimulacao) {
                arMenus.push({
                    title: "Parâmetros iniciais",
                    url: "/simulacao/parametros"
                });

                if (form.tipoSimulacao.intTipoSimulacao > 1) {
                    arMenus.push({
                        title: "Receitas no ano calendário anterior",
                        url: "/simulacao/receitas-ano-anterior"
                    });
                }

                if (form.blLiberarCampos && form.campos) {
                    form.campos.forEach(aba => {
                        arMenus.push({
                            title: aba.aba,
                            url: "/simulacao/valores/" + aba.slug_rota
                        });
                    });
                }

                this.items[1].subMenu = arMenus;
                if (p_origem != "selecionarSimulacao") this.$emit("salvar");

                setTimeout(() => {
                    this.$refs.item_title[0].click();
                }, 1000);
            } else {
                this.items[1].subMenu = [];
            }
        }
    },
    computed: {
        itemsMenu() {
            let arItems = this.items.slice(0, 2);
            if (
                this.$props.form &&
                this.$props.form.campos &&
                this.$props.form.campos.length > 0
            ) {
                let subMenu = [];
                subMenu.push(
                    {
                        title: "Simples Nacional",
                        url: "/simulacao/resultado/simples-nacional"
                    },
                    {
                        title: "Lucro Presumido",
                        url: "/simulacao/resultado/lucro-presumido"
                    },
                    {
                        title: "Lucro Real",
                        url: "/simulacao/resultado/lucro-real"
                    }
                );
                if (this.$props.resultadoHtml.html.length > 0) {
                    subMenu.push({
                        title: "Impressão",
                        url: "/simulacao/resultado/impressao"
                    });
                }

                arItems.push({
                    title: "Resultados",
                    icon: "file-check-outline",
                    subMenu: subMenu
                });
            }

            return arItems;
        }
    }
};
