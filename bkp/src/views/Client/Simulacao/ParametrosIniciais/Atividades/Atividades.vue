<template>
    <div>
        <DialogAjuda :abrir="dadosModal.abrir" :dados="dadosModal.dados" @fechar="fecharDialog()"></DialogAjuda>
        <DialogCnae
            :abrir="dadosModalCnae.abrir"
            :cnae="dadosModalCnae.cnae"
            @fechar="fecharDialogCnae()"
        ></DialogCnae>

        <v-layout row wrap>
            <v-flex xs12 class="titulo">
                Selecione o código da atividade principal e de outras atividades secundárias
                <small>(Até duas secundárias)</small>
            </v-flex>

            <fieldset class="mt-4">
                <legend>
                    <div>
                        <span
                            class="titulo"
                            v-if="form.cnaes.length == 0"
                        >CNAE Principal / Descrição</span>
                        <span class="titulo" v-else>CNAE Secundário / Descrição</span>
                        <a class="help help2" @click="abrirDialogAjuda()">
                            <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                            />
                        </a>
                    </div>
                </legend>

                <div class="lista-area" v-if="form.cnaes.length < 3">
                    <v-layout>
                        <v-flex xs12 md5>
                            <v-text-field
                                single-line
                                v-model="strFiltro"
                                label="Pesquisar por CNAE ou Descrição"
                                clearable
                                append-icon="mdi-magnify"
                                class="pt-0"
                                outline
                                solo
                                @input="pesquisar()"
                                ref="inputCnae"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-data-table
                        :items="arCnaes"
                        class="lista mt-2"
                        :rows-per-page-items="rowsPerPage"
                        hide-actions
                        :pagination.sync="pagination"
                    >
                        <template v-slot:headers="props" v-if="arCnaes.length > 0">
                            <tr>
                                <th class="acao text-xs-center" width="30px">Selecionar</th>
                                <th width="140px">CNAE</th>
                                <th class="text-xs-left">Descrição</th>
                                <th class="acao text-xs-center" width="50px">Informações</th>
                            </tr>
                        </template>

                        <template v-slot:items="props">
                            <td width="30px">
                                <span class="item center acao" style="width: 90px">
                                    <v-tooltip
                                        top
                                        open-delay="0"
                                        close-delay="0"
                                        v-if="verificaCnaeAdicionado(props.item.idcnae)"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-icon v-on="on" class="disabled">mdi-check-bold</v-icon>
                                        </template>
                                        <span>Selecionado</span>
                                    </v-tooltip>
                                    <v-tooltip top open-delay="0" close-delay="0" v-else>
                                        <template v-slot:activator="{ on }">
                                            <v-icon
                                                @click="adicionar(props.item)"
                                                v-on="on"
                                            >mdi-check-bold</v-icon>
                                        </template>
                                        <span>Selecionar</span>
                                    </v-tooltip>
                                </span>
                            </td>
                            <td class="acao text-xs-center" width="110px">
                                <span class="item center">{{ props.item.cnae }}</span>
                            </td>
                            <td>
                                <span class="item">{{ props.item.descricao }}</span>
                            </td>
                            <td width="50px">
                                <span class="item center acao">
                                    <a class="help" @click="abrirDialogCnae(props.item)">
                                        <img
                                            class="icone"
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                        />
                                    </a>
                                </span>
                            </td>
                        </template>

                        <template v-slot:no-data>
                            <v-alert
                                v-if="timeoutPesquisa"
                                :value="true"
                                class="info-cinza"
                                color="grey lighten-3"
                                icon="mdi-alert-circle"
                            >
                                <v-layout row justify-center align-center>
                                    <v-progress-circular
                                        indeterminate
                                        :size="20"
                                        :width="2"
                                        color="grey"
                                    ></v-progress-circular>
                                </v-layout>
                            </v-alert>

                            <v-alert
                                v-else
                                :value="true"
                                class="info-cinza"
                                icon="mdi-alert-circle"
                                color="grey lighten-3"
                            >
                                <span
                                    v-if="strFiltro == null || strFiltro.length == 0"
                                    class="texto"
                                >Pesquise um CNAE</span>
                                <span v-else class="texto">Nenhum CNAE encontrado</span>
                            </v-alert>
                        </template>
                    </v-data-table>

                    <div
                        class="text-xs-center pt-2"
                        v-if="arCnaes.length > 0 && pagination.paginas > 1"
                    >
                        <v-pagination
                            v-model="pagination.page"
                            :length="pagination.paginas"
                            circle
                            :total-visible="6"
                        ></v-pagination>
                    </div>
                </div>
                <v-alert v-else :value="true" type="warning" icon="mdi-alert-circle">
                    <span>Limite de CNAES atingido</span>
                </v-alert>
            </fieldset>

            <fieldset class="mt-4">
                <legend>
                    <div class="titulo">CNAES Selecionados</div>
                </legend>

                <div class="lista-area">
                    <v-data-table :items="cnaePrincipal" class="lista" :hide-actions="true">
                        <template v-slot:headers="props" v-if="form.cnaes.length > 0">
                            <tr>
                                <th class="acao text-xs-center" width="30px">Remover</th>
                                <th width="140px">CNAE Principal</th>
                                <th class="text-xs-left">Descrição</th>
                                <th class="acao text-xs-center" width="50px">Informações</th>
                            </tr>
                        </template>

                        <template v-slot:items="props">
                            <td width="30px">
                                <span class="item center acao" style="width: 90px">
                                    <v-tooltip top open-delay="0" close-delay="0">
                                        <template v-slot:activator="{ on }">
                                            <v-icon
                                                @click="remover(props.index, props.item.id_cnae)"
                                                v-on="on"
                                            >mdi-delete</v-icon>
                                        </template>
                                        <span>Remover</span>
                                    </v-tooltip>
                                </span>
                            </td>
                            <td width="110px">
                                <span class="item center">{{ props.item.cnae }}</span>
                            </td>
                            <td>
                                <span class="item">{{ props.item.descricao }}</span>
                            </td>
                            <td width="50px">
                                <span class="item center acao">
                                    <a class="help" @click="abrirDialogCnae(props.item)">
                                        <img
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                        />
                                    </a>
                                </span>
                            </td>
                        </template>

                        <template v-slot:no-data>
                            <v-alert
                                :value="true"
                                class="info-cinza"
                                color="grey lighten-3"
                                icon="mdi-alert-circle"
                            >
                                <span class="texto">Nenhum CNAE selecionado</span>
                            </v-alert>
                        </template>
                    </v-data-table>

                    <v-data-table
                        :items="cnaesSecundarios"
                        v-if="cnaesSecundarios.length > 0"
                        class="lista"
                        :hide-actions="true"
                    >
                        <template v-slot:headers="props" v-if="form.cnaes.length > 0">
                            <tr>
                                <th class="acao text-xs-center" width="30px">Remover</th>
                                <th width="140px">CNAE Secundário</th>
                                <th class="text-xs-left">Descrição</th>
                                <th class="acao text-xs-center" width="50px">Informações</th>
                            </tr>
                        </template>

                        <template v-slot:items="props">
                            <td width="30px">
                                <span class="item center acao" style="width: 90px">
                                    <v-tooltip top open-delay="0" close-delay="0">
                                        <template v-slot:activator="{ on }">
                                            <v-icon
                                                @click="remover((props.index + 1), props.item.id_cnae)"
                                                v-on="on"
                                            >mdi-delete</v-icon>
                                        </template>
                                        <span>Remover</span>
                                    </v-tooltip>
                                </span>
                            </td>
                            <td width="110px">
                                <span class="item center">{{ props.item.cnae }}</span>
                            </td>
                            <td>
                                <span class="item">{{ props.item.descricao }}</span>
                            </td>
                            <td width="50px">
                                <span class="item center acao">
                                    <a class="help" @click="abrirDialogCnae(props.item)">
                                        <img
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII="
                                        />
                                    </a>
                                </span>
                            </td>
                        </template>

                        <template v-slot:no-data>
                            <v-alert
                                :value="true"
                                class="info-cinza"
                                color="grey lighten-3"
                                icon="mdi-alert-circle"
                            >
                                <span class="texto">Nenhum CNAE selecionado</span>
                            </v-alert>
                        </template>
                    </v-data-table>
                </div>
            </fieldset>
        </v-layout>
    </div>
</template>
<script src="./Atividades.js"></script>
<style lang="scss">
@import "./Atividades.scss";
</style>