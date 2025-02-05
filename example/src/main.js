// Import Vue from 'vue' (this will import Vue 2)
import Vue from 'vue'

// Import the Vue 2 Composition API plugin
import VueCompositionAPI from '@vue/composition-api'

// Import the root component
import App from './App.vue'

// Install the Composition API plugin into Vue (required for Vue 2.6.x when using Composition API)
Vue.use(VueCompositionAPI)

/*
  Create a new Vue instance.
  In Vue 2, you render the root component using the render function.
  This replaces Vue 3's createApp() method.
*/
new Vue({
  // The render function creates a virtual node for App
  render: (h) => h(App),
}).$mount('#app') // Mount the Vue instance to the DOM element with id="app"
