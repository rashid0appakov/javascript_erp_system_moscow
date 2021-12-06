<template>
    <v-card>
        <v-toolbar class="primary" dense>
            <v-toolbar-title>Новый лид</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-autocomplete
			v-model="model"
			:items="items"
			:loading="isLoading"
			:search-input.sync="search"
			small-chips
			clearable
			hide-details
			hide-selected
			item-text="name"
			item-value="id"
			label="Заказчик"
			placeholder="Начните ввод для поиска"
			>
			<template v-if="search && search.length > 2" v-slot:no-data>
				<v-list-item @click="storeCustomer">
					<v-list-item-content>
						<v-list-item-title>Клиент с имененм <strong>"{{search}}"</strong> не найден</v-list-item-title>
						<v-list-item-subtitle>Нажмите здесь, чтобы создать его</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</template>
    		</v-autocomplete>
        </v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn @click="storeLead" class="primary" :disabled="!model">Сохранить</v-btn>
		</v-card-actions>
    </v-card>
</template>
<script>
export default {
    data: () => ({
		isLoading: false,
		items: [],
		model: null,
		search: null,

	}),
	methods: {
		async storeCustomer(){
			try{
				const {data} = await axios.post('/customers', { name: this.search})
				this.items.push(data)
				this.$toast.success('Клиент успешно добавлен!')
			}catch(e){}
		},
		async storeLead(){
			try{
				const lead = {
					customer_id: this.model
				}
				await axios.post('/leads', lead)
				this.$emit('create')
			}catch(e){
				if(e.response && e.response.status == 404 && e.response.data.message) this.$toast.error(e.response.data.message)
			}
		}
	},
    watch: {
		async search (val) {
			if(!val || val.length < 3 || ( val.length > 3 && !this.items.length )) {
				return false
			}
			this.isLoading = true
			try{
				const {data} = await axios.get('/customers', { params: { q: val } })
				this.items = data
			}catch(e){}
			this.isLoading = false
		},
	},
}
</script>