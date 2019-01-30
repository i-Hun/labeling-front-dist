<template>
	<div class="admin">
		<div v-for="text in data">
			{{text}}
		</div>
	</div>
</template>

<style>

</style>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
	name: 'admin',
	data () {
		return {
			data: {},
		}
	},
	mounted () {
		axios
			.get('http://ihun.pythonanywhere.com/api/texts')
			.then(response => {
				this.data = response.data
			})
	}
};
</script>
