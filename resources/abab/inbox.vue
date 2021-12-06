<template>
    <v-card>
        <v-toolbar dense>
            <v-toolbar-title>Почта</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn x-small fab color="primary" @click="email=true"><v-icon small>mdi-email</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
            <v-row v-for="(message,i) in messages" :key="i" class="mb-5 pb-2 elevation-1" align-center>
                <v-col cols="12" md="9" class="py-0" @click="readMessage(message)">
                    {{message.subject}}
                </v-col>
                <v-col cols="12" sm="3" class="text-right caption py-0">
                    <v-btn icon x-small @click="addLead(message)" title="Новый лид">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn icon x-small @click="markDeleted(message)" title="Удалить">
                        <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-dialog v-model="email" width="500">
            <email @done="email = false"></email>
        </v-dialog>
    </v-card>
</template>
<script>
import email from '@/components/email'
export default {
    components: { email },
	data() {
        return {
            email: false,
            messages: []
        }
    },
    async created(){
        this.$store.dispatch('load')
        try{
            const {data} = await axios.get('/inbox')
            this.messages = data
        }
        catch(e){}
        finally{this.$store.dispatch('unload')}
    },
    methods: {
        async addLead(message){
            this.$store.dispatch('load')
            try{
                await axios.post('/leads/storeByEmail', {departament_id: 1, message})
                this.$toast.success('Лид успешно добавлен')
            }
            catch(e){}
            finally{this.$store.dispatch('unload')}
        }
    },
}
</script>