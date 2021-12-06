<template>
    <v-card>
		<v-toolbar>
            <v-btn fab x-small class="error darken-3 mr-3" @click="close"><v-icon>mdi-close</v-icon></v-btn>
            <v-divider class="mx-2" vertical></v-divider>
            <v-text-field v-model="search" append-icon="search" dense hide-details single-line label="Найти"></v-text-field>
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
            :search="search"
            height="550"
            show-select
            item-key="id"
            locale="ru"
            class="elevation-1"
            show-group-by
            group-by="category.name"
            v-model="selected"
            :footer-props="fprops"
            :headers="headers.filter( el => el.active )"
            :items="materials"
            @pagination="setItemsBefore"
            @update:group-by="group"
        >
        <template v-slot:item="props">
            <tr>
                <td>
                    <v-checkbox class="mt-0" hide-details :input-value="props.isSelected" @click.stop="toggleRow($event, props)"></v-checkbox>
                </td>
                <td v-if="headers[0].active && !groupState">{{props.item.category.name}}</td>
                <td v-if="headers[1].active">{{props.item.name}}</td>
                <td v-if="headers[2].active">{{props.item.weight}}</td>
                <td v-if="headers[3].active">{{props.item.quantity}}</td>
                <td v-if="headers[2].active">{{props.item.price}}</td>
            </tr>
        </template>
        <template v-slot:footer="props">
            <v-card>
                <v-card-text>
                    <v-btn x-small class="success mr-1" @click="materialDialog({})" :disabled="!categories.length">Добавить элемент</v-btn>
                    <v-btn x-small class="primary mr-1" @click="materialDialog(false)" :disabled="selected.length != 1">Редактировать элемент</v-btn>
                    <v-btn x-small class="error mr-1" @click="destroySelected" :disabled="!selected.length">Удалить выбраные</v-btn>
                    <v-btn x-small class="success mr-1" @click="showCategoriesDialog = true">Категории</v-btn>
                </v-card-text>
            </v-card>
        </template>
        </v-data-table>
        <v-dialog v-model="showCategoriesDialog" width="350px">
            <v-card>
                <v-toolbar dense color="primary">Список категорий</v-toolbar>
                <v-card-text class="pt-5">
                    <v-btn small class="success" @click="categoryDialog({})">Добавить категорию</v-btn>
                    <v-list dense>
                        <v-list-item v-for="category in categories" :key="category.id">
                            <v-list-item-content>{{category.name}}</v-list-item-content>
                            <v-list-item-action>
                                <div>
                                    <v-btn x-small class="warning" @click="categoryDialog(category)"><v-icon small>mdi-pencil</v-icon></v-btn>
                                    <v-btn x-small class="error" @click="destroyCategory(category)"><v-icon small>mdi-delete</v-icon></v-btn>
                                </div>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showCategoryDialog" width="350px">
            <v-card>
                <v-toolbar dense color="primary"><span v-if="materialModel.id">Редактирование категории</span><span v-else>Новая категория</span></v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field dense outlined v-model="categoryModel.name" label="Название"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="warning mr-2" x-small @click="showCategoryDialog = false">Отмена</v-btn>
                    <v-btn class="success" x-small @click="saveCategory">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="showMaterialDialog" width="350px">
            <v-card>
                <v-toolbar dense color="primary"><span v-if="materialModel.id">Редактирование элемента</span><span v-else>Новый элемент</span></v-toolbar>
                <v-card-text class="pt-5">
                    <v-select :items="categories" v-model="materialModel.material_category_id" item-value="id" item-text="name" dense outlined single-line label="Категория"></v-select>
                    <v-text-field dense outlined v-model="materialModel.name" label="Название"></v-text-field>
                    <v-text-field dense outlined v-model="materialModel.weight" label="Вес"></v-text-field>
                    <v-text-field dense outlined v-model="materialModel.quantity" label="Кол-во"></v-text-field>
                    <v-text-field dense outlined v-model="materialModel.price" label="Цена"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="warning mr-2" x-small @click="showMaterialDialog = false">Отмена</v-btn>
                    <v-btn class="success" x-small @click="saveMaterial">Сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
	</v-card>
</template>
<script>
export default {
    data(){
        return {
            categories: [],
            materials: [],
            search: '',
            selected: [],
            savedIndex: null,
            itemsBefore: 0,
            showMaterialDialog: false,
            showCategoryDialog: false,
            showCategoriesDialog: false,
            materialModel: {},
            categoryModel: {},
            groupState: true,
            fprops: {
                "items-per-page-options": [20, 100, 200]
            },
            headers: [
                { active: true, text: 'Категория', value: 'category.name'},
				{ active: true, text: 'Название', value: 'name', groupable: false},
				{ active: true, text: 'Вес', value: 'weight', groupable: false},
                { active: true, text: 'Кол-во', value: 'quantity', groupable: false},
                { active: true, text: 'Цена', value: 'price', groupable: false}
			],
        }
    },
    async created(){
        const materials = await axios.get('/materials')
		const categories = await axios.get('/materialCategories')
		this.materials = materials.data;
        this.categories = categories.data
    },
    methods: {
        group(cat){
            this.groupState = cat
        },
        materialDialog(model){
            this.materialModel = model ? model : this.selected[0]
            this.showMaterialDialog =true
        },
        categoryDialog(model){
            this.categoryModel = model ? model : this.selected[0]
            this.showCategoryDialog =true
        },
        async saveMaterial(){
            try{
                if(this.materialModel.id){
                    const {data} = await axios.put('/materials/'+this.materialModel.id, this.materialModel)
                    this.$set(this.materials, this.materials.findIndex(m=>m.id == data.id), data)
                    this.selected = []
                }else{
                    const {data} = await axios.post('/materials', this.materialModel)
                    this.materials.push(data)
                }
                this.$toast.success('Элемент успешно сохранен')
                this.showMaterialDialog = false
            }catch(e){
            }
        },
        async saveCategory(){
            try{
                if(this.categoryModel.id){
                    const {data} = await axios.put('/materialCategories/'+this.categoryModel.id, this.categoryModel)
                    this.selected[0] = data
                }else{
                    const {data} = await axios.post('/materialCategories', this.categoryModel)
                    this.categories.push(data)
                }
                this.$toast.success('Категория успешно сохранена')
                this.showCategoryDialog = false
            }catch(e){
            }
        },
        async destroyCategory(category){
            let res = await this.$confirm('Вы уверены, что хотите удалить категорию '+category.name+'?', {title: 'Подтвердите действие'})
            if(!res) return false
            if(this.materials.filter(m => m.material_category_id == category.id).length){
                this.$toast.warning('Категория не пуста, перенесите материалы в другую категорю, прежде чем удалить выбранную')
                return false
            }
            try{
                await axios.delete('/materialCategories/'+category.id)
                this.categories.splice(this.categories.findIndex(c => c.id == category.id), 1)
                this.$toast.success('Категория успешно удалена')
            }catch(e){}
        },
        async destroySelected(){
            const res = await this.$confirm('Вы уверены, что хотите удалить выбранные элементы?', {title: 'Подтвердите действие'})
            if(!res) return false
            try{
                const ids = this.selected.map( s => s.id )
                const {data} = await axios.delete('/materials/destroyMany', { params: {ids} })
                this.selected = []
                const newMaterials = []
                this.materials.forEach(m => {
                    if(ids.indexOf(m.id) < 0) newMaterials.push(node)
                })
                this.materials = newMaterials
                this.$toast.success('Выбранные элементы успешно удалены')
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