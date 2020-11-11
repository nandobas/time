<template>
    <div class="simulacoes">
        <div class="lista-area mt-2">
            <v-layout v-if="arSimulacoes.length > 0">
                <v-flex xs12 md5>
                    <v-text-field
                        autofocus
                        single-line
                        v-model="strFiltro"
                        label="Pesquisar simulação"
                        clearable
                        append-icon="mdi-magnify"
                        class="pt-0"
                        outline
                        solo
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-data-table :items="filtered" hide-actions :pagination.sync="pagination" class="mt-3">
                <template v-slot:headers="pagination" v-if="filtered.length > 0">
                    <tr>
                        <th class="text-xs-left">Nome</th>
                        <th
                            width="180px"
                            :class="[
                                'column sortable', 
                                pagination.descending ? 'desc' : 'asc', 
                                'active',
                               'text-xs-center',
                                
                            ]"
                            @click="pagination.descending = !pagination.descending"
                        >
                            Última alteração
                            <v-icon>mdi-arrow-up</v-icon>
                        </th>
                        <th class="acao text-xs-center" width="180px">Ação</th>
                    </tr>
                </template>
                <template v-slot:items="props">
                    <td>
                        <span class="item">{{ props.item.strNome }}</span>
                    </td>
                    <td>
                        <span class="item center">{{ props.item.updated_at }}</span>
                    </td>
                    <td class="acao">
                        <span class="item center">
                            <v-tooltip top open-delay="0" close-delay="0">
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                        @click="selecionaSimulacao(props.item)"
                                        v-on="on"
                                    >mdi-pencil</v-icon>
                                </template>
                                <span>Abrir Simulação</span>
                            </v-tooltip>
                            <v-tooltip top open-delay="0" close-delay="0">
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                        @click="copiarSimulacao(props.item)"
                                        v-on="on"
                                    >mdi-content-copy</v-icon>
                                </template>
                                <span>Copiar Simulação</span>
                            </v-tooltip>
                            <v-tooltip top open-delay="0" close-delay="0">
                                <template v-slot:activator="{ on }">
                                    <v-icon
                                        @click="abrirDialogExcluir(props.item)"
                                        v-on="on"
                                    >mdi-delete</v-icon>
                                </template>
                                <span>Excluir Simulação</span>
                            </v-tooltip>
                        </span>
                    </td>
                </template>
                <template v-slot:no-data>
                    <v-alert
                        :value="true"
                        class="info-cinza"
                        icon="mdi-alert-circle"
                        color="grey lighten-3"
                        v-if="timeoutPesquisa"
                    >
                        <span>
                            <v-layout row justify-center align-center>
                                <v-progress-circular
                                    indeterminate
                                    :size="20"
                                    :width="2"
                                    color="grey"
                                ></v-progress-circular>
                            </v-layout>
                        </span>
                    </v-alert>
                    <v-alert
                        :value="true"
                        class="info-cinza"
                        color="grey lighten-3"
                        icon="mdi-alert-circle"
                        v-else
                    >
                        <span class="texto">Nenhuma simulação encontrada</span>
                    </v-alert>
                </template>
            </v-data-table>

            <div class="text-xs-center pt-2" v-if="filtered.length > 0 && pagination.paginas > 1">
                <v-pagination
                    v-model="pagination.page"
                    :length="pagination.paginas"
                    circle
                    :total-visible="maxPaginas"
                ></v-pagination>
            </div>
        </div>

        <DialogExcluir
            :abrir="dialogRemover"
            :simulacao="simulacao"
            @fechar="fecharDialogExcluir"
            @obterSimulacoes="obterSimulacoes"
        ></DialogExcluir>
    </div>
</template>
<script src="./Simulacoes.js"></script>
<style lang="scss">
@import "./Simulacoes.scss";
</style>