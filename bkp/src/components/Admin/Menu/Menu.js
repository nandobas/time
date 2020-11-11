export default {
    name: "admin-menu",
    data() {
        return {
            key: 0,
            strNomeUsuario: ""
        };
    },
    created() {
        this.setRoute();
    },
    watch: {
        $route(to, from) {
            this.setRoute();
        }
    },
    methods: {
        setRoute() {
            this.strRoute = this.$route.name;
            this.key = new Date().getTime();
        }
    }
};
