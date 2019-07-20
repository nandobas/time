export default {
    name: "Layout",
    props: {
        titulo: {
            type: String,
            required: true
        }
    },
    components: {

    },
    data() {
        return {
        }
    },
    mounted() {
    },
	methods: {

		abreFormClubes(){
			this.$router.push({
				name: 'clubes'
			});
		},
		abreFormJogadores(){
			this.$router.push({
				name: 'jogadores'
			});
		},
		downloadFile(){
			alert('...download');
		},
	}
}