<template>
    <v-card>
        <v-toolbar dense color="primary">
            <v-toolbar-title>Просмотр справочника {{list.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small color="orange darken-4 mr-2" @click="editDialog()">Добавить</v-btn>
            <v-btn small color="orange darken-4" @click="upload">Импортировать</v-btn>
        </v-toolbar>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left" v-for="(field, i) in list.list_fields.filter(f => f.id)" :key="i">{{field.name}}</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.id">
                        <td v-for="(field, i) in list.list_fields.filter(f => f.id)" :key="i">{{row.value[field.id]}}</td>
                        <td>
                            <v-btn x-small class="warning mr-3" @click="editDialog(row)"><v-icon small>mdi-pencil</v-icon></v-btn>
                            <v-btn x-small class="error" @click="destroy(row)"><v-icon small>mdi-delete</v-icon></v-btn>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
        <v-dialog width="400px" v-model="showFieldDialog">
            <v-card v-if="showFieldDialog">
                <v-toolbar dense color="primary">{{model.id ? 'Редактирование записи' : 'Новая запись'}}</v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field dense :label="field.name" v-model="model.value[field.id]" v-for="field in list.list_fields.filter(f => f.id)" :key="field.id"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="primary" @click="save">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
export default {
    props: ['list'],
    data(){
        return {
            rows: [],
            showFieldDialog: false,
            model: {}
        }
    },
    async created(){
        this.$store.dispatch('load')
        const {data} = await axios.get('/lists/'+this.list.id+ '/rows')
        this.rows = data.map( item => {
            return {
                id: item.id,
                value: JSON.parse(item.value)
            }
        })
        this.$store.dispatch('unload')
    },
    methods: {
        editDialog(model){
            this.model = model || { value: {} }
            this.showFieldDialog = true
        },
        async upload(){
            try{
                const rows = await this.$upload('/lists/'+this.list.id+'/uploadRows' )
                if(rows){
                    this.rows = [...this.rows, ...rows]
                }
                this.$toast.success('Справочник успешно загружен')
            }catch(e){}
        },
        async save(){
            try{
                const model = Object.assign({}, this.model)
                model.value = JSON.stringify(model.value)
                if(model.id){
                    await axios.put('/listRows/'+model.id, model)
                }else{
                    model.list_id = this.list.id
                    const {data} = await axios.post('/listRows', model)
                    data.value = JSON.parse(data.value)
                    this.rows.push(data)
                }
                this.$toast.success('Запись успешно сохранена')
                this.showFieldDialog = false
            }catch(e){}
        },
        async destroy(row){
            const res = await this.$confirm('Вы уверены, что хотите удалить запись?')
            if(!res) return false
            try{
                await axios.delete('/listRows/'+row.id)
                this.$toast.success('Запись успешно удалена')
                this.rows.splice(this.rows.findIndex(r => r.id == row.id), 1)
            }catch(e){}
        }
    }
}
</script>