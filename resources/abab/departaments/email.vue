<template>
    <v-card>
        <v-card-title class="headline primary">Отправка сообщения</v-card-title>
        <v-card-text class="pa-5">
            <v-form>
                <v-select dense solo outlined clearable :items="templates" item-text="name" item-value="id" label="Отправка по шаблону" v-model="message.template"></v-select>
                <v-text-field dense outlined solo  :disabled="to != undefined" v-model="message.to" label="Кому"></v-text-field>
                <v-text-field v-if="!message.template" dense outlined solo v-model="message.subject" label="Тема"></v-text-field>
                <v-textarea v-if="!message.template" dense outlined solo v-model="message.body" label="Текст письма"></v-textarea>
            </v-form>
        </v-card-text>
        <v-card-actions class="pa-5">
            <v-btn class="ml-auto" @click="done" outlined color="primary">Отмена</v-btn>
            <v-btn color="primary" :disabled="!message.body && !message.template" @click="send()">Отправить</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: ['to', 'user_id', 'lead_id'],
    computed: {
        ...mapGetters( ['user'] )
    },
    data(){
        return {
            message: {},
            templates: []
        }
    },
    async created(){
        const {data} = await axios.get('/templates')
        this.templates = data
        this.message = {
            subject: '',
            to: this.to,
            lead_id: this.lead_id,
            body: '',
            user_id: this.user_id,
            template: false
        }
    },
    methods: {
        done(){
            this.$emit('done')
        },
        async send(){
            this.$store.dispatch('load')
            try{
                if(this.lead_id) await axios.post('/emails/lead', this.message)
                else await axios.post('/emails/default', this.message)
                this.$toast.success('Сообщение успешно отправлено')
                this.done()
            }catch(e){
                // this.$toast.error('При отправке сообщения возникла ошибка')
            }finally{
                this.$store.dispatch('unload')
            }
        }
    }
}
</script>