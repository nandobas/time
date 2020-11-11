export default {
    
    data() {
        return {
            templates: []
        }
    },

    created() {
        this.getTemplates();
    },

    methods: {
        getTemplates() {
            this.$root.$api.get("admin/templates").then(response => {
                this.templates = response.response.templates;
            });
        },
    },
}