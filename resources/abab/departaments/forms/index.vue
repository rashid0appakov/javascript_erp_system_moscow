<template>
    <v-sheet>
        <v-card>
            <v-toolbar dense flat>
                <v-toolbar-title>Список клиентов</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-text-field dense solo outlined hide-details clearable single-line v-model="search" append-icon="mdi-magnify" label="Найти"></v-text-field>
                <v-spacer></v-spacer>
                <v-select
                    :items="types"
                    item-text="name"
                    item-value="id"
                    label="Категория"
                    v-model="type"
                    hide-details single-line
                    dense solo outlined
                    @click:clear="type = false"
                    clearable>
                    <template v-slot:prepend-item>
                        <v-list-item><v-btn width="100%" small class="primary" @click="typeDialog({})">Добавить</v-btn></v-list-item>
                    </template>
                    <template v-slot:item="{item}">
                        <v-list-item @click="type = item.id">
                            <v-list-item-content>
                                <v-list-item-title>{{item.name}}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <span>
                                    <v-btn x-small class="warning" @click.prevent="typeDialog(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                                    <v-btn x-small class="error" @click.prevent="destroyType(item)"><v-icon small>mdi-delete</v-icon></v-btn>
                                </span>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-select>
                <v-spacer></v-spacer>
                <v-btn x-small class="orange darken-4 mr-2" fab :disabled="!selected.length" @click="showAddLeadDialog = true"><v-icon small>mdi-phone-alert</v-icon></v-btn>
                <v-btn small class="error mr-2" :disabled="!selected.length" @click="destroyMany"><v-icon>mdi-delete</v-icon></v-btn>
                <v-btn small class="primary mr-2" @click="customerDialog({})"><v-icon>mdi-plus</v-icon></v-btn>
                <v-btn small class="success mr-2" @click="upload"><v-icon>mdi-upload</v-icon></v-btn>
                <v-btn small class="success" @click="toExcel"><v-icon>mdi-download</v-icon></v-btn>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="filtered"
                :search="search"
                :footer-props="{ 'items-per-page-options': [20, 100, 200] }"
                v-model="selected"
                show-select
                sort-by="id">
                <template v-slot:item.actions="{ item }">
                    <v-btn class="mr-2 warning" x-small @click="customerDialog(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                    <v-btn class="error mr-2" x-small @click="destroy(item)"><v-icon small>mdi-delete</v-icon></v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-navigation-drawer v-model="showCustomerDrawer" absolute right touchless width="100%">
            <v-card>
                <v-toolbar dense color="primary">
                    <v-btn fab x-small class="error darken-3 mr-3" @click="showCustomerDrawer = false"><v-icon>mdi-close</v-icon></v-btn>
                    <v-toolbar-title>{{model.id ? 'Редактирование клиента '+model.name : 'Новый клиент'}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-card-title>Реквизиты</v-card-title>
                            <customer-requisites @addCustomer="addCustomer" :types="types" :customer="model"></customer-requisites>
                        </v-col>
                        <v-col cols="12" md="3" v-if="model.id">
                            <v-card-title>Контакты</v-card-title>
                            <customer-contacts :customer="model"></customer-contacts>
                        </v-col>
                        <v-col cols="12" md="3" v-if="model.id">
                            <v-card-title>Адреса</v-card-title>
                            <customer-addresses :customer="model"></customer-addresses>
                        </v-col>
                        <v-col cols="12" md="3" v-if="model.id">
                            <v-card-title>Заказы</v-card-title>
                            <customer-leads :customer_id="model.id"></customer-leads>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-navigation-drawer>
        <v-dialog width="400px" v-model="showTypeDialog">
            <v-card>
                <v-toolbar dense color="primary">{{typeModel.id ? 'Редактирование категории' : 'Новая категория'}}</v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field dense sole outlined v-model="typeModel.name" label="Название"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning" @click="showTypeDialog = false">Отмена</v-btn>
                    <v-btn small class="success" @click="saveType">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog width="400px" v-model="showAddLeadDialog">
            <v-card>
                <v-toolbar dense color="primary">Добавить лид</v-toolbar>
                <v-card-text class="pt-5">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-chip small-chip label dense v-bind="attrs" v-on="on" width="100%" class="mb-3">
                                <span v-if="lead.departament">{{lead.departament.name}}<v-icon>mdi-chevron-right</v-icon>{{lead.board.name}}</span>
                                <span v-else>Выберите отдел</span>
                            </v-chip>
                        </template>
                        <v-list dense>
                            <div v-for="sd in $store.getters.subdepartaments(1)" :key="sd.id">
                                <v-subheader>{{sd.name}}</v-subheader>
                                <v-list-item v-for="b in sd.boards" :key="b.id" @click="changeDestination(sd, b)">
                                    <v-list-item-title>
                                        <v-icon :color="b.color" class="mr-3">mdi-hexagon</v-icon>
                                        {{ b.name }}
                                    </v-list-item-title>
                                </v-list-item>
                            </div>
                        </v-list>
                    </v-menu>
                    <v-textarea dense solo outlined v-model="lead.message" label="Дополнительная информация"></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning" @click="showAddLeadDialog = false">Отмена</v-btn>
                    <v-btn small class="success" @click="addLead">Добавить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>
<script>
import customerContacts from '@/components/customers/contacts'
import customerAddresses from '@/components/customers/addresses'
import customerRequisites from '@/components/customers/requisites'
import customerLeads from '@/components/customers/leads'
import {json2excel} from 'js2excel';
export default {
    components: { customerContacts, customerAddresses, customerRequisites, customerLeads },
	data: () => ({
        showAddLeadDialog: false,
        showTypeDialog: false,
		search: '',
        customers: [],
        types: [],
        showCustomerDrawer: false,
        model: {},
        selected: [],
        type: false,
        typeModel: {},
        lead: {},
		headers: [
            { text: "Тип", value: "customer_type.name" },
			{ text: "Название", value: "name" },
			{ text: 'Действия', value: 'actions', sortable: false },
		]
    }),
    computed:{
        filtered(){
            return this.customers.filter( c => (!this.type || c.customer_type_id == this.type) && (!this.search || c.name.toLowerCase().indexOf(this.seach) > -1) )
        }
    },
	async created(){
        const types = await axios.get('/customerTypes')
        this.types = types.data
        await this.loadCustomers()
	},
	methods: {
        changeDestination(d, b){
            this.lead.departament = d
            this.lead.board = b
            this.lead.board_id = b.id
            this.lead.departament_id = d.id
        },
        async destroyMany(){
            const res = await this.$confirm('Подтвердите удаление выбранных клиентов', {title: 'Подтвердите действие'})
            if(!res) return false
            try{
                const ids = this.selected.map( s => s.id )
                const {data} = await axios.delete('/customers', { params: {ids} })
                this.selected = []
                const newCustomers = []
                this.customers.forEach(customer => {
                    if(ids.indexOf(customer.id) < 0) newCustomers.push(customer)
                })
                this.customers = newCustomers
                this.$toast.success('Выбранные клиенты успешно удалены')
            }catch(e){}
        },
        async upload(){
            const data = this.type ? { customer_type_id: this.type } : {}
            const customers = await this.$upload('/customers', { data })
			if(customers){
                this.customers = customers
				this.$toast.success('Файл успешно загружен')
			}
        },
        async loadCustomers(){
            const customers = await axios.get('/customers')
            this.customers = customers.data
        },
        customerDialog(model){
            this.model = model
            this.showCustomerDrawer = true
        },
        typeDialog(model){
            this.typeModel = model
            this.showTypeDialog = true
        },
        async saveType(){
            try{
                if(this.typeModel.id){
                    await axios.put('/customerTypes/'+this.typeModel.id, this.typeModel)
                }else{
                    const {data} = await axios.post('/customerTypes', this.typeModel)
                    this.types.push(data)
                }
                this.$toast.success('Категория успешно сохранена')
                this.showTypeDialog = false
            }catch(e){}
        },
        async destroyType(type){
            const res = await this.$confirm('Вы действительно хотите удаить категорию '+type.name+'?', {title: 'Подтвердите действие'})
            if(!res) return false
            try{
                await axios.delete('/customerTypes/'+type.id)
                this.$toast.success('Категория успешно удалена')
                this.types.splice(this.types.findIndex(t => t.id == type.id), 1)
                await this.loadCustomers()
            }catch(e){}
        },
        async addLead(){
            if(!this.lead.departament_id){
                this.$toast.warning('Не выбран отдел')
                return false
            }
            this.$store.dispatch('load')
            this.lead.customers = this.selected.map( s => s.id)
			try{
				const {data} = await axios.post('/leads/createMany', this.lead)
				this.$toast.success('Лид успешно добавлен')
                this.lead = {}
                this.selected = []
                this.showAddLeadDialog = false  
			}catch(e){
				if(e.response && e.response.status == 404 && e.response.data.message) this.$toast.error(e.response.data.message)
			}finally{ this.$store.dispatch('unload')}
        },
        async addCustomer(data){
            this.customers.push(data)
        },
		async destroy(item){
            const res = await this.$confirm('Вы уверены, что хотите удалить клиента "'+item.name+'"?', {title: 'Подтвердите действие'})
            if(!res) return false
            this.$store.dispatch('load')
            try{
                await axios.delete('/customers/'+item.id)
                this.customers.splice( this.customers.findIndex( i => i.id == item.id), 1)
                this.$toast.success('Клиент успешно удален')
            }catch(e){
            }finally{this.$store.dispatch('unload')}
        },
		toExcel(){
			try {
				json2excel({
					data: this.customers.map( c => {
                        return {
                            name: c.name,
                            contact_name: c.contacts[0] ? c.contacts[0].name: '',
                            contact_phone: c.contacts[0] ? c.contacts[0].phone: '',
                            contact_email: c.contacts[0] ? c.contacts[0].email: '',
                            inn: c.inn,
                            kpp: c.kpp,
                            bik: c.bik,
                            rs: c.rs,
                            ks: c.ks,
                            bank: c.bank,
                            address: c.address,
                            u_address: c.u_address,
                            additional_info: c.additional_info
                        }
                    }),
					name: 'Клиенты',
					formateDate: 'yyyy/mm/dd'
				});
			} catch (e) {
				this.$toast.error('Не удалось выгрузить данные')
			}
		}
	}
}
</script>