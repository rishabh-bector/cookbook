import Vue from "vue";
import App from "./App.vue";
import { VueSpinners } from '@saeris/vue-spinners'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(VueMaterial)
Vue.use(VueSpinners);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
