<template>
    <v-card>
        <v-toolbar dense color="primary">
            <v-toolbar-title>КП</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-row>
                <v-col cols="8">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th colspan="4">Позиции для продажи</th>
                                <th>Цена<br>за единицу</th>
                                <th>Всего</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(position, i) in positions" :key="i">
                                <td><v-text-field dense :value="i+1" disabled></v-text-field></td>
                                <td><v-text-field dense v-model="position.name"></v-text-field></td>
                                <td><v-text-field dense v-model="position.quantity"></v-text-field></td>
                                <td><v-text-field dense v-model="position.dim"></v-text-field></td>
                                <td><v-text-field dense v-model="position.price"></v-text-field></td>
                                <td><v-text-field dense :value="position.price * position.quantity"></v-text-field></td>
                            </tr>
                            <tr>
                                <td><v-text-field disabled></v-text-field></td>
                                <td><v-text-field v-model="positionModel.name"></v-text-field></td>
                                <td><v-text-field v-model="positionModel.quantity"></v-text-field></td>
                                <td><v-text-field v-model="positionModel.dim"></v-text-field></td>
                                <td><v-text-field v-model="positionModel.price"></v-text-field></td>
                                <td><v-text-field disabled :value="positionModel.quantity && positionModel.price ? positionModel.quantity * positionModel.price : 0"></v-text-field></td>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-right">
                                    <v-btn small color="success" @click="addPosition"><v-icon>mdi-plus</v-icon></v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
                <v-col cols="4">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th colspan="2">Услуги</th>
                                <th>Цена<br>всего</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(service, i) in services" :key="i">
                                <td><v-text-field dense :value="i+1" disabled></v-text-field></td>
                                <td><v-text-field dense v-model="service.name"></v-text-field></td>
                                <td><v-text-field dense v-model="service.price"></v-text-field></td>
                            </tr>
                            <tr>
                                <td><v-text-field disabled></v-text-field></td>
                                <td><v-text-field v-model="serviceModel.name"></v-text-field></td>
                                <td><v-text-field v-model="serviceModel.price"></v-text-field></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="text-right">
                                    <v-btn small color="success" @click="addService"><v-icon>mdi-plus</v-icon></v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
            </v-row>
            {{services.reduce((acc, {price}) => acc + Number(price), 0) + positions.reduce( (acc, {price, quantity}) => acc + Number(quantity) * Number(price), 0)}}
            <v-row>
                <v-col cols="6">
                    <v-radio-group v-model="model.radios" :mandatory="false">
                        <v-radio label="Проектная документация" value="1"></v-radio>
                        <v-radio label="Доставка" value="2"></v-radio>
                    </v-radio-group>
                    <v-text-field dense v-model="model.address" label="Адрес доставки"></v-text-field>
                    <v-textarea dense v-model="model.comment" rows="3" label="Комментарий менеджера"></v-textarea>
                </v-col>
                <v-col cols="6">
                    <v-text-field dense v-model="model.period" label="Срок изготовления"></v-text-field>
                    <v-textarea dense v-model="model.payment" rows="2" label="Условия оплаты"></v-textarea>
                </v-col>
            </v-row>
            <vue-html2pdf
                :show-layout="false"
                :enable-download="true"
                :preview-modal="false"
                :paginate-elements-by-height="5000"
                pdf-format="a4"
                pdf-orientation="portrait"
                pdf-content-width="790px"
                filename="kp"
                :manual-pagination="false"
                @hasStartedGeneration="hasStartedGeneration()"
                @hasGenerated="hasGenerated($event)"
                ref="html2Pdf"
            >
                <section slot="pdf-content">
                    <div class="pdf-item">
                        <div class="width-bg" style="background-image: url(/img/pdf/bg.png)">
                            <table cellspaddin="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="20%" class="logo">
                                        <div>
                                            <img src="/img/pdf/logo.png">
                                        </div>
                                    </td>
                                    <td width="50%" class="middle big white bold">
                                        Производство и монтаж<br>металлоконструкций<br>любой сложности!
                                        <hr>
                                        Поставка металлопроката
                                    </td>
                                    <td width="30%" class="middle big white text-left">
                                        8 (495) 640-74-04<br>
                                        info@vier-group.ru<br>
                                        vier-group.ru<br>
                                    </td>
                                </tr>
                            </table>    
                        </div>
                        <table cellspaddin="0" cellspacing="0" border="0">
                            <tr>
                                <td width="15%">
                                    <label class="blue">Номер заказа</label>
                                    <div class="bold black">{{lead.id}}</div>
                                </td>
                                <td width="35%">
                                    <label class="blue">Наименование компании клиента</label>
                                    <div>{{lead.customer.name}}</div>
                                </td>
                                <td>
                                    <label>Менеджер проекта</label>
                                    <div>{{lead.manager ? lead.manager.name : 'Не назначен'}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <label class="blue">ФИО клиента</label>
                                    <div>ФИО клиента</div>
                                </td>
                                <td>
                                    <label>Телефон менеджера</label>
                                    <div>{{lead.manager ? lead.manager.phone : 'Не указан'}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <label class="blue">Название объекта</label>
                                    <div>Название объекта</div>
                                </td>
                                <td>
                                    <label>Электронная почта менеджера</label>
                                    <div>{{lead.manager ? lead.manager.email : 'Не указана'}}</div>
                                </td>
                            </tr>
                        </table>
                        <div class="divider"></div>
                    </div>
                    <div class="pdf-item">
                        <table cellspaddin="0" cellspacing="0" border="0">
                            <tr>
                                <td width="50%">
                                    <table cellspaddin="0" cellspacing="0" border="0">
                                        <tr>
                                            <td class="small blue" colspan="4">Позиции для продажи</td>
                                            <td class="small blue">Цена<br>за единицу</td>
                                            <td class="small blue">Всего</td>
                                        </tr>
                                        <tr v-for="(position, i) in positions" :key="i">
                                            <td width="75px"><div>{{i+1}}</div></td>
                                            <td><div>{{position.name}}</div></td>
                                            <td><div>{{position.quantity}}</div></td>
                                            <td><div>{{position.dim}}</div></td>
                                            <td><div>{{position.price}}</div></td>
                                            <td><div>{{position.price * position.quantity}}</div></td>
                                        </tr>
                                    </table>
                                </td>
                                <td width="50%">
                                    <table cellspaddin="0" cellspacing="0" border="0">
                                        <tr>
                                            <td class="small blue" colspan="2">Услуги</td>
                                            <td class="small blue">Цена<br>всего</td>
                                        </tr>
                                        <tr v-for="(service, i) in services" :key="i">
                                            <td width="75px"><div>{{i+1}}</div></td>
                                            <td><div>{{service.name}}</div></td>
                                            <td><div>{{service.price}}</div></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <div class="divider"></div>
                    </div>
                    <div class="pdf-item">
                        <table cellspaddin="0" cellspacing="0" border="0">
                            <tr>
                                <td>
                                    <label><input type="radio" :checked="model.radios == '1'"> Проектная документация</label>
                                    <label><input type="radio" :checked="model.radios == '2'"> Доставка</label>
                                </td>
                                <td>
                                    <label class="blue">Сроки изготовления</label>
                                    <div>{{model.period}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label class="blue">Адрес доставки</label>
                                    <div>{{model.address}}</div>
                                </td>
                                <td>
                                    <label class="blue">Условия оплаты</label>
                                    <div>{{model.payment}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label class="blue">Комментарий менеджера</label>
                                    <div>{{model.comment}}</div>
                                </td>
                                <td>
                                    <label class="blue">Стоимость</label>
                                    <div class="bold black">{{services.reduce((acc, {price}) => acc + Number(price), 0) + positions.reduce( (acc, {price, quantity}) => acc + Number(quantity) * Number(price), 0)}}</div>
                                </td>
                            </tr>
                        </table>
                        <div class="divider"></div>
                    </div>
                    <div class="pdf-item">
                        <table cellspaddin="0" cellspacing="0" border="0">
                            <tr>
                                <td width="25%"><img src="/img/pdf/1.png"></td>
                                <td width="25%"><img src="/img/pdf/2.png"></td>
                                <td width="25%"><img src="/img/pdf/3.png"></td>
                                <td width="25%"><img src="/img/pdf/4.png"></td>
                            </tr>
                        </table>
                    </div>
                </section>
            </vue-html2pdf>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small class="warning mr-2" @click="close">Отмена</v-btn>
            <v-btn small class="primary" @click="generatePdf">Выставить</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import VueHtml2pdf from 'vue-html2pdf'
export default {
    components: { VueHtml2pdf },
    props: ['lead'],
    data(){
        return {
            model: {},
            radios: false,
            positionModel: {},
            serviceModel: {},
            services: [],
            positions: []
        }
    },
    methods: {
        hasStartedGeneration(){
            console.log(1)
            this.$store.dispatch('load')
        },
        hasGenerated(){
            console.log(2)
            this.$store.dispatch('unload')
        },
        close(){
            this.$emit('close')
        },
        addService(){
            this.services.push(this.serviceModel)
            this.serviceModel = {}
        },
        addPosition(){
            this.positions.push(this.positionModel)
            this.positionModel = {}
        },
        generatePdf() {
            this.$refs.html2Pdf.generatePdf()
        }
    }
}
</script>
<style lang="scss">
    .pdf-item{
        font-family: Roboto, sans-serif;
        width: 100%;
        margin: 25px auto;
        font-size: 0.9em;
        .big{ font-size: 1.3em; }
        .small{ font-size: 0.75em; }
        .very-big{ font-size: 2em; }
        .bold{ font-weight: bold;}
        .black{ color: black;}
        .white{ color: white;}
        .blue{color: #0076a9!important;}
        img{
            display: inline-block;
            max-width: 100%;
            height: auto;
        }
        .logo{
            padding: 0 15px;
            div{
                background: #dedede;
            }
        }
        .divider{
            height: 1px;
            background-color: #999;
            width: 100%;
            margin: 15px 0;
            &.white{
                background-color: #fff;
            }
        }
        .with-bg{
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }
        table{
            width: 100%;
            td{
                border: 0;
                padding: 5px;
                vertical-align: top;
                text-align: left;
                &.middle{
                    vertical-align: middle;
                }
                label{
                    display: block;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #333;
                }
                div{
                    padding: 10px;
                    background: #eaf3f4;
                    color: #666;
                }
            }
        }
    }
</style>