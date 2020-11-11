import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        };
    },
    routes: [
        {
            path: "/",
            name: "home",
            component: () =>
                import(
                    /* webpackChunkName: "about" */ "./views/Client/Home/Home.vue"
                )
        },
        {
            path: "/admin",
            component: () => import("./views/Admin/Admin/Admin.vue"),
            children: [
                {
                    path: "templates",
                    name: "templates",
                    component: () =>
                        import("./views/Admin/ListaTemplate/ListaTemplate.vue")
                },
                {
                    path: "templates/:id",
                    name: "template",
                    component: () =>
                        import("./views/Admin/Template/Template.vue")
                },
                {
                    path: "mapas",
                    name: "mapas",
                    component: () =>
                        import("./views/Admin/ListaMapas/ListaMapas.vue")
                },
                {
                    path: "mapas/:id",
                    name: "mapa",
                    component: () =>
                        import("./views/Admin/Mapa/Mapa.vue")
                }
            ]
        },
        {
            path: "/simulacao",
            component: () => import("./views/Client/Layout/Layout.vue"),
            children: [
                {
                    path: "/",
                    name: "homeLogado",
                    component: () =>
                        import("./views/Client/HomeLogado/HomeLogado.vue")
                },
                {
                    path: "ecf",
                    name: "ecf",
                    component: () =>
                        import("./views/Client/ImportarECF/ImportarECF.vue")
                },
                {
                    path: "parametros",
                    name: "parametros",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/ParametrosIniciais/ParametrosIniciais.vue"
                        )
                },
                {
                    path: "receitas-ano-anterior",
                    name: "rbt12-anterior",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Campos/Rbt12/Rbt12.vue"
                        )
                },
                {
                    path: "valores/:slug",
                    name: "valores",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Campos/Valores/Valores.vue"
                        )
                },
                {
                    path: "resultado/simples-nacional",
                    name: "simples_nacional",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Resultado/SimplesNacional/SimplesNacional.vue"
                        )
                },
                {
                    path: "resultado/lucro-presumido",
                    name: "lucro-presumido",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Resultado/Presumido/Presumido.vue"
                        )
                },
                {
                    path: "resultado/lucro-real",
                    name: "lucro-real",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Resultado/Real/Real.vue"
                        )
                },
                {
                    path: "resultado/comparativo",
                    name: "Comparativo",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Resultado/Comparativo/Comparativo.vue"
                        )
                },
                {
                    path: "resultado/impressao",
                    name: "Impressão",
                    component: () =>
                        import(
                            "./views/Client/Simulacao/Resultado/Impressao/Impressao.vue"
                        )
                }
            ]
        },
        {
            path: "/validar-login/:id",
            name: "Login",
            component: () => import("./views/login/Login.vue")
        }
    ]
});
