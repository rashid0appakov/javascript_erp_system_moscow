'use strict'

module.exports = {
	csp: {
		directives: {
		},
		reportOnly: false,
		setAllHeaders: false,
		disableAndroid: true
	},
	xss: {
		enabled: true,
		enableOnOldIE: false
	},
	xframe: 'DENY',
	nosniff: true,
	noopen: true,
	csrf: {
		enable: true,
		methods: ['POST', 'PUT', 'DELETE'],
		filterUris: [
			'/api/v1/test',
			'/api/v1/telphinEvent'
		],
		cookieOptions: {
			httpOnly: false,
			sameSite: true,
			path: '/',
			maxAge: 7200
		}
	}
}
