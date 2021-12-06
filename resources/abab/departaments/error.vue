<template>
	<v-row>
        <v-col cols="12" class="py-0">
            <h1 class="font-weight-light mb-0">{{title}}</h1>
            <p>{{body}}</p>
			<v-divider class="my-3"></v-divider>
			<v-btn to="/">На главную</v-btn>
        </v-col>
    </v-row>
</template>
<script>
export default {
    props: ['title', 'body']
}
</script>