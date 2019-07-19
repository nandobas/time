import Api from "@/services/api.js"

export default {
	name: "Home",
	components: {},
	data() {
		return {
			blSalvandoTime: false
		}
	},
	mounted() {


	},
	methods: {

		salvarTime() {

			this.blSalvandoTime = true;
			this.$root.$api.post('salvarTime', this.form).then(

				(response) => {
					this.form.id = response.retorno.id;

					localStorage.setItem('_simulacao', JSON.stringify(this.form));

					setTimeout(() => {
						this.blSalvandoTime = false;
					}, 1000);
				}
			);
		}

	}
}