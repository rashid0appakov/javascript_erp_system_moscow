<template>
	<v-app>
		<v-overlay v-if="loading" z-index="2000"><v-progress-circular size="70" width="5" color="primary" indeterminate></v-progress-circular></v-overlay>
		<v-app-bar app v-if="check" dense>
			<v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
			<v-toolbar-title>{{appName}}</v-toolbar-title>
			<v-switch class="ml-3" @change="setTheme" v-model="$vuetify.theme.dark" hide-details dense label="Темная тема" ></v-switch>
			<v-spacer></v-spacer>
			<span>Мой баланс: {{user.balance}}</span>
			<v-badge v-if="connected" :value="$store.getters.notifications.length" color="green" dot overlap class="ml-2">
				<v-btn x-small fab @click="showNotificationsDialog = true" class="primary"><v-icon>mdi-notification-clear-all</v-icon></v-btn>
			</v-badge>
			<v-badge v-if="connected" :value="newMessage" color="green" dot overlap class="ml-2">
				<v-btn @click="$store.dispatch('toggleNewMessage'); showChatDrawer = true" x-small fab color="primary"><v-icon>mdi-chat</v-icon></v-btn>
			</v-badge>
			<v-badge v-if="connected" :content="onlineUsers.length ? onlineUsers.length : '0'" class="ml-2" color="green" overlap>
				<v-btn @click="showUsersDrawer = true" x-small fab color="primary"><v-icon>mdi-account</v-icon></v-btn>
			</v-badge>
			<v-btn x-small fab color="orange darken-4" class="ml-2"  @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
		</v-app-bar>
		<v-navigation-drawer v-model="showChatDrawer" v-if="check" right fixed temporary width="400px">
			<chat></chat>
		</v-navigation-drawer>
		<v-navigation-drawer v-model="showUsersDrawer" v-if="check" right fixed temporary width="400px">
			<users-list></users-list>
		</v-navigation-drawer>
		<v-navigation-drawer id="main-menu" v-if="check" app floating permanent :mini-variant="sidebarMenu">
			<v-list class="pt-0" dense>
				<v-list-item two-line flat dense :to="'/users/'+user.id" min-height="32px">
					<avatar :user="user" size="32"></avatar>
					<v-list-item-content>
						<v-list-item-title>{{user.name}}</v-list-item-title>
						<v-list-item-subtitle>{{user.role.name}}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
          		<v-divider></v-divider>
				<v-list-item to="/">
					<v-list-item-icon><v-icon>mdi-home-outline</v-icon></v-list-item-icon>
					<v-list-item-content><v-list-item-title>Главная</v-list-item-title></v-list-item-content>
				</v-list-item>
				<v-list-item to="/moderation" v-if="$store.getters.can('moderation')">
					<v-list-item-icon><v-icon>mdi-cash-lock</v-icon></v-list-item-icon>
					<v-list-item-content><v-list-item-title>Модерация</v-list-item-title></v-list-item-content>
				</v-list-item>
				<v-list-item to="/customers">
					<v-list-item-icon><v-icon>mdi-account-outline</v-icon></v-list-item-icon>
					<v-list-item-content><v-list-item-title>Клиенты</v-list-item-title></v-list-item-content>
				</v-list-item>
				<v-list-item to="/stocks">
					<v-list-item-icon><v-icon>mdi-home-thermometer</v-icon></v-list-item-icon>
					<v-list-item-content><v-list-item-title>Склады</v-list-item-title></v-list-item-content>
				</v-list-item>
				<v-list-item to="/tasks">
					<v-list-item-icon><v-icon>mdi-bell-circle-outline</v-icon></v-list-item-icon>
					<v-list-item-content><v-list-item-title>Задачи</v-list-item-title></v-list-item-content>
				</v-list-item>
				<v-list-item to="/inbox">
					<v-list-item-icon><v-icon>mdi-email-multiple-outline</v-icon></v-list-item-icon>
					<v-list-item-content><v-list-item-title>Почта</v-list-item-title></v-list-item-content>
				</v-list-item>
				<v-list-group no-action prepend-icon="mdi-cog-outline">
					<template v-slot:activator>
						<v-list-item-content><v-list-item-title>Настройки</v-list-item-title></v-list-item-content>
					</template>
					<v-list-item to="/settings/roles"><v-list-item-content><v-list-item-title>Должности</v-list-item-title></v-list-item-content></v-list-item>
					<v-list-item to="/settings/users"><v-list-item-content><v-list-item-title>Сотрудники</v-list-item-title></v-list-item-content></v-list-item>
					<v-list-item to="/settings/lists"><v-list-item-content><v-list-item-title>Справочники</v-list-item-title></v-list-item-content></v-list-item>
					<v-list-item to="/settings/templates"><v-list-item-content><v-list-item-title>Шаблоны</v-list-item-title></v-list-item-content></v-list-item>
				</v-list-group>
			</v-list>
		</v-navigation-drawer>
		<v-main>
			<v-container class="px-4 py-0" fluid>
				<v-tabs dense v-if="check">
					<v-btn x-small text class="align-self-center mr-3" :to="'/departaments/'+departament.id" v-for="departament in $store.getters.departaments" :key="departament.id">
						<v-icon small class="mr-2">{{departament.icon}}</v-icon>
						{{departament.name}}
						<v-menu v-if="$store.getters.subdepartaments(departament.id).length" left open-on-hover>
							<template v-slot:activator="{ on, attrs }">
								<v-btn icon fab x-small v-bind="attrs" v-on="on"><v-icon x-small>mdi-menu-down</v-icon></v-btn>
							</template>
							<v-list>
								<v-list-item v-for="child in $store.getters.subdepartaments(departament.id)" :key="child.id" :to="'/departaments/'+child.id">
									{{ child.name }}
								</v-list-item>
							</v-list>
						</v-menu>
					</v-btn>
				</v-tabs>
				<v-row>
					<v-col>
						<transition name="scale-transition" mode="out-in">
							<router-view></router-view>
						</transition>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
		<v-navigation-drawer v-model="showNotificationsDialog" v-if="check" right fixed temporary width="400px">
			<v-toolbar dense color="primary">Уведомления</v-toolbar>
			<v-list>
				<v-list-item v-for="item in $store.getters.notifications" :key="item.id">
					<v-list-item-content v-text="item.text"></v-list-item-content>
					<v-list-item-action><v-btn x-small fab class="success" @click="$store.dispatch('close_notification', item.id)"><v-icon>mdi-close</v-icon></v-btn></v-list-item-action>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
	</v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import avatar from '@/components/avatar'
import chat from '@/components/chat'
import usersList from '@/components/users/list'
export default {
	components: { avatar, chat, usersList },
	computed: {
		...mapGetters( [ 'connected', 'check', 'user', 'loading', 'messages', 'newMessage', 'onlineUsers', 'users'] )
	},
	methods: {
		setTheme(val){
			const theme = val ? 'dark' : 'light'
			window.localStorage.setItem('theme', theme)
		},
		logout(){
			this.$store.dispatch('destroy')
			this.$store.dispatch('disconnect')
			this.$toast.info('Вы вышли из системы')
			this.$router.push({ name: 'login' })
		},
		toggleSidebar(){
			this.sidebarMenu = !this.sidebarMenu
			window.localStorage.setItem('sidebarMenu', this.sidebarMenu ? 1 : 0)
		}
	},
	data: () => ({
		appName: 'Vier Group',
		showNotificationsDialog: false,
		sidebarMenu: window.localStorage.getItem('sidebarMenu') == 1,
		showChatDrawer: false,
		showUsersDrawer: false
	})
}
</script>