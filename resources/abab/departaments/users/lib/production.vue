<template>
	<div>
		<v-navigation-drawer v-model="selectedLead" absolute right touchless width="100%">
			<nodes @changeBoard="getData" @close="selectedLead = false" v-if="selectedLead" :id="selectedLead.id"></nodes>
		</v-navigation-drawer>
		<v-card>
			<v-toolbar dense flat>
				<v-toolbar-title>Производство</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<v-row>
					<v-col cols="12" md="3" v-for="lead in leads" :key="lead.id">
						<v-card max-width="400" class="fill-height">
							<v-list-item three-line>
								<v-list-item-content>
									<v-list-item-title class="headline">#{{lead.id}}</v-list-item-title>
									<v-list-item-subtitle>Создан {{lead.created_at | moment('DD.MM')}}</v-list-item-subtitle>
									<v-list-item-subtitle>В производстве {{lead.updated_at | moment('DD.MM')}}</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-card-text>
								<doughnut-chart :chart-data="lead.data"></doughnut-chart>
							</v-card-text>
							<v-card-actions>
								<v-btn small class="mx-auto" color="primary" @click="selectedLead=lead">Управление</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>
<script>
import nodes from '@/components/nodes'
import doughnutChart from '@/components/charts/doughnut.js'
export default {
	components: { nodes, doughnutChart },
    data () {
		return {
			selectedLead: false,
			leads: {}
		}
	},
	async created(){
		await this.getData()
	},
	methods: {
		async getData(){
			const {data} = await axios.get('/leads/getProduction')
			const obj = {}
			data.forEach( item => {
				if(!obj[item.lead_id]){
					obj[item.lead_id] = {
						id: item.lead_id,
						created_at: item.created_at,
						updated_at: item.updated_at,
						data: {
							labels: [item.stage],
							datasets: [
								{
									backgroundColor: [item.color],
									data: [item.count]
								}
							]
						}
					}
				}else{
					obj[item.lead_id].data.labels.push(item.stage)
					obj[item.lead_id].data.datasets[0].backgroundColor.push(item.color)
					obj[item.lead_id].data.datasets[0].data.push(item.count)
				}
			} )
			this.leads = obj
		}
	}
}
</script>
