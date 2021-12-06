'use strict'

const Env = use('Env')

module.exports = {
  connection: Env.get('MAIL_CONNECTION', 'smtp'),
  smtp: {
    driver: 'smtp',
    pool: true,
    port: 465,//Env.get('SMTP_PORT', 2525),
    host: 'smtp.yandex.ru',//Env.get('SMTP_HOST'),
    secure: 'tls',
    auth: {
      user: 'ydjinkrabs@yandex.ru',//Env.get('MAIL_USERNAME'),
      pass: 'Demekhin0091'//Env.get('MAIL_PASSWORD')
    },
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10
  },
  sparkpost: {
    driver: 'sparkpost',
    apiKey: Env.get('SPARKPOST_API_KEY'),
    extras: {}
  },
  mailgun: {
    driver: 'mailgun',
    domain: Env.get('MAILGUN_DOMAIN'),
    region: Env.get('MAILGUN_API_REGION'),
    apiKey: Env.get('MAILGUN_API_KEY'),
    extras: {}
  },

  /*
  |--------------------------------------------------------------------------
  | Ethereal
  |--------------------------------------------------------------------------
  |
  | Ethereal driver to quickly test emails in your browser. A disposable
  | account is created automatically for you.
  |
  | https://ethereal.email
  |
  */
  ethereal: {
    driver: 'ethereal'
  }
}
