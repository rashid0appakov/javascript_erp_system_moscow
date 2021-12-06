<template>
    <v-simple-table>
        <template v-slot:default>
        <thead>
            <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Перейти</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="lead in leads" :key="lead.name">
            <td>#{{ lead.id }}</td>
            <td class="text-right">
                <v-btn x-small @click="selectLead(lead.id)" class="success"><v-icon small>mdi-eye</v-icon></v-btn>
            </td>
            </tr>
        </tbody>
        </template>
  </v-simple-table>
</template>
<script>
export default {
    props: ['customer_id'],
    data(){
        return {
            leads: []
        }
    },
    methods: {
        selectLead(id){
            this.$emit('selectLead', id)
        },
    },
    async created(){
        this.$store.dispatch('load')
        const { data } = await axios.get('/customers/'+this.customer_id+'/leads')
        this.leads = data
        this.$store.dispatch('unload')
    }
}
</script>