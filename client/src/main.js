import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.use(ElementUI);
Vue.config.productionTip = false;

import Loading from "@/components/Loading.vue"
Vue.component('loading', Loading)


Vue.filter('setTime', function (v) {
  let newZDate = new Date(Number(v));
  let strTime = `${newZDate.getFullYear()}-${(newZDate.getMonth() + 1) > 9 ? (newZDate.getMonth() + 1) : '0' + (newZDate.getMonth() + 1)}-${newZDate.getDate() > 9 ? newZDate.getDate() : '0' + newZDate.getDate()}`;
  return strTime;
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
