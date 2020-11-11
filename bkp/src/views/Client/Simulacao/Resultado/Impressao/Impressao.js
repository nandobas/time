import Header from "@/components/Header/Header.vue";

export default {
    props: ["resultadoHtml", "form"],
    components: {
        Header
    },
    data() {
        return {
            calculou: false
        };
    },
    mounted() {
        setTimeout(() => {
            window.print();
        }, 100);
    },
    methods: {},
    computed: {}
};
