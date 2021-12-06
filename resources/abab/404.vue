<template>
    <error title="Ошибка 404!" :body="'Страница '+$route.path+ ' не существует'"></error>
</template>
<script>
import Error from '../components/error'
export default {
    components: {Error}
}
</script>