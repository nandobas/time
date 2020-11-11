import Unmask from "@/services/Unmask.js";
import Padrao from "./Padrao.vue";

export default {
    name: "memoria_sn",
    props: ["arMeses", "arReceitas", "intUltimoMes"],
    components: {
        Padrao
    },
    data() {
        return {
            blEfeito: false,
            intMes: 0,
            quebra_coluna: false,
            arrFaixas: [],
            arrTipoReceitas: ["ate_mi", "acima_mi", "ate_me", "acima_me"]
        };
    },
    created() {
        let arMeses = this.$props.arMeses;
    },
    mounted() {
        this.montaFaixas();
    },
    methods: {
        montaFaixas() {
            this.arrFaixas = [];
            this.arReceitas[this.intMes].simplesNacional.header
                .info_aliq_efetiva;
            this.arrTipoReceitas.forEach(tipo_receita => {
                let receita = this.arReceitas[this.intMes].simplesNacional
                    .header.info_aliq_efetiva[tipo_receita];
                if (receita) {
                    let strFaixa = "";
                    switch (tipo_receita) {
                        case "acima_me":
                            strFaixa =
                                "Faixa da receita no mercado externo, acima do limite " +
                                receita.FAIXA;
                            break;
                        case "acima_mi":
                            strFaixa =
                                "Faixa da receita no mercado interno, acima do limite " +
                                receita.FAIXA;
                            break;
                        case "ate_me":
                            strFaixa =
                                "Faixa da receita no mercado externo, at&eacute; o limite " +
                                receita.FAIXA;
                            break;
                        case "ate_mi":
                            strFaixa =
                                "Faixa da receita no mercado interno, at&eacute; o limite " +
                                receita.FAIXA;
                            break;
                    }

                    this.arrFaixas.push({
                        FAIXA: strFaixa,
                        ALIQUOTA: receita.ALIQUOTA,
                        CALCULO: receita.CALCULO
                    });
                }
            });
        },
        quebraColuna() {
            let quebra_coluna = false;
            this.arrTipoReceitas.forEach(tipo_receita => {
                let receita = this.arReceitas[this.intMes].simplesNacional
                    .dados[tipo_receita];
                if (receita) {
                    quebra_coluna = receita.quebra_coluna;
                }
            });
            return quebra_coluna;
        },
        changeMes(indexMes) {
            this.intMes = indexMes;
            this.aplicarEfeito();
            this.montaFaixas();
        },
        aplicarEfeito() {
            this.blEfeito = true;

            setTimeout(() => {
                this.blEfeito = false;
            }, 1000);
        },
        verificarMostrarTributo(strTributo) {
            if (
                this.arReceitas[this.intMes].simplesNacional.dados.ate_mi &&
                !this.arReceitas[this.intMes].simplesNacional.dados.ate_mi
                    .linhaInfo[strTributo]
            )
                return false;
            if (
                this.arReceitas[this.intMes].simplesNacional.dados.acima_mi &&
                !this.arReceitas[this.intMes].simplesNacional.dados.acima_mi
                    .linhaInfo[strTributo]
            )
                return false;

            if (
                this.arReceitas[this.intMes].simplesNacional.dados.ate_me &&
                !this.arReceitas[this.intMes].simplesNacional.dados.ate_me
                    .linhaInfo[strTributo]
            )
                return false;

            return true;
        },
        somaTributos(strTributo) {
            const unmask = new Unmask();
            let valor = 0;

            if (this.verificarMostrarTributo(strTributo)) {
                valor = unmask.unmask(
                    this.arReceitas[this.intMes].simplesNacional
                        .arr_linha_final[strTributo].vlr_tributo
                );

                return Number(valor)
                    .toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        style: "currency",
                        currency: "BRL"
                    })
                    .slice(3);
            }
        },
        fechar() {
            this.$emit("fechar");
        }
    },
    computed: {
        arMesesFiltrado() {
            return this.$props.arMeses.slice(0, this.$props.intUltimoMes + 1);
        },
        totalTributos() {
            let arTotal = [];

            if (
                this.arReceitas[this.intMes].simplesNacional.dados.ate_mi &&
                this.arReceitas[this.intMes].simplesNacional.dados.ate_me
            ) {
                arTotal.push(this.somaTributos("total"));

                ["irpj", "csll", "cofins", "pis", "cpp", "ipi"].forEach(
                    strTributo => {
                        let valor = this.somaTributos(strTributo);

                        if (valor) {
                            arTotal.push(valor);
                        }
                    }
                );

                if (
                    this.arReceitas[this.intMes].simplesNacional.dados.ate_mi
                        .linhaValor.icms
                )
                    arTotal.push(this.somaTributos("icms"));

                if (
                    this.arReceitas[this.intMes].simplesNacional.dados.ate_mi
                        .linhaValor.iss
                )
                    arTotal.push(this.somaTributos("iss"));

                return arTotal;
            }

            return [];
        }
    }
};
