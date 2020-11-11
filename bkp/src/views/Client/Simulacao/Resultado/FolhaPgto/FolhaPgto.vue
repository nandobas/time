<template class="regimeCnae">

	<div :class="['folha', origem]">
		<DialogAjuda :abrir="dadosModal.abrir" :dados="dadosModal.dados" @fechar="fecharDialog()"></DialogAjuda>
		<div class="area-obs area-cpp tabela-tipo">
			<table class="tabela">
				<tr class="linha" v-for="(c, indexCnae) in obDados.arCnaes" :key="'tipo_cnae_'+indexCnae">
					<td class="coluna legenda tipo" v-if="c && indexCnae == 0 || obDados.arCnaes.length==1">CNAE PRINCIPAL:</td>
					<td class="coluna legenda tipo" v-else-if="c">CNAE SECUNDARIO {{indexCnae}}:</td>
					<td class="coluna legenda" v-if="c">{{c.cnae}}</td>
				</tr>
			</table>
		</div>
		<div class="area-obs area-cpp tabela-tipo">
			<table class="tabela">
				<tr class="linha">
					<td class="coluna legenda text-sm-left">&nbsp;

						<div role="cell" style="text-align:center;width:100%;position: relative;">
							<a class="help help2" style="float:left;" @click="abrirDialogAjuda('Soma das Alíquotas', txtAjudaRAT)">
								<img width="22px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=" />
							</a>
						</div>
					</td>

					<td class="coluna legenda">CPP
					</td>
					<td class="coluna legenda">TERCEIROS</td>
					<td class="coluna legenda">RAT</td>
					<td class="coluna legenda">TOTAL</td>
				</tr>
				<tr class="linha" v-for="(c, indexCnae) in obDados.arCnaes" :key="'tipo_cnae_'+indexCnae">
					<td class="coluna legenda tipo" v-if="c && indexCnae == 0">
						<span style="display:contents;" v-if="idCnaeFuncionarios === c.idcnae">(!) </span>ALÍQUOTA: CNAE PRINCIPAL:
					</td>
					<td class="coluna legenda tipo" v-else-if="c">
						<span style="display:contents;" v-if="idCnaeFuncionarios === c.idcnae">(!) </span>ALÍQUOTA: CNAE SECUNDARIO:
					</td>

					<td class="coluna legenda" v-if="c">{{formatarValor(c.arReceitas.porCnae.cpp.cpp.aliquota)}} %</td>
					<td class="coluna legenda" v-if="c">{{formatarValor(c.arReceitas.porCnae.cpp.terceiros.aliquota)}} %</td>
					<td class="coluna legenda" v-if="c && indexCnae == 0">{{formatarValor(c.arReceitas.porCnae.cpp.rat.aliquota * obDados.arReceitas.acumulado.cpp.cppInfoGeral.fap.fap)}} %</td>
					<td class="coluna legenda" v-else-if="c">{{formatarValor(c.arReceitas.porCnae.cpp.rat.aliquota)}} %</td>
					<td class="coluna legenda" :rowspan="obDados.arCnaes.length" v-if="c && indexCnae ==0">{{formatarValor(vlrTotalAliquota)}} %</td>
				</tr>
			</table>
			<span style="float:left; width:100%;">(!) Cnae com maior número de funcionários</span>
		</div>
		<div class="area-obs area-cpp tabela-tipo">
			<table class="tabela">
				<tr class="linha">
					<td class="coluna legenda text-sm-right">
						<div role="cell" style="text-align:center;width:100%;position: relative;">
							<a class="help help2" style="float:left;" @click="abrirDialogAjuda('FAP', txtAjudaFAP)">
								<img width="20px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=" />
							</a>
						</div>
						FAP
					</td>

					<td class="coluna legenda">{{formatarValor(obDados.arReceitas.acumulado.cpp.cppInfoGeral.fap.fap,4)}}</td>
				</tr>
			</table>
		</div>

		<div class="area-obs area-cpp tabela-tipo">
			<table class="tabela">
				<tr class="linha" v-for="(c, indexCnae) in obDados.arCnaes" :key="'tipo_cnae_'+indexCnae">
					<td class="coluna legenda tipo" v-if="c && indexCnae == 0">FOLHA CNAE PRINCIPAL:</td>
					<td class="coluna legenda tipo" v-else-if="c">FOLHA CNAE SECUNDARIO:</td>

					<td class="coluna legenda" v-if="c">R$ {{formatarValor(c.arReceitas.porCnae.cpp.folhaCnae[c.idcnae].anual)}}</td>
				</tr>
				<tr class="linha">
					<td class="coluna legenda tipo">TOTAL FOLHA SALARIAL:</td>

					<td class="coluna legenda">R$ {{formatarValor(vlrTotalFolha)}}</td>
				</tr>
				<tr class="linha">
					<td colspan="2" class="coluna legenda tipo">&nbsp;</td>
				</tr>
				<tr class="linha">
					<td class="coluna legenda tipo">CPP (20%, RAT e TERCEIROS):</td>

					<td class="coluna legenda">R$ {{formatarValor(vlrTotalCpp)}}</td>
				</tr>
				<tr class="linha">
					<td class="coluna legenda tipo">CPP (20%):</td>

					<td class="coluna legenda">R$ {{formatarValor(vlrTotalFolha20)}}</td>
				</tr>
			</table>
		</div>
	</div>

</template>

<script src="./FolhaPgto.js"></script>

<style lang="sass">
	@import "../Real/Real.scss"
	@import "../Presumido/Presumido.scss"
</style>