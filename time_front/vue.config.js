module.exports = {
    publicPath: "/",
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/assets/css/style.scss";`
            }
        }
    }
}