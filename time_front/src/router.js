import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			name: 'home',
			component: () => import( /* webpackChunkName: "about" */ './views/Client/Home/Home.vue')
		},
		{
			path: '/simulacao',
			component: () => import('./views/Client/Layout/Layout.vue'),
			children: [{
					path: '/',
					name: 'homeLogado',
					component: () => import('./views/Client/HomeLogado/HomeLogado.vue'),
				},
				{
					path: 'parametros',
					name: 'parametros',
					component: () => import('./views/Client/ParametrosIniciais/ParametrosIniciais.vue')
				},
				{
					path: 'ecf',
					name: 'ecf',
					component: () => import('./views/Client/ImportarECF/ImportarECF.vue')
				}
			]
		},
		{
			path: '/validar-login/:id',
			name: 'Login',
			component: () => import('./views/login/Login.vue')
		}
	]
})