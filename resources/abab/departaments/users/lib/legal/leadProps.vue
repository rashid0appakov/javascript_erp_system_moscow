<template>
    <v-card>
        <v-card-subtitle>Перевозки</v-card-subtitle>
        <v-card-text>
            <v-list dense two-line>
                <v-list-item v-for="item in lead.transportations" :key="item.id">
                    <v-list-item-content>
                        <v-list-item-title>{{item.route}}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.date | moment('DD.MM.YYYY HH:mm')}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                        <span v-if="!item.done">
                            <v-btn x-small class="mr-2" color="warning" @click="showAutoDialog(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
                            <v-btn x-small color="error" @click="destroyAuto(item.id)"><v-icon small>mdi-delete</v-icon></v-btn>
                        </span>
                        <v-icon v-else>mdi-check</v-icon>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
            <v-btn small class="mb-3" width="100%" @click="showAutoDialog({})">Добавить транспорт</v-btn>
        </v-card-text> 
        <v-dialog v-model="autoDialog" width="500">
            <v-card>
                <v-toolbar dense class="primary">
                    <v-toolbar-title dense color="primary">{{autoModel.id ? 'Редактирование доставки' :'Новая доставка'}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-datetime-picker dense :time-picker-props="{format: '24hr'}" time-format="HH:mm:00" label="Дата" v-model="autoModel.date"></v-datetime-picker>
                    <v-text-field dense label="Характер груза" v-model="autoModel.type"></v-text-field>
                    <v-text-field dense label="Габариты" v-model="autoModel.size"></v-text-field>
                    <v-text-field dense label="Счета" v-model="autoModel.invoices"></v-text-field>
                    <v-row>
                        <v-col cols="12" md="6"><v-switch dense :label="autoModel.our ? 'стороний заказ':'наш склад'" v-model="autoModel.our"></v-switch></v-col>
                        <v-col cols="12" md="6"><v-switch dense label="Экспедирование" v-model="autoModel.expedition"></v-switch></v-col>
                    </v-row>
                    <v-text-field type="number" dense label="Стоимость" v-model="autoModel.price"></v-text-field>
                    <v-select :items="lead.customer ? lead.customer.addresses : []" item-text="name" item-value="id" dense label="Адрес" v-model="autoModel.address"></v-select>
                    <v-select :items="lead.customer ? lead.customer.contacts : []" item-text="name" item-value="id" dense label="Контакт" v-model="autoModel.contacts"></v-select>
                    <v-checkbox v-model="autoModel.done" label="Отгружено"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning" @click="autoDialog = false">Отмена</v-btn>
                    <v-btn small class="success" @click="setAuto">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
export default {
    props: ['lead'],
    computed: {
    },
    data(){
        return {
            autoDialog: false,
            autoModel: {}
        }
    },
    methods: {   
        showAutoDialog(model){
            this.autoModel = model
            this.autoDialog = true
        },
        setAuto(){
            const model = this.autoModel
            model.id = Math.random()
            model.created_at = moment()
            this.lead.transportations.push(model)
            this.autoModel = {}
            this.autoDialog = false
        },
        async destroyAuto(id){
            const res = await this.$confirm('Вы действительно хотите удалить запись?', {title: 'Подтвердите действие'})
            if(!res) return false
            const index = this.lead.transportations.findIndex( t => t.id == id)
            this.lead.transportations.splice(index, 1)
            this.$toast.success('Запись успешно удалена')
        }
    }
}
</script>