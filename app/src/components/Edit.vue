<template>
<div class="editor">
    <b-card>
    <div>ID:{{id}}</div>
    <b-form-group
              id="input-group-1"
              label="内容"
              label-cols="4" label-cols-lg="2"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="taskBody"
                type="text"
                required
              ></b-form-input>
            </b-form-group>
    <b-form-group
              id="input-group-2"
              label="ステータス"
              label-cols="4" label-cols-lg="2"
              label-for="input-2"
            >
              <b-button
                id="input-2"
                type="text"
                @click="doChangeState"
              >{{ labels[taskState] }}</b-button>
    </b-form-group>
    <b-form-group id="input-group-3" label="期日" label-for="input-3" label-cols="4" label-cols-lg="2">
        <vuejs-datepicker id="input-3" v-model="deadline" :format="customFormatter" @closed="pickerClosed" :language="ja"></vuejs-datepicker>
    </b-form-group>

    <b-form-group id="input-group-4" label="予定工数" label-for="input-4" label-cols="4" label-cols-lg="2">
        <b-form-input
                id="input-4"
                v-model="estimatedTime"
                type="number"
                required
              ></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-5" label="実績工数" label-for="input-5" label-cols="4" label-cols-lg="2">
        <b-form-input
                id="input-5"
                v-model="actualTime"
                type="number"
                required
              ></b-form-input>
    </b-form-group>

    <b-button-group block>
        <b-button  @click="save" variant="primary">更新</b-button>
        <b-button  @click="remove" variant="danger">削除</b-button>
    </b-button-group>
    </b-card>
</div>
</template>
<script>
import firebase from 'firebase'
import vuejsDatepicker from 'vuejs-datepicker';
import {ja} from 'vuejs-datepicker/dist/locale';
import moment from "moment";
export default{
    name:"edit",
    data () {
        return {
            user:{},
            id: this.$route.params["id"],
            taskBody: '',
            taskState: 0,
            options: [
                { value: -1, label: 'すべて' },
                { value: 0,  label: '作業中' },
                { value: 1,  label: '完了' }
            ],
            DatePickerFormat: 'yyyy-MM-dd',
            ja:ja,
            deadline: '',
            estimatedTime: 0,
            actualTime: 0
        }
    },
    components: {
        'vuejs-datepicker':vuejsDatepicker
    },
    mounted () {
        let id = this.$route.params["id"];
        let task = this.$store.state.todos.slice().find(task=>task.id==id);
        this.taskBody = task.task;
        this.taskState = task.state;
        this.deadline = task.deadline;
        this.actualTime = task.actualTime;
        this.estimatedTime = task.estimatedTime;
    },
    created() {
        firebase.auth().onAuthStateChanged(user => {
          this.user = user ? user : {}
        });
    },
    computed:{
        task: function(){
            let id = this.$route.params["id"];
            return this.$store.state.todos.find(task => task.id == id);
        },
        labels: function() {
            return this.options.reduce(function(a, b) {
               return Object.assign(a, { [b.value]: b.label })
            }, {})
        }
    },
    methods:{
        // タスク更新
        save: function(){
            var taskId = this.$route.params["id"];
            var task = this.$store.state.todos.find(task => task.id == taskId);
            this.$store.commit("update", {
                id: this.$route.params["id"],
                task: this.taskBody,
                user_id: this.user.uid,
                state: this.taskState,
                deadline: this.deadline,
                estimatedTime: this.estimatedTime,            
                actualTime: task.actualTime + parseInt(this.actualTime)
            });
            this.$router.push("/todo")
        },
        // タスク削除
        remove: function(){
            this.$store.commit("remove", this.$route.params["id"]);
            this.$router.push("/todo");
        },
        // ステータス更新
        doChangeState: function() {
            this.taskState = this.taskState ? 0 : 1
        },
                // Datepicker日付フォーマット指定
        customFormatter(date) {
          return moment(date).format('YYYY/MM/DD');
        },
        // カレンダーが閉じられた時にフォーマッター適用
        pickerClosed() {
          if(this.deadline){
            this.deadline = moment(this.deadline).format('YYYY/MM/DD');
          }
        }
    }
};
</script>
<style scoped>
.remove{
    background-color: transparent;
    color: #f33;
    border: none;
}
</style>