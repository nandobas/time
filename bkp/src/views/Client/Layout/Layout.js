import Menu from "../../../components/Menu/Menu.vue";
import Topo from "../../../components/Topo/Topo.vue";
import FormularioModel from "@/models/FormularioModel.js";

export default {
    name: "Layout",
    components: {
        Menu,
        Topo
    },
    data() {
        return {
            blSalvandoSimulacao: false,
            form: null,
            strRota: "",
            preResult: {
                result_sn: "",
                result_real: "",
                result_lp: ""
            },
            resultadoHtml: { tipo: "", html: "" },
            infoSimulacao: []
        };
    },
    mounted() {
        this.strNome = this.$route.name;

        if (localStorage.getItem("_simulacao")) {
            this.recuperarLocalStorage();
        } else {
            this.$router.push({
                name: "homeLogado"
            });
        }
    },
    methods: {
        limparForm() {
            this.form = {};
            this.atualizarMenu();
        },
        iniciarForm(strNome = "") {
            this.form = new FormularioModel();
            this.form.strNome = strNome;
            this.form.blSalvar = strNome != "" ? true : false;

            this.atualizarMenu();
        },
        recuperarLocalStorage() {
            this.form = JSON.parse(localStorage.getItem("_simulacao"));

            this.atualizarMenu();
        },
        setNome(strNome) {
            this.form.blSalvar = true;
            this.form.strNome = strNome;

            this.salvar();
        },
        setPreResult(preResult) {
            this.preResult = preResult;
        },
        registraResultado(objResultado) {
            this.resultadoHtml = objResultado;

            setTimeout(() => {
                this.$router.push({
                    name: "Impressão"
                });
            }, 1000);
        },
        salvar() {
            if (this.form.blSalvar) {
                this.blSalvandoSimulacao = true;

                this.form.router = this.$router.history.current.fullPath;

                this.$root.$api
                    .post("SalvarSimulacao", this.form)
                    .then(response => {
                        this.form._id = response.retorno._id;

                        try {
                            localStorage.setItem(
                                "_simulacao",
                                JSON.stringify(this.form)
                            );
                        } catch (e) {
                            console.log("Local Storage is full");
                        }

                        setTimeout(() => {
                            this.blSalvandoSimulacao = false;
                            console.log("..salvou");
                        }, 1000);
                    });
            }
            return true;
        },
        selecionarSimulacao(simulacao) {
            this.form = simulacao;

            this.atualizarMenu("selecionarSimulacao");
        },
        adicionarCampos(campos) {
            this.form.campos = campos.abas;
            this.form.escopo = campos.escopo;
            var aba = this.form.campos[0];

            //console.log(this.form.campos);

            if (this.form.tipoSimulacao.intTipoSimulacao > 1) {
                this.form.blLiberarCampos = false;

                this.$router.push({
                    name: "rbt12-anterior"
                });
            } else {
                this.form.blLiberarCampos = true;

                this.$router.push({
                    name: "valores",
                    params: {
                        slug: aba.slug_rota
                    }
                });
            }

            this.atualizarMenu();
        },
        atualizarMenu(p_origem) {
            this.$refs.refMenu.atualizar(this.form, p_origem);
            if (
                this.form.router &&
                this.form.router != this.$router.history.current.fullPath &&
                p_origem == "selecionarSimulacao"
            ) {
                this.$nextTick(() => {
                    if (this.form.blLiberarCampos) {
                        var aba = this.form.campos[0];
                        this.$router.push({
                            name: "valores",
                            params: {
                                slug: aba.slug_rota
                            }
                        });
                    } else {
                        this.$router.push({
                            name: "parametros"
                        });
                    }
                });
            }
        }
    }
};
