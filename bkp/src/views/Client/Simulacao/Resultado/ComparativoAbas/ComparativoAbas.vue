<template>
    <div class="navigation-tabs" v-if="calculou">
        <div class="navigation-tabs">
            <div class="cnaes">
                <div
                    v-for="(c, indexCnae) in preResult.result_sn"
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
                v-if="intIndexCnae != 99 && !preResult.result_sn[intIndexCnae].impedimento"
            >
                <div
                    v-for="(validacao, indexValidacao) in preResult.result_sn[intIndexCnae].arValidacoes"
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

        <div class="navigation-tabs">
            <div class="meses">
                <div
                    :class="['mes', intMes == indexMes ? 'active' : '']"
                    v-for="(mes, indexMes) in arMesesFiltrado"
                    :key="'mes-'+indexMes"
                    @click="changeMes(indexMes)"
                >{{ arMesesFiltrado.length > 6 ? mes.strAbreviacao : mes.strNome }}</div>
            </div>
        </div>
        <div class="aba_comparativo">
            <div class="area-obs area-tabela">
                <table class="tabela">
                    <tr class="linha">
                        <td class="coluna legenda text-sm-left" style="min-width:200px;"></td>
                        <td
                            class="coluna legenda"
                            style="min-width:80px;"
                            v-for="(tributo, indexTotal) in totalTributosSN"
                            :key="'memoria_sn_total'+indexTotal"
                        >{{ tributo.tributo }}</td>
                    </tr>
                    <tr class="linha">
                        <td class="coluna legenda">Simples Nacional</td>

                        <td
                            class="coluna legenda"
                            v-for="(tributo, indexTotal) in totalTributosSN"
                            :key="'total-'+indexTotal"
                        >{{ tributo.valor }}</td>
                    </tr>
                    <tr class="linha">
                        <td class="coluna legenda">Lucro Presumido</td>

                        <td
                            class="coluna legenda"
                            v-for="(tributo, indexTotal) in totalTributosLP"
                            :key="'total-'+indexTotal"
                        >{{ tributo.valor }}</td>
                    </tr>
                    <tr class="linha">
                        <td class="coluna legenda">Lucro Real</td>

                        <td
                            class="coluna legenda"
                            v-for="(tributo, indexTotal) in totalTributosLR"
                            :key="'total-'+indexTotal"
                        >{{ tributo.valor }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script src="./ComparativoAbas.js"></script>
<style lang="scss">
@import "./ComparativoAbas.scss";
</style>