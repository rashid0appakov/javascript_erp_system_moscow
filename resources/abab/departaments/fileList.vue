<template>
    <v-card>
        <v-card-title>
            {{title}}
            <v-spacer></v-spacer>
            <v-btn fab x-small color="orange darken-4" @click="upload"><v-icon>mdi-plus</v-icon></v-btn>
        </v-card-title>
        <v-list>
            <template v-for="(file, index) in files">
                <v-list-item :key="file.id" dense>
                    <v-icon>{{fileType(file.type)}}</v-icon><br>
                    <v-divider vertical class="mx-2"></v-divider>
                    {{file.name}}
                    <v-spacer></v-spacer>
                    <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn x-small fab icon v-bind="attrs" v-on="on"><v-icon small>mdi-dots-vertical</v-icon></v-btn>
                        </template>
                        <v-list>
                            <v-list-item><v-btn fab x-small color="info mr-2" :href="storage+file.path" target="_blank"><v-icon small>mdi-download</v-icon></v-btn></v-list-item>
                            <v-list-item><v-btn fab x-small color="error" @click="destroyFile(file)"><v-icon small>mdi-delete</v-icon></v-btn></v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item>
                <v-divider :key="index" v-if="index + 1 < files.length"></v-divider>
            </template>
        </v-list>
    </v-card>
</template>
<script>
import { etoi } from '@/util/helpers'
export default {
    props: [ 'list', 'title', 'group', 'type', 'id' ],
    data(){
        return {
            files: []
        }
    },
    created(){
        this.files = this.list.filter( f => f.group == this.group).slice()
    },
    methods: {
        fileType(ext){ return etoi(ext) },
        async upload(){
            const files = await this.$upload('/files', { data: { multiple: true, id: this.id, type: this.type, group: this.group } })
			if(files){
                this.files = [...this.files, ...files]
				this.$toast.success('Файлы успешно загружены')
			}
        },
        async destroyFile(file){
            try{
                const res = await this.$confirm('Вы действительно хотите удалить файл '+file.name+'?', { title: 'Подтвердите действие' })
                if (res) {
                    await axios.delete('/files/'+file.id)
                    this.files.splice(this.files.findIndex(f => { return f.id == file.id}), 1)
                    this.$toast.success('Файл успешно удалн!')
                }
            }catch(e){}
        }
    }
}
</script>