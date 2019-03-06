<template>
	<div class="name">
		<h1 class="title" v-if="name">Здравствуйте, {{name}}!</h1>
	<div class="field">
		<p class="control">
			<input class="input is-large" type="text" placeholder="Введите ваше имя" v-model="name">
		</p>
	</div>
	<div class="field">
		<p class="control">
			<button	v-on:click="startLabeling" class="button is-success is-large">
				Начать кодирование
			</button>
		</p>
	</div>
<footer class="footer">
  <div class="content has-text-centered">
    <p>
      v1.6
    </p>
  </div>
</footer>
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
