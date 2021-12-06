import Upload from './Upload.vue'

function Install (Vue, options = {}) {
	const property = options.property || '$upload'
	delete options.property
	const vuetify = options.vuetify
	delete options.vuetify
	if (!vuetify) {
		console.warn('Module vuetify-uploads needs vuetify instance. Use Vue.use(VuetifyUpload, { vuetify })')
	}
	const Ctor = Vue.extend(Object.assign({ vuetify }, Upload))
	function createDialogCmp (options) {
		const container = document.querySelector('[data-app=true]') || document.body
		return new Promise(resolve => {
			const cmp = new Ctor(Object.assign({}, {
				propsData: Object.assign({}, Vue.prototype[property].options, options),
				destroyed: () => {
					container.removeChild(cmp.$el)
					resolve(cmp.value)
				}
			}))
			container.appendChild(cmp.$mount().$el)
		})
	}
	
	function show (url, options = {}) {
		options.url = url
		return createDialogCmp(options)
	}

	Vue.prototype[property] = show
	Vue.prototype[property].options = options || {}
}

if (typeof window !== 'undefined' && window.Vue) {
  	window.Vue.use(Install)
}

export default Install
