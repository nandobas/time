import Header from "@/components/Header/Header.vue";
import Meses from "@/models/Meses";
import Unmask from "@/services/Unmask.js";
import SimplesNacional from "../SimplesNacional/SimplesNacional.vue";
import Real from "../Real/Real.vue";
import Presumido from "../Presumido/Presumido.vue";
import VueMd5 from "js-md5/src/md5.js";

export default {
    props: ["form", "intPage", "preResult"],
    components: {
        Header,
        SimplesNacional,
        Real,
        Presumido
    },
    data() {
        return {
            arCnaes: { sn: [], lp: [], lr: [] },
            arMensagens: [],
            arMeses: "",
            intIndexCnae: 0,
            intIndexSegmento: 0,
            calculou: false
        };
    },
    watch: {
        preResult: function() {
            console.log("...alterou preResult");
            if (
                this.$props.preResult.result_sn !== "" &&
                this.$props.preResult.result_real !== "" &&
                this.$props.preResult.result_lp !== ""
            ) {
                console.log("calculou");

                this.obterMeses();
                this.calcular();
                this.calculou = true;
            }
        }
    },
    mounted() {
        let requisicao_hash_sn = "";
        let requisicao_hash_real = "";
        let requisicao_hash_lp = "";

        let requisicao_hash = VueMd5(
            JSON.stringify({
                rbt12: this.$props.form.rbt12,
                abas: this.$props.form.campos,
                cnaes: this.$props.form.cnaes,
                tipoSimulacao: this.$props.form.tipoSimulacao,
                cnaesIncidenciaIpiIss: this.$props.form.cnaesIncidenciaIpiIss
            })
        );
        if (localStorage.getItem("sn_hash")) {
            requisicao_hash_sn = localStorage.getItem("sn_hash");
        }
        if (localStorage.getItem("real_hash")) {
            requisicao_hash_real = localStorage.getItem("real_hash");
        }
        if (localStorage.getItem("lp_hash")) {
            requisicao_hash_lp = localStorage.getItem("lp_hash");
        }

        if (
            requisicao_hash_sn !== requisicao_hash &&
            this.$props.preResult.result_sn != ""
        ) {
            this.$refs.calcular_sn.calcular();
        }
        if (
            requisicao_hash_real !== requisicao_hash &&
            this.$props.preResult.result_real != ""
        ) {
            this.$refs.calcular_real.calcular();
        }
        if (
            requisicao_hash_lp !== requisicao_hash &&
            this.$props.preResult.result_lp != ""
        ) {
            this.$refs.calcular_lp.calcular(true);
        }
        if (
            (requisicao_hash_sn == requisicao_hash &&
                requisicao_hash_real == requisicao_hash &&
                requisicao_hash_lp == requisicao_hash) ||
            this.$props.preResult.result_real != ""
        ) {
            this.obterMeses();
            this.calcular();
            this.calculou = true;
        }
    },
    methods: {
        setPreResult(preResult) {
            this.$emit("setPreResult", preResult);
        },
        obterMeses() {
            let obMeses = new Meses();
            let intMesInicio =
                this.$props.form.tipoSimulacao.intTipoSimulacao == 1
                    ? this.$props.form.tipoSimulacao.intMesInicio
                    : 0;

            this.arMeses = obMeses.obterPorInicio(intMesInicio);
        },
        calcular() {
            this.arCnaes["sn"] = this.$props.preResult.result_sn;
            this.arCnaes["lp"] = this.$props.preResult.result_lp;
            this.arCnaes["lr"] = this.$props.preResult.result_real;
            this.calculou = true;
        },
        formatarValor(valor) {
            if (!valor) return 0;

            valor = valor.toFixed(2);

            return Number(valor)
                .toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    style: "currency",
                    currency: "BRL"
                })
                .slice(3);
        },
        verificarMostrarCampo(strCampo) {
            if (
                this.arCnaes["sn"][this.intIndexCnae].arValidacoes[
                    this.intIndexSegmento
                ].arReceitas[0].simplesNacional.EXISTE_CAMPO[strCampo] != true
            ) {
                return false;
            }

            return true;
        },
        obterValor(receita, strCampo) {
            strCampo = strCampo.toLowerCase();

            let valor = 0;
            let unmask = new Unmask();

            if (receita.simplesNacional.dados["ate_mi"]) {
                valor += unmask.unmask(
                    receita.simplesNacional.dados["ate_mi"].linhaValor[strCampo]
                        .vlr_tributo
                );
            }

            if (receita.simplesNacional.dados["ate_me"]) {
                valor += unmask.unmask(
                    receita.simplesNacional.dados["ate_me"].linhaValor[strCampo]
                        .vlr_tributo
                );
            }

            return this.formatarValor(valor);
        },
        getTotalAno(regime) {
            let unmask = new Unmask();
            let flTotal = 0;
            if (regime == "SN") {
                let receitas = this.filtrarReceitasSn;
                receitas.forEach(receita => {
                    flTotal =
                        flTotal +
                        parseFloat(unmask.unmask(this.calcularTotal(receita)));
                });
            }
            if (regime == "LR") {
                let receitas = this.filtrarReceitasLr;
                receitas.forEach(receita => {
                    flTotal = flTotal + parseFloat(unmask.unmask(receita));
                });
            }
            if (regime == "LP") {
                let receitas = this.filtrarReceitasLp;
                receitas.forEach(receita => {
                    flTotal = flTotal + parseFloat(unmask.unmask(receita));
                });
            }
            return this.formatarValor(flTotal);
        },
        getTotalTrimestre(regime, trimestre) {
            let unmask = new Unmask();
            let flTotal = 0;
            let ini = 0;
            let fim = 2;

            if (trimestre == 2) {
                ini = 3;
                fim = 5;
            }
            if (trimestre == 3) {
                ini = 6;
                fim = 8;
            }
            if (trimestre == 4) {
                ini = 9;
                fim = 11;
            }

            if (regime == "SN") {
                let receitas = this.filtrarReceitasSn;
                receitas.forEach((receita, mes) => {
                    if (mes >= ini && mes <= fim)
                        flTotal =
                            flTotal +
                            parseFloat(
                                unmask.unmask(this.calcularTotal(receita))
                            );
                });
            }
            if (regime == "LR") {
                let receitas = this.filtrarReceitasLr;
                receitas.forEach((receita, mes) => {
                    if (mes >= ini && mes <= fim)
                        flTotal = flTotal + parseFloat(unmask.unmask(receita));
                });
            }
            if (regime == "LP") {
                let receitas = this.filtrarReceitasLp;
                receitas.forEach((receita, mes) => {
                    if (mes >= ini && mes <= fim)
                        flTotal = flTotal + parseFloat(unmask.unmask(receita));
                });
            }
            return this.formatarValor(flTotal);
        },
        calcularTotal(receita) {
            let arKeys = [];
            let unmask = new Unmask();

            if (receita.simplesNacional.dados.ate_mi) {
                arKeys = Object.keys(
                    receita.simplesNacional.dados.ate_mi.linhaValor
                );
            } else if (receita.simplesNacional.dados.ate_me) {
                arKeys = Object.keys(
                    receita.simplesNacional.dados.ate_me.linhaValor
                );
            } else if (receita.simplesNacional.dados.acima_mi) {
                arKeys = Object.keys(
                    receita.simplesNacional.dados.acima_mi.linhaValor
                );
            } else if (receita.simplesNacional.dados.acima_me) {
                arKeys = Object.keys(
                    receita.simplesNacional.dados.acima_me.linhaValor
                );
            }

            let total = 0;

            if (receita.simplesNacional.arr_linha_final) {
                return receita.simplesNacional.arr_linha_final["total"]
                    .vlr_tributo;
            }
            arKeys.forEach(key => {
                if (key != "total") {
                    if (receita.simplesNacional.dados.ate_mi) {
                        total += unmask.unmask(
                            receita.simplesNacional.dados.ate_mi.linhaValor[key]
                                .vlr_tributo
                        );
                    }
                    if (receita.simplesNacional.dados.ate_me) {
                        total += unmask.unmask(
                            receita.simplesNacional.dados.ate_me.linhaValor[key]
                                .vlr_tributo
                        );
                    }
                    if (receita.simplesNacional.dados.acima_mi) {
                        total += unmask.unmask(
                            receita.simplesNacional.dados.acima_mi.linhaValor[
                                key
                            ].vlr_tributo
                        );
                    }
                    if (receita.simplesNacional.dados.acima_me) {
                        total += unmask.unmask(
                            receita.simplesNacional.dados.acima_me.linhaValor[
                                key
                            ].vlr_tributo
                        );
                    }
                }
            });

            return this.formatarValor(total);
        },
        iniciarMesesTotal() {
            const intMeses =
                this.arCnaes["sn"][0].arValidacoes[0].ultimo_mes_receita + 1;

            let arMeses = [];

            for (let i = 0; i < intMeses; i++) {
                arMeses[i] = 0;
            }

            return arMeses;
        },
        iniciarVariaveisTotal() {
            return {
                IRPJ: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                CSLL: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                PIS: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                COFINS: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                IPI: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                ISS: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                ICMS: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                CPP: { blMostrar: false, arMeses: this.iniciarMesesTotal() },
                TOTAL: { blMostrar: true, arMeses: this.iniciarMesesTotal() }
            };
        }
    },
    computed: {
        filtrarReceitasSn() {
            return this.arCnaes["sn"][this.intIndexCnae].arValidacoes[
                this.intIndexSegmento
            ].arReceitas;
        },
        filtrarReceitasLr() {
            let arTotal = [];

            for (let i = 1; i <= 12; i++) {
                let obReceita = this.arCnaes["lr"].arReceitas.acumulado;

                let vlrTotal = 0;
                vlrTotal += obReceita.irpj
                    ? parseFloat(obReceita.irpj.irpjTotal.mensal[i])
                    : 0;
                vlrTotal += obReceita.csll
                    ? parseFloat(obReceita.csll.csll.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.pis
                    ? parseFloat(obReceita.indiretos.pis.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.cofins
                    ? parseFloat(obReceita.indiretos.cofinsTotal.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.ipi
                    ? parseFloat(obReceita.indiretos.ipi.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.iss
                    ? parseFloat(obReceita.indiretos.iss.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.icms
                    ? parseFloat(obReceita.indiretos.icms.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.cpp
                    ? parseFloat(obReceita.indiretos.cpp.mensal.mensal[i])
                    : 0;
                arTotal.push(this.formatarValor(vlrTotal));
            }

            return arTotal;
        },
        filtrarReceitasLp() {
            let arTotal = [];

            for (let i = 1; i <= 12; i++) {
                let obReceita = this.arCnaes["lp"].arReceitas.acumulado;

                let vlrTotal = 0;
                vlrTotal += obReceita.irpj
                    ? parseFloat(obReceita.irpj.irpj.mensal[i])
                    : 0;
                vlrTotal += obReceita.csll
                    ? parseFloat(obReceita.csll.csll.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.pis
                    ? parseFloat(obReceita.indiretos.pis.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.cofins
                    ? parseFloat(obReceita.indiretos.cofins.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.ipi
                    ? parseFloat(obReceita.indiretos.ipi.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.iss
                    ? parseFloat(obReceita.indiretos.iss.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.icms
                    ? parseFloat(obReceita.indiretos.icms.mensal[i])
                    : 0;
                vlrTotal += obReceita.indiretos.cpp
                    ? parseFloat(obReceita.indiretos.cpp.mensal[i])
                    : 0;

                arTotal.push(this.formatarValor(vlrTotal));
            }

            return arTotal;
        }
    }
};
