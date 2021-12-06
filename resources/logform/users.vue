<template>
<v-sheet class="fill-height">
	<v-toolbar dense flat>
		<v-toolbar-title>Сотрудники</v-toolbar-title>
		<v-divider class="mx-4" inset vertical></v-divider>
		<v-text-field v-model="search" hide-details single-line append-icon="mdi-magnify" label="Найти"></v-text-field>
		<v-spacer></v-spacer>
		<v-btn color="success" x-small fab @click="edit(false)"><v-icon>mdi-plus</v-icon></v-btn>
	</v-toolbar>
	<v-data-table :loading="loading" :headers="headers" :items="users" :search="search" sort-by="id">
		<template v-slot:item.role.name="{ item }">
			<v-chip small :color="item.role.color" dark>{{ item.role.name }}</v-chip>
		</template>
		<template v-slot:item.active="{ item }">
			<v-checkbox v-model="item.active" disabled></v-checkbox>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-btn color="primary mr-2" x-small @click="edit(item)">
				<v-icon small>mdi-pencil</v-icon>
			</v-btn>
			<v-btn color="error mr-2" x-small @click="destroy(item)">
				<v-icon small>mdi-delete</v-icon>
			</v-btn>
		</template>
		<template v-slot:no-data>
			Записей не найдено
		</template>
	</v-data-table>
	<v-navigation-drawer v-model="drawer" absolute right touchless width="100%">
		<v-card class="fill-height" v-if="model">
			<v-toolbar dark color="primary" dense>
				<v-btn icon dark small @click="drawer = false"><v-icon>mdi-close</v-icon></v-btn>
				<v-toolbar-title>{{formTitle}}</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn small color="success" @click="save"><v-icon>mdi-check</v-icon> Сохранить</v-btn>
			</v-toolbar>
			<v-card-text>
				<v-row>
					<v-col cols="12" md="6" class="text-center">
						<avatar :user="model" size="128"></avatar>
						<v-btn @click="upload">Загрузить фото</v-btn>
					</v-col>
					<v-col cols="12" md="6">
						<v-checkbox v-model="model.active" label="Активен"></v-checkbox>
						<v-row>
							<v-col cols="12" md="4"><v-text-field solo outlined flat dense v-model="model.surname" label="Фамилия"></v-text-field></v-col>
							<v-col cols="12" md="4"><v-text-field solo outlined flat dense v-model="model.name" label="Имя" :error-messages="errors.name"></v-text-field></v-col>
							<v-col cols="12" md="4"><v-text-field solo outlined flat dense v-model="model.lastname" label="Отчество" :error-messages="errors.lastname"></v-text-field></v-col>
						</v-row>
						<v-row>
							<v-col cols="12" md="4"><v-text-field solo outlined flat dense v-model="model.email" label="E-mail" :error-messages="errors.email"></v-text-field></v-col>
							<v-col cols="12" md="4"><v-text-field solo outlined flat dense v-model="model.phone" label="Телефон" :error-messages="errors.phone"></v-text-field></v-col>
							<v-col cols="12" md="4"><v-text-field solo outlined flat dense v-model="model.password" label="Пароль" :error-messages="errors.password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field></v-col>
						</v-row>
						<v-text-field solo outlined flat dense v-model="model.extention_id" label="Telphin extention_id"></v-text-field>
						<v-text-field solo outlined flat dense v-model="model.telegram_id" label="Telegram ID"></v-text-field>
						<v-text-field solo outlined flat dense v-model="model.email_login" label="Почтовый логин"></v-text-field>
						<v-text-field solo outlined flat dense v-model="model.email_password" label="Почтовый пароль"></v-text-field>
						<v-select solo outlined flat dense :items="roles" v-model="model.role_id" item-text="name" item-value="id" label="Должность" :error-messages="errors.role_id"></v-select>
						<v-checkbox v-model="model.notify" label="Уведомить пользователя"></v-checkbox>
						<v-checkbox v-model="model.notifications" label="Получать уведомления"></v-checkbox>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-navigation-drawer>
</v-sheet>
</template>
<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar'
export default {
	components: { avatar },
	data: () => ( {
		drawer: false,
		search: '',
		loading: false,
		showPassword: false,
		errors: {},
		model: false,
		headers: [
			{ text: 'ID', align: 'start', value: 'id' },
			{ text: 'Активность', value: 'active', sortable: false },
			{ text: 'Имя', value: 'name' },
			{ text: 'E-mail', value: 'email' },
			{ text: 'Должность', value: 'role.name' },
			{ text: 'Действия', value: 'actions', sortable: false }
		]
	} ),
	computed: {
		...mapGetters( [ 'user', 'users', 'roles' ] ),
		formTitle() {
			return this.model.id ? 'Редактирование пользователя' : 'Новый пользователь'
		}
	},
	methods: {
		async upload(){
			try{
				this.model.photo = await this.$upload('/users/'+this.model.id+'/uploadPhoto')
				this.$toast.success('Фото успешно загружено')
			}catch(e) {}
		},
		edit( item ) {
			this.errors = {}
			this.model = item || {}
			this.drawer = !this.drawer;
		},
		async save() {
			this.errors = {}
			try {
				if ( this.model.id ) {
					await axios.put( '/users/' + this.model.id, this.model )
					this.$toast.success( 'Изменения успешно сохранены' )
				} else {
					const user = await axios.post( '/users', this.model )
					this.users.push( user.data )
					this.$toast.success( 'Пользователь успешно добавлен' )
				}
				this.drawer = false
			} catch ( err ) {
				const errors = {}
				if ( err.response.status == 422 ) {
					err.response.data.forEach( error => {
						if ( !errors[ error.field ] ) {
							errors[ error.field ] = error.message
						}
					} )
					this.errors = errors;
				}
			}
		},
		async destroy( item ) {
			if ( item.id == this.user.id ) {
				this.$toast.warning( 'Вы не можете удалить собственую запись' )
				return false;
			}
			if ( confirm( 'Вы уверены, что хотите удалить запись?' ) ) {
				try {
					await axios.delete( '/users/' + item.id )
					this.$toast.success( 'Пользователь успешно удален' )
					this.users.splice( this.users.findIndex( user => {
						return user.id == item.id
					} ), 1 )
				} catch ( err ) {

				}
			}
		}
	},
}
</script>
