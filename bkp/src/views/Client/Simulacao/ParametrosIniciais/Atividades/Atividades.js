import DialogAjuda from "../../../../../components/Dialogs/DialogAjuda/DialogAjuda.vue";
import DialogCnae from "../../../../../components/Dialogs/DialogCnae/DialogCnae.vue";

export default {
    props: ["form", "intPage"],
    components: {
        DialogAjuda,
        DialogCnae
    },
    data() {
        return {
            strFiltro: null,
            arCnaes: [],
            timeoutPesquisa: "",
            rowsPerPage: [
                5,
                25,
                {
                    text: "$vuetify.dataIterator.rowsPerPageAll",
                    value: -1
                }
            ],
            pagination: {
                page: 1,
                paginas: 0
            },
            dadosModal: {
                abrir: false,
                dados: ""
            },
            dadosModalCnae: {
                abrir: false,
                cnae: ""
            },
            arAjudas: [
                {
                    titulo: "CNAE Principal",
                    texto:
                        "Define-se a atividade principal de uma empresa, a que mais contribui para geração do valor adicionado. O Valor Adicionado é o valor bruto da produção menos o custo das matérias-primas, bem como de outros consumos intermediários. Pode-se também definir como atividade econômica principal, aquela considerada de maior receita auferida ou esperada, dentre as constantes no ato constitutivo ou alterador."
                },
                {
                    titulo: "CNAE Secundário",
                    texto:
                        "Define-se a atividade secundária, como aquela destinada a terceiros, mas cujo valor adicionado é menor do que o da atividade principal. A maior parte das empresas exercem mais de uma atividade e, portanto, tem uma ou mais atividades secundárias relacionadas em seu ato constitutivo."
                }
            ]
        };
    },
    watch: {
        intPage: function() {
            this.zerarPesquisa();

            if (this.$props.intPage == 2 && this.$props.form.cnaes.length < 3) {
                // 600ms por causa do stepper, menos que isso estraga o efeito
                setTimeout(() => {
                    this.$refs.inputCnae.focus();
                }, 600);
            }
        }
    },
    computed: {
        cnaePrincipal() {
            return this.$props.form.cnaes.slice(0, 1);
        },
        cnaesSecundarios() {
            return this.$props.form.cnaes.slice(1);
        }
    },
    methods: {
        zerarPesquisa() {
            this.strFiltro = "";
            this.arCnaes = [];
        },
        obterCnaes() {
            this.$root.$api
                .post("ListarCnae", {
                    cnae: this.strFiltro
                })
                .then(response => {
                    this.arCnaes = response.response;
                    this.timeoutPesquisa = null;
                    this.pagination.paginas = Math.round(
                        this.arCnaes.length / 5
                    );
                });
        },
        pesquisar() {
            clearTimeout(this.timeoutPesquisa);
            this.timeoutPesquisa = null;
            if (!this.strFiltro || this.strFiltro.trim().length == 0) {
                this.arCnaes = [];
            } else {
                this.timeoutPesquisa = setTimeout(() => {
                    this.obterCnaes();
                }, 500);
            }
        },
        verificaCnaeAdicionado(idcnae) {
            return this.$props.form.cnaes.some(cnae => cnae.idcnae == idcnae);
        },
        adicionar(cnae) {
            this.$props.form.cnaes.push(cnae);
            this.$props.form.id_cnaes.push(cnae.idcnae);

            Object.noty.success("CNAE " + cnae.cnae + " selecionada!");

            if (this.$props.form.cnaes.length == 3) this.zerarPesquisa();
        },
        remover(index, idCnae) {
            this.$props.form.cnaes.splice(index, 1);

            index = this.$props.form.id_cnaes.findIndex(id => {
                return id == idCnae;
            });

            this.$props.form.id_cnaes.splice(index, 1);
        },
        abrirDialogAjuda() {
            let index = this.$props.form.cnaes.length == 0 ? 0 : 1;

            this.dadosModal.dados = this.arAjudas[index];
            this.dadosModal.abrir = true;
        },
        fecharDialog() {
            this.dadosModal.abrir = false;
        },
        abrirDialogCnae(cnae) {
            this.dadosModalCnae.cnae = cnae;
            this.dadosModalCnae.abrir = true;
        },
        fecharDialogCnae() {
            this.dadosModalCnae.abrir = false;
        }
    }
};
