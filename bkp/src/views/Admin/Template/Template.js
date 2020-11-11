export default {
    data() {
        return {
            id: 0,
            active:0,
            template: "",
            abas: [],
            modalNovaAba:false,
            modalNovoBloco:false,
            modalAdicionarCampos:false,
            modalConfirmarExcluir: false,
            idAbaTemp: null,
            idAbaBloco:null,
            loading:false,
            loadingPage:true,
            infoAbas: [],
            infoBlocos: [],
            novaAba: {
                aba:"",
                bloco:"",
                campos:"",
                ordem:0,
            }
        }
    },
    created() {
        this.id = this.$route.params.id;
        this.getTemplate();
        this.getAbas();
        this.getBlocos()
    },
    methods: {
        getAbas() {
            this.$root.$api.get("admin/abas").then(response => {
                this.infoAbas = response.response.abas;
            });
        },
        getBlocos() {
            this.$root.$api.get("admin/blocos").then(response => {
                this.infoBlocos = response.response.blocos;
            });
        },
        abrirModalExcluirBloco(idAbaBloco) {
            this.modalConfirmarExcluir = true;
            this.idAbaBloco = idAbaBloco;
        },
        submitExcluirBloco() {
            this.loading = true;
            this.$root.$api.post("admin/template/excluir_bloco", {
                idAbaBloco: this.idAbaBloco
            }).then(response => {
                this.loading = false;
                console.log(response);
                this.$router.go();
            });
        },
        deletarCampo(idAbaBloco,campoId,campos,index) {
            campos.splice(index,1);

            this.$root.$api.post("admin/template/excluir_campo", {
                idAbaBloco: idAbaBloco,
                campoId: campoId
            }).then(response => {});

        },
        getTemplate() {
            this.$root.$api.get("admin/template/" + this.id).then(response => {
                this.abas = response.response.abas;
                this.template = response.response.template;
                this.loadingPage = false;
            });
        },
        abrirModalBloco(idAba) {
            this.modalNovoBloco = true;
            this.idAbaTemp = idAba;
        },
        abrirModalCampos(idAbaBloco) {
            this.modalAdicionarCampos = true;
            this.idAbaBloco = idAbaBloco;
        },
        submitNovosCampos() {
            this.loading = true;
            this.$root.$api.post("admin/template/adicionar_campos", {
                idTemplate : this.id,
                idAbaBloco: this.idAbaBloco,
                campos: this.novaAba.campos
            }).then(response => {
                console.log(response);
                this.loading = false;
                this.$router.go();
                this.novaAba= {
                    aba: "",
                    bloco: "",
                    campos: "",
                    ordem: 0,
                }
            });
        },
        submitNovoBloco() {
            this.loading = true;
            this.$root.$api.post("admin/template/adicionar_aba", {
                idTemplate : this.id,
                aba : this.idAbaTemp,
                bloco: this.novaAba.bloco,
                ordemBloco: this.novaAba.ordemBloco,
                campos: this.novaAba.campos
            }).then(response => {
                this.$router.go();
                this.loading = false;
                this.novaAba= {
                    aba:"",
                    bloco:"",
                    campos:"",
                    ordem:0,
                }
            });
        },
        adicionarAba() {
            this.loading = true;
            this.$root.$api.post("admin/template/adicionar_aba", {
                idTemplate : this.id,
                aba : this.novaAba.aba,
                bloco: this.novaAba.bloco,
                ordemAba: this.novaAba.ordemAba,
                campos: this.novaAba.campos
            }).then(response => {
                console.log(response);
                this.loading = false;
                this.$router.go();
                this.novaAba= {
                    aba:"",
                    bloco:"",
                    campos:"",
                    ordem:0,
                }
            });
        }
    },
}