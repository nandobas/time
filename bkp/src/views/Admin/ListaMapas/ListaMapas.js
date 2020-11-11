export default {
    
    data() {
        return {
            mapas: []
        }
    },

    created() {
        this.getMapas();
    },

    methods: {
        getMapas() {
            this.$root.$api.get("admin/mapas").then(response => {
                this.mapas = response.response.mapas;
            });
        },
    },
}