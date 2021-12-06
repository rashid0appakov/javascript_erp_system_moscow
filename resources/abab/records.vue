<template>
    <v-list two-line>
        <v-list-item v-for="(record, i) in records" :key="i">
            <v-list-item-content>
                <v-list-item-title>{{record.from_screen_name}}</v-list-item-title>
                <v-list-item-subtitle>{{record.init_time_gmt | moment()}} ({{record.duration}}c)</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-btn v-if="!played || played != record.record_uuid || (sound && sound.paused)" @click="listen(record)"><v-icon>mdi-play</v-icon></v-btn>
                <v-btn v-if="played == record.record_uuid" @click="pause"><v-icon>mdi-pause</v-icon></v-btn>
            </v-list-item-action>
        </v-list-item>
    </v-list>
</template>
<script>
export default {
    data(){
        return {
            records: [],
            played: false,
            sound: false
        }
    },
    async created(){
        const {data} = await axios.get('/records')
        this.records = data
    },
    methods: {
        pause(){
            if(this.sound) this.sound.pause()
        },
        async listen(record){
            if(this.played == record.record_uuid){
                this.sound.play()
                return false
            }else{
                this.pause()
                this.played = record.record_uuid
                try{
                    const {data} = await axios.get('/records/'+record.record_uuid)
                    this.sound = new Audio('/uploads/records/'+data);
                    this.sound.play();
                }catch(e){}
            }
        }
    }
}
</script>