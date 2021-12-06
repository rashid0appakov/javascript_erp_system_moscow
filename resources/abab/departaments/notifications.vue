<template>
<v-card>
	<v-list>
		<v-list-item>
			<v-list-item-title>Notifycation</v-list-item-title>
		</v-list-item>
		<v-divider></v-divider>
		<v-subheader>Server</v-subheader>
		<v-list-item>
			<v-list-item-content>
				freemem
			</v-list-item-content>
			<v-list-item-action>
				{{parseInt(system.freemem/1024/1024)}} Mb
			</v-list-item-action>
		</v-list-item>
	</v-list>
</v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters(['system'])
	}
}
</script>
