<template>
    <v-card dense class="fill-height position-relative">
        <v-toolbar dense class="primary">
            <v-toolbar-title>Список пользователей</v-toolbar-title>
        </v-toolbar>
        <v-tabs v-model="activeDepartament" dense show-arrows>
            <v-btn x-small text v-for="departament in $store.getters.departaments" class="align-self-center mr-3" :key="departament.id">
                <v-icon small class="mr-2">{{departament.icon}}</v-icon>
                {{departament.name}}
            </v-btn>
        </v-tabs>
        <v-tabs-items v-model="activeDepartament">
            <v-tab-item v-for="departament in $store.getters.departaments" :key="departament.id">
                <v-list dense two-line>
                    <template v-for="item in departament.users">
                        <v-list-item :key="item.id" :class="{success: $store.getters.onlineUsers.findIndex( u => u.id == item.id)>-1}">
                            <v-list-item-content>
                                <v-list-item-title>{{item.name}}</v-list-item-title>
                                <v-list-item-subtitle>{{item.role.name}}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{item.activity_at | moment('fromNow')}}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <span>
                                    <v-btn x-small class="primary mr-2" fab @click="messageDialog(item, 'telegram')"><v-icon small>mdi-telegram</v-icon></v-btn>
                                    <v-btn x-small class="success" fab @click="messageDialog(item, 'sms')"><v-icon small>mdi-cellphone-message</v-icon></v-btn>
                                </span>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider :key="item.role_id+''+item.id"></v-divider>
                    </template>
                </v-list>
            </v-tab-item>
        </v-tabs-items>
        <v-dialog v-model="showMessageDialog" width="300px">
            <v-card v-if="messageUser">
                <v-toolbar dense>
                    <v-toolbar-title>Сообщение пользователю {{messageUser.name}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field rows="3" v-model="message" counter="255" dense></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning mr-2" @click="showMessageDialog = false">Отмена</v-btn>
                    <v-btn small class="success mr-2" @click="sendMessage">Отправить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
export default {
    data(){ 
        return {
            message: '',
            showMessageDialog: false,
            activeDepartament: 0,
            messageType: false,
            messageUser: false
        }
    },
    methods: {
        messageDialog(user, messageType){
            if(!user.telegram_id){
                this.$toast.warning('У пользователя не указаны настроки telegram')
                return false
            }
            this.message = ''
            this.messageType = messageType
            this.messageUser = user
            this.showMessageDialog = true
        },
        async sendMessage(){
            try{
                await axios.post('/users/'+this.messageUser.id+'/telegram', {message: this.message})
                this.$toast.success('Сообщение успешно отправлено')
                this.message = ''
                this.showMessageDialog = false
            }catch(e){}
        }
    }
}
</script>