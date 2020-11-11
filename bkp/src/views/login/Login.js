import router from "../../router";

export default {
	data() {
		return {
			token1: '',
			token2: '',
			token3: '',
			token4: '',
			erro: false,
			loading: true
		}
	},
	mounted() {
		this.limpaLS();
		/*if (!this.$route.params.id || (document.referrer.indexOf('www.econeteditora.com.br') == -1)) {
			window.location = "http://www.econeteditora.com.br";
		}*/
		this.$root.$api.get('../../api/ValidarLogin/' + this.$route.params.id).then(response => {
			let token = response.response.token;
			let nome_usuario = response.response.nome;
			localStorage.setItem('token', token);
			localStorage.setItem('nome_usuario', nome_usuario);
			localStorage.setItem('HASH_USER', this.$route.params.id);
			this.$root.$api.token = token;
			router.push({
				path: '/simulacao'
			});
		}).catch(
			((error) => {
				router.push({
					path: '/'
				});
			})
		);
	},
	methods: {
		limpaLS: function() {
			localStorage.removeItem('token');
			localStorage.removeItem('nome_usuario');
			localStorage.removeItem('HASH_USER');
		}
	}
}