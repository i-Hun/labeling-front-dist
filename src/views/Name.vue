<template>
  <div class="name">
  	<h1 class="title" v-if="name">Здравствуйте, {{name}}!</h1>
	<div class="field">
	  <p class="control">
	  		<input class="input" type="text" placeholder="Введите ваше имя" v-model="name">
	  </p>
	</div>
	<div class="field">
	  <p class="control">
	    <button  v-on:click="startLabeling" class="button is-success">
	      Начать кодирование
	    </button>
	  </p>
	</div>
  </div>
</template>

<script>

export default {
  name: 'name',
  data () {
    return {
      texts: [],
      name: ''
    }
  },
  methods: {
  	startLabeling () {
  		localStorage.setItem('name', this.name);
  		this.$router.push({ path: 'labeling' });
  	}
  }
};
</script>
