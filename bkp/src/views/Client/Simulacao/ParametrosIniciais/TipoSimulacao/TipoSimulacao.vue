<template>
    <div class="tipo-simulacao">
        <fieldset>
            <legend>
                <div>
                    <span class="titulo">Que tipo de simulação você deseja fazer?</span>
                </div>
            </legend>

            <v-radio-group
                v-model="form.tipoSimulacao.intTipoSimulacao"
                column
                @change="zerarRbt12()"
            >
                <v-radio
                    v-for="ts in arOpcoes.arTipoSimulacao"
                    :key="'ts'+ts.value"
                    :label="ts.descricao"
                    :value="ts.value"
                    color="grey darken-1"
                    :disabled="(form.blLiberarCampos)"
                ></v-radio>
            </v-radio-group>
        </fieldset>
        <fieldset
            v-if="form.tipoSimulacao.intTipoSimulacao == 1 || form.tipoSimulacao.intTipoSimulacao == 2"
        >
            <legend>
                <div>
                    <span class="titulo">Selecione o mês de início das atividades</span>
                </div>
            </legend>

            <v-flex xs12 sm4 d-flex pt-2>
                <v-select
                    :items="obMeses.arMeses"
                    item-text="strNome"
                    item-value="intMes"
                    v-model="form.tipoSimulacao.intMesInicio"
                    @change="zerarRbt12(false)"
                    label
                    outline
                    solo
                    :disabled="(form.blLiberarCampos)"
                ></v-select>
            </v-flex>
        </fieldset>
        <fieldset v-if="form.tipoSimulacao.intTipoSimulacao > 0">
            <legend>
                <div>
                    <span class="titulo">Qual o regime tributário atual?</span>
                </div>
            </legend>

            <v-radio-group v-model="form.tipoSimulacao.intRegime" column>
                <v-radio
                    v-for="tr in arOpcoes.arRegime"
                    :key="'tr'+tr.value"
                    :label="tr.descricao"
                    :value="tr.value"
                    color="grey darken-1"
                ></v-radio>
            </v-radio-group>
        </fieldset>
        <fieldset>
            <legend>
                <div>
                    <span class="titulo">Selecione o período</span>
                </div>
            </legend>

            <v-radio-group v-model="form.tipoSimulacao.intAnoCompleto" column>
                <v-radio
                    v-for="tr in arOpcoes.arAnoCompleto"
                    :key="'tr'+tr.value"
                    :label="tr.descricao"
                    :value="tr.value"
                    color="grey darken-1"
                ></v-radio>
            </v-radio-group>
        </fieldset>
        <fieldset>
            <legend>
                <div>
                    <span class="titulo">Selecione o estado</span>
                </div>
            </legend>

            <v-flex xs12 sm4 d-flex pt-2>
                <v-select
                    v-if="arOpcoes.arEstados.length > 0"
                    :items="arOpcoes.arEstados"
                    item-text="strDesc"
                    item-value="strUF"
                    v-model="form.tipoSimulacao.strUF"
                    label="Selecione o estado"
                    outline
                    solo
                ></v-select>
                <div v-else>
                    <div class="loading">
                        <v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
                    </div>
                </div>
            </v-flex>
        </fieldset>
    </div>
</template>
<script src="./TipoSimulacao.js"></script>
<style lang="scss">
@import "./TipoSimulacao.scss";
</style>