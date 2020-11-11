<template>
    <div class="col" v-if="tributo.exibe_excedente">
        <div class="quebra">
            <div style="height:30px;"></div>
            <div class="valor" v-html="tributo.aliq_tributo"></div>
            <div style="height:35px;"></div>
            <div class="valor" v-html="tributo.valr_tributo"></div>
            <div style="height:30px;"></div>
            <div class="valor" v-html="tributo.aliq_ext_tributo"></div>
            <div style="height:40px;"></div>
            <div class="valor" v-html="tributo.valr_ext_tributo"></div>
        </div>
    </div>
    <div class="row" v-else>
        <div class="col">{{tributo.aliq_tributo}}</div>
    </div>
</template>

<script src="./Padrao.js"></script>