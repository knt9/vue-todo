import Vue from 'vue'
import Vuex from 'vuex'
import createdPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createdPersistedState()],
    state: {
        todos: []
    },
    mutations: {
        save(state, task) {
            var max = 0;
            if (state.todos == null || state.todos.length == 0) {
                max = 0;
            } else {
                max = state.todos[state.todos.length - 1].id;
            }
            task.id = max + 1;
            task.state = 0;
            task.actualTime = 0;
            state.todos.push(task);
        },
        update(state, data) {
            var x = state.todos.find(todo => todo.id == data.id);
            x.task = data.task;
            x.state = data.state;
            x.deadline = data.deadline;
            x.estimatedTime = data.estimatedTime;
            x.actualTime = data.actualTime;
        },
        remove(state, id) {
            for (var i = 0; i < state.todos.length; i++) {
                if (state.todos[i].id == id) {
                    state.todos.splice(i, 1);
                }
            }
        }
    },
    actions: {}
})