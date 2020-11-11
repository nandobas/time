<template>
    <div>
        <div class="resultado">
            <Header titulo="Tela de Impressão" horario="true"></Header>
            <center>
                <h3>
                    Resultado de Simulação:
                    <span v-if="resultadoHtml.tipo=='sn'">Simples Nacional</span>
                    <span v-if="resultadoHtml.tipo=='presumido'">Lucro Presumido</span>
                    <span v-if="resultadoHtml.tipo=='real'">Lucro Real</span>
                </h3>
            </center>
            <div :class="'impressao '+resultadoHtml.tipo">
                <div v-for="(tmp_cnae, idx_cnae) in resultadoHtml.html" :key="'abaCnae'+idx_cnae">
                    <div
                        v-for="(tmp_validacoes, idx_validacao) in tmp_cnae.arr_validacoes"
                        :key="'abaValidacao'+idx_validacao"
                    >
                        <div v-if="tmp_validacoes.bl_selecionado" class="navigation-tabs">
                            <div class="cnaes">
                                <div class="cnae">
                                    <div class="codigo">{{ tmp_cnae.cnae }}</div>
                                    <div class="descricao">{{ tmp_validacoes.nome }}</div>
                                </div>
                            </div>
                        </div>

                        <fieldset
                            class="pagina"
                            v-for="(tmp_aba, idx_aba) in tmp_validacoes.ar_resultado"
                            :key="'abaConteudo'+idx_aba"
                        >
                            <legend>
                                <span class="titulo">{{tmp_aba.aba}}</span>
                            </legend>
                            <div class="abaConteudo" v-html="tmp_aba.html"></div>
                        </fieldset>
                    </div>
                </div>

                <footer>
                    Simulação
                    <b>{{form.strNome}}</b>,
                    criada em
                    <b>{{form.created_at}}</b> -
                    editada em
                    <b>{{form.updated_at}}</b>
                </footer>
            </div>
        </div>
    </div>
</template>

<script src="./Impressao.js"></script>
<style lang="scss">
@import "./Impressao.scss";
</style>