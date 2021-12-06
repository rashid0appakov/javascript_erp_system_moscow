<template>
    <div>
        <div v-if="!customer.contacts.filter(c => c.phone).length">
            Не указано ни одного контактного телефона
        </div>
        <v-row v-else>
            <v-col cols="12" md="8">
                <v-list two-line>
                    <v-list-item v-for="call in calls" :key="call.id">
                        <v-list-item-content>
                            <v-list-item-title>
                                <v-icon v-if="call.flow == 'in'">mdi-arrow-bottom-left</v-icon>
                                <v-icon v-else>mdi-arrow-top-right</v-icon>
                                {{call.flow == 'in' ? call.from_username : call.to_username}}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{call.start_time_gmt | moment()}} {{call.duration}}(c)</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn @click="recordsDialog(call)" small class="prunary"><v-icon small>mdi-record</v-icon></v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    <v-list-item>
                        <v-btn width="100%" small @click="getCalls">Предыдущий месяц</v-btn>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="12" md="4">
                <v-list two-line>
                    <v-list-item @click="callback(contact)" v-for="contact in customer.contacts.filter(c=> c.phone)" :key="contact.id">
                        <v-list-item-content>
                            <v-list-item-title>{{contact.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{contact.phone}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon>mdi-phone</v-icon>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
        <v-dialog width="450px" v-model="showRecordsDialog" persistent>
            <v-card>
                <v-toolbar dense color="primary">
                    <v-toolbar-title>Запись разговора</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn small icon @click="hidePlayer"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-list two-line class="mt-3">
                    <v-list-item v-for="record in records" :key="record.id">
                        <v-list-item-content class="pb-4" style="position: relative">
                            <v-list-item-title>
                                {{record.from_screen_name}}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{record.start_time_gmt | moment()}} {{record.duration}}(c)</v-list-item-subtitle>
                            <div v-if="playedId == record.record_uuid" @click="changeTime($event)" class="audio-tracker">
                                <div class="audio-tracker__timeline" :style="{width: percent + '%'}"></div>
                            </div>
                        </v-list-item-content>
                        <v-list-item-action>
                            <div>
                                <v-btn @click="stop" x-small fab class="orange darken-4 mr-2"><v-icon small>mdi-stop</v-icon></v-btn>
                                <v-btn v-if="!played" @click="play(record)" x-small fab class="orange darken-4 mr-2"><v-icon small>mdi-play</v-icon></v-btn>
                                <v-btn v-else @click="pause" x-small fab class="orange darken-4"><v-icon small>mdi-pause</v-icon></v-btn>
                            </div>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
export default {
    props: ['customer'],
    data(){
        return {
            showRecordsDialog: false,
            calls: [],
            records: [],
            now: 0,
            sound: false,
            playedId: false,
            played: false,
            percent: 0
        }
    },
    async created(){
        this.getCalls()
        this.sound = new Audio()
        this.sound.ontimeupdate = () => {
            this.percent = this.sound.currentTime * 100 / this.sound.duration;
        }
        this.sound.onended = () => {
            this.stop()
            this.percent = 0
        };
    },
    methods: {
        hidePlayer(){
            this.stop()
            this.showRecordsDialog = false
        },
        async recordsDialog(call){
            this.$store.dispatch('load')
            try{
                const {data} = await axios.get('/atc/records', {
                    params: {
                        from: call.init_time_gmt,
                        end: moment(call.init_time_gmt).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                        number: call.flow == 'in' ? call.from_username : call.to_username
                    }
                })
                this.records = data
                this.showRecordsDialog = true
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        changeTime(e){
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const sec = this.sound.duration * x / e.target.clientWidth
            console.log(x)
            console.log(e.target.clientWidth)
            console.log(sec)
            this.sound.currentTime = sec
        },
        stop(){
            if(this.played){
                this.played = false
                this.sound.pause();
                this.sound.currentTime = 0.0;
            }
        },
        pause(){
            if(this.played){
                this.played = false
                this.sound.pause()
            }
        },
        async play(record){
            if(this.playedId == record.record_uuid){
                this.played = true
                this.sound.play()
                return false
            }else{
                this.stop()
            }
            try{
                const {data} = await axios.get('/atc/records/'+record.record_uuid)
                this.sound.src = '/uploads/records/'+data
                this.playedId = record.record_uuid
                this.played = true
                this.sound.play();
            }catch(e){}
        },
        async getCalls(){
            let from, end
            this.$store.dispatch('load')
            try{
                const curr = this.now ? moment().subtract(this.now, 'months') : moment()
                from = curr.startOf('month').format('YYYY-MM-DD HH:mm:ss')
                end = curr.endOf('month').format('YYYY-MM-DD HH:mm:ss')
                this.now++
                const {data} = await axios.get('/atc/history', {
                    params: {
                        numbers: this.customer.contacts.filter(c=> c.phone).map(c=> c.phone),
                        from,
                        end 
                    }
                })
                this.calls = [...this.calls, ...data.sort((a,b) => moment(a.init_time_gmt).isBefore(b.init_time_gmt) ? 1 : -1)]
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
        async callback(contact){
            this.$store.dispatch('load')
            try{
                await axios.post('/atc/callback/'+contact.phone)
            }catch(e){}
            finally{this.$store.dispatch('unload')}
        },
    }
}
</script>
<style lang="scss" scoped>
    .audio-tracker{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 8px;
        cursor: pointer;
        border: 1px solid #e65100;
        z-index: 2;
        .audio-tracker__timeline{
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #e65100;
            z-index: 1;
        }
    }
</style>