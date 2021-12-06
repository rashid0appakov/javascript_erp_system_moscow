<template>
    <v-template>
        <v-btn x-small text v-for="departament in $store.getters.departaments()" class="align-self-center mr-3" :key="departament.id">
            <v-icon small class="mr-2">{{departament.icon}}</v-icon>
            {{departament.name}}
        </v-btn>
    </v-template>
</template>