<template>
    <v-card v-if="user">
        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <avatar :user="user" size="96"></avatar>
                    <v-divider class="my-2"></v-divider>
                    <v-card v-if="user.files.length" width="300px" dense>
                        <v-card-title>Вложения</v-card-title>
                        <v-list dense>
                            <v-list-item v-for="item in user.attachments" :key="item.id">
                                {{item.type}} | {{item.name}}
                            </v-list-item>
                        </v-list>
                    </v-card>
                    <!-- <v-btn color="success" @click="update"><v-icon left dark>check</v-icon> Сохранить</v-btn> -->
                </v-col>
                <v-col cols="12" md="6">
                    <v-list two-line dense>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{user.surname}} {{user.name}} {{user.lastname}}</v-list-item-title>
                                <v-list-item-subtitle>Последняя активность {{user.activity_at | moment('fromNow')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>{{user.email}}</v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <error v-else-if="notFound" title="Ошибка 404!" :body="'Пользователь с ID '+$route.params.id+' не найден'"></error>
</template>
<script>
import avatar from '@/components/avatar'
import Error from '@/components/error'
export default {
    components: {Error, avatar},
    data(){
        return {
            user: false,
            notFound: false
        }
    },
    methods: {
        async update(){
            try{
                const {data} = await axios.put('/users/'+this.user.id, this.user)
                this.user = data
                this.$toast.success('Профиль успешно обновлен!')
            }catch(e){}
        }
    },
    async created(){
        try{
            this.notFound = false
            const { data } = await axios.get('/users/'+this.$route.params.id)
            this.user = data
        }catch(e){
            if(e.response.status == 404) this.notFound = true;                
        }
    }
}
</script>