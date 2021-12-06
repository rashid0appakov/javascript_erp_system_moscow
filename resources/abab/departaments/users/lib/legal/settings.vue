<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <board-settings :departament="departament"></board-settings>
                </v-col>
                <v-col cols="12" sm="6" md="4">
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
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    computed:{
        ...mapGetters(['users']),
    },
    data(){
        return {
            departament: false,
            modelUsers: []
        }
    },
    methods: {
        async setRule(user, rule){
			try{
				await axios.post('/departaments/'+this.departament.id+'/setRule', {user_id: user.id, rule})
				user.pivot.access = rule
			}catch(e){}
		},
		async addUser(users){
			const {data} = await axios.post('/departaments/'+this.departament.id+'/syncUsers', {users: users.map( user => user.id )})
            this.departament.users = data
		}
    },
    created(){
        this.departament = this.$store.getters.departaments(this.d_logistic)
        this.modelUsers = this.departament.users.slice()
    }
}
</script>