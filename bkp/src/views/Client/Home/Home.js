import Api from "@/services/api.js"

export default {
    name: "Home",
    components: {},
    data() {
        return {
            blLoginAndamento : false
        }
    },
    mounted() {},
    methods: {
        verificarLogin253() {
            this.blLoginAndamento = true;
            /*new Api().get('../../ValidarLogin/' + this.$route.params.id).then(response => {
                console.log(response);
            });*/
        }
    },
}