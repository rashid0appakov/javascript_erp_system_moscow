'use strict'

/*
|--------------------------------------------------------------------------
| BaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
const Hash = use('Hash')
class BaseSeeder {
	async run() {
		await Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
		await Database.truncate('users')
		await Database.truncate('roles')
		await Database.truncate('permissions')
		await Database.raw('SET FOREIGN_KEY_CHECKS = 1;')
		await Database.table('roles').insert([
			{ id: 1, name: 'Администратор', color: '#ff0000' },
			{ id: 2, name: 'Пользователь', color: '#0000ff' }
		])
		await Database.table('users').insert(
			{ id: 1, name: 'admin', role_id: 1, email: 'sepgg@bk.ru', password: await Hash.make('123power') }
		)
		await Database.table('departaments').insert([
			{ id: 1, name: 'Продажи'},
			{ id: 2, name: 'Логистика'},
			{ id: 3, name: 'Юридический отдел'},
			{ id: 4, name: 'Проектный отдел'},
			{ id: 5, name: 'Производство'},
			{ id: 6, name: 'Монтаж'},
			{ id: 7, name: 'Снабжение'},
			{ id: 8, name: 'Бухгалтерия'},
			{ id: 9, name: 'HR отдел'}
			{ id: 10, name: 'Финансовый отдел'}
		])
	}
}

module.exports = BaseSeeder
