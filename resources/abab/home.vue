<template>
	<div>
		<v-row v-if="report">
			<v-col lg="4" cols="sm" class="pb-2">
				<v-card>
					<v-row class="no-gutters">
						<div class="col-auto">
							<div class="primary fill-height" style="width: 5px;"></div>
						</div>
						<div class="col pa-3 py-4 primary--text">
							<h5 class="text-truncate text-uppercase">Всего заказов</h5>
							<h1>{{report.total}}</h1>
						</div>
					</v-row>
				</v-card>
			</v-col>
			<v-col lg="4" cols="sm" class="pb-2">
				<v-card>
					<v-row class="no-gutters">
						<div class="col-auto">
							<div class="cyan fill-height" style="width: 5px;"></div>
						</div>
						<div class="col pa-3 py-4 cyan--text">
							<h5 class="text-truncate text-uppercase">Заказов сегодня</h5>
							<h1>{{report.today}}</h1>
						</div>
					</v-row>
				</v-card>
			</v-col>
			<v-col lg="4" cols="sm" class="pb-2">
				<v-card>
					<v-row class="no-gutters">
						<div class="col-auto">
							<div class="success fill-height" style="width: 5px;"></div>
						</div>
						<div class="col pa-3 py-4 success--text">
							<h5 class="text-truncate text-uppercase">Сегодня выполнено</h5>
							<h1>{{report.done}}</h1>
						</div>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>
<script>
	export default {
		data: () => ({
			report: false,
			sparklineData: [ 423,446,675,510,590,610,423,],
		}),
		async created(){
			const {data} = await axios.get('/reports')
			this.report = data
		}
	}
</script>