<template>
<div>
	<v-navigation-drawer v-model="selectedLead" absolute right touchless width="100%">
		<lead @close="selectedLead = false" v-if="selectedLead" :settings="boardSettings" :departament="departament_id" :lead_id="selectedLead"></lead>
	</v-navigation-drawer>
	<v-card class="fill-height">
		<v-toolbar flat dense>
			<v-btn outlined class="mr-4" color="primary" small @click="setToday">Сегодня</v-btn>
			<v-btn fab x-small class="mr-2" @click="prev"><v-icon small>mdi-chevron-left</v-icon></v-btn>
			<v-btn fab x-small class="mr-2" @click="next"><v-icon small>mdi-chevron-right</v-icon></v-btn>
			<v-toolbar-title v-if="$refs.calendar">Мои задачи</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-menu bottom right>
				<template v-slot:activator="{ on, attrs }">
					<v-btn outlined small color="primary" v-bind="attrs" v-on="on">
						<span>{{ typeToLabel[type] }}</span>
						<v-icon right>mdi-menu-down</v-icon>
					</v-btn>
				</template>
				<v-list>
					<v-list-item @click="type = 'day'"><v-list-item-title>День</v-list-item-title></v-list-item>
					<v-list-item @click="type = 'week'"><v-list-item-title>Неделя</v-list-item-title></v-list-item>
					<v-list-item @click="type = 'month'"><v-list-item-title>Месяц</v-list-item-title></v-list-item>
				</v-list>
			</v-menu>
		</v-toolbar>
		<v-sheet height="600px">
			<v-calendar
				ref="calendar"
				v-model="value"
				color="primary"
				locale="ru"
				event-start="created_at"
				event-end="expired_at"
				:type="type"
				:events="events"
				:weekdays="[1, 2, 3, 4, 5, 6, 0]"
				:event-color="getEventColor"
				@click:event="showEvent"
				@click:more="viewDay"
				@click:date="viewDay"
				>
				<template #event="{ event }">
					<div class="v-event-draggable text-truncate">
						{{event.body}}
					</div>
				</template>
			</v-calendar>
			<v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
				<v-card width="350px">
					<v-card-text>
						{{selectedEvent.body}}<br>
						{{selectedEvent.created_at | moment('DD.MM HH:mm')}} - {{selectedEvent.expired_at | moment('DD.MM HH:mm')}} 
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn x-small class="success" v-if="selectedEvent.lead_id && selectedEvent.departament_id" @click="showLead">Открыть</v-btn>
						<v-btn x-small class="primary" @click="selectedOpen = false">Отмена</v-btn>
					</v-card-actions>
				</v-card>
			</v-menu>
		</v-sheet>
	</v-card>
</div>
</template>

<script>
import lead from '@/components/lead'
export default {
	components: { lead },
	data: () => ({
		selectedLead: false,
		departament_id: false,
		boardSettings: false,
		value: '',
		type: 'month',
		typeToLabel: {
			month: 'Месяц',
			week: 'Неделя',
			day: 'День',
		},
		selectedEvent: {},
		selectedElement: null,
		selectedOpen: false,
		events: [],
	}),
	async created(){
		const {data} = await axios.get('/tasks')
		this.events = data
	},
	methods: {
		showLead(){
			const departament = this.$store.getters.departament(this.selectedEvent.departament_id)
			const board = departament.boards.find( b => b.leads.findIndex( l => l.id == this.selectedEvent.lead_id) > -1)
			this.boardSettings = JSON.parse(board.settings)
			this.departament_id = this.selectedEvent.departament_id
			this.selectedLead = this.selectedEvent.lead_id
			this.selectedOpen = false
		},
		viewDay ({ date }) {
			this.value = date
			this.type = 'day'
		},
		setToday () { this.value = '' },
		prev () { this.$refs.calendar.prev() },
		next () { this.$refs.calendar.next() },
		showEvent ({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event
				this.selectedElement = nativeEvent.target
				setTimeout(() => this.selectedOpen = true, 10)
			}
			if (this.selectedOpen) {
				this.selectedOpen = false
				setTimeout(open, 10)
			} else {
				open()
			}
			nativeEvent.stopPropagation()
		},
		getEventColor (event) {
			return event.color
		},
	},
}
</script>

<style scoped lang="scss">
.v-event-draggable {
	user-select: none;
	-webkit-user-select: none;
	padding-left: 6px;
}

.v-event-drag-bottom {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 4px;
	height: 4px;
	cursor: ns-resize;

	&::after {
		display: none;
		position: absolute;
		left: 50%;
		height: 4px;
		border-top: 1px solid white;
		border-bottom: 1px solid white;
		width: 16px;
		margin-left: -8px;
		opacity: 0.8;
		content: '';
	}

	&:hover::after {
		display: block;
	}
}
</style>