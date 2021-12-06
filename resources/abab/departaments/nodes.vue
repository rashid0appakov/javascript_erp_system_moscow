<template>
    <v-card>
		<v-toolbar>
            <v-btn fab x-small class="error darken-3 mr-3" @click="close"><v-icon>mdi-close</v-icon></v-btn>
            <!-- <v-switch v-model="tree" label="Сменить вид" class="mt-6 mr-3"></v-switch> -->
            <v-divider class="mx-2" vertical></v-divider>
            <v-text-field v-model="search" append-icon="search" dense hide-details single-line label="Найти"></v-text-field>
            <v-divider class="mx-2" vertical></v-divider>
			<v-select :items="$store.getters.departament(d_production).boards" item-text="name" dense hide-details single-line label="Сменить этап">
                <template v-slot:item="{item}">
                    <v-list-item @click="changeBoard(item)">
                        <v-icon :color="item.color" class="mr-3">mdi-hexagon</v-icon>
                        {{item.name}}
                    </v-list-item>
                </template>
            </v-select>
			<v-divider class="mx-2" vertical></v-divider>
			<v-select @input="changeUser" :items="$store.getters.departament(d_production).users" item-text="name" return-object dense hide-details single-line label="Выбрать ответственного"></v-select>
			<v-divider class="mx-2" vertical></v-divider>
			<v-select style="width:100px" :items="headers" item-text="text" dense hide-details single-line placeholder="Колонки">
                <template v-slot:item="{item}">
                    <v-list-item>
                        <v-checkbox v-model="item.active"></v-checkbox>
                        {{item.text}}
                    </v-list-item>
                </template>
            </v-select>
		</v-toolbar>
        <v-data-table
            dense
            fixed-header
            height="550"
            show-select
            item-key="id"
            locale="ru"
            v-model="selected"
            :footer-props="fprops"
            :headers="headers.filter( el => el.active )"
            :items="filtered"
            @pagination="setItemsBefore"
        >
        <template v-slot:item="props">
            <tr>
                <td>
                    <v-checkbox class="mt-0" hide-details :input-value="props.isSelected" @click.stop="toggleRow($event, props)"></v-checkbox>
                </td>
                <td v-if="headers[0].active"><v-chip v-if="props.item.board" dense small :color="props.item.board.color">{{props.item.board.name}}</v-chip></td>
                <td v-if="headers[1].active">{{props.item.name}}</td>
                <td v-if="headers[2].active">{{props.item.number}}</td>
                <td v-if="headers[3].active">{{props.item.quantity}}</td>
                <td v-if="headers[4].active">{{props.item.cut}}</td>
                <td v-if="headers[5].active">{{props.item.len}}</td>
                <td v-if="headers[6].active">{{props.item.weight}}</td>
                <td v-if="headers[7].active">{{props.item.weight_total}}</td>
                <td v-if="headers[8].active">{{props.item.weight_element}}</td>
                <td v-if="headers[9].active">{{props.item.mark}}</td>
                <td v-if="headers[9].active">{{props.item.k}}</td>
                <td v-if="headers[10].active">{{props.item.description}}</td>
                <td v-if="headers[11].active">{{props.item.user ? props.item.user.name : ''}}</td>
            </tr>
        </template>
        <template v-slot:footer="props">
            <v-card>
                <v-card-text>
                    <v-btn x-small class="success mr-1" @click="nodeDialog({})">Добавить узел</v-btn>
                    <v-btn x-small class="primary mr-1" @click="nodeDialog(false)" :disabled="selected.length != 1">Редактировать узел</v-btn>
                    <v-btn x-small class="error mr-1" @click="destroyNodes" :disabled="!selected.length">Удалить выбраные</v-btn>
                    <v-btn x-small class="primary mr-1" @click="showKDialog = true" :disabled="!selected.length">Указать коэффициент</v-btn>
                </v-card-text>
            </v-card>
        </template>
        </v-data-table>
        <v-dialog width="300px" v-model="showKDialog">
            <v-card>
                <v-toolbar dense color="primary">Укажите коэффициент</v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field dense outlined v-model="k" label="Коэффициент"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="warning mr-2" x-small @click="showKDialog = false">Отмена</v-btn>
                    <v-btn class="success" x-small @click="setK">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showNodeDialog" width="350px">
            <v-card>
                <v-toolbar dense color="primary"><span v-if="nodeModel.id">Редактирование узла</span><span v-else>Новый узел</span></v-toolbar>
                <v-card-text class="pt-5">
                    <v-select :items="nodes.filter( n => !n.parent_id)" v-model="nodeModel.parent_id" item-value="id" item-text="name" dense outlined single-line label="Родительский элемент"></v-select>
                    <v-select :items="$store.getters.departament(d_production).boards" v-model="nodeModel.board_id" item-value="id" item-text="name" dense outlined single-line label="Этап"></v-select>
                    <v-text-field dense outlined v-model="nodeModel.name" label="Название"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.number" label="Номер"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.quantity" label="Кол-во"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.cut" label="Сечение"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.len" label="Длина"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.weight" label="Вес детали"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.weight_total" label="Вес всего"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.weight_element" label="Вес элемента"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.k" label="Коэффициент"></v-text-field>
                    <v-text-field dense outlined v-model="nodeModel.mark" label="Применчание"></v-text-field>
                    <v-select :items="$store.getters.departament(d_production).users" v-model="nodeModel.user_id" item-value="id" item-text="name" dense outlined single-line label="Ответственный"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="warning mr-2" x-small @click="showNodeDialog = false">Отмена</v-btn>
                    <v-btn class="success" x-small @click="saveNode">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
	</v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: ['id'],
    data(){
        return {
            k: 1,
            tree: false,
            nodes: [],
            search: '',
            selected: [],
            savedIndex: null,
            boards: [],
            itemsBefore: 0,
            showNodeDialog: false,
            showKDialog: false,
            nodeModel: {},
            fprops: {
                "items-per-page-options": [20, 100, 200]
            },
            headers: [
                { active: true, text: 'Этап', align: 'start'},
				{ active: true, text: 'Название', value: 'name', align: 'start'},
				{ active: true, text: 'Номер', value: 'number', sortable: false},
				{ active: true, text: 'Кол-во', value: 'quantity'},
				{ active: true, text: 'Сечение', value: 'cut', sortable: false},
				{ active: true, text: 'Длина', value: 'len', sortable: false},
				{ active: true, text: 'Вес детали', value: 'weight', sortable: false},
				{ active: true, text: 'Вес всего', value: 'weight_total', sortable: false},
				{ active: true, text: 'Вес элемента', value: 'weight_element', sortable: false},
                { active: true, text: 'Марка', value: 'mark', sortable: false},
                { active: true, text: 'Коэффициент', value: 'k', sortable: false},
                { active: true, text: 'Применчание', value: 'description', sortable: false},
                { active: true, text: 'Ответственный', value: 'user.name'},
			],
        }
    },
    async created(){
        const nodes = await axios.get('/leads/'+this.id+'/getNodes')
		const boards = await axios.get('/boards', {params: { departament_id: 5 }})
		this.boards = boards.data;
        this.nodes = nodes.data
    },
    computed:{
        ...mapGetters(['users']),
        filtered(){
            const l = this.nodes.length
            const parents = []
            const parentsMap = {}
            const res = []
            this.nodes.forEach( node => {
                if(!node.parent_id){
                    parentsMap[node.id] = parents.length
                    node.childs = []
                    parents.push(node)
                }
            })
            this.nodes.forEach( node => {
                if(node.parent_id){
                    const index = parentsMap[node.parent_id]
                    if(index) parents[index].childs.push(node)
                }
            })
            parents.forEach( parent => {
                res.push(parent)
                parent.childs.forEach( child => {
                    res.push(child)
                })
            })
            return res
        }
    },
    methods: {
        nodeDialog(model){
            this.nodeModel = model ? model : this.selected[0]
            this.showNodeDialog =true
        },
        async saveNode(){
            this.nodeModel.lead_id = this.id
            try{
                if(this.nodeModel.id){
                    const {data} = await axios.put('/lead_nodes/'+this.nodeModel.id, this.nodeModel)
                    this.selected[0] = data
                }else{
                    const {data} = await axios.post('/lead_nodes', this.nodeModel)
                    this.nodes.push(data)
                }
                this.$toast.success('Узел успешно сохранен')
                this.showNodeDialog = false
            }catch(e){
            }
        },
        async setK(){
            try{
                const ids = this.selected.map( s => s.id )
                await axios.put('/lead_nodes/updateMany', {
                    k: this.k,
                    ids
                })
                this.selected.forEach( s => {
                    s.k = this.k
                })
                this.showKDialog = false
                this.k = 1
                this.$toast.success('Коэффициент успешно обновлен')
            }catch(e){}
        },
        async destroyNodes(){
            const res = await this.$confirm('Вы уверены, что хотите удалить выбранные узлы? Удаление родительского узла, повлечет за собой удаление всех дочерних!', {title: 'Подтвердите действие'})
            if(!res) return false
            try{
                const ids = this.selected.map( s => s.id )
                const {data} = await axios.delete('/lead_nodes/destroyMany', { params: {ids} })
                this.selected = []
                const newNodes = []
                this.nodes.forEach(node => {
                    if(ids.indexOf(node.id) < 0) newNodes.push(node)
                })
                this.nodes = newNodes
                this.$toast.success('Выбранные узлы успешно удалены')
            }catch(e){}
        },
        close(){ this.$emit('close') },
        setItemsBefore({page, itemsPerPage}){
            this.itemsBefore = (page - 1) * itemsPerPage
        },
        toggleRow(evt, props){
            const savedIndex = this.savedIndex
            this.savedIndex = props.index + this.itemsBefore
            
            if (savedIndex === null || !evt.shiftKey || props.index === savedIndex){
                props.select(!props.isSelected)
                return
            }
            const subset = this.filtered.slice(
                Math.min(this.itemsBefore + props.index, savedIndex),
                Math.max(this.itemsBefore + props.index, savedIndex) + 1
            )
            const toggleFn = !props.isSelected ? addCheckedSubset : removeCheckedSubset

            this.selected = toggleFn(this.selected, subset)
        },
        async changeUser(user){
            const res = await this.$confirm('Выбрано '+this.selected.length+' записей, вы уверены, что хотите назначить ответственного "'+user.name+'"?', {title: 'Подтвердите действие'})
            if(!res) return false
            try{
                const {data} = await axios.post('/lead_nodes/changeUser', {
                    user_id: user.id,
                    ids: this.selected.map( item => item.id)
                })
                this.selected.forEach( (item, index) => {
                    this.selected[index].user = data
                })
            }catch(e){}
            return false
        },
        async changeBoard(board){
            if(!this.selected.length){
                this.$toast.warning('Не выбрано ни одной записи')
                return false
            }
            const res = await this.$confirm('Выбрано '+this.selected.length+' записей, вы уверены, что хотите изменить этап произведства на "'+board.name+'"?', {title: 'Подтвердите действие'})
            if(!res) return false
            try{
                const {data} = await axios.post('/lead_nodes/changeBoard', {
                    board_id: board.id,
                    ids: this.selected.map( item => item.id)
                })
                this.selected.forEach( (item, index) => {
                    this.selected[index].board = data
                })
                this.$emit('changeBoard')
            }catch(e){}
        }
    }
}
const notInArr = function notInArr(item) {
	return this.indexOf(item) === -1
}
function addCheckedSubset(current, add) {
	if (!current.length) return add
	return current.concat(add.filter(notInArr, current))
}

function removeCheckedSubset(current, remove) {
	return current.filter(notInArr, remove)
}
</script>