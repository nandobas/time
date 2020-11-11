import Header from "../../../../components/Header/Header.vue";
import TipoSimulacao from "./TipoSimulacao/TipoSimulacao.vue";
import Atividades from "./Atividades/Atividades.vue";
import OutrasInformacoes from "./OutrasInformacoes/OutrasInformacoes.vue";
import DialogIncidenciaIpiIss from "../../../../components/Dialogs/DialogIncidenciaIpiIss/DialogIncidenciaIpiIss.vue";
import DialogEquiparacaoIpi from "../../../../components/Dialogs/DialogIpiComercio/DialogIpiComercio.vue";
import DialogCpp from "../../../../components/Dialogs/DialogCpp/DialogCpp.vue";
import DialogConfirmacao from "../../../../components/Dialogs/DialogConfirmacao/DialogConfirmacao.vue";

export default {
    name: "Parametros",
    props: ["form"],
    components: {
        Header,
        TipoSimulacao,
        Atividades,
        OutrasInformacoes,
        DialogIncidenciaIpiIss,
        DialogEquiparacaoIpi,
        DialogCpp,
        DialogConfirmacao
    },
    data() {
        return {
            abrirDialogIncidenciaIpiIss: false,
            abrirDialogEquiparacao: false,
            abrirDialogCpp: false,
            abrirDialogConfirmacao: { mostra: false, origem: "" },
            arOpcoes: {
                arTipoSimulacao: [
                    {
                        value: 0,
                        descricao: "Simular tributação para uma nova empresa"
                    },
                    {
                        value: 1,
                        descricao:
                            "Simular tributação para uma empresa constituída dentro do ano-calendário"
                    },
                    {
                        value: 2,
                        descricao:
                            "Simular tributação para empresa constituída no ano anterior"
                    },
                    {
                        value: 3,
                        descricao:
                            "Simular tributação para empresa já constituída, que possua dados consolidados de períodos anteriores"
                    }
                ],
                arRegime: [
                    {
                        value: 0,
                        descricao: "Simples Nacional"
                    },
                    {
                        value: 1,
                        descricao: "Lucro Presumido"
                    },
                    {
                        value: 2,
                        descricao: "Lucro Real"
                    }
                ],
                arEstados: [],
                arAnoCompleto: [
                    {
                        value: 0,
                        descricao:
                            "Quero inserir o valor relativo a um mês e o sistema fará a projeção"
                    },
                    {
                        value: 1,
                        descricao: "Quero inserir valores mensais"
                    }
                ]
            },
            blHabilitarBotaoOutrasInformacoes: false,
            blLoadingCampos: false,
            intPage: 1,
            keyAvancarOutrasInformacoes: 0
        };
    },
    mounted() {
        if (this.$props.form.strNome == null) {
            this.intPage = 1;
            this.dialogNome = true;
        }
        this.obterEstados();
    },
    methods: {
        refazer() {
            this.intPage = 1;

            this.abrirDialogIncidenciaIpiIss = false;
            this.abrirDialogEquiparacao = false;
            this.abrirDialogConfirmacao = false;
            this.blHabilitarBotaoOutrasInformacoes = false;
            this.blLoadingCampos = false;
            this.keyAvancarOutrasInformacoes = 0;
            this.$props.form.blLiberarCampos = false;
            this.$emit("campos", []);
            this.atualizarMenu();
        },
        obterEstados() {
            if (!localStorage.getItem("arEstados")) {
                this.$root.$api.get("ListarEstados").then(response => {
                    this.arOpcoes.arEstados = response.response;
                    localStorage.setItem(
                        "arEstados",
                        JSON.stringify(this.arOpcoes.arEstados)
                    );
                });
            } else {
                this.arOpcoes.arEstados = JSON.parse(
                    localStorage.getItem("arEstados")
                );
            }

            if (this.$props.form.blLiberarCampos) {
                this.abrirDialogConfirmacao = {
                    mostra: true,
                    origem: "iniciada"
                };
            }
        },
        validarTipoSimulacao() {
            let localForm = this.$props.form.tipoSimulacao;

            if (localForm.intTipoSimulacao == null || localForm.strUF == null)
                return false;

            if (localForm.intTipoSimulacao == 1 && localForm.intRegime == null)
                return false;

            return true;
        },
        validarAtividades() {
            return this.$props.form.cnaes && this.$props.form.cnaes.length > 0;
        },
        validarOutrasInformacoes() {
            let blValido = true;
            let blAvancarDireto = true;

            this.$props.form.cnaes.forEach(cnae => {
                cnae.blValidacoesOk = true;

                if (cnae.validacoes) {
                    if (cnae.validacoes.titulos_validacoes && cnae.validacoes.titulos_validacoes.length == 1) {
                        if (
                            cnae.validacoes.titulos_validacoes[0].validacoes
                                .length == 1
                        ) {
                            let obValidacao =
                                cnae.validacoes.titulos_validacoes[0]
                                    .validacoes[0];
                            obValidacao.blMarcado = 1;
                            obValidacao.blOcultarCheckbox = 1;
                            cnae.validacoes_marcadas = [
                                obValidacao.id_validacao
                            ];
                        }
                    }

                    cnae.validacoes.titulos_validacoes.forEach(tv => {
                        let arAtivos = tv.validacoes.filter(v => {
                            return (
                                (v.blHide == 0 || v.blMostrarImportant == 1) &&
                                v.blOcultarImportant == 0 &&
                                v.blDesabilitado == 0
                            );
                        });

                        if (
                            arAtivos.length > 0 &&
                            !arAtivos.some(a => {
                                return a.blMarcado == 1;
                            })
                        ) {
                            blValido = false;
                            cnae.blValidacoesOk = false;
                        }
                    });

                    if (cnae.validacoes.titulos_validacoes.length > 1) {
                        blAvancarDireto = false;
                    } else if (
                        cnae.validacoes.titulos_validacoes[0].validacoes
                            .length > 1
                    ) {
                        blAvancarDireto = false;
                    }
                }
            });

            if (blAvancarDireto) {
                this.verificarCpp();
                /*this.verificarIncidenciaIpiIss();*/
            }

            this.keyAvancarOutrasInformacoes = new Date().getTime();
            this.blHabilitarBotaoOutrasInformacoes = blValido;
        },
        avancar(intPage) {
            this.intPage = intPage;
            this.salvar();
        },
        salvar() {
            this.$emit("salvar");
        },
        verificarIncidenciaIpiIss() {
            let arIncidencia = [];

            this.$props.form.cnaes.forEach(cnae => {
                cnae.validacoes.titulos_validacoes.forEach(tv => {
                    if (
                        tv.validacoes.some(
                            v => v.blMarcado == 1 && v.blIncidenciaIPIISS == 1
                        )
                    ) {
                        arIncidencia.push({
                            idcnae: cnae.idcnae,
                            cnae: cnae.cnae,
                            descricao: cnae.descricao,
                            blIncidencia: this.$props.form.cnaesIncidenciaIpiIss.some(
                                i => cnae.idcnae == i.idcnae
                            )
                                ? 1
                                : 0
                        });
                    }
                });
            });

            this.$props.form.cnaesIncidenciaIpiIss = arIncidencia;

            if (arIncidencia.length > 0)
                this.abrirDialogIncidenciaIpiIss = true;
            else this.abrirDialogConfirmacao = { mostra: true, origem: "nova" };
        },
        confirmarIncidenciaIpiIss() {
            this.$props.form.cnaesIncidenciaIpiIss = this.$props.form.cnaesIncidenciaIpiIss.filter(
                c => {
                    return c.blIncidencia == 1;
                }
            );

            this.fecharDialogIncidenciaIpiIss();

            this.abrirDialogConfirmacao = { mostra: true, origem: "nova" };
        },
        verificarEquiparacaoIpi() {
            let arEquiparacao = [];

            this.$props.form.cnaes.forEach(cnae => {
                if (cnae.validacoes.equiparacao == 1) {
                    arEquiparacao.push({
                        idcnae: cnae.idcnae,
                        cnae: cnae.cnae,
                        descricao: cnae.descricao,
                        equiparacao: cnae.validacoes.equiparacao
                    });
                }
            });
            this.$props.form.cnaesEquiparacao = arEquiparacao;

            if (arEquiparacao.length > 0) this.abrirDialogEquiparacao = true;
            else this.verificarIncidenciaIpiIss();
        },
        confirmarEquiparacaoIpi() {
            this.$props.form.cnaesEquiparacao = this.$props.form.cnaesEquiparacao.filter(
                c => {
                    return c.blEquiparacao == 1;
                }
            );

            this.fecharDialogEquiparacao();
            this.verificarIncidenciaIpiIss();

            /*this.abrirDialogConfirmacao = { mostra: true, origem: "nova" };*/
        },
        fecharDialogIncidenciaIpiIss() {
            this.abrirDialogIncidenciaIpiIss = false;
        },
        fecharDialogEquiparacao() {
            this.abrirDialogEquiparacao = false;
        },
        fecharDialogConfirmacao(origem) {
            this.abrirDialogConfirmacao = false;
            if (origem == "iniciada") {
                var aba = this.$props.form.campos[0];
                this.$router.push({
                    name: "valores",
                    params: {
                        slug: aba.slug_rota
                    }
                });
            }
        },
        verificarCpp() {
            let arCppFuncionarios = [];
            let arCppFap = 0;

            if (this.$props.form.tipoSimulacao.intTipoSimulacao == 3){
                arCppFap = 1;
            }
            if (this.$props.form.cnaes.length > 1){
                this.$props.form.cnaes.forEach(cnae => {
                    arCppFuncionarios.push({
                        idcnae: cnae.idcnae,
                        cnae: cnae.cnae,
                        descricao: cnae.descricao,
                        cppFuncionarios: 0
                    });
                });
            }
            this.$props.form.cppFuncionarios = arCppFuncionarios;
            this.$props.form.fap = arCppFap;

            if ((arCppFuncionarios && arCppFuncionarios.length > 0) || arCppFap == 1) this.abrirDialogCpp = true;
            else this.verificarEquiparacaoIpi();
        },
        confirmarCpp() {
            console.log(this.$props.form);

            this.fecharDialogCpp();
            this.verificarEquiparacaoIpi();
        },
        fecharDialogCpp() {
            this.abrirDialogCpp = false;
        },
        obterCampos() {
            if (!this.$props.form.blLiberarCampos) {
                this.blLoadingCampos = true;

                this.$root.$api
                    .post("TemplateCampos", this.$props.form)
                    .then(response => {
                        this.blLoadingCampos = false;
                        this.fecharDialogConfirmacao();

                        this.$emit("campos", response.response);
                    });
            } else {
                var aba = this.$props.form.campos[0];
                this.$router.push({
                    name: "valores",
                    params: {
                        slug: aba.slug_rota
                    }
                });
            }
        },
        atualizarMenu() {
            this.$emit("atualizarMenu");
        }
    }
};
