<template>
    <div>
        <Menu ref="refMenu" :form="form" :resultadoHtml="resultadoHtml" @salvar="salvar"></Menu>

        <v-content>
            <v-container v-if="form || $route.name == 'homeLogado'">
                <Topo
                    :form="form"
                    :blSalvandoSimulacao="blSalvandoSimulacao"
                    @iniciarForm="iniciarForm"
                    @setNome="setNome"
                    @salvar="salvar"
                ></Topo>

                <router-view
                    :form="form"
                    :preResult="preResult"
                    :resultadoHtml="resultadoHtml"
                    @setPreResult="setPreResult"
                    @registraResultado="registraResultado"
                    @setNome="setNome"
                    @salvar="salvar"
                    @selecionarSimulacao="selecionarSimulacao"
                    @iniciarForm="iniciarForm"
                    @limparForm="limparForm"
                    @campos="adicionarCampos"
                    @atualizarMenu="atualizarMenu"
                ></router-view>
            </v-container>
        </v-content>
    </div>
</template>
<script src="./Layout.js"></script>