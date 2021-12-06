<template>
    <v-card flat>
        <v-navigation-drawer v-model="showNodes" fixed right touchless width="100%">
            <nodes @close="showNodes = false" v-if="showNodes" :id="lead.id"></nodes>
        </v-navigation-drawer>
        <v-card-text>
           <v-card flat>
                <v-card-title>
                    Узлы
                    <v-spacer></v-spacer>
                    <v-btn v-if="!lead.hasNodes" fab x-small color="orange darken-4" @click="uploadNodes"><v-icon>mdi-plus</v-icon></v-btn>
                    <v-btn v-else fab x-small color="success" @click="showNodes = true"><v-icon>mdi-eye</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
</template>
<script>
import nodes from '@/components/nodes'
export default {
    props: ['lead'],
    components: { nodes },
    data(){
        return {
            showNodes: false,
        }
    },
    methods: {
        async uploadNodes(){
            const nodes = await this.$upload('/leads/'+this.lead.id+'/uploadNodes', { data: {multiple: false} })
            this.lead.hasNodes = nodes
            this.$toast.success('Узлы успешно загружены')
        },
    }
}
</script>