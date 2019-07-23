import axios from 'axios';
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
            timeoutDownload:false
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
			let there = this;
            there.timeoutDownload = true;

            axios({
                url: process.env.VUE_APP_ROOT_API + 'gera_arquivo_csv',
                method: 'GET',
                responseType: 'blob', // important
              }).then((blob) => {

                there.timeoutDownload = false;
                
                const url = window.URL.createObjectURL(new Blob([blob.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.csv');
                document.body.appendChild(link);
                link.click();

            })
            .catch(function(error) {
                    console.log(error)
            });
		},
	}
}