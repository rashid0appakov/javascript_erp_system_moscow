<template>
	<v-dialog eager @input="change" value="true" max-width="500px" @keydown.esc="response(false)">
		<v-card tile dark>
			<v-toolbar color="primary" dense flat>
				<v-toolbar-title class="white--text">Загрузка файлов</v-toolbar-title>
			</v-toolbar>
			<v-card-text class="pt-5">
				<v-file-input small-chips :multiple="data && data.multiple" v-model="files" label="Выберите файлы для загрузки"></v-file-input>
				<div style="min-height: 4px;"><v-progress-linear max="100" v-model="percent"></v-progress-linear></div>
			</v-card-text>
			<v-card-actions>
				<v-spacer/>
				<v-btn small color="warning" @click="response(false)">Отмена</v-btn>
				<v-btn small color="primary" @click="upload" :disabled="!files.length || percent > 0">Загрузить</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { VProgressLinear, VFileInput, VCard, VCardActions, VCardText, VDialog, VToolbar, VToolbarTitle, VSpacer, VBtn } from 'vuetify/lib'

export default {
	components: {
		VCard,
		VCardActions,
		VCardText,
		VDialog,
		VToolbar,
		VToolbarTitle,
		VSpacer,
		VBtn,
		VFileInput,
		VProgressLinear
	},
	props: ['url', 'data'],
	data () {
		return {
			percent: 0,
			files: []
		}
	},
 	methods: {
		async upload(){
			let formData = new FormData();
			for( var i = 0; i < this.files.length; i++ ){
  				let file = this.files[i];
				formData.append('files[' + i + ']', file);
			}
			if(this.data)
				for(let key in this.data){
					formData.append(key, this.data[key]);
				}
			try{
				const { data } = await axios({
					url: this.url,
					data: formData, 
					method: 'post',
					onUploadProgress: progressEvent => {
						this.percent = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
					}
				})
				this.files = []
				this.response(data)
			}catch(e){
				this.percent = 0
			}
		},
		response (value) {
			this.$emit('result', value)
			this.value = value
			this.$destroy()
		},
		change (res) {
			this.$destroy()
		}
  	}
}
</script>
