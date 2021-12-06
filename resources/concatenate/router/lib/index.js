const types = [
    { key: 'BOOLEAN', label: 'Да/Нет'},
    { key: 'STRING', label: 'Строка'},
    { key: 'FILE', label: 'Файл'},
    { key: 'DATE', label: 'Дата'},
    { key: 'DATETIME', label: 'Дата и время'},
    { key: 'USERSLIST', label: 'Список пользователей'},
    // { key: 'CLIENTSLIST', label: 'Список клиентов'},
    // { key: 'DEPARTAMENTSLIST', label: 'Список отделов'},
]
const prod = {
    enableWs: true,
    api: 'http://erp.fvds.ru/api/v1',
    storage: 'http://erp.fvds.ru/',
    ws: 'ws://erp.fvds.ru/',
    types: types
}
const dev = {
    enableWs: true,
    api: 'http://localhost:3333/api/v1',
    storage: 'http://localhost:3333/',
    ws: 'ws://localhost:3333/',
    types: types
}
export const config = prod