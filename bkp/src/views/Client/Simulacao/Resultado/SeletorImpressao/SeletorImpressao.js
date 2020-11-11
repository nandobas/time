import Meses from "@/models/Meses";
import Unmask from "@/services/Unmask.js";

export default {
    name: "ComparativoAbas",
    props: ["arMeses", "arCnaes", "arAbasResultado", "intUltimoMes"],
    data() {
        return {
            intMes: 0,
            calculou: false,
            intIndexCnae: 0,
            intIndexSegmento: 0,
            vlMarcadas: [],
            mesMarcados: [],
            abaMarcadas: []
        };
    },
    mounted() {
        this.$props.arCnaes.forEach((c, intIndexCnae) => {
            let arr_cnae = {
                idcnae: c.idcnae,
                cnae: c.cnae,
                descricao: c.descricao,
                arValidacoes: []
            };
            this.arCnaes[intIndexCnae].arValidacoes.forEach(v => {
                arr_cnae.arValidacoes.push({
                    id: v.id,
                    texto_validacao: v.texto_validacao,
                    bl_selecionado: 1
                });
            });
            this.vlMarcadas.push(arr_cnae);
        });

        let arMesesFiltrado = this.$props.arMeses.slice(
            0,
            this.$props.intUltimoMes + 1
        );
        arMesesFiltrado.forEach(mes => {
            this.mesMarcados.push({
                label:
                    arMesesFiltrado.length > 6
                        ? mes.strAbreviacao
                        : mes.strNome,
                bl_selecionado: 1
            });
        });

        this.$props.arAbasResultado.forEach(aba => {
            this.abaMarcadas.push({
                label: aba,
                bl_selecionado: 1
            });
        });
    },
    methods: {
        setConfigImpressao() {
            let configImpressao = {
                vlMarcadas: this.vlMarcadas,
                mesMarcados: this.mesMarcados,
                abaMarcadas: this.abaMarcadas
            };
            this.$emit("setConfigImpressao", configImpressao);
        }
    },
    computed: {
        arMesesFiltrado() {
            return this.$props.arMeses.slice(0, this.$props.intUltimoMes + 1);
        }
    }
};
