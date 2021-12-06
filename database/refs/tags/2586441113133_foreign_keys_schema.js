'use strict'
/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use( 'Schema' )
class ForeignKeysSchema extends Schema {
	up() {
		this.alter( 'users', ( table ) => {
			table.foreign( 'role_id' ).references( 'roles.id' )
		} )
		this.alter( 'permission_role', ( table ) => {
			table.foreign( 'role_id' ).references( 'roles.id' ).onDelete( 'cascade' )
			table.foreign( 'permission_id' ).references( 'permissions.id' ).onDelete( 'cascade' )
		} )
		this.alter( 'permission_user', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete( 'cascade' )
			table.foreign( 'permission_id' ).references( 'permissions.id' ).onDelete( 'cascade' )
		} )
		this.alter( 'messages', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('set null')
		} )
		this.alter( 'actions', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('cascade')
		} )
		this.alter( 'boards', ( table ) => {
			table.foreign( 'departament_id' ).references( 'departaments.id' ).onDelete('cascade')
		} )
		this.alter( 'leads', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('set null')
			table.foreign( 'customer_id' ).references( 'customers.id' ).onDelete('set null')
		} )
		this.alter( 'lead_nodes', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('set null')
			table.foreign( 'lead_id' ).references( 'leads.id' ).onDelete('cascade')
			table.foreign( 'parent_id' ).references( 'lead_nodes.id' ).onDelete('cascade')
			table.foreign( 'board_id' ).references( 'boards.id' ).onDelete('set null')
		} )
		this.alter( 'invoices', ( table ) => {
			table.foreign( 'lead_id' ).references( 'leads.id' ).onDelete('cascade')
		} )
		this.alter( 'teams', ( table ) => {
			table.foreign( 'departament_id' ).references( 'departaments.id' ).onDelete('cascade')
		} )
		this.alter( 'departament_dields', ( table ) => {
			table.foreign( 'departament_id' ).references( 'departaments.id' ).onDelete('cascade')
		} )
		this.alter( 'lead_histories', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('set null')
			table.foreign( 'lead_id' ).references( 'leads.id' ).onDelete('cascade')
		} )
		this.alter( 'departament_user', ( table ) => {
			table.foreign( 'departament_id' ).references( 'departaments.id' ).onDelete('cascade')
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('cascade')
		} )
		this.alter( 'departaments', ( table ) => {
			table.foreign( 'parent_id' ).references( 'departaments.id' ).onDelete('cascade')
		} )
		this.alter( 'funds', ( table ) => {
			table.foreign( 'departament_id' ).references( 'departaments.id' ).onDelete('cascade')
			table.foreign( 'lead_id' ).references( 'leads.id' ).onDelete('cascade')
		} )
		this.alter( 'board_lead', ( table ) => {
			table.foreign( 'board_id' ).references( 'boards.id' ).onDelete('cascade')
			table.foreign( 'lead_id' ).references( 'leads.id' ).onDelete('cascade')
		} )
		this.alter( 'user_team', ( table ) => {
			table.foreign( 'team_id' ).references( 'teams.id' ).onDelete('cascade')
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('cascade')
		} )
		this.alter( 'tasks', ( table ) => {
			table.foreign( 'user_id' ).references( 'users.id' ).onDelete('cascade')
			table.foreign( 'to_user_id' ).references( 'users.id' ).onDelete('cascade')
			table.foreign( 'lead_id' ).references( 'leads.id' ).onDelete('cascade')
		} )
		this.alter( 'customer_contacts', ( table ) => {
			table.foreign( 'customer_id' ).references( 'customers.id' ).onDelete('cascade')
		} )
		this.alter( 'customers', ( table ) => {
			table.foreign( 'customer_type_id' ).references( 'customer_types.id' ).onDelete('set null')
		} )
  }
  down() {
  }
}
module.exports = ForeignKeysSchema
