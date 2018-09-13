console.log("loading index.js")

/*
  Create componets for Vue instance to use.
*/
Vue.component('todo-item', {
  // The todo-item component now accepts a
  // "prop", which is like a custom attribute.
  // This prop is called todo.
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

/*
  Create Root instance of Vue.
*/

const vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    groceryList: [
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Test' }
    ],
    // initialize property so it can be reactive later
    tweets: []
  },
  created: function () {
    // created hook can be used to run code after an instance is created
    // `this` points to the vm instance
    console.log('message is: ' + this.message)
  },
  methods: {
    reverseMessage: function() {
      this.message = this.message.split('').reverse().join('')
    }

  }
})

// $watch is an instance method
vm.$watch('message', function (newValue, oldValue) {
  // This callback will be called when `vm.message` changes
})
