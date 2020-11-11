<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Seletor de Impressão</v-card-title>

        <fieldset>
            <legend>
                <div>
                    <span class="titulo">Quais atividades deseja incluir na impressão?</span>
                </div>
            </legend>
            <ul v-for="c in vlMarcadas" :key="'ccnae' + c.idcnae">
                <li>
                    {{ c.cnae + " - " + c.descricao }}
                    <ul v-if="c.arValidacoes">
                        <li
                            v-for="(validacao, intIndexValidacao) in c.arValidacoes"
                            :key="
                                            'validacao' + validacao.id
                                        "
                            class="incidencia"
                        >
                            <v-checkbox
                                :key="'idx_val'+intIndexValidacao"
                                :label="validacao.texto_validacao"
                                :value="1"
                                aria-checked="true"
                                v-model="validacao.bl_selecionado"
                                color="grey darken-1"
                            ></v-checkbox>
                        </li>
                    </ul>
                </li>
            </ul>
        </fieldset>
        <fieldset>
            <legend>
                <div>
                    <span class="titulo">Quais os meses deseja incluir na impressão?</span>
                </div>
            </legend>

            <div class="navigation-tabs">
                <div class="meses">
                    <ul v-for="(mes, indexMes) in mesMarcados" :key="'mes-'+indexMes">
                        <v-checkbox
                            :key="'idx_mes'+indexMes"
                            :label="mes.label"
                            :value="1"
                            v-model="mes.bl_selecionado"
                            aria-checked="true"
                            color="grey darken-1"
                        ></v-checkbox>
                    </ul>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>
                <div>
                    <span class="titulo">Quais abas devem ser incluídas na exibição?</span>
                </div>
            </legend>

            <div class="navigation-tabs">
                <div class="meses">
                    <ul v-for="(aba, indexAbas) in abaMarcadas" :key="'aba-'+indexAbas">
                        <v-checkbox
                            :key="'idx_aba'+indexAbas"
                            :label="aba.label.label"
                            :value="1"
                            :style="aba.label==='false' ? 'display:none': ''"
                            v-model="aba.bl_selecionado"
                            aria-checked="true"
                            color="grey darken-1"
                        ></v-checkbox>
                    </ul>
                </div>
            </div>
        </fieldset>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="gray darken-1" text @click="$emit('fechar')">Cancelar</v-btn>
            <v-btn color="gray darken-1" text @click="setConfigImpressao()">Imprimir</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script src="./SeletorImpressao.js"></script>
<style lang="scss">
@import "./SeletorImpressao.scss";
</style>