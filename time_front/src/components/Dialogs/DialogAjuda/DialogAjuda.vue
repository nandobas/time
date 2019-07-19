<template>
	<v-dialog v-model="abrirModal" max-width="500px">
		<div class="image-header">
			<img class='icone' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABklBMVEUAAABFxdVEwdNEw9NEwtNEwtMA//9EwdNGv9JEwdNCxNJEwtNEwtREwtNEwdNHw9REwtNAv99EwtNFw9JHxtVEw9NEwtNEwtNJws5FwdNDw9VFwtJFwtRHv9VLw9I5xsZEwtNEwtREwtNEwtJExNVEwtNBxNFEw9RDwtRCwtVEwtNEwtNIv89EwtRDw9NAv79DwtJEw9NEwdNFwtNVqqpJtttEwdNDwtVEwtRDwtNGwdJFwtJEwtNEw9JJyNtEwtRFwtREwdNEwtNFwtNDwdNEwtNFwdJFwtNDwdREw9NDwtJDwtJFwtREwtNEwtNFxNhEwtNEwtNAv9VDwNJEwtJFwtFEwtNFwdVEwtNOxdV4099w0N3t+fv///9LxNXr+fpu0N1pztxIw9Th9fhizNrb8/deytlx0d6F1+JkzdtKxNTf9Pe86e+I2ONhy9p10t9/1eGr4+v0+/x+1eFQxtZgy9pWyNeP2uWi4em/6vCY3udXyNfz+/z7/v6Q2+Wz5u1qztyN2uST3Obq+Pqm4uoAAACJNxO4AAAAWHRSTlMAMIC+2PEBVijLSfBT/VIv9AjedxJir/MVRkg/OyQRCee8i488/CfCnzb++SCTkAS9qcenAwehVNnBPmC4RA5HZJXiyVfKSnpfe1B9grnsGp7cDDnIQ+ZOC17kQQAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiChcUIw3LEWfeAAAB9ElEQVRYw+2X91PCMBhAIyDujQvFvQe49957j6DGAe4NLtzzD7cISkm+0ja988473498eY9eSK8FIZownd4QjgHCDXpdGJLBGGHAITFEGEP5kVFYlqhIaT86Rt7HOCZayo+NU+JjHBcP+wmJynyMExMgPykZWGpfWbEDHycnAYEUYOHqGiFrq8AghfVNwAaubxCBjXVgI01MIBX4nk3yxSYwSmUCacCqLV9gCxilMUcwHVjlcHp9pwMYpdMHMgP8vbZ3CNnZBkcZ9C2EYXZ3JQb0bZWJVZJJBcxqA+ZfCeztCxxwBw6PfMfgmDdwQvyccgbOvgPnvHvgcvsCF9yb6Li80nQFAtf/gf/AHwtkqQ1kUwGL2kAOFchVGchDNMC7kf3G4/IGbj139/QsnwkUMP7lA/nhkX4+FjKBIibwREQ8B8+KS5gAKqUDL+LAa/CsjPVReQVdeHO6/bx/HAZNKquAAKrGirFCPrLVKPVrbWAAmeqU+fUNSILGJiV+k6Qv0Nwip7e2oZDY2jsqQ+h1nUieru4eXaHV2tvH6P1mBXqAhoFgfXBIle5FL/aHVesIjYj8UQ4fjQX8cR5fFJjg8gOBSaO2wNQ0n/8TiOf0vwMzvL4/MDunLVA8z+37Ajp+/yuwYNMQWBT+2lg0+KixZmlZbs0n0NQhVsp6gXgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTAtMjNUMjA6MzU6MTMrMDI6MDCSR93cAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTEwLTIzVDIwOjM1OjEzKzAyOjAw4xplYAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII=">
		</div>

		<v-icon class="close" @click='fechar()'>mdi-close</v-icon>

		<v-card>
			<v-card-title class="headline">
				<div class="h1">
					{{ dados.titulo }}
				</div>
			</v-card-title>
			<v-card-text>
				<v-layout row wrap>
					<div class='conteudo-ajuda' v-html="dados.texto"></div>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script src="./DialogAjuda.js"></script>
<style lang="scss">
	@import "./DialogAjuda.scss";
</style>