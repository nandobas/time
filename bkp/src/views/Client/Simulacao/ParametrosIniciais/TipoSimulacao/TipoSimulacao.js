import Meses from "../../../../../models/Meses";

export default {
    props: ["form", "arOpcoes"],
    components: {},
    data() {
        return {
            obMeses: new Meses()
        };
    },
    mounted() {},
    methods: {
        zerarRbt12(blZerarMes = true) {
            if (blZerarMes) {
                this.$props.form.tipoSimulacao.intMesInicio = 0;
            }

            this.$props.form.blLiberarCampos = false;
            this.$props.form.rbt12 = null;
            this.$emit("atualizarMenu");
        }
    }
};
