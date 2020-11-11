import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueAxios from "vue-axios";
import VueNoty from "vuejs-noty";
import "./plugins/vuetify";
import "vuejs-noty/dist/vuejs-noty.css";
import money from "vuejs-money";
import VueLodash from "vue-lodash";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(money);
import VMoney from './services/directive'; //directive personalizada by Basilio
Vue.directive('money', VMoney);
Vue.use(VueLodash, {
	name: "lodash"
});
Vue.use(VueNoty, {
	timeout: 1500,
	progressBar: true,
	layout: "topCenter"
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");