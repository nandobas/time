<template class="regimeCnae">
	<v-layout row justify-center v-if="!consultou" class="ma-5 pa-5">
		<v-progress-circular indeterminate :size="70" :width="5"></v-progress-circular>
	</v-layout>
	<v-layout v-else wrap>
		<div class="navigation-tabs">
			<div class="cnaes">
				<div v-for="(c, indexCnae) in listaCnae" :key="'abaCnae'+indexCnae" :class="['cnae', indexCnae == intIndexCnae ? 'active': '']" @click="intIndexCnae = indexCnae">
					<div class="codigo">{{ c.cnae }}</div>
					<div class="descricao">{{ c.descricao }}</div>
				</div>
			</div>
		</div>
		<div class="regimes">
			<div v-html="html_enquadramento" v-if="intIndexAba===4"></div>
			<div v-html="html_obrigacoes" v-if="intIndexAba===5"></div>
			<main v-html="html_obrigacoes" v-if="intIndexAba===6" id="divRetorno"></main>
		</div>
	</v-layout>
</template>

<script src="./RegimesCnae.js"></script>
<style lang="scss">
	@import "./RegimesCnae.scss";
</style>