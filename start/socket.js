'use strict'

const Ws = use('Ws')
Ws.channel('user:*', 'UserController').middleware(['auth'])
Ws.channel('main', 'MainController').middleware(['auth'])
Ws.channel('chat', 'ChatController').middleware(['auth'])
Ws.channel('lead:*', 'LeadController').middleware(['auth'])