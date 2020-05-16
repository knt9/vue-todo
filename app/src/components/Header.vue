<template>
 <header class="header">
      
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="/" class="font-weight-bold">Vue-ToDo</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav >
          <b-navbar-nav>
            <b-nav-item right><div v-if="user.uid"><router-link to="/todo">ToDo</router-link></div></b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          
            <b-navbar-nav class="ml-auto">
              <div v-if="user.uid">
                <b-nav-item-dropdown right>
                    <template v-slot:button-content>
                      <em class="user">{{user.email}}</em>
                    </template>
                    <b-dropdown-item @click="doLogout">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
              </div>
            </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      
    </header>
</template>
<script>
import firebase from 'firebase';

export default {
  name: 'App',
  data(){
    return {
      user:{}
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
    })
  },
  methods: {
      // ログアウト処理
      doLogout() {
          firebase.auth().signOut()
          this.$router.push('/');
      }   
  }
}
</script>

<style scoped>
.user{
  color: white;
}
</style>