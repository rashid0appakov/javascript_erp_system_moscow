import { app } from '../../main';
export default function can(rule) {
    return function({ store, next }) {
		if (store.getters['can'](rule)) {
            return next();
        }
		app.$toast.error('Доступ ограничен');
        return next({
			name: 'home'
		});
    }
}
