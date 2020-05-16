<template>
  <div id="app">
    <Header/>
    <div class="container">
    <router-view />
    </div>
    <Footer/>
  </div>
</template>

<script>
import firebase from 'firebase';
const firebaseConfig = require(`./config/${process.env.NODE_ENV}-firebase.js`);
firebase.initializeApp(firebaseConfig);
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components : {
    Header,
    Footer
  },
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
