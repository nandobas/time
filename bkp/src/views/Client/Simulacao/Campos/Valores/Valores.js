import Header from "../../../../../components/Header/Header.vue";
import VueMathjs from "mathjs/dist/math.js";
import Unmask from "@/services/Unmask";
import Meses from "@/models/Meses";
import DialogSimNao from "@/components/Dialogs/DialogSimNao/DialogSimNao.vue";
import DialogAjuda from "../../../../../components/Dialogs/DialogAjuda/DialogAjuda.vue";

import money from "vuejs-money";

export default {
    name: "Valores",
    props: ["form"],
    components: {
        Header,
        DialogSimNao,
        DialogAjuda
    },
    data() {
        return {
            abrirCamposDeducoes: false,
            tempCamposDeducoes: {},
            aba: "",
            arLegendaNota: {
                A: "Valor sujeito à adição no Lucro Real",
                E: "Valor sujeito à exclusão no Lucro Real",
                AP:
                    "Valor sujeito à adição na base de cálculo do Lucro Presumido",
                C: "Valor sujeito a crédito de Pis/Cofins"
            },
            arMeses: [],
            arMesesReplicar: [],
            blEfeito: false,
            cnae: "",
            dadosModal: {
                abrir: false,
                dados: ""
            },
            idCnae: 0,
            indexCnae: 0,
            intSegmento: 0,
            intMes: 0,
            keyPanel: 0,
            money: {
                decimal: ",",
                thousands: ".",
                prefix: "R$ ",
                precision: 2,
                masked: true,
                unmaskedVar: true
            },
            money_negative: {
                decimal: ",",
                thousands: ".",
                prefix: "R$ -",
                precision: 2,
                masked: true,
                unmaskedVar: true
            },
            obCampoEditar: null,
            txtCampoEditar: "",
            txtBotaoAvancar: "Avançar"
        };
    },
    created() {
        this.obterMeses();
        this.obterAba();
    },
    watch: {
        $route(to, from) {
            this.obterAba();
        }
    },
    computed: {
        icon() {
            if (this.arMeses.length == this.arMesesReplicar.length)
                return "mdi-close-box";
            else if (this.arMesesReplicar.length > 0) return "mdi-minus-box";
            return "mdi-checkbox-blank-outline";
        }
    },
    methods: {
        somaCampoDeducoes(campoDeducoes, pMes = "") {
            let lMes = this.intMes;

            if (pMes != "") lMes = pMes;

            let somatorio = 0;
            const obUnmask = new Unmask();
            campoDeducoes.camposDetalhamentoDeducoes.forEach(campoDeducao => {
                somatorio += parseFloat(obUnmask.unmask(campoDeducao.valor));
                // somatorio += campoDeducao.valor;
            });
            this.cnae.arValidacoes[this.intSegmento].arMeses[
                lMes
            ].arBlocos[0].arCampos.forEach(c => {
                // console.log(c.id,campo);
                if (c.id == campoDeducoes.id) {
                    c.valor = somatorio.toFixed(2);
                }
            });
            if (pMes == "") {
                this.setEscopoManual(somatorio, campoDeducoes.id);
                this.setFormula(lMes);
            } else {
                this.setEscopoReplicar(somatorio, pMes, campoDeducoes.id);
            }
            // console.log(somatorio);
        },

        verificaCamposDeducao(campo) {
            if (campo.camposDetalhamentoDeducoes) {
                this.tempCamposDeducoes = campo;
                let tempObj = [];
                if (
                    typeof this.tempCamposDeducoes
                        .camposDetalhamentoDeducoes[0] == "string"
                ) {
                    this.tempCamposDeducoes.camposDetalhamentoDeducoes.forEach(
                        (descricao_campo, id_campo_modal) => {
                            console.log(descricao_campo, id_campo_modal);
                            //if (id_campo_modal == campo.id)
                            tempObj.push({
                                label: descricao_campo,
                                valor: 0
                            });
                        }
                    );
                    this.tempCamposDeducoes.camposDetalhamentoDeducoes = tempObj;
                    // campo = this.tempCamposDeducoes;
                    // console.log(this.cnae.arValidacoes[this.intSegmento].arMeses[this.intMes].arBlocos[0].arCampos);
                    this.cnae.arValidacoes[this.intSegmento].arMeses[
                        this.intMes
                    ].arBlocos[0].arCampos.forEach(c => {
                        // console.log(c.id,campo);
                        if (c.id == campo.id) {
                            c = this.tempCamposDeducoes;
                        }
                    });
                }
                // console.log(typeof this.tempCamposDeducoes[0]);
                // console.log('mostra modal');
                this.abrirCamposDeducoes = true;
                return this.tempCamposDeducoes;
            }
            // this.aba = this.$props.form.campos.find(
            //     a => a.slug_rota == this.$route.params.slug
            // );

            // console.log(this.$props.form.campos);
        },

        obterMeses() {
            let obMeses = new Meses();
            let intMesInicio =
                this.$props.form.tipoSimulacao.intTipoSimulacao == 1
                    ? this.$props.form.tipoSimulacao.intMesInicio
                    : 0;

            let arMeses = obMeses.obterPorInicio(intMesInicio);

            this.arMeses = arMeses.map((mes, index) => {
                mes.index = index;
                return mes;
            });
        },
        obterAba() {
            this.intSegmento = 0;
            this.intMes = 0;

            this.aba = this.$props.form.campos.find(
                a => a.slug_rota == this.$route.params.slug
            );

            this.cnae = this.aba.arCnaes[0];

            this.arMesesReplicar = [];
        },
        changeCnae(cnae, indexMes = 0) {
            if (this.cnae.idcnae != cnae.idcnae) {
                /*
				const abaCnae = this.aba.arCnaes.find(
				    c => c.idcnae == cnae.idcnae
				);
				*/

                const indexCnae = this.aba.arCnaes.findIndex(
                    c => c.idcnae == cnae.idcnae
                );

                this.indexCnae = indexCnae;

                this.arMesesReplicar = [];
                this.intSegmento = 0;
                this.intMes = indexMes;
                this.cnae = this.aba.arCnaes[indexCnae];
                this.aplicarEfeito();
            }
        },
        changeValidacao(indexValidacao) {
            this.intSegmento = indexValidacao;
            this.aplicarEfeito();
        },
        changeMes(indexMes) {
            this.intMes = indexMes;
            this.aplicarEfeito();
            this.verificaUltimaAba();
        },
        aplicarEfeito() {
            this.blEfeito = true;

            setTimeout(() => {
                this.blEfeito = false;
            }, 1000);
        },
        abrirDialogAjuda(campo) {
            this.dadosModal.dados = {
                titulo: campo.labelCampo,
                texto: campo.txtAjuda
            };
            this.dadosModal.abrir = true;
        },
        abrirDialogNota(campo, strNota) {
            let strTexto = "";

            switch (strNota) {
                case "A":
                case "E":
                    strTexto = campo.nota_ircs.nota;
                    break;
                case "AP":
                    strTexto = campo.nota_adicao_bc_presumido.nota;
                    break;
                case "C":
                    strTexto = campo.nota_pis_cofins.nota;
                    break;
            }

            this.dadosModal.dados = {
                titulo: this.arLegendaNota[strNota],
                texto: strTexto
            };
            this.dadosModal.abrir = true;
        },
        avancar() {
            if (
                this.intMes == 11 ||
                this.$props.form.tipoSimulacao.intAnoCompleto == 0
            ) {
                if (this.cnae.arValidacoes.length - 1 == this.intSegmento) {
                    let indexCnae = this.$props.form.cnaes.findIndex(cnae => {
                        return cnae.idcnae == this.cnae.idcnae;
                    });

                    if (this.$props.form.cnaes[++indexCnae]) {
                        this.changeCnae(this.$props.form.cnaes[indexCnae]);
                    } else {
                        let indexAba = this.$props.form.campos.findIndex(
                            aba => {
                                return aba.idAba == this.aba.idAba;
                            }
                        );

                        if (this.$props.form.campos[++indexAba]) {
                            this.$router.push({
                                name: "valores",
                                params: {
                                    slug: this.$props.form.campos[indexAba]
                                        .slug_rota
                                }
                            });
                        } else {
                            this.$router.push({
                                name: "Comparativo"
                            });
                            //alert("fim dos campos");
                        }
                    }
                } else {
                    this.intSegmento++;
                    this.changeMes(0);

                    //this.intMes = 0;
                }
                this.arMesesReplicar = [];
            } else {
                //this.intMes++;
                this.changeMes(this.intMes + 1);
            }
        },
        voltar() {
            if (this.intMes == 0) {
                if (this.intSegmento == 0) {
                    let indexCnae = this.$props.form.cnaes.findIndex(cnae => {
                        return cnae.idcnae == this.cnae.idcnae;
                    });

                    if (this.$props.form.cnaes[--indexCnae]) {
                        this.changeCnae(this.$props.form.cnaes[indexCnae], 11);
                    } else {
                        let indexAba = this.$props.form.campos.findIndex(
                            aba => {
                                return aba.idAba == this.aba.idAba;
                            }
                        );

                        if (this.$props.form.campos[--indexAba]) {
                            this.$router.push({
                                name: "valores",
                                params: {
                                    slug: this.$props.form.campos[indexAba]
                                        .slug_rota
                                }
                            });
                        } else {
                            this.$router.push({
                                name: "parametros"
                            });
                        }
                    }
                } else {
                    this.intSegmento--;
                    //this.intMes = 11;
                    this.changeMes(11);
                }
            } else {
                //this.intMes--;
                this.changeMes(this.intMes - 1);
            }
        },
        selecionaTodosMeses() {
            this.$nextTick(() => {
                if (this.arMeses.length == this.arMesesReplicar.length) {
                    this.arMesesReplicar = [];
                } else {
                    this.arMesesReplicar = this.arMeses.slice().map(mes => {
                        return mes.index;
                    });
                }
            });
        },
        verificaUltimaAba() {
            if (
                this.aba.slug_rota === "outras_despesas_operacionais" &&
                this.intMes == 11 &&
                this.indexCnae == this.aba.arCnaes.length - 1
            )
                this.txtBotaoAvancar = "Ir para os resultados";
            else this.txtBotaoAvancar = "Avançar";
        },
        replicar() {
            const arBlocos = this.lodash.cloneDeep(
                this.cnae.arValidacoes[this.intSegmento].arMeses[this.intMes]
                    .arBlocos
            );

            let TempDeducoes = [];

            this.cnae.arValidacoes[this.intSegmento].arMeses.forEach(
                (mes, index) => {
                    if (
                        index != this.indexMes &&
                        this.arMesesReplicar.indexOf(index) >= 0
                    ) {
                        this.cnae.arValidacoes[this.intSegmento].arMeses[
                            index
                        ].arBlocos = this.lodash.cloneDeep(arBlocos);

                        this.$props.form.campos.forEach(abas => {
                            let tmpCnae = abas.arCnaes[this.indexCnae];
                            let tmpArBlocos = this.lodash.cloneDeep(
                                tmpCnae.arValidacoes[this.intSegmento].arMeses[
                                    index
                                ].arBlocos
                            );
                            tmpArBlocos.forEach(bloco => {
                                bloco.arCampos.forEach(campo => {
                                    this.setEscopoReplicar(
                                        campo.valor,
                                        index,
                                        campo.id
                                    );

                                    if (campo.camposDetalhamentoDeducoes) {
                                        TempDeducoes = this.verificaCamposDeducao(
                                            campo
                                        );
                                        this.somaCampoDeducoes(
                                            TempDeducoes,
                                            index
                                        );
                                    }
                                });
                            });

                            this.abrirCamposDeducoes = false;

                            this.setFormula(
                                index,
                                this.$props.form.escopo[this.cnae.idcnae][
                                    this.intSegmento
                                ][index]
                            );
                        });
                    }
                }
            );
            this.changeMes(this.arMeses.length - 1);

            Object.noty.success("Valores replicados com sucesso");
            this.arMesesReplicar = [];
        },
        setFormula(intMes, pEscopo = "") {
            let escopo = this.$props.form.escopo[this.cnae.idcnae][
                this.intSegmento
            ][this.intMes];

            if (pEscopo != "") {
                escopo = pEscopo;
            }

            this.$props.form.campos.forEach(aba => {
                aba.arCnaes[this.indexCnae].arValidacoes[
                    this.intSegmento
                ].arMeses[intMes].arBlocos.forEach(bloco => {
                    bloco.arCampos.forEach(campo => {
                        if (campo.formula) {
                            if (
                                (campo.chCampoEditavel == "C.A.E" &&
                                    !campo.valorManual) ||
                                campo.chCampoEditavel != "C.A.E"
                            ) {
                                let vlrResultado = parseFloat(
                                    VueMathjs.evaluate(
                                        campo.formula.str_formula,
                                        escopo
                                    )
                                ).toFixed(2);

                                campo.valor = vlrResultado;

                                if (campo.blUtilizar == 0) {
                                    vlrResultado = 0;
                                }

                                this.$set(
                                    escopo.C,
                                    campo.id,
                                    parseFloat(vlrResultado).toFixed(2)
                                );
                                if (
                                    campo.nota_cmv_negativo !== null &&
                                    vlrResultado < 0 &&
                                    this.$route.params.slug ==
                                        "CUSTOS_DOS_BENS_E_SERVICOS"
                                ) {
                                    //money_negative //

                                    Object.noty.warning(
                                        campo.nota_cmv_negativo.nota
                                    );
                                }
                            }
                        }
                    });
                });
            });
        },
        setEscopoReplicar(valor, mes, idCampo) {
            const obUnmask = new Unmask();
            let unmaskValue = parseFloat(obUnmask.unmask(valor)).toFixed(2);

            this.$props.form.escopo[this.cnae.idcnae][this.intSegmento][mes].C[
                idCampo
            ] = unmaskValue; // * 100;
        },
        setEscopoManual(valor, idCampo) {
            this.$props.form.escopo[this.cnae.idcnae][this.intSegmento][
                this.intMes
            ].C[idCampo] = valor; // * 100;
        },
        setEscopo(event, idCampo) {
            const obUnmask = new Unmask();
            let unmaskValue = parseFloat(
                obUnmask.unmask(event.target.value)
            ).toFixed(2);

            this.$props.form.escopo[this.cnae.idcnae][this.intSegmento][
                this.intMes
            ].C[idCampo] = unmaskValue; // * 100;
        },
        abrirDialogEditar(campo) {
            this.obCampoEditar = {
                texto: campo.nota_altera_valor.nota,
                campo: campo
            };
        },
        fecharDialogEditar(blOpcao) {
            if (blOpcao == true) {
                this.obCampoEditar.campo.valorManual = true;
            }

            this.obCampoEditar = null;
        },
        fecharDialog() {
            this.dadosModal.abrir = false;
        },
        voltarCalculoManual(campo) {
            campo.valorManual = false;

            this.setFormula(this.intMes);
        }
    }
};
