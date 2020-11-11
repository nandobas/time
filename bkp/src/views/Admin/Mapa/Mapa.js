export default {

    data() {
        return {
            id: null,
            loadingPage: true,
            loading:false,
            mapa: null,
            modalAdicionarCnae:false,
            cnaeMapa: [],
            novoCnae: {
                cnaes: ''
            }
        }
    },
    created() {
        this.id = this.$route.params.id;
        this.getMapa();
    },
    methods: {
        getMapa() {
            this.$root.$api.get("admin/mapa/" + this.id).then(response => {
                this.mapa = response.response.mapa;
                this.cnaeMapa = response.response.cnaes;
                this.loadingPage = false;
            });
        },

        submitCnaes() {
            this.loading = true;
            this.$root.$api.post("admin/mapa/adicionar_mapa_cnae",{
                idMapa: this.id,
                cnaes: this.novoCnae.cnaes
            }).then(response => {
                this.$router.go();
            });
        },

        removeCnae(index,idMapaCnae) {
            this.cnaeMapa.splice(index,1);

            this.$root.$api.post("admin/mapa/deletar_cnae_mapa",{
                idMapaCnae: idMapaCnae
            }).then(response => {
                console.log(response);
            });
        }
    },
}