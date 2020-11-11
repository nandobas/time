<template>
	<v-container class="mapa">
		<div v-if="loadingPage">
			<span>
				<v-layout row justify-center align-center>
					<v-progress-circular indeterminate :size="200" :width="2" color="grey"></v-progress-circular>
				</v-layout>
			</span>
		</div>
        <div v-else-if="mapa">
            <h1>{{mapa.nome}}</h1>
            <v-btn color="success" style="color:white" @click="modalAdicionarCnae = true">Adicionar Cnae</v-btn>
            <v-card class="pl-4" v-for="(cMapa,index) in cnaeMapa" :key=cMapa.id>
                <v-layout class="mt-3 btn-template" >
                    <v-flex xs11>
                        <v-card-text class="px-0">{{ cMapa.id }} - {{ cMapa.cnae.cnae }} <i>{{ cMapa.cnae.descricao }}</i></v-card-text>
                    </v-flex>
                    <v-flex xs1>
                        <v-icon color="red" class="pt-3" @click="removeCnae(index,cMapa.id)" >mdi-delete</v-icon>
                    </v-flex>
                </v-layout>
            </v-card>

        </div>

        <v-dialog v-model="modalAdicionarCnae" max-width="500px" persistent>
			<v-icon v-if="!loading" class="close" @click='modalAdicionarCnae = false'>mdi-close</v-icon>

			<v-card>
				<v-card-title class="headline">
					<div class="h1">
						Adicionar Cnaes
					</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex x12>
							<v-text-field single-line v-model="novoCnae.cnaes" label="Informe os idsCnae separados por ';' Ex: 1:1;2:2;4:3;5:5;5" clearable outline solo></v-text-field>
						</v-flex>
					</v-layout>
					<v-btn :loading=loading :disabled="(novoCnae.cnaes == '')" color="success" style="color:white" @click="submitCnaes()">Adicionar Cnaes</v-btn>
				</v-card-text>
			</v-card>
		</v-dialog>

	</v-container>
</template>

<script src="./Mapa.js"></script>

<style lang="scss">
	@import "./Mapa.scss";
</style>