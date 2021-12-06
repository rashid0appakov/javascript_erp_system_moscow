<template>
	<v-row align="center" justify="center">
		<v-col cols="12" sm="8" md="4">
			<v-card class="elevation-12">
				<v-toolbar color="primary" flat>
					<v-toolbar-title>Авторизация</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-form ref="form" @submit.prevent="submit">
						<v-text-field label="E-mail" v-model="user.email" type="email" :error-messages="errors.email" :disabled="loading" prepend-icon="person"></v-text-field>
						<v-text-field label="Пароль" v-model="user.password" :error-messages="errors.password" :append-icon="passwordHidden ? 'visibility_off' : 'visibility'" @click:append="() => (passwordHidden = !passwordHidden)" :type="passwordHidden ? 'password' : 'text'" :disabled="loading" prepend-icon="lock"></v-text-field>
						<v-layout class="mt-4 mx-0">
							<v-spacer></v-spacer>
							<v-btn type="submit" :loading="loading" :disabled="loading" color="primary" class="ml-4">Войти</v-btn>
						</v-layout>
					</v-form>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
export default {
	data: () => ({
		passwordHidden: true,
		loading: false,
		errors: {},
		user: {
			email: null,
			password: null
		}
	}),
	methods: {
		async submit() {
			this.$store.dispatch('load')
			try {
				this.errors = {}
				const { data } = await axios.post('/login', this.user)
				this.$store.dispatch('saveToken', data.token)
				this.$store.dispatch('setUser', data.user)
				this.$toast.success('Успешная авторизация!');
				this.play('auth')
				this.$router.push({ name: 'home' })
			} catch (err) {
				if (err.response && err.response.status == 422) {
					this.errors = err.response.data.errors;
				}
			}finally{this.$store.dispatch('unload')}
		},
	}
}
</script>
