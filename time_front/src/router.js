import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
		path: '/',
		name: 'home',
		component: () => import('./views/Client/Home/Home.vue')
	},{
		path: '/clubes/',
		name: 'clubes',
		component: () => import('./views/Client/Clubes/Clubes.vue')
	},{
		path: '/jogadores/',
		name: 'jogadores',
		component: () => import('./views/Client/Jogadores/Jogadores.vue')
	}]
})