<template>
    <div>
        <v-list dense three-line>
            <v-list-item v-for="contact in customer.contacts" :key="contact.id">
                <v-list-item-content >
                    <v-list-item-title>{{contact.phone | VMask('#-###-###-##-##')}}</v-list-item-title>
                    <v-list-item-title>{{contact.email}}</v-list-item-title>
                    <v-list-item-subtitle>{{contact.name}} - {{contact.role}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <span class="mb-1">
                        <v-btn v-if="contact.phone" class="mr-2" fab x-small color="success"><v-icon small>mdi-phone</v-icon></v-btn>
                        <v-btn v-if="contact.email" fab x-small color="info" @click="sendEmail(contact)"><v-icon small>mdi-email</v-icon></v-btn>
                    </span>
                    <span>
                        <v-btn x-small fab class="warning mr-2 " @click="contactModal(contact)"><v-icon small>mdi-pencil</v-icon></v-btn>
                        <v-btn x-small fab class="error" @click="destroy(contact)"><v-icon small>mdi-delete</v-icon></v-btn>
                    </span>
                </v-list-item-action>
            </v-list-item>
        </v-list> 
        <v-btn class="info" width="100%" small @click="contactModal({})">Добавить контакт</v-btn>
        <v-dialog v-model="email" width="500">
            <email :to="contact.email" :user_id="contact.id" :lead_id="lead_id" @done="email = false"></email>
        </v-dialog>
        <v-dialog v-model="showContactModal" width="500">
            <v-card>
                <v-toolbar dense class="primary">
                    {{contactModel.id ? 'Редактирование контакта' : 'Новый контакт'}}
                </v-toolbar>
                <v-card-text class="pt-3">
                    <v-text-field dense solo outlined flat label="Должность" v-model="contactModel.role"></v-text-field>
                    <v-text-field dense solo outlined flat label="Имя" v-model="contactModel.name"></v-text-field>
                    <v-text-field dense solo outlined flat v-mask="'#-###-###-##-##'" label="Телефон" v-model="contactModel.phone"></v-text-field>
                    <v-text-field dense solo outlined flat label="Email" v-model="contactModel.email"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning" @click="showContactModal = false">Отмена</v-btn>
                    <v-btn small class="success" @click="setContact">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>    
</template>
<script>
import email from '@/components/email'
export default {
    components: { email },
    props: ['customer', 'lead_id'],
    data(){
        return {
            showContactModal: false,
            contactModel: {},
            email: false,
            contact: {},
        }
    },
    methods: {
        async sendEmail(contact){
            this.contact = contact
            this.email = true
        },
        contactModal(model){
            this.contactModel = model
            this.showContactModal = true;
        },
        async destroy(contact){
            const res = await this.$confirm('Вы увереы, что хотите удалить запись?', { title: 'Подтвердите действие'})
            if(!res) return false
            this.$store.dispatch('load')
            try{
                await axios.delete('/customerContacts/'+contact.id)
                const index = this.customer.contacts.findIndex( a => a.id == contact.id)
                this.customer.contacts.splice(index, 1)
                this.$toast.success('Адрес успешно удален')
            }catch(e){
            }finally{
                this.$store.dispatch('unload')
            }
        },
        async setContact(){
            if(!this.contactModel.name && (!this.contactModel.email || !this.contactModel.phone)) return false
            const model = Object.assign({}, this.contactModel)
            model.customer_id = this.customer.id
            model.phone = model.phone.replace(/-/g, '')
            this.$store.dispatch('load')
            try{
                if(model.id){
                    await axios.put('/customerContacts/' + model.id, model)
                }else{
                    const {data} = await axios.post('/customerContacts', model)
                    this.customer.contacts.push(data)
                }
                this.$toast.success('Успешно сохранено')
                this.showContactModal = false
                this.contactModel = {}
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        }
    }
}
</script>