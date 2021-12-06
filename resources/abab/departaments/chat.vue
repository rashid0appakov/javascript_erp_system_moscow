<template>
	<v-card dense class="fill-height">
		<div style="height: calc(100% - 70px); overflow: auto">
			<v-card-title>Чат</v-card-title>
			<v-card-text>
				<v-row v-for="message in $store.getters.messages" :key="message.id" class="mb-5 pb-2 elevation-1" align-center>
					<v-col sm="6" cols="6" class="py-0">
						<h4>{{message.user.name}}</h4>
					</v-col>
					<v-col sm="6" cols="6" class="text-right caption py-0">
						{{message.created_at | moment('DD.MM HH:mm')}}
					</v-col>
					<v-col cols="12" class="py-0">
						<div>{{message.body}}</div>
					</v-col>
				</v-row>
			</v-card-text>
		</div>
		<v-card-actions>
			<v-text-field
				autocomplete="off"
				v-model="input"
				append-outer-icon="mdi-send"
				clear-icon="mdi-close-circle"
				clearable
				label="Message"
				type="text"
				counter="255"
				dense
				@keyup.enter="sendMessage"
				@click:append-outer="sendMessage"
				@click:clear="input=''"
			></v-text-field>
		</v-card-actions>
	</v-card>
</template>
<script>
export default {
	data: () => ({
		input: ''
	}),
	methods: {
		sendMessage(){
			if(!this.input || !this.$store.getters.connected) return false
			this.$ws.$emitToServer('chat', 'message', this.input)
			this.input = ''
		}
	}
}
</script>