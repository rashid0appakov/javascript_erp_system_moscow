<template>
    <v-card>
        <v-toolbar dense>
            <v-btn small class="success" @click="editDialog({})"><v-icon>mdi-plus</v-icon></v-btn>
        </v-toolbar>
        <v-list dense two-lie>
            <v-list-item v-for="list in lists" :key="list.id">
                <v-list-item-content>
                    <v-list-item-title>{{list.name}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <div>
                        <v-btn x-small class="primary mr-2" @click="showDialog(list)"><v-icon small>mdi-eye</v-icon></v-btn>
                        <v-btn x-small class="warning mr-2" @click="editDialog(list)"><v-icon small>mdi-pencil</v-icon></v-btn>
                        <v-btn x-small class="error" @click="destroyList(list)"><v-icon small>mdi-delete</v-icon></v-btn>
                    </div>
                </v-list-item-action>
            </v-list-item>
        </v-list>
        <v-dialog width="400px" v-model="editListDialog">
            <v-card>
                <v-toolbar dense color="primary">
                    <v-toolbar-title>{{model.id ? 'Редактирование справочника ' + model.name : 'Новый справочник'}}</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field v-model="model.name" dense label="Название"></v-text-field>
                    <v-text-field dense label="Название поля" v-model="model.list_fields[i].name" v-for="(field, i) in model.list_fields" :key="i">
                        <template v-slot:append-outer>
                            <v-btn x-small class="success mr-2" @click="saveListField(field, i)"><v-icon small>mdi-content-save</v-icon></v-btn>
                            <v-btn x-small class="error" @click="destroyListField(field, i)"><v-icon small>mdi-delete</v-icon></v-btn>
                        </template>
                    </v-text-field>
                    <v-btn v-if="model.id" small class="success" @click="model.list_fields.push({name: '', list_id: model.id})">Добавить поле</v-btn>
                    <v-btn small class="primary" @click="saveList">Сохранить</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog width="800px" v-model="showListDialog">
            <list-fields :list="model" v-if="showListDialog"></list-fields>
        </v-dialog>
    </v-card>
</template>
<script>
import ListFields from '@/views/settings/listFields'
export default {
    components: { ListFields},
    data(){
        return {
            lists: [],
            model: {},
            editListDialog: false,
            showListDialog: false,
        }
    },
    async created(){
        const {data} = await axios.get('/lists')
        this.lists = data
    },
    methods: {
        editDialog(model){
            this.model = model
            this.editListDialog = true
        },
        async showDialog(list){
            this.model = list
            this.showListDialog = true
        },
        async saveListField(field, i){
            try{
                field.list_id = this.model.id
                if(field.id){
                    await axios.put('/listFields/'+field.id, field)
                }else{
                    const {data} = await axios.post('/listFields', field)
                    this.model.list_fields[i] = data
                }
                this.$toast.success('Поле успешно сохранено')
            }catch(e){}
        },
        async destroyListField(field, i){
            const res = await this.$confirm('Вы уверены, что хотите удалить поле ' + field.name + '?')
            if(!res) return false
            if(!field.id) this.model.list_fields.splice(i, 1)
            else{
                try{
                    await axios.delete('/listFields/'+field.id)
                    this.model.list_fields.splice(i, 1)
                }catch(e){}
            }
        },
        async destroyList(list){
            const res = await this.$confirm('Вы уверены, что хотите удалить справочник ' + list.name + '?')
            if(!res) return false
            try{
                await axios.delete('/lists/'+list.id)
                this.$toast.success('Справочник успешно удален')
                this.lists.splice(this.lists.findIndex( l => l.id == list.id), 1)
            }catch(e){}
        },
        async saveList(){
            this.$store.dispatch('load')
            try{
                if(this.model.id){
                    const {data} = await axios.put('/lists/'+this.model.id, this.model)
                    this.model = data
                }else{
                    const {data} = await axios.post('/lists', this.model)
                    this.lists.push(data)
                    this.model = data
                }
                this.$toast.success('Справочник успешно сохранен')
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        }
    }
}
</script>