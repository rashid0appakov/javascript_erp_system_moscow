<template>
<v-card>
	<v-toolbar flat dense>
		<v-toolbar-title>Должности</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-dialog v-model="dialog" max-width="600px">
			<template v-slot:activator="{ on }">
				<v-btn color="success" x-small fab v-on="on" @click="edit(false)"><v-icon>mdi-plus</v-icon></v-btn>
			</template>
			<v-card>
				<v-toolbar dense color="primary">
					<v-toolbar-title>{{formTitle}}</v-toolbar-title>
				</v-toolbar>
				<v-card-text class="pt-5">
					<v-text-field v-model="model.name" label="Название" autofocus dense></v-text-field>
					<v-text-field v-model="model.salary" label="Оклад" dense></v-text-field>
					<v-checkbox v-model="model.bonus" label="Учитывать бонусы"></v-checkbox>
					<v-select :items="permissions" v-model="model.permissions" dense small-chips solo clearable deletable-chips item-text="name" item-value="id" label="Права" multiple></v-select>
					<v-color-picker @update:color="setColor" v-model="model.color" hide-mode-switch show-swatches hide-inputs hide-canvas></v-color-picker>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small color="warning" @click="dialog = false">Отмена</v-btn>
					<v-btn small color="primary" @click="save">Сохранить</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-toolbar>
	<v-data-table :headers="headers" :items="roles" sort-by="id" class="elevation-1">
		<template v-slot:item.name="{ item }">
			<v-chip :color="item.color">{{item.name}}</v-chip>
		</template>
		<template v-slot:item.actions="{ item }">
			<v-btn color="primary mr-2" x-small @click="edit(item)" v-if="item.id > 1">
				<v-icon small>mdi-pencil</v-icon>
			</v-btn>
			<v-btn color="error mr-2" x-small @click="destroy(item)" v-if="item.id > 1">
				<v-icon small>mdi-delete</v-icon>
			</v-btn>
		</template>
		<template v-slot:no-data>
			Записей не найдено
		</template>
	</v-data-table>
</v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters(['roles', 'permissions']),
		formTitle() {
			return this.model.id ? 'Редактирование должности' : 'Новая должность'
		}
	},
	data: () => ( {
		dialog: false,
		search: '',
		model: {
			permissions: []
		},
		headers: [
			{ text: 'Название', align: 'start', value: 'name' },
			{ text: 'Действия', align: 'end', value: 'actions', sortable: false }
		]
	} ),
	methods: {
		setColor(color){
			this.model.color = color.hex
		},
		edit( item ) {
			this.errors = {}
			this.model = item ? item : {
				permissions: []
			}
			this.dialog = true
		},
		async destroy( item ) {
			try {
				if ( confirm( 'Вы уверены, что хотите удалить запись?' ) ) {
					await axios.delete( '/roles/' + item.id )
					this.roles.splice( this.roles.findIndex( role => {
						return role.id == item.id
					} ), 1 )
				}
			} catch ( err ) {

			}
		},
		async save() {
			try {
				if ( this.model.id ) {
					await axios.put( '/roles/' + this.model.id, this.model )
				} else {
					const {data} = await axios.post( '/roles', this.model )
					this.roles.push( data )
				}
			} catch ( e ) {}
			finally { this.dialog = false }
		}
	}
}
</script>
