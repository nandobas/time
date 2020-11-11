<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script>
import Api from "@/services/api.js";
export default {
    name: "App",
    components: {},
    data() {
        return {
            //
            isSetToken: false
        };
    },
    watch: {
        $route(to, from) {
            if (
                window.location.pathname.indexOf("/parametros") === -1 &&
                window.location.pathname.indexOf("/resultado") === -1
            ) {
                localStorage.removeItem("_simulacao");
            }
        }
    },
    mounted: function() {
        Object.noty = this.$noty;

        this.$root.$api = new Api();
        if (localStorage.getItem("token")) {
            this.isSetToken = true;
            this.$root.$api
                .getUrlCompleta(
                    "http://www.econeteditora.com.br/acesso_spt_login.php?id=" +
                        localStorage.getItem("HASH_USER")
                )
                .then(response => {
                    if (response.blLogado) {
                        if (
                            window.location.pathname.indexOf("/simulacao") === -1 && window.location.pathname.indexOf("/admin") === -1
                        ) {
                            console.log('aqui');
                            this.$router.push({
                                name: "homeLogado"
                            });
                            /*
							this.$router.replace({
							    path: '/simulacao'
							});
							*/
                        }
                    } else {
                        localStorage.removeItem("token");
                        localStorage.removeItem("nome_usuario");
                        localStorage.removeItem("HASH_USER");
                        this.$router.push({
                            path: "/"
                        });
                    }
                });
        } else if (
            window.location.pathname.indexOf("/erro/") === -1 &&
            window.location.pathname.indexOf("/validar") === -1
        ) {
            this.$router.push({
                path: "/"
            });
        }
    }
};
</script>