export default function guest({
    next,
    store
}) {
    if (store.getters['check']) {
        return next({
            name: 'home'
        })
    }

    return next()
}
