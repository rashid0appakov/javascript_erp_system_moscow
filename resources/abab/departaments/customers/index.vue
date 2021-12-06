<template>
<v-sheet class="fill-height">
	<v-navigation-drawer v-model="selectedLead" absolute right touchless width="100%">
		<lead @close="selectedLead = false" v-if="selectedLead" :departament="d_legal" :lead_id="selectedLead.id"></lead>
	</v-navigation-drawer>
	<v-toolbar dense flat>
		<v-toolbar-title>Юридический отдел</v-toolbar-title>
		<v-spacer></v-spacer>
	</v-toolbar>
	<v-card-text>
		<board-list @selectLead="selectLead" :departament="departament"></board-list>
	</v-card-text>
</v-sheet>
</template>
<script>
import lead from '@/components/lead'
import boardList from '@/components/boards/list'
export default {
	components: { lead, boardList },
	data() {
		return {
			selectedLead: false,
			departament: false,
		};
	},
	methods: {
		selectLead(lead){
			this.selectedLead = lead
		}
	},
	created(){
		this.departament = this.$store.getters.departaments(this.d_legal)
	}
};
</script>