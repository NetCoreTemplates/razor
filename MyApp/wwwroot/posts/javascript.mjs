import { ref } from "vue"
import VueComponentGallery from "./components/VueComponentGallery.mjs"
import VueComponentLibrary from "./components/VueComponentLibrary.mjs"

/** Simple inline component examples */
const Hello = {
    template: `<b>Hello, {{name}}!</b>`,
    props: { name:String }
}
const Counter = {
    template: `<b @click="count++">Counter {{count}}</b>`,
    setup() {
        let count = ref(1)
        return { count }
    }
}
const Plugin = {
    template:`<div>
        <b @click="show=true">Open Modal</b>
        <ModalDialog v-if="show" @done="show=false">
            <div class="p-8">Hello @servicestack/vue!</div>
        </ModalDialog>
    </div>`,
    setup() {
        const show = ref(false)
        return { show }
    }
}

export default {
    components: {
        Hello,
        Counter,
        Plugin,
        VueComponentGallery,
        VueComponentLibrary,
    },
    install(app) {
    }
}
