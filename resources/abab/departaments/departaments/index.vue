<template>
<v-sheet class="fill-height">
	<v-navigation-drawer v-model="selectedLead" absolute right touchless width="100%">
		<lead @close="selectedLead = false" v-if="selectedLead" :departament="d_sale" :lead_id="selectedLead.id"></lead>
	</v-navigation-drawer>
	<v-toolbar dense flat>
		<v-toolbar-title>Продажи</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-btn @click="createLeadDialog = true" small color="orange darken-4" :disabled="!$store.getters.departaments(d_sale).boards.length"><v-icon>mdi-plus</v-icon> Новый лид</v-btn>
	</v-toolbar>
	<v-card-text>
		<board-list @selectLead="selectLead" :departament="departament"></board-list>
	</v-card-text>
	<v-dialog v-model="createLeadDialog" width="500px">
		<lead-form @create="addLead" v-if="createLeadDialog"></lead-form>
	</v-dialog>
	<v-dialog v-model="showUsersDialog" width="400px">
		<v-card>
			<v-toolbar dense color="primary">
				<v-toolbar-title>Пользователи</v-toolbar-title>
			</v-toolbar>
			<v-list dense>
				<v-list-item>
					<v-select @change="addUser" :items="users" return-object v-model="modelUsers" item-text="name" label="Список пользователей" multiple></v-select>
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
</template>
<script>
import lead from '@/components/lead'
import leadForm from '@/components/leadForm'
import boardList from '@/components/boards/list'
export default {
	components: { lead, leadForm, boardList },
	data() {
		return {
			createLeadDialog: false,
			selectedLead: false,
			departament: false,
			showUsersDialog: false
		};
	},
	methods: {
		selectLead(lead){
			this.selectedLead = lead
		},
		async addLead(lead){
			this.createLeadDialog = false
		}
	},
	created(){
		this.departament = this.$store.getters.departaments(this.d_sale)
	}
};
</script>