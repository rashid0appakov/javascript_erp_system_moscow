<template>
    <v-avatar :size="size" class="mr-4" :tile="tile" color="primary">
        <img v-if="user.photo" :src="storage+user.photo" :alt="user.name">
        <span v-else class="white--text headline">{{user.name.charAt(0).toUpperCase()}}{{user.surname? user.surname.charAt(0).toUpperCase():''}}</span>
    </v-avatar>
</template>
<script>
export default {
    props: ['user', 'size', 'tile']
}
</script>