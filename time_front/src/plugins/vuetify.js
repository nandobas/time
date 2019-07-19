import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import pt from 'vuetify/es5/locale/pt'

Vue.use(Vuetify, {
    options: {
        customProperties: true,
        theme: false,
        themeCache: {
            get: () => ''
        }
    },
    iconfont: 'mdi',
    lang: {
        locales: {
            pt
        },
        current: 'pt'
    },
    theme: {
        primary: '#5e9eaa'
    },
    themeCache: {
        get: () => ''
    }
})