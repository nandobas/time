import DialogExcluir from "../../components/Dialogs/DialogExcluirSimulacao/DialogExcluirSimulacao.vue";

export default {
    name: "Simulacoes",
    props: ["form"],
    components: {
        DialogExcluir
    },
    data() {
        return {
            maxPaginas: 5,
            pagination: {
                page: 1,
                paginas: 0,
                sortBy: "datetime_updated",
                descending: true
            },
            dialogRemover: false,
            timeoutPesquisa: true,
            simulacao: {
                _id: 0,
                strNome: ""
            },
            strFiltro: "",
            arSimulacoes: []
        };
    },
    mounted() {
        this.obterSimulacoes();
        localStorage.removeItem("sn_hash");
        localStorage.removeItem("lp_hash");
        localStorage.removeItem("real_hash");
    },
    computed: {
        filtered: function() {
            let tmpSimulacoes = [];

            if (this.strFiltro == "" || this.strFiltro == null) {
                tmpSimulacoes = this.arSimulacoes;
            } else {
                tmpSimulacoes = this.arSimulacoes.filter(e => {
                    if (
                        e.strNome
                            .toLowerCase()
                            .indexOf(this.strFiltro.toLowerCase()) > -1
                    ) {
                        return true;
                    }
                });
            }

            this.pagination.paginas = Math.ceil(
                tmpSimulacoes.length / this.maxPaginas
            );

            let arSort = tmpSimulacoes.sort((a, b) => {
                const sortA = a["datetime_updated"];
                const sortB = b["datetime_updated"];

                if (this.pagination.descending) {
                    if (sortA < sortB) return 1;
                    if (sortA > sortB) return -1;
                    return 0;
                } else {
                    if (sortA < sortB) return -1;
                    if (sortA > sortB) return 1;
                    return 0;
                }
            });

            return arSort;
        }
    },
    methods: {
        selecionaSimulacao(simulacao) {
            this.$emit("setLoading", true);
            this.$root.$api
                .post("getSimulacao", {
                    _id: simulacao._id
                })
                .then(resposta => {
                    simulacao = resposta.retorno[0];
                    let objSimulacao = JSON.parse(simulacao.jsonSimulacao);
                    objSimulacao._id = simulacao._id;
                    objSimulacao.created_at = simulacao.created_at;
                    objSimulacao.updated_at = simulacao.updated_at;
                    this.$emit("selecionarSimulacao", objSimulacao);
                });
        },
        copiarSimulacao(simulacao) {
            /*this.loading = true;
            this.$root.$api
                .post("getSimulacao", {
                    _id: simulacao._id
                })
                .then(resposta => {
                    simulacao = resposta.retorno[0];
                    this.loading = false;
                    let objSimulacao = JSON.parse(simulacao.jsonSimulacao);

                    objSimulacao._id = 0;
                    objSimulacao.strNome = "";
                    this.$emit("abrirDialogCopiarSimulacao", objSimulacao);
                });*/
            this.$emit("abrirDialogCopiarSimulacao", simulacao);
        },
        abrirDialogExcluir(simulacao) {
            this.simulacao = {
                _id: simulacao._id,
                strNome: simulacao.strNome
            };
            this.dialogRemover = true;
        },
        fecharDialogExcluir() {
            this.dialogRemover = false;
        },
        obterSimulacoes() {
            this.dialogRemover = false;
            this.timeoutPesquisa = true;

            this.$root.$api.get("ListarSimulacoes").then(response => {
                this.timeoutPesquisa = false;

                if (response && response.status) {
                    this.arSimulacoes = response.response;
                } else {
                    this.arSimulacoes = [];
                }
                this.pagination.paginas = Math.round(
                    this.arSimulacoes.length / this.maxPaginas
                );
                this.loading = false;
                this.dialogRemover = false;
            });
        }
    }
};
