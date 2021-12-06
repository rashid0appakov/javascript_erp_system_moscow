<template>
    <v-card>
        <v-toolbar color="primary" dense>
            Шаблоны сообщений
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text class="pt-5">
            <v-row>
                <v-col cols="12" md="3">
                    <v-list dense>
                        <v-list-item @click="addTemplate" class="success">Добавить новый</v-list-item>
                        <v-list-item @click="editTemplate(i)" :class="{info: i == edited}" v-for="(item, i) in items" :key="item.id">
                            <v-list-item-content>{{item.name}}</v-list-item-content>
                            <v-list-item-action>
                                <v-btn x-small class="error" @click.prevent="destroyTemplate(item)"><v-icon small>mdi-delete</v-icon></v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" md=3>
                    <p>В тексте возможны вставки, однако такой шаблон будет доступен к отправке только для конкретных лидов</p>
                    <p class="small"><a href="#" @click.prevent="addText('#id#')">#id#</a> - Номер заказа</p>
                    <p class="small"><a href="#" @click.prevent="addText('#date#')">#user#</a> - Имя контакта</p>
                    <p class="small"><a href="#" @click.prevent="addText('#date#')">#date#</a> - Дата заказа</p>
                    <p class="small"><a href="#" @click.prevent="addText('#users#')">#users#</a> - Менеджеры</p>
                </v-col>
                <v-col cols="12" md="6">
                    <div v-if="model">
                        <v-text-field dense solo outlined v-model="model.name" label="Название шаблона"></v-text-field>
                        <v-text-field dense solo outlined v-model="model.subject" label="Тема письма"></v-text-field>
                        <v-textarea ref="template" dense solo outlined v-model="model.body"></v-textarea>
                        <v-btn class="primary" small @click="save">Сохранить</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    data(){
        return {
            items: [],
            model: false,
            edited: -1
        }
    },
    async created(){
        const {data} = await axios.get('/templates')
        this.items = data
    },
    methods: {
        addText(text){
            if(this.model){
                const template = this.$refs.template.$refs.input
                const index = template.selectionStart
                this.model.body = this.model.body.substring(0, index) + text + this.model.body.substring(index);
            }
        },
        addTemplate(){
            this.model = {name: 'Новый шаблон'}
            this.items.unshift(this.model)
            this.edited = 0
        },
        editTemplate(i){
            this.edited = i
            this.model = this.items[i]
        },
        async save(){
            this.model.usePaste = this.model.body.indexOf('#id#') > -1 || this.model.body.indexOf('#date#') > -1 || this.model.body.indexOf('#user#') > -1 || this.model.body.indexOf('#users#') > -1
            try{
                if(this.model.id){
                    await axios.put('/templates/'+this.model.id, this.model)
                }else{
                    const {data} = await axios.post('/templates', this.model)
                    this.$set(this.items, this.edited, data)
                }
                this.$toast.success('Шаблон успешно сохранен')
            }catch(e){}
        },
        async destroyTemplate(template){
            const res = await this.$confirm('Вы уверены. что хотите удалить шаблон "'+template.name+'"?', {title: 'Подтвердите действие'})
            if(!res) return false
            if(template.id) await axios.delete('/templates/'+template.id)
            this.items.splice(this.items.findIndex(i => i.id == template.id), 1)
            this.model = false
        }
    }
}
</script>