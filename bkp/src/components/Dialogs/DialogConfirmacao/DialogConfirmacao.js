import Api from "@/services/api.js";
import Meses from "../../../models/Meses";

export default {
    props: ["abrir", "form", "arOpcoes", "blLoadingCampos"],
    components: {},
    data() {
        return {
            loading:false,
            abrirModal: false,
            obMeses: new Meses(),
            arCnaes: []
        };
    },
    watch: {
        abrir: function() {
            this.abrirModal = this.$props.abrir;
        },
        abrirModal: function() {
            if (this.abrirModal == false) this.fechar();
        }
    },
    created() {
        if (this.$props.abrir.origem == "iniciada")
            this.arCnaes = this.$props.form.campos[0].arCnaes;
    },
    methods: {
        fechar(p_origem) {
            this.$emit("fechar", p_origem);
        },
        refazer() {
            this.$emit("refazer");
        },
        verificaIncidenciaIpiIss(idcnae) {
            return this.$props.form.cnaesIncidenciaIpiIss.some(
                cnae => cnae.idcnae == idcnae
            );
        },
        confirmar() {
            this.$emit("confirmar");
        }
    }
};
