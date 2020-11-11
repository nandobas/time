<template>
    <v-toolbar class="menu">
        <v-toolbar-items style="width:100%;">
            <v-layout row wrap>
                <v-flex xs12>
                    <h3>Simulador de Planejamento Tributário Econet</h3>
                </v-flex>
                <v-flex xs6>
                    <h1>{{ titulo }}</h1>
                </v-flex>
                <v-flex xs6 v-if="horario">
                    <span style="float:right;">{{hoje | date_2}}</span>
                </v-flex>
            </v-layout>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script src="./Header.js"></script>
<style lang="scss">
@import "./Header.scss";
</style>