<template>
    <v-dialog
        v-model="abrirModal"
        max-width="500px"
        content-class="dialog-atencao dialog-cpp"
        persistent
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
                <div class="h1">Atenção</div>
                <div class="h1"><h6>Informe o valor do FAP</h6></div>
            </v-card-title>
            <v-card-text class="pb-0" v-if="form.fap">
                <v-layout row wrap>
                    <v-flex class="text-md-center">
                        <v-layout row wrap class="item">
                            <v-flex xs12 mt-3 mb-0 pb-0 justify>
                                <span style="float:left" class="caption">Valor do FAP precisa ser entre 0,5000 e 2,0000</span>
                                <br />
                                <v-text-field
                                    autofocus
                                    single-line
                                    label="Informe o valor do FAP"
                                    v-model="valorFap"
                                    class="pt-0"
                                    outline
                                    solo
                                    return-masked-value
                                    mask="#,####"
                                    :rules="fapRules"
                                    :disabled="disableCampo"
                                    @blur="confereFap()"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-text
                class="pb-0"
                v-if="form.cppFuncionarios && form.cppFuncionarios.length > 0"
            >
                <v-layout row wrap>
                    <v-flex class="text-md-center">
                        <v-flex class="mb-2">Qual CNAE possui o maior numero de funcionarios?</v-flex>
                        <v-radio-group column v-model="idCnaeFuncionarios">
                            <v-radio
                                v-for="cpp in form.cppFuncionarios"
                                :key="cpp.idcnae"
                                :label="cpp.cnae + ' - ' + cpp.descricao"
                                :value="cpp.idcnae"
                                color="grey darken-1"
                                :rules="cppFuncionariosRules"
                            ></v-radio>
                            <v-radio
                                :label="'Mesmo numero de funcionarios ou não sabe informar'"
                                :value="x"
                                color="grey darken-1"
                                :rules="cppFuncionariosRules"
                            ></v-radio>
                        </v-radio-group>
                    </v-flex>
                </v-layout>
            </v-card-text>
            <v-card-text v-else>
                <v-layout row wrap>
                    <v-flex class="text-md-center">
                        <v-checkbox
                            label="Não sabe informar"
                            :value=true
                            v-model="naoSabeInformar">
                        <p>teste</p>
                        </v-checkbox>
                    </v-flex>
                </v-layout>
            </v-card-text>

            <v-card-actions>
                <div class="button-area">
                    <v-btn @click="confirmar">
                        <span>Confirmar</span>
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script src="./DialogCpp.js"></script>
<style lang="scss">
@import "./DialogCpp.scss";
</style>