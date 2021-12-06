<template>
<v-sheet class="fill-height">
	<div v-dragscroll class="kanban">
		<table>
			<tr>
				<td>
					<v-btn fab x-small class="success" @click="boardDialog({})"><v-icon small>mdi-plus</v-icon></v-btn>
				</td>
				<td v-for="board in $store.getters.departament(departament_id).boards" :key="board.id">
					<v-card width="300px">
						<v-app-bar :color="board.color" dense>
							<v-toolbar-title>{{board.name}}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn class="mr-1 primary" x-small @click="boardDialog(board, index)"><v-icon small>mdi-pencil</v-icon></v-btn>
                            <v-btn class="mr-1 error" x-small @click="destroy(board.id)"><v-icon small>mdi-delete</v-icon></v-btn>
							<v-btn small icon><v-icon>mdi-blur</v-icon></v-btn>
						</v-app-bar>
						<v-list three-line>
							<drop-list :items="board.leads" @reorder="reorder($event, board)" @insert="insert($event, board)" mode="cut">
								<template v-slot:item="{item, reorder}">
									<drag :key="item.id" :data="item" @cut="remove(board, item)">
										<v-list-item :style="reorder ? {borderLeft: '2px solid #1976D2', marginLeft:'-2px'} : {}">
											<v-list-item-content>
												<v-list-item-title @click="selectLead(item, board)">#{{item.id}} <small>{{item.source}}</small></v-list-item-title>
												<v-list-item-subtitle>
													<small v-if="item.customer">{{item.customer.name}}</small>
													<small v-else>Заказчик не указан</small>
												</v-list-item-subtitle>
												<div>
													<v-btn x-small class="mr-1 primary" @click="getDepartamentRequests(id, item.id)" v-for="(d, id) in leadDepartaments(item)" :key="id"><v-icon x-small >{{d.icon}}</v-icon></v-btn>
												</div>
											</v-list-item-content>
											<v-list-item-action>
												<v-list-item-action-text>{{item.created_at | moment('DD.MM HH:mm')}}</v-list-item-action-text>
											</v-list-item-action>
										</v-list-item>
										<v-divider/>
									</drag>
								</template>
								<template v-slot:reordering-drag-image/>
								<template v-slot:feedback="{data}">
									<v-skeleton-loader type="list-item-avatar-three-line" :key="data.id" style="border-left: 2px solid #1976D2; margin-left: -2px;"/>
								</template>
							</drop-list>
						</v-list>
					</v-card>
				</td>
			</tr>
		</table>
	</div>
	<v-dialog v-model="dialog" width="800px">
		<v-card v-if="model">
			<v-toolbar dense class="primary">
				<v-toolbar-title>{{model.name ? model.name : 'Новая доска'}}</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-row>
					<v-col cols="12" md="6">
						<v-checkbox v-model="model.isDefault" label="По умолчанию"></v-checkbox>
						<v-text-field label="Название" v-model="model.name" autofocus></v-text-field>
						<v-text-field label="Сортировка" v-model="model.sort"></v-text-field>
						<v-menu v-model="colorMenu" :close-on-content-click="false" :nudge-width="200" offset-y>
							<template v-slot:activator="{ on, attrs }">
								<v-chip :color="model.color" v-bind="attrs" v-on="on">Цвет</v-chip>
							</template>
							<v-card>
								<v-color-picker @update:color="setColor" class="mx-auto" v-model="model.color" show-swatches hide-inputs hide-canvas></v-color-picker>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn small class="success" @click="colorMenu = false">OK</v-btn>
								</v-card-actions>
							</v-card>
						</v-menu>
					</v-col>
					<v-col cols="12" md="6">
						<v-expansion-panels v-if="model.id">
							<v-expansion-panel v-if="model.lead_sources.length">
								<v-expansion-panel-header>
									Источники
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-list dense>
										<v-list-item v-for="(source, i) in model.lead_sources" :key="i">
											<v-list-item-icon>
												<v-icon v-text="source.type == 'ATC' ? 'mdi-phone' : 'mdi-email' "></v-icon>
											</v-list-item-icon>
											<v-list-item-content>
												<v-list-item-title v-text="source.value"></v-list-item-title>
											</v-list-item-content>
											<v-list-item-action>
												<div>
													<v-btn x-small class="warning mr-2" @click="sourceDialog(source)"><v-icon small>mdi-pencil</v-icon></v-btn>
													<v-btn x-small class="error" @click="destroySource(source.id)"><v-icon small>mdi-delete</v-icon></v-btn>
												</div>
											</v-list-item-action>
										</v-list-item>
									</v-list>
								</v-expansion-panel-content>
							</v-expansion-panel>
							<v-expansion-panel v-if="model.settings.emails.length || model.settings.tasks.length || model.settings.users.length">
								<v-expansion-panel-header>
									Действия
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-list dense>
										<v-list-item v-for="(action, i) in model.settings.emails" :key="i">
											<v-list-item-content>
												<v-list-item-title>Отправка письма</v-list-item-title>
											</v-list-item-content>
											<v-list-item-action>
												<div>
													<v-btn x-small class="warning mr-2" @click="actionDialog('emails', action)"><v-icon small>mdi-pencil</v-icon></v-btn>
													<v-btn x-small class="error" @click="model.settings.emails.splice(i, 1)"><v-icon small>mdi-delete</v-icon></v-btn>
												</div>
											</v-list-item-action>
										</v-list-item>
									</v-list>
									<v-list dense>
										<v-list-item v-for="(action, i) in model.settings.tasks" :key="i">
											<v-list-item-content>
												<v-list-item-title>Постановка задачи</v-list-item-title>
											</v-list-item-content>
											<v-list-item-action>
												<div>
													<v-btn x-small class="warning mr-2" @click="actionDialog('tasks', action)"><v-icon small>mdi-pencil</v-icon></v-btn>
													<v-btn x-small class="error" @click="model.settings.tasks.splice(i, 1)"><v-icon small>mdi-delete</v-icon></v-btn>
												</div>
											</v-list-item-action>
										</v-list-item>
									</v-list>
									<v-list dense>
										<v-list-item v-for="(action, i) in model.settings.users" :key="i">
											<v-list-item-content>
												<v-list-item-title>Смена пользователей</v-list-item-title>
											</v-list-item-content>
											<v-list-item-action>
												<div>
													<v-btn x-small class="warning mr-2" @click="actionDialog('users', action)"><v-icon small>mdi-pencil</v-icon></v-btn>
													<v-btn x-small class="error" @click="model.settings.users.splice(i, 1)"><v-icon small>mdi-delete</v-icon></v-btn>
												</div>
											</v-list-item-action>
										</v-list-item>
									</v-list>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-expansion-panels>
						<v-divider></v-divider>
						<v-btn width="100%" small class="success" @click="actionDialog()">Добавить действие</v-btn>
						<v-divider></v-divider>
						<v-select v-model="model.settings.departaments" :items="$store.getters.departaments" item-text="name" item-value="id" multiple label="Активные отделы"></v-select>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small @click="dialog = false">Отмена</v-btn>
				<v-btn small color="primary" @click="save" :disabled="!model.name">Сохранить</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
	<v-dialog v-model="showSourceDialog" width="350px">
		<v-card v-if="showSourceDialog">
			<v-toolbar dense color="primary">
				<v-toolbar-title>Источник</v-toolbar-title>
			</v-toolbar>
			<v-card-text class="pt-5">
				<v-select
					dense
					outlined
					v-model="sourceModel.type"
					:items="['ATC', 'EMAIL']"
					label="Тип"
				></v-select>
				<v-select
					dense
					outlined
					v-model="sourceModel.value"
					:items="numbers"
					label="Значение"
					item-text="name"
					item-id="name"
					v-if="sourceModel.type == 'ATC'"
				></v-select>
				<v-text-field v-else dense outlined label="Значение" v-model="sourceModel.value"></v-text-field>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small class="success" @click="saveSource">Сохранить</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
	<v-dialog v-model="showDepartamentRequests" width="350px">
		<v-card>
			<v-toolbar dense color="primary">
				<v-toolbar-title>Список созданных ТЗ</v-toolbar-title>
			</v-toolbar>
			<v-card-text class="pt-5">
				<v-list two-line subheader dense>
					<template v-for="d in departamentRequests">
						<v-subheader :key="d.id">{{d.name}}</v-subheader>
						<v-list-item v-for="r in d.requests" :key="r.id" :class="{primary: r.status == 'NEW', warning: r.status=='ACCEPT', success: r.status=='DONE', error: r.status == 'REJECT'}">
							<v-list-item-content>
								<v-list-item-title>{{tzStatus(r.status)}}</v-list-item-title>
								<v-list-item-subtitle>{{r.created_at | moment()}}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-list>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small class="success" @click="showDepartamentRequests = false">Закрыть</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
	<v-dialog v-model="showActionDialog" width="400px">
		<v-card>
			<v-toolbar dense color="primary">Новое действие</v-toolbar>
			<v-card-text class="pt-5">
				<v-select v-model="actionType" :items="actions" item-text="label" item-value="value" label="Тип действия" dense solo outlined></v-select>
				<v-radio-group v-model="actionOn" column>
					<v-radio label="При переносе на доску" :value="1"></v-radio>
					<v-radio label="При переносе с доски" :value="2"></v-radio>
					<v-radio label="При создании на доске" :value="3"></v-radio>
				</v-radio-group>
				<div v-if="actionType == 'emails'">
					<v-select dense solo outlined clearable :items="templates" item-text="name" item-value="id" label="Отправка по шаблону" v-model="actionEmail.template_id"></v-select>
					<v-text-field v-if="!actionEmail.template_id" placeholder="Тема" v-model="actionEmail.subject" dense solo outlined></v-text-field>
					<v-textarea v-if="!actionEmail.template_id" placeholder="Текст письма" v-model="actionEmail.body" dense solo outlined></v-textarea>
				</div>
				<div v-else-if="actionType == 'users'">
					<v-checkbox v-model="actionUsers.keep" :true-value="1" :false-value="0" label="Оставить предыдущих"></v-checkbox>
					<v-select v-model="actionUsers.users" :items="$store.getters.departament(departament_id).users" item-text="name" item-value="id" label="Выберите пользователей" small-chips hide-details multiple dense solo outlined>
						<template slot="item" slot-scope="data">
							{{ data.item.name }} {{ data.item.surname }}
						</template>
					</v-select>
				</div>
				<div v-if="actionType == 'tasks'">
					<v-select dense solo outlined flat small-chips multiple label="Выберите пользователей" v-model="actionTask.users" :items="$store.getters.departament(departament_id).users" item-text="name" item-value="id">
						<template slot="item" slot-scope="data">
							{{ data.item.name }} {{ data.item.surname }}
						</template>
					</v-select>
					<v-textarea type="textarea" placeholder="Задача" v-model="actionTask.message" dense solo outlined></v-textarea>
				</div>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small class="warning mr-2" @click="showActionDialog = false">Отмена</v-btn>
				<v-btn small class="success" @click="addAction">Сохранить</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</v-sheet>
</template>
<script>
import {Drag,Drop,DropList} from "vue-easy-dnd";
import { dragscroll } from 'vue-dragscroll'
import { mapGetters } from 'vuex'
export default {
	components: { Drag, DropList, Drop },
	directives: { dragscroll },
	props: ['departament_id'],
	computed: {
		...mapGetters(['users'])
	},
	data() {
		return {
			actionOn: 1,
			isActionEdit: false,
			actionType: false,
			actionTask: {},
			actionEmail: {},
			actionUsers: {},
			numbers: [],
			colorMenu: false,
			removeIndex: false,
			removeBoard: false,
			model: false,
			actions: [
				{label: 'Отправить письмо', value: 'emails'},
				{label: 'Сменить ответственных', value: 'users'},
				{label: 'Добавить задачу', value: 'tasks'}
			],
			sourceModel: {},
			dialog: false,
			index: 0,
			showActionDialog: false,
			showSourceDialog: false,
			departamentRequests: [],
			showDepartamentRequests: false,
			templates: []
		};
	},
	methods: {
		actionDialog(type, model){
			this.actionTask = {}
			this.actionEmail = {}
			this.actionUsers = {}
			if(type){
				this.isActionEdit = true
				this.actionType = type
				this.actionOn = model.actionOn
				if(type == 'emails') this.actionEmail = model
				else if(type == 'tasks') this.actionTask = model
				if(type == 'users') this.actionUsers = model
			}else{
				this.isActionEdit = false
			}
			this.showActionDialog = true
		},
		addAction(){
			if(!this.actionType 
			|| (this.actionType == 'emails' && ( !this.actionEmail.template_id && (!this.actionEmail.subject || !this.actionEmail.body)))
			|| (this.actionType == 'users' && (!this.actionUsers.users || !this.actionUsers.users.length))
			|| (this.actionType == 'tasks' && (!this.actionTask.users || !this.actionTask.users.length || !this.actionTask.message))){
				this.$toast.warning('Заполните все поля для продолжения')
				return false
			}
			let item = false
			if(this.actionType == 'emails'){
				item = this.actionEmail
				this.actionEmail = {}
			}else if(this.actionType == 'users'){
				item = this.actionUsers
				this.actionUsers = {}
			}else if(this.actionType == 'tasks'){
				item = this.actionTask
				this.actionTask = {}
			}
			item.actionOn = this.actionOn
			if(!this.isActionEdit) this.model.settings[this.actionType].push(item)
			this.showActionDialog = false
			this.actionType = false
			this.actionOn = 1
		},
		async getDepartamentRequests(departament_id, lead_id){
			const {data} = await axios.get('departaments/'+departament_id+'/getRequests', { params: {lead_id}})
			this.departamentRequests = data
			this.showDepartamentRequests = true
		},
		async destroySource(id){
			const res = await this.$confirm('Вы уверены, что хотите удалить этот источник?')
			if(!res) return false
			await axios.delete('/leadSources/'+id)
			this.model.lead_sources.splice(this.model.lead_sources.findIndex( ls => ls.id == id), 1)
		},
		async saveSource(){
			this.sourceModel['board_id'] = this.model.id
			try{
				if(this.sourceModel.id){
					await axios.put('/leadSources/'+this.sourceModel.id, this.sourceModel)
				}else{
					const {data} = await axios.post('/leadSources', this.sourceModel)
					this.model.lead_sources.push(data)
				}
				this.showSourceDialog = false
				this.$toast.success('Успешно сохранено')
			}catch(e){}
		},
		sourceDialog(model){
			this.sourceModel = model
			this.showSourceDialog = true
		},
		tzStatus(status){
            return {
                NEW: 'Новый',
                ACCEPT: 'Принят',
                DONE: 'Выполнен',
                REJECT: 'Отклонен'
            }[status]
        },
		leadDepartaments(lead){
			const res = {}
			const departaments = this.$store.getters.allDepartaments
			lead.requests.forEach( request => {
				let departament = departaments.find( d => d.id == request.departament_id)
				if(!departament) return false
				request.departament = {
					name: departament.name
				}
				if(departament.parent_id) departament = departaments.find( d => d.id == departament.parent_id)
				if(!res[departament.id]) res[departament.id] = {
					icon: departament.icon,
					requests: []
				}
				res[departament.id].requests.push(request)
			})
			return res
		},
		selectLead(lead, board){
			this.$emit('selectLead', lead, board)
		},
		async insert(event, board) {
			const res = await this.$confirm('Подтвердить перенос лида #' + event.data.id + ' в "'+board.name+'"', { title: 'Подтвердите действие!'})
			if(!res) return false
			this.$store.dispatch('load')
			try{
				await axios.post('/leads/'+event.data.id+'/moveTo', {from: this.removeBoard.id, to: board.id, departament_id: this.departament_id})
			}catch(e){}
			finally{this.$store.dispatch('unload')}
		},
		async reorder(event, board){
			event.apply(board.leads)
		},
		remove(board, value) {
			this.removeIndex = board.leads.indexOf(value);
			this.removeBoard = board
		},
		setColor(color){
			this.model.color = color.hex
        },
		async boardDialog(board, index){
			const model = Object.assign({}, board)
			if(!model.settings) model.settings = { users: [], emails: [], tasks: [], departaments: [], terms: [] }
			else model.settings = JSON.parse(model.settings)
			if(!model.settings.users) model.settings.users = []
			if(!model.settings.tasks) model.settings.tasks = []
			if(!model.settings.emails) model.settings.emails = []
			this.model = model
			this.index = index
			if(!this.templates.length){
				const templates = await axios.get('/templates')
				this.templates = templates.data
			}
			if(!this.numbers.length){
				const {data} = await axios.get('/atc/numbers')
				this.numbers = data
			}
			this.dialog = true
		},
		async save(){
			try{
				const model = Object.assign({}, this.model)
				model.departament_id = this.departament_id
				model.settings = JSON.stringify(model.settings)
				this.$store.dispatch('load')
                if(this.model.id){
                    const { data } = await axios.put('/boards/'+this.model.id, model)
                }else{
                    const {data} = await axios.post('/boards', model)
                }
				this.$toast.success('Этап успешно' + (this.model.id ? ' обновлен' : ' добавлен'))
				this.dialog = false
                this.model = false
			}catch(e){}
			finally{this.$store.dispatch('unload')}
        },
		async destroy(id){
			const res = await this.$confirm('Вы уверены, что хотите удалить этот этап? Также будут удалены все лиды, находящиеся на ней', { title: 'Подтвердите действие'})
			if(res){
				try{
					await axios.delete('/boards/'+id)
					// this.departament.boards.splice(this.departament.boards.findIndex( b => b.id == id), 1)
					this.$toast.success('Доска успешно удалена!')
				}catch(e){}
			}
		}
	}
};
</script>