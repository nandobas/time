<template>
    <div class="rbt12">
        <Header titulo="Receitas no ano calendário anterior"></Header>

        <v-container>
            <v-alert :value="true" icon="mdi-information" :class="obterClasse()">
                <span
                    v-if="blMostrarFolhaPagamento"
                >Para a realização dos cálculos no Simples Nacional, é necessário informar a Receita Bruta auferida no mercado interno e externo, além da folha de salários pagos no ano anterior, a partir do mês de início das atividades.</span>
                <span
                    v-else
                >Para a realização dos cálculos no Simples Nacional, é necessário informar a Receita Bruta auferida no mercado interno e externo, a partir do mês de início das atividades.</span>
            </v-alert>

            <v-alert :value="true" icon="mdi-information" class="informacao mt-2">
                <span
                    v-if="blMostrarFolhaPagamento"
                >Atenção! É possível informar somente o valor total relativo a Receita Bruta e a Folha Salarial paga no ano calendário anterior. Neste caso, o simulador aplicará uma média mensal com base no valor informado, e os resultados da simulação poderão ficar distorcidos.</span>
                <span
                    v-else
                >Atenção! É possível informar somente o valor total relativo a Receita Bruta auferida no ano calendário anterior. Neste caso, o simulador aplicará uma média mensal com base no valor informado, e os resultados da simulação poderão ficar distorcidos.</span>
            </v-alert>

            <v-layout row>
                <v-flex xs12 lg12 class="text-xs-center item" ref="refContainer">
                    <div class="table-container" role="table" aria-label="Destinations">
                        <div class="flex-table header" role="rowgroup">
                            <div class="flex-row first" role="columnheader"></div>
                            <div class="flex-row" role="columnheader">Receita bruta MI</div>
                            <div class="flex-row" role="columnheader">Receita bruta ME</div>
                            <div
                                class="flex-row"
                                role="columnheader"
                                v-if="blMostrarFolhaPagamento"
                            >Folha salário</div>
                        </div>
                        <div v-for="(mes, key) in form.rbt12" :key="mes.strMes">
                            <div
                                class="flex-table row"
                                role="rowgroup"
                                v-if="key < form.rbt12.length - 1"
                            >
                                <div class="flex-row first" role="cell">{{ mes.strMes }}</div>
                                <div class="flex-row" role="cell">
                                    <v-text-field
                                        solo
                                        outline
                                        v-money="money"
                                        v-model="mes.vlReceitaMi"
                                        @keyup="changeValor($event)"
                                        maxlength="17"
                                    ></v-text-field>
                                </div>
                                <div class="flex-row" role="cell">
                                    <v-text-field
                                        solo
                                        outline
                                        v-money="money"
                                        v-model="mes.vlReceitaMe"
                                        @keyup="changeValor($event)"
                                        maxlength="17"
                                    ></v-text-field>
                                </div>
                                <div class="flex-row" role="cell" v-if="blMostrarFolhaPagamento">
                                    <v-text-field
                                        solo
                                        outline
                                        v-money="money"
                                        v-model="mes.vlFolha"
                                        @keyup="changeValor($event)"
                                        maxlength="17"
                                    ></v-text-field>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex-table row total"
                            role="rowgroup"
                            v-if="form.rbt12 && form.rbt12.length > 0"
                            :key="keyTotal"
                        >
                            <div
                                class="flex-row first"
                                role="cell"
                            >{{ form.rbt12[form.rbt12.length - 1].strMes }}</div>

                            <div class="flex-row" role="cell">
                                <v-text-field
                                    solo
                                    outline
                                    @keyup="changeTotal($event, 'mi')"
                                    v-money="money"
                                    v-model="form.rbt12[form.rbt12.length - 1].vlReceitaMi"
                                    maxlength="17"
                                ></v-text-field>
                            </div>
                            <div class="flex-row" role="cell">
                                <v-text-field
                                    solo
                                    outline
                                    @keyup="changeTotal($event, 'me')"
                                    v-money="money"
                                    v-model="form.rbt12[form.rbt12.length - 1].vlReceitaMe"
                                    maxlength="17"
                                ></v-text-field>
                            </div>
                            <div class="flex-row" role="cell" v-if="blMostrarFolhaPagamento">
                                <v-text-field
                                    solo
                                    outline
                                    @keyup="changeTotal($event, 'folha')"
                                    v-money="money"
                                    v-model="form.rbt12[form.rbt12.length - 1].vlFolha"
                                    maxlength="17"
                                ></v-text-field>
                            </div>
                        </div>
                    </div>
                </v-flex>
            </v-layout>

            <div class="button-steps">
                <v-btn @click="voltar()" class="b-btn next left ml-0">
                    <div class="icon">
                        <v-icon>mdi-chevron-left</v-icon>
                    </div>
                    <span>Voltar</span>
                </v-btn>

                <v-btn @click="avancar()" class="next right mr-0">
                    <span>Avançar</span>
                    <div class="icon">
                        <v-icon>mdi-chevron-right</v-icon>
                    </div>
                </v-btn>
            </div>
        </v-container>
    </div>
</template>
<script src="./Rbt12.js"></script>
<style lang="scss">
@import "./Rbt12.scss";
</style>