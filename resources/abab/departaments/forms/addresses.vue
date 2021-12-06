<template>
    <div>
        <v-list dense two-line>
            <v-list-item v-for="address in customer.addresses" :key="address.id">
                <v-list-item-content >
                    <v-list-item-title>{{address.name}}</v-list-item-title>
                    <v-list-item-subtitle>{{address.address}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <span>
                        <v-btn x-small fab class="warning mr-2" @click="addressModal(address)"><v-icon small>mdi-pencil</v-icon></v-btn>
                        <v-btn x-small fab class="error" @click="destroy(address)"><v-icon small>mdi-delete</v-icon></v-btn>
                    </span>
                </v-list-item-action>
            </v-list-item>
        </v-list> 
        <v-btn class="info" width="100%" small @click="addressModal({})">Добавить адрес</v-btn>
        <v-dialog v-model="showAddressModal" width="500">
            <v-card>
                <v-toolbar dense class="primary">
                    {{addressModel.id ? 'Редактирование адреса' : 'Новый адрес'}}
                </v-toolbar>
                <v-card-text class="pt-3">
                    <v-text-field dense solo outlined flat label="Название" v-model="addressModel.name"></v-text-field>
                    <v-text-field dense solo outlined flat label="Адрес" v-model="addressModel.address"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning" @click="showAddressModal = false">Отмена</v-btn>
                    <v-btn small class="success" @click="setAddress">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>    
</template>
<script>
export default {
    props: ['customer'],
    data(){
        return {
            showAddressModal: false,
            addressModel: {}
        }
    },
    methods: {
        addressModal(model){
            this.addressModel = model
            this.showAddressModal = true;
        },
        async destroy(address){
            const res = await this.$confirm('Вы увереы, что хотите удалить запись?', { title: 'Подтвердите действие'})
            if(!res) return false
            this.$store.dispatch('load')
            try{
                await axios.delete('/customerAddresses/'+address.id)
                const index = this.customer.addresses.findIndex( a => a.id == address.id)
                this.customer.addresses.splice(index, 1)
                this.$toast.success('Адрес успешно удален')
            }catch(e){
            }finally{
                this.$store.dispatch('unload')
            }
        },
        async setAddress(){
            if(!this.addressModel.name && !this.addressModel.address) return false
            const model = this.addressModel
            model.customer_id = this.customer.id
            this.$store.dispatch('load')
            try{
                if(model.id){
                    await axios.put('/customerAddresses/' + model.id, model)
                }else{
                    const {data} = await axios.post('/customerAddresses', model)
                    this.customer.addresses.push(data)
                }
                this.$toast.success('Успешно сохранено')
                this.showAddressModal = false
                this.addressModel = {}
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        }
    }
}
</script>