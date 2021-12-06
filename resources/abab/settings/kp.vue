<template>
    <v-card>
        <v-toolbar dense class="primary">
            <v-toolbar-title>Коммерческое предложение</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pt-5">
            dev
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="warning" @click="showKPDialog = false">Отмена</v-btn>
            <v-btn small color="success" @click="showKPDialog = false">Сохранить</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    data(){
        return {
            showKPDialog: false
        }
    }
}
</script>