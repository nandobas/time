import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
import pt from "vuetify/es5/locale/pt";

Vue.use(Vuetify, {
    customProperties: true,
    theme: {
        themes: {
            light: {
                primary: "#5e9eaa"
            }
        }
    },

    iconfont: "mdi",
    lang: {
        locales: {
            pt
        },
        current: "pt"
    },
    theme: {
        primary: "#5e9eaa"
    },
    themeCache: {
        get: () => ""
    }
});
