<template>
    <div>
        <div v-if="blLoading">
            <span>...aguarde</span>
            <span>
                <v-layout row justify-center align-center>
                    <v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
                </v-layout>
            </span>
        </div>
        <div class="home-logado" :style="[blLoading ? {'display': 'none'} : {}]">
            <p class="mb-0">Bem vindo ao</p>

            <h1>Simulador de Planejamento Tributário Econet</h1>

            <div class="text">Você pode iniciar uma nova simulação</div>

            <div class="button-area">
                <v-btn @click="novaSimulacao()" class="mt-2">
                    <div class="icon">
                        <v-icon>mdi-pencil</v-icon>
                    </div>
                    <span>Simulação manual</span>
                </v-btn>
                <v-btn class="mt-2">
                    <router-link to="/simulacao/ecf">
                        <div class="icon">
                            <v-icon>mdi-file-upload</v-icon>
                        </div>
                        <span>Importar ECF</span>
                    </router-link>
                </v-btn>
            </div>

            <div class="text">Ou selecionar uma simulação salva</div>

            <Simulacoes
                @setLoading="setLoading"
                @selecionarSimulacao="selecionarSimulacao"
                @abrirDialogCopiarSimulacao="abrirDialogCopiarSimulacao"
            ></Simulacoes>
            <DialogSimulacao
                :abrir="abrirDialogNome"
                @iniciarForm="iniciarForm"
                @setNome="setNome"
                @copiarSimulacao="copiarSimulacao"
            ></DialogSimulacao>
        </div>
    </div>
</template>
<script src="./HomeLogado.js"></script>
<style lang="scss">
@import "./HomeLogado.scss";
</style>