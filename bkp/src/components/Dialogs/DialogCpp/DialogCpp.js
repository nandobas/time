export default {
    props: ["abrir", "form"],
    components: {},
    data() {
        return {
            abrirModal: false,
            idCnaeFuncionarios: "",
            x: null,
            disableCampo: false,
            valorFap: "",
            naoSabeInformar: false
        };
    },
    watch: {
        naoSabeInformar: function(){
            if(this.naoSabeInformar == true) {
                this.valorFap = "1,0000";
                this.disableCampo = true;
            }else {
                this.disableCampo = false;
            }
        },
        idCnaeFuncionarios: function(){
            if(this.idCnaeFuncionarios == null) {
                this.disableCampo = true;
                this.valorFap = "1,0000";
            }else {
                this.disableCampo = false;
            }
        },
        abrir: function() {
            this.abrirModal = this.$props.abrir;
            if (
                typeof this.$props.form.cppFuncionarios === "undefined" ||
                this.$props.form.cppFuncionarios === "null"
            ) {
                this.$props.form.cppFuncionarios = 0;
            }
        },
        abrirModal: function() {
            if (this.abrirModal == false) this.fechar();
        }
    },
    computed: {
        fapRules() {
            return [
                v => !!v || "FAP precisa ser preenchido",
                v =>
                    (v.replace(",",".") >= 0.5 && v.replace(",",".") <= 2) ||
                    "Valor do FAP precisa ser entre 0,5000 e 2,0000"
            ];
        },

        cppFuncionariosRules() {
            return [v => v == 0 || "Selecione um CNAE"];
        }
    },
    methods: {
        fechar() {
            this.$emit("fechar");
        },
        confirmar() {
            let erro = 0;
            if (this.$props.form.fap == 1) {
                let fap = this.valorFap;
                if (fap < 0.5 || fap > 2 || this.fap == 0) {
                    erro = erro + 1;
                } else {
                    this.$props.form.valorFap = this.valorFap;
                }
            } else {
                this.$props.form.valorFap = [];
            }
            if (this.$props.form.cppFuncionarios != 0) {
                if (this.idCnaeFuncionarios == "") {
                    erro = erro + 1;
                } else {
                    this.$props.form.idCnaeFuncionarios = this.idCnaeFuncionarios;
                }
            } else {
                this.$props.form.idCnaeFuncionarios = [];
            }
            if (erro == 0) {
                //console.log('passou');
                this.$emit("confirmar");
            }
        },
        confereFap() {
            if(this.valorFap.length < 6 && this.valorFap != "") {
                let l = this.valorFap.length;
                for(let i = 0; i< (6-l);i++) {
                    this.valorFap = this.valorFap + "0";
                }
            }
            let fap = this.valorFap.replace(",", ".");
            if (fap >= 0.5 && fap <= 2) {
            } else {
            }
        }
    }
};
