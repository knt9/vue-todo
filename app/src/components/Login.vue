<template>
  <div id="app">
  <div class="login">
          <b-card >
        <div id="login-row" class="row justify-content-center align-items-center">
          <div id="login-column" class="col-md-6">
            <div id="login-box" class="col-md-12">
                <div class="row">
                    <div class="col-sm-12">
                        <form @submit="signIn">
                            <div class="form-group">
                                <label for="email" class="font-weight-bold">Email</label>
                                <input type="email" class="form-control" id="email" v-model="email">
                            </div>
                            <div class="form-group">
                              <label for="password" class="font-weight-bold">Password</label>
                              <input type="password" class="form-control" id="password" v-model="password">
                            </div>
                            <div class="d-block d-xl-none">
                              <div class="btn-group-vertical d-flex">
                                <div class="btn-group ">
                                  <button type="submit" class="btn btn-primary font-weight-bold">Login</button>
                                </div>
                              </div>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
          </div>
        </div>
          </b-card>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'login',
  data: function () {
    return {
      user: {},  // ユーザー情報
      email: '',
      password: '',
    }
  },
  methods: {
    // ログイン処理
    signIn(){
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          alert('Sign In Success!'),
          this.user = firebase.auth().currentUser,
          this.$router.push('/todo')
        ).catch(error=> {
          alert(error.message);
        })
    },
  }
}
</script>
<style>
</style>