<template>
    <v-card flat>
        <v-navigation-drawer v-model="showMaterials" fixed right touchless width="100%">
            <materials @close="showMaterials = false" v-if="showMaterials"></materials>
        </v-navigation-drawer>
        <v-btn small class="primary" width="100%" @click="showMaterials = true">Материалы</v-btn>
    </v-card>
</template>
<script>
import materials from '@/components/materials'
export default {
    props: ['lead'],
    components: { materials },
    data(){
        return {
            showMaterials: false,
        }
    },
    methods: {}
}
</script>