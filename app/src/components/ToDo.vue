<template>
    <div>
      <b-card bg-variant="light">
      <b-card bg-variant="light" title="新しいタスク">        
        <b-form @submit.prevent="doAdd" >
            <b-form-group
              id="input-group-1"
              label="内容"
              label-cols="4" label-cols-lg="1"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="newtask"
                type="text"
                required
                placeholder="Enter Task"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="予定工数" label-for="input-2" label-cols="4" label-cols-lg="1">
              <b-form-input
                id="input-2"
                v-model="estimatedTime"
                type="number"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-3" label="期日" label-for="input-3" label-cols="4" label-cols-lg="1">
               <vuejs-datepicker id="input-3" v-model="deadline" :format="customFormatter" @closed="pickerClosed" :language="ja"></vuejs-datepicker>
            </b-form-group>
            <b-button block type="submit" variant="primary">追加</b-button>            
        </b-form>
      </b-card>
      </b-card>
      <b-card bg-variant="light">
        <b-card bg-variant="light" title="タスク検索">
          <div class="input-group">
            <input type="text" class="form-control" v-model="searchWord" placeholder="Search word...">
          </div>
        </b-card>
        <b-card bg-variant="light" title="ステータス">
            <div class="input-group">
              <label v-for="label in options" v-bind:key="label.label" >
                  <input type="radio"
                      v-model="current"
                      v-bind:value="label.value">{{ label.label }}
              </label>
            </div>
        </b-card>
        <span class="">（{{ computedTodos.length }} 件を表示）</span>

        <table>
          <thead v-pre>
              <tr>
              <th class="id">ID</th>
              <th class="task">タスク</th>
              <th class="deadline">期日</th>
              <th class="estimatedTime">予定工数</th>
              <th class="state">ステータス</th>
              <th class="button">-</th>
              </tr>
          </thead>
          <tbody>
              <tr
              v-for="task in computedTodos"
              v-bind:key="task.id"
              v-bind:class="{done:task.state}">
              <th><router-link :to="{name: 'Edit', params: {id: task.id}}">{{task.id}}</router-link></th>
              <td>{{ task.task }}</td>
              <td><div v-bind:class="{late:compare2now(task.deadline)<0}">{{ task.deadline }}</div></td>
              <td>{{ task.estimatedTime }}</td>
              <td>
                  <b-button @click="doChangeState(task)" variant="outline-primary">
                  {{ labels[task.state] }}
                  </b-button>
              </td>
              <td>
                  <b-button @click="doRemove(task)" variant="outline-danger">
                  削除
                  </b-button>
              </td>
              </tr>
          </tbody>
        </table>
      </b-card>
    </div>
</template>
<script>
// firebase モジュール
import firebase from 'firebase'
import vuejsDatepicker from 'vuejs-datepicker';
import {ja} from 'vuejs-datepicker/dist/locale'
import moment from "moment"
export default {
    data: function (){
        return {
            todos: [],
            options: [
                { value: -1, label: 'すべて' },
                { value: 0,  label: '作業中' },
                { value: 1,  label: '完了' },
                { value: -2, label: '納期遅れ'}
            ],
            searchWord:'',
            isLate: false,
            user: {},
            current: -1, //初期値
            newtask:'',
            DatePickerFormat: 'yyyy-MM-dd',
            ja:ja,
            deadline: new Date(),
            estimatedTime:0,
            actualTime:0,
        }
    },
    components: {
        'vuejs-datepicker':vuejsDatepicker
    },
    methods: {
        // タスク新規追加
        doAdd: function() {
            if (!this.newtask.length) {
                return
            }
            this.$store.commit("save",{
              task:this.newtask,
              user_id:this.user.uid,
              deadline:moment(this.deadline).format('YYYY/MM/DD'),
              estimatedTime:this.estimatedTime,
              actualTime:0 });
            // ToDoリスト再取得
            this.todos = this.$store.state.todos.slice().reverse();
            // Textboxを空欄に
            this.newtask = ''
        },
        // ステータス変更
        doChangeState: function(item) {
            item.state = item.state ? 0 : 1
            this.$store.commit("update", {
                id: item.id,
                task: item.task,
                user_id: this.user.uid,
                deadline: moment(item.deadline).format('YYYY/MM/DD'),
                estimatedTime: item.estimatedTime,
                state: item.state,
                actualTime: item.actualTime 
            });
            this.todos = this.$store.state.todos.slice().reverse();
        },
        // タスク削除
        doRemove: function(item) {
            this.$store.commit("remove", item.id);
            this.todos = this.$store.state.todos.slice().reverse();
        },
        // 日付比較
        compare2now: function( datestr )
        {
          // 現在の日付＆時刻を取得
          var today = new Date();
          // 時間を0:00にする
          today.setHours(0);
          today.setMinutes(0);
          today.setSeconds(0);
          today.setMilliseconds(0);
          
          // 文字列から年月日を抜き出し、数値型に変換
          var vYear = parseInt( datestr.substr( 0, 4  ),10);
          var vMonth = parseInt( datestr.substr( 5, 2 ),10 ) -1;
          var vDay = parseInt( datestr.substr( 8, 2 ),10 );
          var adate = new Date( vYear, vMonth, vDay );
          
          if( adate.getTime() < today.getTime() ){
            return -1;
          }else{
            return 1;
          }
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
    },
    created() {
        // ToDoリスト取得
        this.todos = this.$store.state.todos.slice().reverse();//todoStorage.fetch()
        // ログインユーザー状態確認
        firebase.auth().onAuthStateChanged(user => {
          this.user = user ? user : {}
        });
    },
    computed: {
        // ToDoリストフィルタリング
        computedTodos: function() {
            var updatedTodos = this.$store.state.todos.slice().reverse();
            // 検索条件が指定された場合
            if(this.searchWord !== ''){
              return updatedTodos.filter(function(el) {
                                // ステータス:全て
                                return this.current === -1 ? 
                                  (true && this.user.uid === el.user_id && el.task.indexOf(this.searchWord)!==-1) 
                                  // ステータス:納期遅れ
                                  : (this.current === -2 ? 
                                  (1 !== el.state && this.user.uid === el.user_id && el.task.indexOf(this.searchWord)!==-1  && this.compare2now(el.deadline) < 0)
                                  :(this.current === el.state && this.user.uid === el.user_id && el.task.indexOf(this.searchWord)!==-1 ))
                            }, this)
            }else{
              // 検索条件が指定されない場合
              return updatedTodos.filter(function(el) {
                  // ステータス:全て
                  return this.current === -1 ? 
                  (true && this.user.uid === el.user_id ) 
                  // ステータス:納期遅れ
                  : (this.current === -2 ?
                  (1 !== el.state && this.user.uid === el.user_id && this.compare2now(el.deadline) < 0)
                  :(this.current === el.state && this.user.uid === el.user_id))
              }, this)
            }

        },
        // ステータスラベル
        labels: function() {
            return this.options.reduce(function(a, b) {
               return Object.assign(a, { [b.value]: b.label })
            }, {})
        }
    }
}
</script>
<style scoped>

table {
  width: 100%;
  border-collapse: collapse;
}
thead th {
  border-bottom: 2px solid #0099e4; /*#d31c4a */
  color: #0099e4;
}
th,
th {
  padding: 0 8px;
  line-height: 40px;
}
thead th.id {
  width: 50px;
}
thead th.state {
  width: 100px;
}
thead th.button {
  width: 60px;
}
tbody td.button, tbody td.state {
  text-align: center;
}
tbody tr td,
tbody tr th {
  border-bottom: 1px solid #ccc;
  transition: all 0.4s;
}
tbody tr.done td,
tbody tr.done th {
  background: #f8f8f8;
  color: #bbb;
}

tbody tr td div.late{
  background: #f8f8f8;
  color:red;
}
tbody tr:hover td,
tbody tr:hover th {
  background: #f4fbff;
}

</style>