<template>
<v-sheet class="fill-height" v-if="departament">
	<v-navigation-drawer v-model="selectedLead" absolute right touchless width="100%">
		<lead @move="move" @close="selectedLead = false" v-if="selectedLead" :board="board" :settings="boardSettings" :departament="departament.id" :lead_id="selectedLead.id"></lead>
	</v-navigation-drawer>
	<v-toolbar dense flat>
		<v-toolbar-title>{{departament.name}}</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-btn @click="addLead" :disabled="!departament.boards.length" small color="orange darken-4"><v-icon>mdi-plus</v-icon> Новый лид</v-btn>
        <v-btn small @click="showUsersDialog = true" class="primary ml-2"><v-icon>mdi-account-multiple-plus</v-icon></v-btn>
		<v-btn small @click="departamentDialog(false)" class="primary ml-2" v-if="!departament.parent_id"><v-icon>mdi-plus</v-icon></v-btn>
		<v-btn small @click="departamentDialog(true)" class="warning ml-2"><v-icon>mdi-pencil</v-icon></v-btn>
		<v-btn small @click="destroyDepartament" class="error ml-2" v-if="departament.parent_id"><v-icon>mdi-delete</v-icon></v-btn>
	</v-toolbar>
	<v-card-text>
		<v-row>
			<v-col cols="12" md="3" v-for="child in $store.getters.subdepartaments" :key="child.id">
				<v-btn class="primary" width="100%" :to="'/departaments/'+departament.id+'/' + child.id">{{child.name}}</v-btn>
			</v-col>
		</v-row>
		<board-list @selectLead="selectLead" :departament_id="departament.id"></board-list>
	</v-card-text>
	<v-dialog v-model="showdepartamentDialog" width="500px">
		<departament-form @done="departamentDone" :model="departamentModel" v-if="showdepartamentDialog"></departament-form>
	</v-dialog>
	<v-dialog v-model="showUsersDialog" width="400px">
		<v-card>
			<v-toolbar dense color="primary">
				<v-toolbar-title>Пользователи</v-toolbar-title>
			</v-toolbar>
			<v-list dense>
				<v-list-item>
					<v-select @change="addUser" :items="users" return-object v-model="departament.users" item-text="name" label="Список пользователей" multiple></v-select>
				</v-list-item>
				<v-list-item v-for="user in departament.users" :key="user.id">
					<v-list-item-content>
						<v-list-item-title>{{user.name}}</v-list-item-title>
					</v-list-item-content>
					<v-list-item-action>
						<span>
							<v-btn :class="{success: user.pivot.access == 'd'}" class="mr-1" x-small @click="setRule(user, 'd')"><v-icon small>mdi-close-octagon-outline</v-icon></v-btn>
							<v-btn :class="{success: user.pivot.access == 'r'}" class="mr-1" x-small @click="setRule(user, 'r')"><v-icon small>mdi-eye</v-icon></v-btn>
							<v-btn :class="{success: user.pivot.access == 'w'}" class="mr-1" x-small @click="setRule(user, 'w')"><v-icon small>mdi-pencil</v-icon></v-btn>
							<v-btn :class="{success: user.pivot.access == 'x'}" x-small @click="setRule(user, 'x')"><v-icon small>mdi-cog</v-icon></v-btn>
						</span>
					</v-list-item-action>
				</v-list-item>
			</v-list>
		</v-card>
	</v-dialog>
</v-sheet>
<error v-else title="Ошибка 404!" body="Отдел не найден"></error>
</template>
<script>
import lead from '@/components/lead'
import departamentForm from '@/components/forms/departament'
import boardList from '@/components/boards/list'

import Production from '@/views/departaments/production'
import {mapGetters} from 'vuex'
import Error from '@/components/error'
export default {
    components: { Error, lead, departamentForm, boardList, Production},
    data(){
        return {
            selectedLead: false,
			showUsersDialog: false,
			board: false,
			boardSettings: false,
			showdepartamentDialog: false,
			departamentModel: false,
			departament: false
        }
	},
    computed: {
        ...mapGetters(['users'])
	},
	created(){
		this.departament = this.$store.getters.departament(this.$route.params.id)
	},
	watch: {
		$route(to, from) {
			this.departament = this.$store.getters.departament(this.$route.params.id)
		}
	},
    methods: {
		move(board){
			this.boardSettings = JSON.parse(board.settings)
			this.board = board
		},
        selectLead(lead, board){
			this.boardSettings = JSON.parse(board.settings)
			this.board = board
			this.selectedLead = lead
		},
		departamentDialog(flag){
			if(flag){
				this.departamentModel = this.departament
			}else{
				this.departamentModel = {
					parent_id: this.departament.id
				}
			}
			this.showdepartamentDialog = true
		},
		departamentDone(departament){
			this.showdepartamentDialog = false
		},
		async destroyDepartament(){
			const res = await this.$confirm('Вы уверены, что хотите удалить раздел? Это повлечет удалеие всех лидов и воронок, находящихся в нем!', { title: 'Подтвердите действие'})
			const parent_id = this.departament.parent_id
			axios.delete('/departaments/'+this.departament.id)
			this.$router.push('/departaments/'+parent_id)
		},
		async addLead(){
			const defaultBoard = this.departament.boards.find( b => b.isDefault == 1)
			if(!defaultBoard) {
				this.$toast.error('Лид не может быть создан, не найдена доска по умолчанию')
				return false
			}
			this.$store.dispatch('load')
			try{
				const {data} = await axios.post('/leads', { departament_id: this.departament.id})
				this.$toast.success('Лид успешно добавлен')
				this.selectLead(data, defaultBoard)
			}catch(e){
				if(e.response && e.response.status == 404 && e.response.data.message) this.$toast.error(e.response.data.message)
			}finally{ this.$store.dispatch('unload')}
        },
        async setRule(user, rule){
			this.$store.dispatch('load')
			try{
				await axios.post('/departaments/'+this.departament.id+'/setRule', {user_id: user.id, rule})
				user.pivot.access = rule
				this.$toast.success('Настройки успешно сохранены')
			}catch(e){}
			finally{this.$store.dispatch('unload')}
		},
		async addUser(users){
			this.$store.dispatch('load')
			try{
				const {data} = await axios.post('/departaments/'+this.departament.id+'/syncUsers', {users: users.map( user => user.id )})
				this.departament.users = data
				this.$toast.success('Настройки успешно сохранены')
			}catch(e){}
			finally{this.$store.dispatch('unload')}
		}
    },
}
</script>