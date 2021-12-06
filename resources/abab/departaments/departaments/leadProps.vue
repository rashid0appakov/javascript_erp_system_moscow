<template>
    <customer-contacts v-if="lead.customer" :customer="lead.customer"></customer-contacts>
</template>
<script>
import customerContacts from '@/components/customers/contacts'
export default {
    props: ['lead'],
    components: { customerContacts },
    data(){
        return {
        }
    }
}
</script>