<template>
    <v-card>
        <v-toolbar dense class="primary">
            <v-toolbar-title><span v-if="!lead.invoice">Выставить счет</span><span v-else>Счет #{{lead.invoice.id}}</span></v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pt-5">

            <v-simple-table>
                <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">Услуга</th>
                        <th class="text-left">Количество</th>
                        <th class="text-left">Единица</th>
                        <th class="text-left">Цена за ед.</th>
                        <th class="text-left">Итого</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-left"><v-text-field dense v-model="rowModel.name"></v-text-field></td>
                        <td class="text-left"><v-text-field dense v-model="rowModel.quantity"></v-text-field></td>
                        <td class="text-left"><v-text-field dense v-model="rowModel.val"></v-text-field></td>
                        <td class="text-left"><v-text-field dense v-model="rowModel.price"></v-text-field></td>
                        <td class="text-left">{{rowModel.price * rowModel.quantity}}</td>
                        <td class="text-center"><v-btn @click="addRow" small class="success"><v-icon>mdi-plus</v-icon></v-btn></td>
                    </tr>
                    <tr v-for="(item, i) in invoiceModel.rows" :key="i">
                        <td class="text-left"><v-text-field dense v-model="item.name"></v-text-field></td>
                        <td class="text-left"><v-text-field dense v-model="item.quantity"></v-text-field></td>
                        <td class="text-left"><v-text-field dense v-model="item.val"></v-text-field></td>
                        <td class="text-left"><v-text-field dense v-model="item.price"></v-text-field></td>
                        <td class="text-left">{{item.price * item.quantity}}</td>
                        <td><v-btn @click="invoiceModel.rows.splice(i, 1)" small class="warning mr-2"><v-icon>mdi-minus</v-icon></v-btn></td>
                    </tr>
                    <tr>
                        <td colspan="4">Итого к оплате</td>
                        <td>{{total}}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        </v-card-text>
        <v-card-actions>
            <v-btn small color="primary mr-2" @click="done(false)"><v-icon>mdi-printer</v-icon></v-btn>
            <v-btn small color="primary mr-2" @click="done(false)"><v-icon>mdi-send</v-icon></v-btn>
            <v-btn small color="primary" @click="done(false)"><v-icon>mdi-download</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-btn small color="warning" @click="done(false)">Отмена</v-btn>
            <v-btn small color="success" @click="done(true)">Сохранить</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props: ['lead'],
    data(){
        return {
            services: [],
            rowModel: {
                quantity: 1,
                val: 'ед',
                price: 0
            },
            invoiceModel: { rows: [], total: 0}
        }
    },
    computed: {
        total(){
            let total = 0
            this.invoiceModel.rows.forEach( row => {
                total += row.price * row.quantity
            })
            return total
        }
    },
    created(){
        this.invoiceModel = this.lead.invoice ? this.lead.invoice : { rows: [], total: 0, lead_id: this.lead.id}
    },
    methods: {
        async done(flag){
            if(!flag){
                this.$emit('done')
                return false
            }
            if(!this.invoiceModel.rows.length){
                this.$toast.warning('Не добавлено ни одной услуги')
                return false
            }
            try{
                this.invoiceModel.total = this.total
                if(this.invoiceModel.id){
                    await axios.put('/invoices/'+this.invoiceModel.id, this.invoiceModel)
                }else{
                    await axios.post('/invoices', this.invoiceModel)
                }
                this.$emit('done')
            }
            catch(e){
                console.log(e)
            }
        },
        addRow(){
            if(!this.rowModel.quantity) this.rowModel.quantity = 1
            if(!this.rowModel.val) this.rowModel.val = 'ед.'
            if(!this.rowModel.name || !this.rowModel.price){
                this.$toast.warning('Не заполнены обязательные поля')
                return false
            }
            this.invoiceModel.rows.unshift(this.rowModel)
            this.invoiceModel.total += this.rowModel.quantity*this.rowModel.price
            this.rowModel = {
                quantity: 1,
                val: 'ед',
                price: 0
            }
        }
    }
}
</script>