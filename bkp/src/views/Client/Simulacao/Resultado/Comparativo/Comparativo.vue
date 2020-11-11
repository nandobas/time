<template>
    <div>
        <SimplesNacional
            style="display:none"
            v-on:setPreResult="setPreResult"
            ref="calcular_sn"
            :preResult="preResult"
            :form="form"
        ></SimplesNacional>
        <Real
            style="display:none"
            v-on:setPreResult="setPreResult"
            ref="calcular_real"
            :preResult="preResult"
            :form="form"
        ></Real>

        <Presumido
            style="display:none"
            v-on:setPreResult="setPreResult"
            :preResult="preResult"
            :form="form"
            ref="calcular_lp"
        ></Presumido>
        <div class="resultado">
            <Header titulo="Comparativo"></Header>
            <v-layout row justify-center class="ma-5 pa-5" v-if="!calculou ">
                <v-progress-circular indeterminate :size="70" :width="5"></v-progress-circular>
            </v-layout>
            <v-layout v-else wrap>
                <div class="navigation-tabs">
                    <div class="cnaes">
                        <div
                            v-for="(c, indexCnae) in arCnaes['sn']"
                            :key="'abaCnae'+indexCnae"
                            :class="['cnae', indexCnae == intIndexCnae ? 'active': '']"
                            @click="intIndexCnae = indexCnae; intIndexSegmento = 0"
                        >
                            <div class="codigo">{{ c.cnae }}</div>
                            <div class="descricao">{{ c.descricao }}</div>
                        </div>
                    </div>

                    <div
                        class="segmentos"
                        v-if="intIndexCnae != 99 && !arCnaes['sn'][intIndexCnae].impedimento"
                    >
                        <div
                            v-for="(validacao, indexValidacao) in arCnaes['sn'][intIndexCnae].arValidacoes"
                            :key="'keyCnaeValidacao'+validacao.id"
                            :class="['segmento', 'industria', intIndexSegmento == indexValidacao ? 'active' : '']"
                            @click="intIndexSegmento = indexValidacao"
                        >
                            <div class="icone-area">
                                <v-icon>mdi-factory</v-icon>
                            </div>
                            <span class="texto">{{ validacao.texto_validacao }}</span>

                            <div class="segmento segmento-hover">
                                <div class="icone-area">
                                    <v-icon>mdi-factory</v-icon>
                                </div>
                                <span class="texto">{{ validacao.texto_validacao }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="intIndexCnae != 99 && arCnaes['sn'][intIndexCnae].impedimento">
                    <v-alert type="warning" icon="mdi-information" class="mt-4" :value="true">
                        <span v-html="arCnaes[intIndexCnae].impedimento.texto"></span>
                    </v-alert>
                </div>
                <div v-else-if="intIndexCnae != 99" class="area-tabela-result">
                    <div
                        class="anexo"
                    >Anexo {{ arCnaes['sn'][intIndexCnae].arValidacoes[intIndexSegmento].anexo }}</div>

                    <div class="area-tabela">
                        <table class="tabela">
                            <tr class="linha">
                                <td class="coluna legenda text-sm-left"></td>
                                <td
                                    class="coluna legenda"
                                    v-for="(receita, indexReceita) in filtrarReceitasSn"
                                    :key="'mes'+indexReceita"
                                >{{ arMeses[indexReceita].strAbreviacao }}</td>
                                <td class="coluna legenda">Total</td>
                            </tr>
                            <tr class="linha">
                                <td class="coluna legenda">Simples Nacional</td>

                                <td
                                    class="coluna legenda"
                                    v-for="(receita, indexReceita) in filtrarReceitasSn"
                                    :key="'total-'+indexReceita"
                                >{{ calcularTotal(receita) }}</td>
                                <td class="coluna legenda">{{ getTotalAno('SN') }}</td>
                            </tr>
                            <tr class="linha">
                                <td class="coluna legenda">Lucro Presumido</td>
                                <td
                                    class="coluna legenda"
                                    v-for="(vlTotal, index) in filtrarReceitasLp"
                                    :key="'lp_total'+index"
                                >{{ vlTotal }}</td>
                                <td class="coluna legenda">{{ getTotalAno('LP') }}</td>
                            </tr>
                            <tr class="linha">
                                <td class="coluna legenda">Lucro Real</td>
                                <td
                                    class="coluna legenda"
                                    v-for="(vlTotal, index) in filtrarReceitasLr"
                                    :key="'lr_total'+index"
                                >{{ vlTotal }}</td>
                                <td class="coluna legenda">{{ getTotalAno('LR') }}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="tabela-flex">
                        <div class="coluna tributo">
                            <div class="linha legenda">&nbsp;</div>
                            <div class="linha legenda">Simples Nacional</div>
                            <div class="linha legenda">Lucro Presumido</div>
                            <div class="linha legenda">Lucro Real</div>
                        </div>
                        <div class="coluna">
                            <div>
                                <div class="linha legenda">Primeiro Trimestre</div>
                                <div class="linha total">R$ {{getTotalTrimestre('SN', 1)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LP', 1)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LR', 1)}}</div>
                            </div>
                        </div>
                        <div class="coluna">
                            <div>
                                <div class="linha legenda">Segundo Trimestre</div>
                                <div class="linha total">R$ {{getTotalTrimestre('SN', 2)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LP', 2)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LR', 2)}}</div>
                            </div>
                        </div>
                        <div class="coluna">
                            <div>
                                <div class="linha legenda">Terceiro Trimestre</div>
                                <div class="linha total">R$ {{getTotalTrimestre('SN', 3)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LP', 3)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LR', 3)}}</div>
                            </div>
                        </div>
                        <div class="coluna">
                            <div>
                                <div class="linha legenda">Quarto Trimestre</div>
                                <div class="linha total">R$ {{getTotalTrimestre('SN', 4)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LP', 4)}}</div>
                                <div class="linha total">R$ {{getTotalTrimestre('LR', 4)}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="tabela-flex">
                        <div class="coluna tributo">
                            <div class="linha legenda">&nbsp;</div>
                            <div class="linha legenda">Simples Nacional</div>
                            <div class="linha legenda">Lucro Presumido</div>
                            <div class="linha legenda">Lucro Real</div>
                        </div>
                        <div class="coluna coluna-3">
                            <div>
                                <div class="linha legenda">Ano</div>
                                <div class="linha total">R$ {{ getTotalAno('SN') }}</div>
                                <div class="linha total">R$ {{ getTotalAno('LP') }}</div>
                                <div class="linha total">R$ {{ getTotalAno('LR') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-layout>
        </div>
    </div>
</template>

<script src="./Comparativo.js"></script>
<style lang="scss">
@import "./Comparativo.scss";
</style>