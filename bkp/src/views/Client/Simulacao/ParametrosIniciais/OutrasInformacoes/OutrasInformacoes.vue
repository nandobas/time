<template>
    <div ref="top" class="outras-informacoes">
        <DialogAjuda
            :abrir="dadosModal.abrir"
            :dados="dadosModal.dados"
            @fechar="fecharDialogAjuda()"
        ></DialogAjuda>
        <DialogAtencao
            :abrir="arDadosModalAtencao.length > 0"
            :texto="arDadosModalAtencao.length > 0 ? arDadosModalAtencao[0].texto : ''"
            @fechar="fecharDialogAtencao()"
        ></DialogAtencao>

        <v-layout row wrap>
            <v-flex xs12 class="titulo">Outras informações necessárias para iniciar a simulação</v-flex>
        </v-layout>

        <div class="expansion-area">
            <v-layout
                row
                justify-center
                v-if="blLoading || form.id_cnaes.length > 0"
                class="ma-5 pa-5"
            >
                <v-progress-circular indeterminate :size="70" :width="5"></v-progress-circular>
            </v-layout>

            <v-expansion-panel
                v-else
                v-model="arExpansionPanel"
                expand
                class="mt-4"
                :key="keyPanel"
            >
                <v-expansion-panel-content v-for="(cnae, index) in form.cnaes" :key="cnae.idcnae">
                    <template v-slot:actions v-if="ocultarBody(cnae)">
                        <div style="display:none" />
                    </template>
                    <template v-slot:header>
                        <div class="descricao">
                            <span>
                                <v-icon v-if="cnae.blValidacoesOk">mdi-check-bold</v-icon>
                                <v-tooltip v-else top open-delay="0" close-delay="0">
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on">mdi-alert-circle-outline</v-icon>
                                    </template>
                                    <span>Selecione as opções referentes às suas atividades</span>
                                </v-tooltip>
                                {{ cnae.cnae }} - {{ cnae.descricao }}
                            </span>
                            <a
                                class="help"
                                v-if="cnae.validacoes.fluxo"
                                @click="abrirDialogAjuda(cnae, index)"
                            >
                                <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                />
                            </a>
                        </div>
                    </template>
                    <v-card v-if="!ocultarBody(cnae)" :key="cnae.idcnae+keyCard" class="pt-0">
                        <div class="alert-area mb-4 pt-2">
                            <v-alert
                                type="warning"
                                icon="mdi-information"
                                class="mt-2"
                                v-for="i in cnae.validacoes.impedimentos"
                                :key="i.id"
                                :value="true"
                            >
                                <span v-html="i.texto"></span>
                            </v-alert>
                        </div>

                        <div
                            v-for="(t, indexTitulo) in cnae.validacoes.titulos_validacoes"
                            :key="indexTitulo + '-' +t.id"
                            class="fieldset-area"
                        >
                            <fieldset v-if="verificaMostrarGrupo(t)">
                                <legend v-if="t.id > 1">
                                    <div>
                                        <span class="titulo">{{ t.titulo }}</span>
                                    </div>
                                </legend>

                                <div v-for="v in t.validacoes" :key="v.id">
                                    <div
                                        v-if="(v.blHide == 0 || v.blMostrarImportant == 1) && v.blOcultarImportant == 0"
                                    >
                                        <label
                                            v-if="v.blOcultarCheckbox"
                                            v-html="v.validacao.id +' '+ v.validacao.texto_validacao"
                                        ></label>
                                        <v-checkbox
                                            v-else
                                            :disabled="v.blDesabilitado == 1"
                                            class="pt-0"
                                            v-model="v.blMarcado"
                                            :value="1"
                                            color="grey darken-1"
                                            @change="marcaValidacao($event, cnae, v)"
                                        >
                                            <div
                                                slot="label"
                                                v-html="v.validacao.id +' '+ v.validacao.texto_validacao"
                                            ></div>
                                        </v-checkbox>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <!--
					<v-layout row wrap class="group" v-for='t in cnae.validacoes.titulos_validacoes' :key='t.id'>
						<v-flex xs12 class='titulo'>
							{{ t.titulo }}
						</v-flex>

						<v-checkbox class='pt-0 mt-2' v-for='v in t.validacoes' :key='v.id' v-model="v.blMarcado" :label="v.validacao.txValidacao" :value="1"></v-checkbox>
					</v-layout>
                        -->
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
    </div>
</template>
<script src="./OutrasInformacoes.js"></script>
<style lang="scss">
@import "./OutrasInformacoes.scss";
</style>