'use strict'
const { ImapFlow } = require('imapflow');
class InboxController {
    async index({ auth }){
        const client = new ImapFlow({
            host: 'imap.yandex.ru',
            port: 993,
            secure: true,
            auth: {
                user: auth.user.email_login,
                pass: auth.user.email_password
            }
        })
        await client.connect()
        let lock = await client.getMailboxLock('INBOX')
        const messages = []
        try {
            let message = await client.fetchOne('*', { source: true })
            for await (let message of client.fetch('1:3', { envelope: true })) {
                messages.push({
                    uid: message.uid,
                    id: message.id,
                    subject: message.envelope.subject,
                    data: message.envelope.date,
                    from: message.envelope.from,
                    to: message.envelope.to
                })
            }
        } finally {
            lock.release();
        }
        await client.logout()
        return messages
    }
}

module.exports = InboxController
