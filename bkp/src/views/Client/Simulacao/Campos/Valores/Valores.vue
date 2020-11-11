<template>
	<div class="campos" v-if="aba">
		<Header :titulo="aba.aba"></Header>

		<DialogSimNao :abrir="obCampoEditar ? true : false" :texto="obCampoEditar ? obCampoEditar.texto : ''" @fechar="fecharDialogEditar"></DialogSimNao>
		<DialogAjuda :abrir="dadosModal.abrir" :dados="dadosModal.dados" @fechar="fecharDialog()"></DialogAjuda>

		<div class="navigation-tabs">
			<div class="cnaes">
				<div v-for="(c, indexCnae) in form.cnaes" :key="'abaCnae'+indexCnae" :class="['cnae', c.idcnae == cnae.idcnae ? 'active': '']" @click="changeCnae(c)">
					<div class="codigo">{{ c.cnae }}</div>
					<div class="descricao">{{ c.descricao }}</div>
				</div>
			</div>

			<div :class="['segmentos', form.tipoSimulacao.intAnoCompleto != 1 ? 'mb-4' : '']">
				<div v-for="(validacao, indexValidacao) in cnae.arValidacoes" :key="'keyCnaeValidacao'+validacao.id" :class="['segmento', 'industria', intSegmento == indexValidacao ? 'active' : '']" @click="changeValidacao(indexValidacao)">
					<div class="icone-area">
						<v-icon>mdi-factory</v-icon>
					</div>
					<span class="texto">{{ validacao.texto_validacao }}</span>

					<div class="segmento segmento-hover">
						<div class="icone-area">
							<v-icon>mdi-factory</v-icon>
						</div>
						<span class="texto">{{ validacao.texto_validacao }}</span>
					</div>
				</div>

				<!-- <div
                    :class="['segmento', 'comercio active', 'active', intSegmento == 1 ? 'active' : '']"
                    @click="intSegmento = 1"
                >
                    <div class="icone-area">
                        <v-icon>mdi-store</v-icon>
                    </div>
                    <span class="texto">Comérciox</span>
                </div>
                <div
                    :class="['segmento', 'servico active', 'active', intSegmento == 2 ? 'active' : '']"
                    @click="intSegmento = 2"
                >
                    <div class="icone-area">
                        <v-icon>mdi-wrench-outline</v-icon>
                    </div>
                    <span class="texto">Serviço</span>
                </div>-->
			</div>

			<div class="meses" v-if="form.tipoSimulacao.intAnoCompleto == 1">
				<div :class="['mes', intMes == indexMes ? 'active' : '']" v-for="(mes, indexMes) in arMeses" :key="'mes-'+indexMes" @click="changeMes(indexMes)">{{ arMeses.length > 6 ? mes.strAbreviacao : mes.strNome }}</div>
			</div>
		</div>

		<div v-for="bloco in cnae.arValidacoes[intSegmento].arMeses[intMes].arBlocos" :key="'cnae'+cnae.idcnae+'-mes'+intMes+'bloco-' + bloco.id_aba_bloco" :class="['fieldset-area', blEfeito ? 'efeito' : '', (intSegmento == 0 ? 'industria' : (intSegmento == 1 ? 'comercio' : (intSegmento == 2 ? 'servico' : '')))]">
			<fieldset>
				<legend v-if="bloco.id != 1">
					<div>
						<span class="titulo">{{ bloco.bloco }}</span>
					</div>
				</legend>

				<div v-for="campo in bloco.arCampos" :key="'campo'+campo.id">
					<div class="flex-table row" role="rowgroup" :class="{'total': campo.chCampoEditavel == 'T'}">
						<div class="flex-row first">{{ campo.id }} - {{ campo.labelCampo }}</div>

						<div class="flex-row notas" v-if="campo.blAdicaoIRCS == 1 || campo.blExclusaoIRCS == 1 || campo.blAdicaoBCPresumido == 1 || campo.blCreditoPISCOFINS == 1">
							<v-tooltip top v-if="campo.blAdicaoIRCS == 1">
								<template v-slot:activator="{ on }">
									<div class="nota" v-on="on" @click="abrirDialogNota(campo, 'A')">A</div>
								</template>
								<span>{{ arLegendaNota['A'] }}</span>
							</v-tooltip>
							<v-tooltip top v-if="campo.blExclusaoIRCS == 1">
								<template v-slot:activator="{ on }">
									<div class="nota" v-on="on" @click="abrirDialogNota(campo, 'E')">E</div>
								</template>
								<span>{{ arLegendaNota['E'] }}</span>
							</v-tooltip>
							<v-tooltip top v-if="campo.blAdicaoBCPresumido == 1">
								<template v-slot:activator="{ on }">
									<div class="nota" v-on="on" @click="abrirDialogNota(campo, 'AP')">AP</div>
								</template>
								<span>{{ arLegendaNota['AP'] }}</span>
							</v-tooltip>
							<v-tooltip top v-if="campo.blCreditoPISCOFINS == 1">
								<template v-slot:activator="{ on }">
									<div class="nota" v-on="on" @click="abrirDialogNota(campo, 'C')">C</div>
								</template>
								<span>{{ arLegendaNota['C'] }}</span>
							</v-tooltip>
						</div>

						<div class="flex-row opcao" role="cell" v-if="campo.chCampoEditavel == 'C.A.V'">
							<div class="label">Confirmar valor</div>

							<v-switch v-model="campo.blUtilizar" label color="primary" @change="setFormula(intMes)"></v-switch>
						</div>
						<div class="flex-row opcao" role="cell" v-if="campo.chCampoEditavel == 'C.A.E' && !campo.valorManual">
							<div class="label">Editar valor</div>

							<v-icon color="primary" @click="abrirDialogEditar(campo)">mdi-pencil</v-icon>
						</div>
						<div class="flex-row opcao" role="cell" v-if="campo.chCampoEditavel == 'C.A.E' && campo.valorManual">
							<div class="label">Voltar ao cálculo automático</div>

							<v-icon color="primary" @click="voltarCalculoManual(campo)">mdi-autorenew</v-icon>
						</div>
						<div class="flex-row campo" role="cell" v-if="parseInt(form.escopo[cnae.idcnae][intSegmento][intMes].C[campo.id]) < 0">
							<v-text-field solo outline maxlength="17" v-money="money_negative" :key="cnae.idcnae+'_'+intSegmento+'_'+intMes+'_'+campo.id" v-model="campo.valor" @focus="verificaCamposDeducao(campo)" @keyup="setEscopo($event, campo.id)" @blur="setFormula(intMes)" :readonly="campo.chCampoEditavel != 'P' && !campo.valorManual" />
						</div>
						<div class="flex-row campo" role="cell" v-else>
							<v-text-field solo outline maxlength="17" v-money="money" :key="cnae.idcnae+'_'+intSegmento+'_'+intMes+'_'+campo.id" v-model="campo.valor" @focus="verificaCamposDeducao(campo)" @keyup="setEscopo($event, campo.id)" @blur="setFormula(intMes)" :readonly="campo.chCampoEditavel != 'P' && !campo.valorManual" />
						</div>
						<div class="flex-row help-area" role="cell">
							<a v-if="campo.txtAjuda" class="help help2" @click="abrirDialogAjuda(campo)">
								<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=" />
							</a>
						</div>
					</div>
				</div>
			</fieldset>
		</div>

		<div class="fieldset-area" v-if="form.tipoSimulacao.intAnoCompleto == 1">
			<fieldset>
				<legend>
					<div>
						<span class="titulo">Replicar valores</span>
					</div>
				</legend>

				<div class="replicar">
					<div class="campo">
						<v-select v-model="arMesesReplicar" :items="arMeses" label="Selecione os meses" multiple item-text="strNome" item-value="index" outline solo chips>
							<template v-slot:prepend-item>
								<v-list-tile ripple @click="selecionaTodosMeses">
									<v-list-tile-action>
										<v-icon :color="arMesesReplicar.length > 0 ? 'primary' : ''">{{ icon }}</v-icon>
									</v-list-tile-action>
									<v-list-tile-content>
										<v-list-tile-title>Selecionar todos</v-list-tile-title>
									</v-list-tile-content>
								</v-list-tile>
								<v-divider class="mt-2"></v-divider>
							</template>
							<template v-slot:selection="{ item, index }">
								<v-chip v-if="index < 9">
									<span>{{ item.strNome }}</span>
								</v-chip>
								<span v-if="index === 9" class="grey--text caption">(+{{ arMesesReplicar.length - 8 }} outros)</span>
							</template>
						</v-select>
					</div>

					<div class="button-steps ml-0 mr-0">
						<v-btn @click="replicar()" class="next right mr-0 mt-0">
							<span>Replicar</span>
							<div class="icon">
								<v-icon>mdi-content-copy</v-icon>
							</div>
						</v-btn>
					</div>
				</div>
			</fieldset>
		</div>

		<div class="button-steps">
			<v-btn @click="voltar()" class="next left ml-0">
				<div class="icon">
					<v-icon>mdi-chevron-left</v-icon>
				</div>
				<span>Voltar</span>
			</v-btn>

			<v-btn @click="avancar()" class="next right mr-0">
				<span>{{ txtBotaoAvancar }}</span>
				<div class="icon">
					<v-icon>mdi-chevron-right</v-icon>
				</div>
			</v-btn>
		</div>


		<v-dialog v-model="abrirCamposDeducoes" max-width="900px" content-class="dialog-atencao" persistent>
			<div class="image-header">
				<img class='icone' src="data:image/svg+xml;base64,
PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48Zz48cGF0aCBzdHlsZT0iZmlsbDojRkVEQjQxOyIgZD0iTTUwMy40ODQsMzkxLjZMMzAxLjkxNyw1OC45MDFjLTEwLjgwMS0xOC4zMDEtMzAtMjkuMTAxLTUxLjMwMS0yOS4xMDFzLTQwLjQ5OSwxMC44LTUxLjU5OSwyOS4zOTkgIEw4LjUxNiwzOTEuNmMtMTEuMSwxOC42LTExLjQsNDEuMS0wLjYwMSw2MC4zYzEwLjgwMSwxOC45LDMwLjMsMzAuMyw1Mi4yMDIsMzAuM2gzOTEuNzY2YzIxLjkwMSwwLDQxLjQtMTEuNCw1Mi4yMDItMzAuMyAgQzUxNC44ODQsNDMyLjcsNTE0LjU4NCw0MTAuMiw1MDMuNDg0LDM5MS42eiIgZGF0YS1vcmlnaW5hbD0iI0ZFREI0MSI+PC9wYXRoPjxwYXRoIHN0eWxlPSJmaWxsOiNGRkNDMzM7IiBkPSJNNTA0LjA4NSw0NTEuOWMtMTAuODAxLDE4LjktMzAuMywzMC4zLTUyLjIwMiwzMC4zSDI1MC42MTZWMjkuOGMyMS4zMDEsMCw0MC40OTksMTAuOCw1MS4zMDEsMjkuMTAxICBMNTAzLjQ4NCwzOTEuNkM1MTQuNTg0LDQxMC4yLDUxNC44ODQsNDMyLjcsNTA0LjA4NSw0NTEuOXoiIGRhdGEtb3JpZ2luYWw9IiNGRkNDMzMiPjwvcGF0aD48Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwRDcwQjI7IiBkPSJNMjgwLjYxNiwxNTIuMnYxMjBjMCwxNi41LTEzLjUsMzAtMzAsMzBzLTMwLTEzLjUtMzAtMzB2LTEyMGMwLTE2LjUsMTMuNS0zMCwzMC0zMCAgIFMyODAuNjE2LDEzNS43MDEsMjgwLjYxNiwxNTIuMnoiIGRhdGEtb3JpZ2luYWw9IiMwRDcwQjIiPjwvcGF0aD4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwRDcwQjI7IiBkPSJNMjgwLjYxNiwzOTIuMmMwLDE2LjUtMTMuNSwzMC0zMCwzMHMtMzAtMTMuNS0zMC0zMHMxMy41LTMwLDMwLTMwUzI4MC42MTYsMzc1LjcwMSwyODAuNjE2LDM5Mi4yeiIgZGF0YS1vcmlnaW5hbD0iIzBENzBCMiI+PC9wYXRoPgo8L2c+PGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMDA1OUFBIiBkPSJNMjgwLjYxNiwzOTIuMmMwLDE2LjUtMTMuNSwzMC0zMCwzMHYtNjBDMjY3LjExNiwzNjIuMiwyODAuNjE2LDM3NS43MDEsMjgwLjYxNiwzOTIuMnoiIGRhdGEtb3JpZ2luYWw9IiMwMDU5QUEiIGNsYXNzPSJhY3RpdmUtcGF0aCIgZGF0YS1vbGRfY29sb3I9IiMwMDU5QUEiPjwvcGF0aD4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDU5QUEiIGQ9Ik0yODAuNjE2LDE1Mi4ydjEyMGMwLDE2LjUtMTMuNSwzMC0zMCwzMHYtMTgwQzI2Ny4xMTYsMTIyLjIsMjgwLjYxNiwxMzUuNzAxLDI4MC42MTYsMTUyLjJ6IiBkYXRhLW9yaWdpbmFsPSIjMDA1OUFBIiBjbGFzcz0iYWN0aXZlLXBhdGgiIGRhdGEtb2xkX2NvbG9yPSIjMDA1OUFBIj48L3BhdGg+CjwvZz48L2c+IDwvc3ZnPg==" />
			</div>

			<v-icon class="close" @click="abrirCamposDeducoes = false">mdi-close</v-icon>

			<v-card>
				<v-card-title class="headline">
					<div class="h1">
						Atenção
					</div>
				</v-card-title>
				<v-card-text class="deducoes-modal">
					<v-layout row wrap>
						<div v-for="(campo,i) in tempCamposDeducoes.camposDetalhamentoDeducoes" :key="'campoDeducao-'+i">
							<div class="flex-table row" role="rowgroup">
								<div class="flex-row first">{{ campo.label }}</div>
								<div class="flex-row campo" role="cell">
									<v-text-field solo outline maxlength="17" v-money="money" v-model="campo.valor" @blur="somaCampoDeducoes(tempCamposDeducoes)" />
								</div>
								<div class="flex-row help-area" role="cell">
									<a v-if="campo.txtAjuda" class="help help2" @click="abrirDialogAjuda(campo)">
										<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=" />
									</a>
								</div>
							</div>
						</div>
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<div class="button-area">
						<v-btn @click="abrirCamposDeducoes = false">
							<span>Confirmar</span>
						</v-btn>
					</div>
				</v-card-actions>
			</v-card>
		</v-dialog>

	</div>
</template>
<script src="./Valores.js"></script>
<style lang="scss">
	@import "./Valores.scss";
</style>