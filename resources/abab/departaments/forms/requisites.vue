<template>
    <div>
        <v-select
            :items="types"
            v-model="customer.customer_type"
            item-text="name"
            label="Тип"
            return-object
            dense solo outlined
            @change="selectCustomerType"
        ></v-select>
        <v-text-field v-model="customer.name" counter="255" label="Название" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.inn" counter="10" v-mask="'##########'" label="ИНН" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.kpp" counter="9" v-mask="'#########'" label="КПП" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.bik" counter="9" v-mask="'#########'" label="БИК" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.ks" counter="20" v-mask="'####################'" label="Корреспондентский счет" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.rs" counter="20" v-mask="'####################'" label="Расчетный счет" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.bank" counter="255" label="Наименование банка" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.address" counter="255" label="Адрес" dense solo outlined flat></v-text-field>
        <v-text-field v-model="customer.u_address" counter="255" label="Юридический адрес" dense solo outlined flat></v-text-field>
        <v-textarea v-model="customer.additional_info" counter="255" rows="3" label="Дополнительная информация" solo outlined dense flat></v-textarea>
        <v-btn small class="primary" @click="updateCustomer">Сохранить</v-btn>
    </div>
</template>
<script>
export default {
    props: ['customer', 'types'],
    methods: {
        selectCustomerType(type){
            this.customer.customer_type_id = type.id
        },
        async updateCustomer(){
            this.$store.dispatch('load')
            try{
                if(this.customer.id){
                    await axios.put('/customers/'+this.customer.id, this.customer)
                    this.$toast.success('Данные клиента успешно обновлены')
                }else{
                    const {data} = await axios.post('/customers', this.customer)
                    this.$emit('addCustomer', data)
                    this.$toast.success('Клиент успешно добавлен')
                }
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
    }
}
</script>