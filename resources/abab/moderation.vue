<template>
    <v-sheet class="fill-height">
        <v-navigation-drawer v-model="selectedLead" absolute right touchless width="100%">
            <lead @close="selectedLead = false" v-if="selectedLead" :lead_id="selectedLead"></lead>
        </v-navigation-drawer>
        <v-card class="position">
            <v-toolbar dense color="primary">
                <v-toolbar-title>Модерация выполненных ТЗ</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-checkbox v-model="status" :true-value="1" :false-value="0"  label="Ожидают подтверждения"></v-checkbox>
                <v-data-table :items="filtered" :headers="headers">
                <template v-slot:item.status="{ item }">
                    <v-chip small v-if="item.status == 'NEW'" color="info">Новый</v-chip>
                    <v-chip small v-else-if="item.status == 'ACCEPT'" color="primary">Принят</v-chip>
                    <v-chip small v-else-if="item.status == 'REJECT'" color="error">Отклонен</v-chip>
                    <v-chip small v-else-if="item.status == 'DONE'" color="warning">Выполнен</v-chip>
                    <v-chip small v-else-if="item.status == 'CONFIRM'" color="success">Подтвержден</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn class="mr-2 primary" x-small @click="selectedLead = item.lead_id"><v-icon small>mdi-eye</v-icon></v-btn>
                    <v-btn class="mr-2 success" x-small @click="accept(item)"><v-icon small>mdi-check</v-icon></v-btn>
                    <v-btn class="mr-2 error" x-small @click="requestCommentDialog(item)"><v-icon small>mdi-close</v-icon></v-btn>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog width="350px" v-model="showRequestCommentDialog">
            <v-card v-if="showRequestCommentDialog">
                <v-toolbar dense color="primary">
                    <v-toolbar-title>Комментарий</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-textarea dense solo outlined v-model="comment" dense rows="3" label="Текст комментария"></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="warning mr-2" small @click="showRequestCommentDialog = false">Отмена</v-btn>
                    <v-btn class="success" small @click="reject">Отклонить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-sheet>
</template>
<script>
import lead from '@/components/lead'
export default {
    components: {lead},
    data(){
        return {
            items: [],
            status: 0,
            selectedLead: false,
            showRequestCommentDialog: false,
            comment: '',
            item: false,
            headers: [
                { text: "Лид", value: "lead_id" },
                { text: "Статус", value: "status" },
                { text: "Исполнитель", value: "worker.name" },
                { text: 'Действия', value: 'actions', sortable: false },
            ]
        }
    },
    async created(){
        const {data} = await axios.get('/departamentRequests')
        this.items = data
    },
    computed: {
        filtered(){
            return this.items.filter( i => i.status == 'DONE' || !this.status)
        }
    },
    methods: {
        requestCommentDialog(item){
            this.item = item
            this.showRequestCommentDialog = true
        },
        getValue(field){
            if(field.type == 'BOOLEAN') return this.model.data[field.id] ? 'Да' : 'Нет'
            else if(field.type == 'DATE') return this.model.data[field.id] ? moment(this.model.data[field.id]).format('DD.MM.YYYY') : 'Не выбрано'
            else if(field.type == 'DATETIME') return this.model.data[field.id] ? moment(this.model.data[field.id]).format('DD.MM.YYYY HH:mm') : 'Не выбрано'
            else if(field.type == 'STRING') return this.model.data[field.id] ? this.model.data[field.id] : 'Не выбрано'
            else if(field.type == 'FILE') return this.model.data[field.id] ? '<a href="'+this.model.data[field.id]+'">Файл приложен</a>' : 'Не выбрано'
        },
        async accept(item){
            const res = await this.$confirm('Подтвердить выполнение ТЗ?', { title: 'Подтвердите действие'})
            if(!res) return false
            await axios.post('/departamentRequests/'+item.id+'/confirm')
            item.status = 'CONFIRM'
        },
        async reject(){
            if(!this.comment){
                this.$toast.warning('Укажите причину отклонения')
                return false
            }
            const res = await this.$confirm('Отклонить выполнение ТЗ?', { title: 'Подтвердите действие'})
            if(!res) return false
            await axios.post('/departamentRequests/'+this.item.id+'/reject', {comment: this.comment})
            this.item.status = 'ACCEPT'
        }
    }
}
</script>