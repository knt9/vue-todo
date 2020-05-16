<template>
 <footer class="footer">
    <b-navbar type="primary" variant="primary">
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto font-weight-bold">
                <span class="copyright">{{copyright}}</span>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    
  </footer>
</template>
<script>
export default {
  name: 'App',

  data(){
    return {
      copyright: "© 2020 Copyright:KNT9"
    }
  }
}
</script>

<style scoped>
.copyright{
    color: white;
}
</style>