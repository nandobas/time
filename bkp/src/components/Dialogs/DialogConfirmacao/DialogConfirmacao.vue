<template>
    <v-dialog
        v-model="abrirModal"
        max-width="700px"
        content-class="dialog-atencao dialog-confirmacao"
        persistent
        scrollable
    >
        <div class="image-header">
            <img
                class="icone"
                src="data:image/svg+xml;base64,
PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48Zz48cGF0aCBzdHlsZT0iZmlsbDojRkVEQjQxOyIgZD0iTTUwMy40ODQsMzkxLjZMMzAxLjkxNyw1OC45MDFjLTEwLjgwMS0xOC4zMDEtMzAtMjkuMTAxLTUxLjMwMS0yOS4xMDFzLTQwLjQ5OSwxMC44LTUxLjU5OSwyOS4zOTkgIEw4LjUxNiwzOTEuNmMtMTEuMSwxOC42LTExLjQsNDEuMS0wLjYwMSw2MC4zYzEwLjgwMSwxOC45LDMwLjMsMzAuMyw1Mi4yMDIsMzAuM2gzOTEuNzY2YzIxLjkwMSwwLDQxLjQtMTEuNCw1Mi4yMDItMzAuMyAgQzUxNC44ODQsNDMyLjcsNTE0LjU4NCw0MTAuMiw1MDMuNDg0LDM5MS42eiIgZGF0YS1vcmlnaW5hbD0iI0ZFREI0MSI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiNGRkNDMzM7IiBkPSJNNTA0LjA4NSw0NTEuOWMtMTAuODAxLDE4LjktMzAuMywzMC4zLTUyLjIwMiwzMC4zSDI1MC42MTZWMjkuOGMyMS4zMDEsMCw0MC40OTksMTAuOCw1MS4zMDEsMjkuMTAxICBMNTAzLjQ4NCwzOTEuNkM1MTQuNTg0LDQxMC4yLDUxNC44ODQsNDMyLjcsNTA0LjA4NSw0NTEuOXoiIGRhdGEtb3JpZ2luYWw9IiNGRkNDMzMiPjwvcGF0aD48Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwRDcwQjI7IiBkPSJNMjgwLjYxNiwxNTIuMnYxMjBjMCwxNi41LTEzLjUsMzAtMzAsMzBzLTMwLTEzLjUtMzAtMzB2LTEyMGMwLTE2LjUsMTMuNS0zMCwzMC0zMCAgIFMyODAuNjE2LDEzNS43MDEsMjgwLjYxNiwxNTIuMnoiIGRhdGEtb3JpZ2luYWw9IiMwRDcwQjIiPjwvcGF0aD4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwRDcwQjI7IiBkPSJNMjgwLjYxNiwzOTIuMmMwLDE2LjUtMTMuNSwzMC0zMCwzMHMtMzAtMTMuNS0zMC0zMHMxMy41LTMwLDMwLTMwUzI4MC42MTYsMzc1LjcwMSwyODAuNjE2LDM5Mi4yeiIgZGF0YS1vcmlnaW5hbD0iIzBENzBCMiI+PC9wYXRoPgo8L2c+PGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMDA1OUFBIiBkPSJNMjgwLjYxNiwzOTIuMmMwLDE2LjUtMTMuNSwzMC0zMCwzMHYtNjBDMjY3LjExNiwzNjIuMiwyODAuNjE2LDM3NS43MDEsMjgwLjYxNiwzOTIuMnoiIGRhdGEtb3JpZ2luYWw9IiMwMDU5QUEiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDU5QUEiPjwvcGF0aD4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDU5QUEiIGQ9Ik0yODAuNjE2LDE1Mi4ydjEyMGMwLDE2LjUtMTMuNSwzMC0zMCwzMHYtMTgwQzI2Ny4xMTYsMTIyLjIsMjgwLjYxNiwxMzUuNzAxLDI4MC42MTYsMTUyLjJ6IiBkYXRhLW9yaWdpbmFsPSIjMDA1OUFBIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDA1OUFBIj48L3BhdGg+CjwvZz48L2c+IDwvc3ZnPg=="
            />
        </div>

        <v-icon class="close" @click="fechar()">mdi-close</v-icon>

        <v-card>
            <v-card-title class="headline">
                <div class="h1">Confirmação e validação dos dados</div>
            </v-card-title>
            <v-card-text>
                <fieldset>
                    <legend>
                        <div>
                            <span class="titulo">Tipo de simulação</span>
                        </div>
                    </legend>

                    <div v-for="ts in arOpcoes.arTipoSimulacao" :key="'cts' + ts.value">
                        <span
                            class="opcao-selecionada"
                            v-if="
                                ts.value == form.tipoSimulacao.intTipoSimulacao
                            "
                        >{{ ts.descricao }}</span>
                    </div>
                </fieldset>
                <fieldset
                    v-if="
                        form.tipoSimulacao.intTipoSimulacao == 1 ||
                            form.tipoSimulacao.intTipoSimulacao == 2
                    "
                >
                    <legend>
                        <div>
                            <span class="titulo">Mês de início das atividades</span>
                        </div>
                    </legend>

                    <div v-for="mes in obMeses.arMeses" :key="'ctm' + mes.intMes">
                        <span
                            class="opcao-selecionada"
                            v-if="mes.intMes == form.tipoSimulacao.intMesInicio"
                        >{{ mes.strNome }}</span>
                    </div>
                </fieldset>
                <fieldset v-if="form.tipoSimulacao.intTipoSimulacao > 0">
                    <legend>
                        <div>
                            <span class="titulo">Regime tributário atual</span>
                        </div>
                    </legend>

                    <div v-for="tr in arOpcoes.arRegime" :key="'ctr' + tr.value">
                        <span
                            class="opcao-selecionada"
                            v-if="tr.value == form.tipoSimulacao.intRegime"
                        >{{ tr.descricao }}</span>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <div>
                            <span class="titulo">Período para a simulação</span>
                        </div>
                    </legend>

                    <div v-for="ac in arOpcoes.arAnoCompleto" :key="'cts' + ac.value">
                        <span
                            class="opcao-selecionada"
                            v-if="ac.value == form.tipoSimulacao.intAnoCompleto"
                        >{{ ac.descricao }}</span>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <div>
                            <span class="titulo">Estado</span>
                        </div>
                    </legend>

                    <div v-for="e in arOpcoes.arEstados" :key="'ce' + e.strUF">
                        <span
                            class="opcao-selecionada"
                            v-if="e.strUF == form.tipoSimulacao.strUF"
                        >{{ e.strDesc }}</span>
                    </div>
                </fieldset>
                <!--fieldset>
                    <legend>
                        <div>
                            <span class="titulo">Cnaes</span>
                        </div>
                    </legend>

                    <div v-for="c in form.cnaes" :key="'ccnae' + c.idcnae">
                        <span class="opcao-selecionada">
                            {{ c.cnae + " - " + c.descricao }}
                            <div
                                class="incidencia"
                                v-if="verificaIncidenciaIpiIss(c.idcnae)"
                            >
                                ( Incidência de IPI e ISS )
                            </div>
                        </span>
                    </div>
                </fieldset-->
                <fieldset>
                    <legend>
                        <div>
                            <span class="titulo">Cnaes/ Validações</span>
                        </div>
                    </legend>
                    <div v-if="form.cnaes">
                        <ul v-for="c in form.cnaes" :key="'ccnae' + c.idcnae">
                            <li>
                                {{ c.cnae + " - " + c.descricao }}
                                <ul v-if="c.validacoes">
                                    <li
                                        v-for="validacao in c.validacoes
                                            .titulos_validacoes[0].validacoes"
                                        :key="
                                            'validacao' + validacao.id_validacao
                                        "
                                        class="incidencia"
                                    >
                                        <span v-if="validacao.blMarcado == 1">
                                            <v-icon left>mdi-check</v-icon>
                                            {{validacao.validacao
                                            .texto_validacao
                                            }}
                                        </span>
                                    </li>

                                    <li
                                        class="incidencia"
                                        v-if="verificaIncidenciaIpiIss(c.idcnae)"
                                    >
                                        <v-icon left>mdi-check</v-icon>
                                        <span>&nbsp;Incidência de IPI e ISS</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </fieldset>
                <fieldset v-if="form.cnaesEquiparacao && form.cnaesEquiparacao.length > 0">
                    <legend>
                        <div>
                            <span class="titulo">Equiparacao de IPI</span>
                        </div>
                    </legend>

                    <div v-for="c in form.cnaesEquiparacao" :key="c.idcnae">
                        <span>{{ c.cnae }} - {{ c.descricao }}</span>
                    </div>
                </fieldset>

                <fieldset v-if="form.valorFap && form.valorFap.length > 0">
                    <legend>
                        <div>
                            <span class="titulo">FAP</span>
                        </div>
                    </legend>

                    <div>
                        <span>{{ form.valorFap }}</span>
                    </div>
                </fieldset>
                <fieldset v-if="form && form.idCnaeFuncionarios">
                    <legend>
                        <div>
                            <span class="titulo">CNAE com maior numero de funcionarios</span>
                        </div>
                    </legend>

                    <div v-for="c in form.cnaes" :key="'ccnae' + c.idcnae">
                        <span
                            v-if="c.idcnae == form.idCnaeFuncionarios"
                        >{{ c.cnae }} - {{ c.descricao }}</span>
                    </div>
                </fieldset>
            </v-card-text>
            <v-card-actions>
                <div class="button-area" style="text-align: center;">
                    <v-btn
                        class="outline"
                        @click="
                            abrir.origem == 'iniciada'
                                ? fechar('iniciada')
                                : fechar(null)
                        "
                    >
                        <span v-if="abrir.origem == 'iniciada'">Cancelar</span>
                        <span v-else>Voltar</span>
                    </v-btn>
                    <v-btn
                        :disabled="blLoadingCampos"
                        @click="
                            abrir.origem == 'iniciada' ? refazer() : confirmar()
                        "
                    >
                        <span v-if="blLoadingCampos">
                            <v-layout row justify-center align-center>
                                <v-progress-circular
                                    indeterminate
                                    :size="20"
                                    :width="2"
                                    color="grey"
                                ></v-progress-circular>
                            </v-layout>
                        </span>
                        <span v-else-if="abrir.origem == 'iniciada'">Refazer</span>
                        <span v-else>Confirmar</span>
                    </v-btn>
                    <div class="v-alert warning" v-if="abrir.origem == 'iniciada'">
                        <span>
                            Atenção! Ao clicar em Refazer, os valores
                            preenchidos anteriormente serão perdidos
                            <br />(Ex: Receitas e Despesas), sendo necessário
                            preenchê-los novamente.
                        </span>
                    </div>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script src="./DialogConfirmacao.js"></script>
<style lang="scss">
@import "./DialogConfirmacao.scss";
</style>
