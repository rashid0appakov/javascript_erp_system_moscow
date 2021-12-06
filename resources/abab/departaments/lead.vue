<template>
<v-sheet v-if="lead" style="min-height:100%">
    <v-toolbar dense>
        <v-btn fab x-small class="error darken-3 mr-3" @click="close"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>
            #{{lead.id}}
            <small class="text-caption font-weight-lightc text--disabled">{{lead.created_at | moment('DD.MM.YYYY HH:mm')}}</small>
        </v-toolbar-title>
        <v-chip-group class="ml-5">
            <v-chip label @click="showCustomerDialog = true">{{lead.customer ? lead.customer.name : 'Клиент не указан'}} <v-icon small class="ml-3">mdi-cog</v-icon></v-chip>
            <v-chip label @click="showManagerDialog = true">{{lead.users.length ? lead.users[0].name : 'Ответственные не выбраны'}} <v-icon small class="ml-3">mdi-cog</v-icon></v-chip>
            <v-menu offset-y v-if="departament">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip label v-bind="attrs" v-on="on">{{$store.getters.departament(departament).name}} <v-icon>mdi-chevron-right</v-icon> {{board.name}}</v-chip>
                </template>
                <v-list dense>
                    <div v-for="sd in $store.getters.subdepartaments(1)" :key="sd.id">
                        <v-subheader>{{sd.name}}</v-subheader>
                        <v-list-item v-for="b in sd.boards" :key="b.id" @click="moveTo(sd, b)">
                            <v-list-item-title>
                                <v-icon :color="b.color" class="mr-3">mdi-hexagon</v-icon>
                                {{ b.name }}
                            </v-list-item-title>
                        </v-list-item>
                    </div>
                </v-list>
            </v-menu>
        </v-chip-group>
        <v-spacer></v-spacer>
        <span class="small mr-2" v-if="!lead.source">Источник не указан</span>
        <span class="small mr-2" v-else>{{lead.source}}</span>
        <v-btn @click="destroyLead" x-small class="error mr-3"><v-icon small>mdi-delete</v-icon></v-btn>
        <v-menu offset-y v-if="$store.getters.connected">
            <template v-slot:activator="{ on, attrs }">
                <v-btn x-small color="success" v-bind="attrs" v-on="on"><v-icon small>mdi-eye</v-icon> {{watchers.length}}</v-btn>
            </template>
            <v-list dense>
                <v-list-item v-for="user in watchers" :key="user.id">
                    <v-list-item-title>{{user.name}}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-toolbar>
    <v-card-text>
        <v-row>
            <v-col cols="12" md="4" class="px-1">
                <v-btn width="100%" @click="callbackDialog" v-if="lead.customer" small class="success mb-3"><v-icon>mdi-phone</v-icon></v-btn>
                <v-expansion-panels v-if="lead.customer" v-model="customerPanels">
                    <v-expansion-panel>
                        <v-expansion-panel-header>Реквизиты</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <customer-requisites :customer="lead.customer"></customer-requisites>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Адреса</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <customer-addresses :customer="lead.customer"></customer-addresses>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>Контакты</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <customer-contacts :lead_id="lead.id" :customer="lead.customer"></customer-contacts>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-card>
                    <v-tabs v-model="activeDepartamentIndex" background-color="primary" show-arrows>
                        <v-btn @click="activeDepartamentIndex = i" x-small text v-for="(departament, i) in departamentsToShow" class="align-self-center mr-3" :key="departament.id">
                            <v-icon small class="mr-2">{{departament.icon}}</v-icon>
                            {{departament.name}}
                        </v-btn>
					</v-tabs>
					<v-tabs-items v-model="activeDepartamentIndex">
                        <v-tab-item v-for="d in departamentsToShow" :key="d.id">
                            <v-card>
                                <v-card-text>
                                    <v-btn v-if="!fund" small class="mb-3" width="100%" color="orange darken-4" @click="openFundDialog({})" >Назначить бюджет</v-btn>
                                    <v-list dense two-line v-else>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>Бюджет {{fund.value}}</v-list-item-title>
                                                <v-list-item-subtitle>{{fund.created_at | moment()}}</v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <span>
                                                    <v-btn x-small class="mr-2" color="warning" @click="openFundDialog(fund)"><v-icon small>mdi-pencil</v-icon></v-btn>
                                                    <v-btn x-small color="error" @click="destroyFund(fund.id)"><v-icon small>mdi-delete</v-icon></v-btn>
                                                </span>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-list>
                                    <v-expansion-panels v-if="lead.requests.length">
                                        <v-expansion-panel>
                                            <v-expansion-panel-header>Созданные задачи</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-list dense two-line>
                                                    <v-list-item-group>
                                                        <v-list-item :class="{primary: tz.status == 'NEW', warning: tz.status=='ACCEPT', success: tz.status=='DONE', error: tz.status == 'REJECT'}" @click="tzDialog(tz, $store.getters.departament(tz.departament_id))" v-for="tz in lead.requests.filter(r => r.departament_id == d.id || $store.getters.subdepartaments(d.id).find( sd => sd.id == r.departament_id))" :key="tz.id">
                                                            <v-list-item-content>
                                                                <v-list-item-title>Статус: {{tzStatus(tz.status)}}</v-list-item-title>
                                                                <v-list-item-subtitle>{{tz.created_at | moment()}} - {{tz.expired_at | moment()}}</v-list-item-subtitle>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </v-list-item-group>
                                                </v-list>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    <v-list dense v-if="departament == 1">
                                        <v-subheader>Задачи для отдела</v-subheader>
                                        <v-list-item-group>
                                            <v-list-item class="primary" @click="tzDialog(false, departament)" v-for="departament in $store.getters.subdepartaments(d.id)" :key="departament.id">
                                                <v-list-item-content>
                                                    <v-list-item-title v-text="departament.name"></v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                    <production-lead-props :lead="lead" v-if="d.id == 5"></production-lead-props>
                                    <supply-lead-props :lead="lead" v-else-if="d.id == 7"></supply-lead-props>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
					</v-tabs-items>
                </v-card>
            </v-col>
            <v-col cols="12" md="3" class="px-1">
                <v-card>
                    <v-card-title>Сообщения</v-card-title>
                    <div style="height: 300px; overflow: auto">
                        <v-card-text>
                            <v-row v-for="message in lead.messages" :key="message.id" class="mb-5 pb-2 elevation-1" align-center>
                                <v-col sm="6" cols="6" class="py-0">
                                    <h4 v-if="message.user">{{message.user.name}}</h4>
                                </v-col>
                                <v-col sm="6" cols="6" class="text-right caption py-0">
                                    {{message.created_at | moment('fromNow')}}
                                </v-col>
                                <v-col cols="12" class="py-0">
                                    <div>{{message.body}}</div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </div>
                    <v-card-actions>
                        <v-text-field
                            v-model="input"
                            append-outer-icon="mdi-send"
                            clear-icon="mdi-close-circle"
                            clearable
                            label="Message"
                            type="text"
                            counter="255"
                            dense
                            @keyup.enter="sendMessage"
                            @click:append-outer="sendMessage"
                            @click:clear="input=''"
                        ></v-text-field>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" md="2" class="px-1">
                <v-card>
                    <v-card-title>
                        Задачи
                        <v-spacer></v-spacer>
                        <v-btn fab x-small color="orange darken-4" @click="showTaskDialog = true"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card-title>
                    <v-list tree-line>
                        <v-list-item v-for="task in lead.tasks" :key="task.id">
                            <v-list-item-content>
                                <v-list-item-title>{{task.body}}</v-list-item-title>
                                <v-list-item-subtitle>Создана {{task.created_at | moment('DD.MM.YYYY')}}</v-list-item-subtitle>
                                <v-list-item-subtitle v-if="task.user">{{task.user.name}} {{task.user.surname}}</v-list-item-subtitle>
                                <!-- <v-list-item-subtitle>Назначена на {{task.expired_at | moment('DD.MM.YYYY')}}</v-list-item-subtitle> -->
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="12" md="3" class="px-1">
                <v-card>
                    <file-list :list="lead.files" type="leads" :id="lead.id" group="docs" title="Документы"></file-list>
                    <file-list :list="lead.files" type="leads" :id="lead.id" group="certs" title="Сертификаты"></file-list>
                    <file-list :list="lead.files" type="leads" :id="lead.id" group="charts" title="Чертежи"></file-list>
                    <v-card-text>
                        <v-btn small width="100%" class="mb-2 success" @click="showClientLeadsDialog = true">Все заказы клиента</v-btn>
                        <v-btn small width="100%" class="mb-2 info" v-if="!lead.invoice" @click="showInvoiceDialog = true">Выставить счет</v-btn>
                        <v-btn small width="100%" class="mb-2 success" v-else @click="showInvoiceDialog = true">Изменить счет</v-btn>
                        <v-btn small width="100%" class="mb-2 info" @click="showKPDialog = true">Выставить КП</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-card-text>
    <v-dialog v-model="showTaskDialog" width="500px">
        <v-card>
            <v-toolbar dense class="primary">
                <v-toolbar-title>Новая задача</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-datetime-picker dense solo outlined flat :time-picker-props="{format: '24hr'}" time-format="HH:mm:00" label="Назначить на" v-model="taskModel.notify_at"></v-datetime-picker>
                <v-select dense solo outlined flat label="Задача для сотрудника" :items="users" item-text="name" item-value="id" v-model="taskModel.to_user_id"></v-select>
                <v-textarea dense solo outlined flat v-model="taskModel.body" rows="3" label="Комментарий"></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="warning" @click="showTaskDialog = false">Отмена</v-btn>
                <v-btn small color="success" @click="setTask">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showFundDialog" width="500px">
        <v-card>
            <v-toolbar dense class="primary">
                <v-toolbar-title>Бюджет отдела</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-text-field dense solo outlined flat type="number" :error-messages="errors.fund" v-model="fundModel.value" label="Укажите сумму"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="warning" @click="showFundDialog = false">Отмена</v-btn>
                <v-btn small color="success" @click="setFund">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showInvoiceDialog" width="800px">
        <form-invoice @done="showInvoiceDialog = false" :lead="lead"></form-invoice>
    </v-dialog> 
    <v-dialog v-model="showKPDialog" width="1200px">
        <kp :lead="lead" @close="showKPDialog = false"></kp>
    </v-dialog>
    <v-dialog v-model="showClientLeadsDialog" width="300px">
        <customer-leads @selectLead="loadLead" v-if="lead.customer && showClientLeadsDialog" :customer_id="lead.customer.id"></customer-leads>
    </v-dialog>
    <v-dialog v-model="showTzDialog" width="500px">
        <v-card v-if="tzDepartament">
            <v-toolbar color="primary" dense>
                <v-toolbar-title>ТЗ</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5" v-if="tzModel.comment">
                <p>Комментарий:</p>
                <p>{{tzModel.comment}}</p>
            </v-card-text>
            <v-card-text class="pt-3">
                <v-select v-model="tzModel.worker_user_id" :items="tzDepartament.users" label="Исполнитель" item-text="name" item-value="id"></v-select>
                <div v-for="field in tzDepartament.fields" :key="field.id">
                    <v-checkbox :disabled="tzModel.status == 'DONE'" v-if="field.type == 'BOOLEAN'" v-model="tzModel.data[field.id]" :label="getFieldLabel(field)" false-value="0" true-value="1"></v-checkbox>
                    <v-select dense solo outlined flat :disabled="tzModel.status == 'DONE'" v-else-if="field.type == 'USERSLIST'" v-model="tzModel.data[field.id]" :items="tzDepartament.users" :label="getFieldLabel(field)" item-text="name" item-value="id"></v-select>
                    <v-datetime-picker :disabled="tzModel.status == 'DONE'" v-else-if="field.type == 'DATETIME'" v-model="tzModel.data[field.id]" :label="getFieldLabel(field)" :time-picker-props="{format: '24hr'}" dense></v-datetime-picker>
                    <v-file-input :disabled="tzModel.status == 'DONE'" v-else-if="field.type == 'FILE'" v-model="tzModel.data[field.id]" multiple :label="getFieldLabel(field)" dense></v-file-input>
                    <v-text-field dense solo outlined flat :disabled="tzModel.status == 'DONE'" v-else-if="field.type == 'DATE'" v-model="tzModel.data[field.id]" :label="getFieldLabel(field)" readonly @focus="dateDialog(field.id)"></v-text-field>
                    <v-text-field dense solo outlined flat :disabled="tzModel.status == 'DONE'" v-else v-model="tzModel.data[field.id]" :label="getFieldLabel(field)" ></v-text-field>
                </div>
            </v-card-text>
            <v-card-actions v-if="!tzModel.id || $store.getters.user.id == tzModel.author_user_id">
                <v-spacer></v-spacer>
                <v-btn class="primary mr-2" small @click="showTzDialog = false">Отмена</v-btn>
                <v-btn class="success" small @click="sendDepartamentRequest">Сохранить</v-btn>
            </v-card-actions>
            <v-card-actions v-else>
                <v-spacer></v-spacer>
                <div v-if="tzModel.status =='NEW'">
                    <v-btn class="warning mr-2" small @click="showRequestCommentDialog = true">Отклонить</v-btn>
                    <v-btn class="success" small @click="statusRequest('ACCEPT')">Принять</v-btn>
                </div>
                <div v-else-if="tzModel.status !='DONE'">
                    <v-btn class="primary mr-2" small @click="showTzDialog = false">Отмена</v-btn>
                    <v-btn class="success mr-2" small @click="statusRequest('DONE')">Выполнить</v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog> 
    <v-dialog v-model="showDateDialog" width="290px">
        <v-date-picker no-title scrollable @change="changeDateDialog"></v-date-picker>
    </v-dialog>
    <v-dialog v-model="showCallbackDialog" width="700px">
        <v-card>
            <v-toolbar dense color="primary">
                <v-toolbar-title>История звонков</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <calls-log v-if="showCallbackDialog" :customer="lead.customer"></calls-log>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog width="350px" v-model="showRequestCommentDialog">
        <v-card v-if="showRequestCommentDialog">
            <v-toolbar dense color="primary">
                <v-toolbar-title>Комментарий</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-textarea v-model="tzModel.comment" dense rows="3" label="Текст комментария"></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="warning mr-2" small @click="showRequestCommentDialog = false">Отмена</v-btn>
                <v-btn class="success" small @click="statusRequest('REJECT')">Отправить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showCustomerDialog" width="300px">
        <v-card>
            <v-toolbar dense color="primary">
                <v-toolbar-title>Выбор клиента</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-autocomplete
                    @change="attachCustomer"
                    v-model="lead.customer_id"
                    :items="customers"
                    :search-input.sync="customerSearch"
                    clearable
                    small-chips
                    hide-details
                    hide-selected
                    item-text="name"
                    item-value="id"
                    label="Заказчик"
                    placeholder="Начните ввод для поиска"
                    >
                    <template v-if="customerSearch && customerSearch.length > 2" v-slot:no-data>
                        <v-list-item @click="addCustomer">
                            <v-list-item-content>
                                <v-list-item-title>Клиент с имененм <strong>"{{customerSearch}}"</strong> не найден</v-list-item-title>
                                <v-list-item-subtitle>Нажмите здесь, чтобы создать его</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-autocomplete>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="showManagerDialog" width="300px">
        <v-card>
            <v-toolbar dense color="primary">
                <v-toolbar-title>Выбор отвтственных</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-select small-chips hide-details @change="setUsers" multiple label="Выберите пользователей" v-model="lead.users" :items="$store.getters.users" item-text="name" item-value="id" return-object>
                    <template slot="item" slot-scope="data">
                        {{ data.item.name }} {{ data.item.surname }}
                    </template>
                </v-select>
            </v-card-text>
        </v-card>
    </v-dialog>
</v-sheet>
</template>
<script>
import { mapGetters } from 'vuex'
import fileList from '@/components/fileList'
import kp from '@/components/kp'
import customerLeads from '@/components/customers/leads'
import formInvoice from '@/components/forms/invoice'
import productionLeadProps from '@/views/departaments/production/leadProps'
import supplyLeadProps from '@/views/departaments/supply/leadProps'
import callsLog from '@/components/callsLog'
import customerContacts from '@/components/customers/contacts'
import customerAddresses from '@/components/customers/addresses'
import customerRequisites from '@/components/customers/requisites'
export default {
    props: ['lead_id', 'departament', 'settings', 'board'],
    components: {formInvoice, customerLeads, fileList, kp, productionLeadProps, supplyLeadProps, callsLog, customerContacts, customerAddresses, customerRequisites},
    computed: {
        ...mapGetters(['user', 'users', 'connected']),
        activeDepartament(){
            return this.$store.getters.departaments[this.activeDepartamentIndex]
        },
        departamentAttached(){
            return this.lead.boards.findIndex( b => b.departament_id == this.activeDepartament.id) > -1
        },
        fund(){
            return this.lead.funds.find( f => f.departament_id == this.activeDepartament.id)
        },
        departamentsToShow(){
            return this.$store.getters.departaments.filter( d => !this.settings || this.settings.departaments.indexOf(d.id) > -1)
        }
    },
    data(){
        return {
            customerPanels: false,
            dateFieldId: 0,
            showDateDialog: false,
            showRequestCommentDialog: false,
            showTzDialog: false,
            tzDepartament: false,
            tzFiles: {},
            customerSearch: '',
            customers: [],
            activeDepartamentIndex: 0,
            input: '',
            channel: false,
            watchers: [],
            lead: false,
            showManagerDialog: false,
            showCustomerDialog: false,
            showCallbackDialog: false,
            showFundDialog: false,
            showTaskDialog: false,
            showInvoiceDialog: false,
            showClientLeadsDialog: false,
            showKPDialog: false,
            fundModel: {},
            taskModel: {},
            tzModel: { data: {} },
            errors: {}
        }
    },
    async created(){
        if(this.enableWs && this.connected){
            this.channel = this.$ws.subscribe('lead:'+ this.lead_id)
            this.channel.on('watchers', data => {
                this.watchers = data
            })
            this.channel.on('update', data => {
                if(!data) this.close()
                else this.lead = data
            })
        }
        await this.loadLead(this.lead_id)
    },
    beforeDestroy(){
        if(this.enableWs && this.channel){
            this.channel.close()
        }
    },
    watch: {
		async customerSearch(val) {
			if(val && val.length > 2) {
                try{
                    const {data} = await axios.get('/customers', { params: { q: val } })
                    this.customers = data
                }catch(e){}
            }
		},
	},
    methods: {
        dateDialog(id){
            this.dateFieldId = id
            this.showDateDialog = true
        },
        getFieldLabel(field){
            let str = field.name
            if((!this.tzModel.id && field.required_for_author) || (field.required_for_worker && this.$store.getters.user.id == this.tzModel.worker_user_id)){
                str += '*'
            }
            return str
        },
        changeDateDialog(date){
            this.tzModel.data[this.dateFieldId] = moment(date).format('DD.MM.yyyy')
            this.showDateDialog = false
        },
        tzStatus(status){
            return {
                NEW: 'Новый',
                ACCEPT: 'Принят',
                DONE: 'Выполнен',
                REJECT: 'Отклонен'
            }[status]
        },
        callbackDialog(){
            if(!this.lead.customer){
                this.$toast.warning('Заказчик не указан')
                return false
            }
            if(!this.$store.getters.user.extention_id){
                this.$toast.warning('Не указан ID атс')
                return false
            }
            this.showCallbackDialog = true
        },
        async moveTo(subdepartament, board){
            if(board.id == this.board.id) return false
            const res = await this.$confirm('Подтвердить перенос лида в "'+board.name+'"', { title: 'Подтвердите действие!'})
			if(!res) return false
			this.$store.dispatch('load')
			try{
                await axios.post('/leads/'+this.lead.id+'/moveTo', {from: this.board.id, to: board.id, departament_id: subdepartament.id})
                this.$emit('move', board)
			}catch(e){}
			finally{
                this.$store.dispatch('unload')
                this.$router.push('/departaments/' + subdepartament.id)
            }
        },
        async setUsers(users){
            this.$store.dispatch('load')
            try{
                const {data} = await axios.post('/leads/'+this.lead.id+'/setUsers', {users: users.map( u => u.id)})
                this.lead.users = data
                this.$toast.success('Ответственные успешно назначены')
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        async destroyLead(){
            const res = await this.$confirm('Вы действительно хотите удалить этот лид?', { title: 'Подтвердите действие'})
            if(!res) return false
            try{
                await axios.delete('/leads/'+this.lead.id)
                this.close()
            }catch(e){}
        },
        async statusRequest(status){
            if(status == 'DONE'){
                let valid = true
                this.tzDepartament.fields.forEach(field => {
                    if(field.required_for_worker && !this.tzModel.data[field.id]) valid = false
                    return valid
                })
                if(!valid){
                    this.$toast.warning('Не заполнены обязательные поля')
                    return false
                }
            }
            this.$store.dispatch('load')
            this.tzModel.status = status
            try{
                await axios.put('/departamentRequests/'+this.tzModel.id, this.tzModel)
                this.showRequestCommentDialog = false
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        async sendDepartamentRequest(){
            let valid = true
            this.tzDepartament.fields.forEach(field => {
                if(field.required_for_author && !this.tzModel.data[field.id]) valid = false
                return valid
            })
            if(!valid){
                this.$toast.warning('Не заполнены обязательные поля')
                return false
            }
            this.$store.dispatch('load')
            this.tzModel.departament_id = this.tzDepartament.id
            this.tzModel.lead_id = this.lead.id
            try{
                if(!this.tzModel.id){
                    const {data} = await axios.post('/departamentRequests', this.tzModel)
                    this.lead.requests.push(data)
                    this.$toast.success('Запрос успешно отправлен')
                }else{
                    await axios.put('/departamentRequests/'+this.tzModel.id, this.tzModel)
                    this.$toast.success('Запрос успешно изменен')
                }
                this.showTzDialog = false
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        tzDialog(model, departament){
            if(model){
                this.tzModel = Object.assign({}, model)
                this.tzModel.data = JSON.parse(this.tzModel.data)
            }else{
                this.tzModel = {
                    data: {}
                }
            }
            this.tzDepartament = departament
            this.showTzDialog = true
        },
        close(){ this.$emit('close') },
        async attachCustomer(customer_id){
            this.$store.dispatch('load')
            try{
				const {data} = await axios.post('/leads/'+this.lead.id+'/attachCustomer', { customer_id})
                this.lead.customer = data
                this.editCustomer = false
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        async addCustomer(){
            if(!this.customerSearch) return false
            this.$store.dispatch('load')
            try{
				const {data} = await axios.post('/customers', { name: this.customerSearch})
				this.customers.push(data)
                this.$toast.success('Клиент успешно добавлен!')
                this.customerSearch = ''
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        async loadLead(lead_id){
            const {data} = await axios.get('/leads/'+lead_id)
            this.lead = data
            if(this.lead.customer)
            this.customers = [this.lead.customer]
        },
        async toggleDepartament(){
            try{
                const {data} = await axios.post('/departaments/' + this.activeDepartament.id + '/toggleLead', { id: this.lead.id })
                if(this.departamentAttached){
                    this.lead.boards.splice( this.lead.boards.findIndex( b => b.departament_id == this.activeDepartament.id), 1)
                }else{
                    this.lead.boards.push(data)
                }
            }catch(e){}
        },
        async destroyFund(id){
            const res = await this.$confirm('Удалить бюджет?', { title: 'Подтвердите действие'})
            if(!res) return false
            try{
                await axios.delete('/funds/' + id)
                this.$toast.success('Бюджет удален')
            }catch(e){}
        },
        openFundDialog(model){
            this.fundModel = model || {}
            this.showFundDialog = true
        },
        async setTask(){
            const model = this.taskModel
            this.errors = {}
            if(!model.notify_at){
                this.errors.notify_at = 'Необходимо указать дату'
                return false
            }
            model.lead_id = this.lead.id
            try{
                const {data} = await axios.post('/tasks', model)
                this.taskModel = {}
                this.showTaskDialog = false
                this.$toast.success('Задача успешно добавлена')
            }catch(e){}
        },
        async setFund(){
            if( !this.fundModel.value){
                this.errors = { fund: 'Не указана сумма'}
                return false
            }
            this.fundModel.lead_id = this.lead.id
            this.fundModel.departament_id = this.activeDepartament.id
            try{
                if(!this.fundModel.id){
                    const {data} = await axios.post('/funds', this.fundModel)
                }else{
                    await axios.put('/funds/'+this.fundModel.id, this.fundModel)
                }
                this.$toast.success('Успешно')
                this.showFundDialog = false
                this.fundModel = {}
            }catch(e){}
        },
        async sendMessage(){
            if(!this.input) return false
            try{
                const {data} = await axios.post('/messages', {
                    body: this.input,
                    messageable_id: this.lead.id,
                    messageable_type: 'leads'
                })
                this.input = ''
            }catch(e){}
        }
    }
}
</script>