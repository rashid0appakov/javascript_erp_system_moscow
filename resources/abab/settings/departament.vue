<template>
    <div>
        <v-card>
            <v-toolbar dense color="primary">
                <v-toolbar-title>
                    <span v-if="model.id">Редактирование отдела {{model.name}}</span>
                    <span v-else>Новый подраздел</span>
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5">
                <v-text-field dense label="Название" v-model="model.name"></v-text-field>
                <v-text-field dense v-model="model.donePlus" label="Бонус за выполнение"></v-text-field>
                <v-text-field dense v-model="model.doneMinus" label="Штраф за невыполнение"></v-text-field>
                <v-text-field dense v-model="model.timePlus" label="Бонус за время"></v-text-field>
                <v-text-field dense v-model="model.timeMinus" label="Штраф за время"></v-text-field>
                <v-text-field dense v-model="model.time" label="Время на выполнение"></v-text-field>
                <v-list v-if="model.id && model.parent_id" dense>
                    <v-subheader>Поля для ТЗ</v-subheader>
                    <v-list-item-group>
                        <v-list-item class="primary" v-for="field in model.fields" :key="field.id" @click="fieldDialog(field)">
                            <v-list-item-content>
                                <v-list-item-title v-text="field.name"></v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn x-small class="error" @click.stop="destroyField(field.id)"><v-icon small>mdi-delete</v-icon></v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item @click="fieldDialog({})" class="success">
                            <v-icon>mdi-plus</v-icon>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary mr-2" small @click="done(false)">Отмена</v-btn>
                <v-btn class="success" small @click="done(true)">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="showFieldDialog" width="350px">
            <v-card>
                <v-toolbar color="primary" dense>
                    <v-toolbar-title>Поле</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field v-model="fieldModel.name" dense label="Название"></v-text-field>
                    <v-select v-model="fieldModel.type" item-text="label" item-value="key" label="Тип" dense :items="types"></v-select>
                    <v-checkbox v-model="fieldModel.required_for_author" false-value="0" true-value="1" label="Обязательно для автора"></v-checkbox>
                    <v-checkbox v-model="fieldModel.required_for_worker" false-value="0" true-value="1" label="Обязательно для исполнителя"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small class="warning mr-2" @click="showFieldDialog = false">Отмена</v-btn>
                    <v-btn small class="primary" @click="saveField">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { config } from '@/config'
export default {
    props: ['model'],
    data(){
        return {
            showFieldDialog: false,
            fieldModel: {},
            types: []
        }
    },
    created(){
        this.types = config.types
    },
    methods: {
        fieldDialog(model){
            this.fieldModel = model
            this.showFieldDialog = true
        },
        async destroyField(id){
            const res = this.$confirm('Вы уверены, что хотит удалить эту запись?', {title: 'Подтвердите действие'})
        },
        async saveField(){
            this.fieldModel.departament_id = this.model.id
            this.$store.dispatch('load')
            try{
                if(this.fieldModel.id){
                    await axios.put('/departamentFields/'+this.fieldModel.id, this.fieldModel)
                }else{
                    const {data} = await axios.post('/departamentFields', this.fieldModel)
                    this.model.fields.push(data)
                }
                this.fieldModel = {}
                this.showFieldDialog = false
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        async done(flag){
            if(!flag){
                this.$emit('done')
                return false
            }
            this.$store.dispatch('load')
            try{
                if(this.model.id){
                    await axios.put('/departaments/'+this.model.id, this.model)
                    this.$emit('done')
                }else{
                    const {data} = await axios.post('/departaments', this.model)
                    this.$emit('done', data)
                }
            }catch(e){}
            finally{ this.$store.dispatch('unload')}
        }
    }
}
</script>