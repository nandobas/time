import Simulacoes from "../../../components/Simulacoes/Simulacoes.vue";
import DialogSimulacao from "../../../components/Dialogs/DialogSimulacao/DialogSimulacao.vue";

export default {
    name: "HomeLogado",
    props: ["form"],
    components: {
        Simulacoes,
        DialogSimulacao
    },
    data() {
        return {
            objParam: {},
            abrirDialogNome: {
                intOpcao: 0,
                strAcao: null
            },
            arRotas: ["parametros"],
            tempForm: {},
            blLoading: false
        };
    },
    watch: {},
    mounted() {
        this.$emit("limparForm");
    },
    methods: {
        setLoading(blLoading) {
            this.blLoading = blLoading;
        },
        selecionarSimulacao(simulacao) {
            this.blLoading = false;
            this.$emit("selecionarSimulacao", simulacao);
            try {
                localStorage.setItem("_simulacao", JSON.stringify(simulacao));
            } catch (e) {
                console.log("Local Storage is full");
            }

            this.$router.push({
                name: this.arRotas["parametros"]
            });
        },
        abrirDialogCopiarSimulacao(simulacao) {
            this.abrirDialogNome = {
                intOpcao: 0,
                strAcao: "Copiar"
            };

            this.tempForm = simulacao;
        },
        copiarSimulacao(strNome) {
            var simulacao = { jsonSimulacao: "" };
            this.blLoading = true;
            this.$root.$api
                .post("getSimulacao", {
                    _id: this.tempForm._id
                })
                .then(resposta => {
                    simulacao = resposta.retorno[0];
                    let objSimulacao = JSON.parse(simulacao.jsonSimulacao);

                    objSimulacao._id = 0;
                    objSimulacao.strNome = strNome;
                    this.tempForm = objSimulacao;
                    this.$emit("selecionarSimulacao", this.tempForm);

                    this.blLoading = false;
                    this.$router.push({
                        name: this.arRotas["parametros"]
                    });
                });

            //this.tempForm.strNome = strNome;
            //this.$emit("selecionarSimulacao", this.tempForm);
        },
        novaSimulacao() {
            this.abrirDialogNome = {
                intOpcao: 0,
                strAcao: "Nova"
            };
            //this.p_form = this.form;
        },
        iniciarForm(strNome = "") {
            this.$emit("iniciarForm", strNome);
        },
        setNome(strNome) {
            this.$emit("setNome", strNome);
        },
        importarECF() {
            //Object.noty.success('Funcionalidade em desenvolvimento!');
            //Object.noty.error('Ocorreu um erro ao acessar a API, entrar em contato com o desenvolvimento!');
            //Object.noty.info('Funcionalidade em desenvolvimento!');
            Object.noty.info("Funcionalidade em desenvolvimento!");
        }
    }
};
