<template>
  <div id="app">
      <div class="container">
        <router-view/>
      </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  margin-top: 50px;
}
</style>


<script>
export default {
  name: 'name',
  head: {
    // To use "this" in the component, it is necessary to return the object through a function
    title: function () {
      return {
        inner: "Labeling Machine"
      }
    },
    meta: [
      { name: 'description', content: 'My description', id: 'desc' }
    ],
    link: [
      // { rel: 'author', href: 'author', undo: false }, // undo property - not to remove the element
      { rel: 'stylesheet', href: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css"}, 
    ],
    // script: [
    //   { type: 'text/javascript', src: 'https://unpkg.com/element-ui/lib/index.js'}, // Insert in body
    // ],
  }
}
</script>