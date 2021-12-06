export default function auth({ next, store }) {
    if (!store.getters['check']) {
        return next({ name: 'login' })
    }
    return next()
}