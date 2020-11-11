<template>
    <div class="parametros">
        <Header titulo="Parâmetros Iniciais"></Header>
        <DialogCpp
            :abrir="abrirDialogCpp"
            :arOpcoes="arOpcoes"
            @fechar="fecharDialogCpp()"
            @confirmar="confirmarCpp()"
            :form="form"
        ></DialogCpp>
        <DialogIncidenciaIpiIss
            :abrir="abrirDialogIncidenciaIpiIss"
            :arOpcoes="arOpcoes"
            @fechar="fecharDialogIncidenciaIpiIss()"
            @confirmar="confirmarIncidenciaIpiIss()"
            :cnaes="form.cnaesIncidenciaIpiIss"
        ></DialogIncidenciaIpiIss>
        <DialogEquiparacaoIpi
            :abrir="abrirDialogEquiparacao"
            :arOpcoes="arOpcoes"
            @fechar="fecharDialogEquiparacao()"
            @confirmar="confirmarEquiparacaoIpi()"
            :cnaes="form.cnaesEquiparacao"
        ></DialogEquiparacaoIpi>
        <DialogConfirmacao
            :abrir="abrirDialogConfirmacao"
            :form="form"
            :arOpcoes="arOpcoes"
            :blLoadingCampos="blLoadingCampos"
            @fechar="fecharDialogConfirmacao"
            @refazer="refazer()"
            @confirmar="obterCampos()"
        ></DialogConfirmacao>

        <v-stepper v-model="intPage">
            <v-stepper-header>
                <v-stepper-step :complete="(intPage > 1 )" step="1" editable>Tipo de Simulação</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    :complete="validarAtividades() && (intPage > 2)"
                    step="2"
                    :editable="validarTipoSimulacao()"
                >Atividades</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                    step="3"
                    :editable="validarTipoSimulacao() && validarAtividades()"
                >Outras Informações</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1" class="pt-2" transition="slide-y-transition">
                    <TipoSimulacao :form="form" :arOpcoes="arOpcoes" @atualizarMenu="atualizarMenu"></TipoSimulacao>

                    <span
                        class="info-message"
                        v-if="validarTipoSimulacao() == false"
                    >* Preencha todos os campos</span>

                    <div class="button-steps">
                        <v-btn
                            @click="avancar(2)"
                            class="next right mr-0 slideleft"
                            :disabled="validarTipoSimulacao() == false"
                        >
                            <span>Avançar</span>
                            <div class="icon">
                                <v-icon>mdi-chevron-right</v-icon>
                            </div>
                        </v-btn>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="2" class="pt-2" transition="slide-y-transition">
                    <Atividades class="mb-3" :form="form" :intPage="intPage"></Atividades>

                    <span
                        class="info-message"
                        v-if="validarAtividades() == false"
                    >* Selecione pelo menos um CNAE</span>

                    <div class="button-steps">
                        <v-btn @click="avancar(1)" class="next left ml-0">
                            <div class="icon">
                                <v-icon>mdi-chevron-left</v-icon>
                            </div>
                            <span>Voltar</span>
                        </v-btn>

                        <v-btn
                            @click="avancar(3)"
                            class="next right mr-0"
                            :disabled="validarAtividades() == false"
                        >
                            <span>Avançar</span>
                            <div class="icon">
                                <v-icon>mdi-chevron-right</v-icon>
                            </div>
                        </v-btn>
                    </div>
                </v-stepper-content>

                <v-stepper-content step="3" class="pt-2" transition="slide-y-transition">
                    <OutrasInformacoes
                        class="mb-3"
                        :form="form"
                        :intPage="intPage"
                        @validarOutrasInformacoes="validarOutrasInformacoes()"
                    ></OutrasInformacoes>

                    <span
                        class="info-message"
                        v-if="blHabilitarBotaoOutrasInformacoes == false"
                    >* Selecione as opções referentes às suas atividades</span>

                    <div class="button-steps">
                        <v-btn @click="avancar(2)" class="next left ml-0">
                            <div class="icon">
                                <v-icon>mdi-chevron-left</v-icon>
                            </div>
                            <span>Voltar</span>
                        </v-btn>

                        <v-btn
                            @click="verificarCpp()"
                            class="next right mr-0"
                            :disabled="blHabilitarBotaoOutrasInformacoes == false"
                        >
                            <span>Avançar</span>
                            <div class="icon">
                                <v-icon>mdi-chevron-right</v-icon>
                            </div>
                        </v-btn>
                    </div>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>
<script src="./ParametrosIniciais.js"></script>
<style lang="scss">
@import "./ParametrosIniciais.scss";
</style>