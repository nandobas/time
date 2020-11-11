<template>
	<v-container class="template">

		<div v-if="loadingPage">
			<span>
				<v-layout row justify-center align-center>
					<v-progress-circular indeterminate :size="200" :width="2" color="grey"></v-progress-circular>
				</v-layout>
			</span>
		</div>

		<div v-else-if="abas">

			<h1>{{template.template}}</h1>
			<br />
			<h3>Abas</h3>
			<v-btn color="success" style="color:white" @click="modalNovaAba = true">Adicionar Aba</v-btn>
			<v-tabs v-model="active" dark>

				<v-tab v-for="aba in abas" :key="aba.id">
					{{ aba.aba }}
				</v-tab>

				<v-tab-item v-for="aba in abas" :key="aba.id">
					<div class="container-template">
						<v-layout>
							<v-flex xs2>
								<span class="title">Aba:</span>
							</v-flex>
							<v-flex xs3>
								{{ aba.aba }}
							</v-flex>
						</v-layout>
						<v-layout>
							<v-flex xs2>
								<span class="title">Referencia ECF:</span>
							</v-flex>
							<v-flex xs2>
								{{ aba.ref_aba_ecf }}
							</v-flex>
						</v-layout>
						<v-divider></v-divider>
						<v-spacer></v-spacer>
						<!-- <div
                        v-for="bloco in aba.blocos"
                        :key="bloco.id">
                        {{ bloco.bloco }}
                    </div> -->

						<div>
							<br />
							<h2>Blocos</h2>
							<v-btn color="warning" @click="abrirModalBloco(aba.id)">Adicionar Bloco</v-btn>
							<br />
							<v-expansion-panel>
								<v-expansion-panel-content v-for="bloco in aba.blocos" :key="bloco.id_aba_bloco" expand-icon="mdi-menu-down">
									<template v-slot:header>
										<div>{{ bloco.id_aba_bloco }} - {{bloco.bloco}}</div>
									</template>
									<v-card>
										<v-card-text class="grey lighten-3">
											<v-layout>
												<v-flex xs4>
													Campo
												</v-flex>
												<v-flex xs4 class="d-flex align-end justify-end">
													<span class="text-lg-right">Ordem</span>
												</v-flex>

											</v-layout>

											<v-card v-for="(campo,index) in bloco.campos" :key="campo.id">
												<v-card-text>
													<v-layout>
														<v-flex xs4>
															<span>{{ campo.id }}. {{ campo.labelCampo }}</span>
														</v-flex>
														<v-flex xs4 class="d-flex align-end justify-end">
															<span class="text-lg-right">{{ index + 1 }}</span>
														</v-flex>
                                                        <v-flex xs4 class="d-flex">
                                                            <v-icon color="red" @click="deletarCampo(bloco.id_aba_bloco,campo.id,bloco.campos,index)">mdi-delete</v-icon>
														</v-flex>
													</v-layout>

												</v-card-text>

											</v-card>
											<div class="d-flex">
												<v-btn @click="abrirModalExcluirBloco(bloco.id_aba_bloco)" color="error">Excluir Bloco</v-btn>
												<v-btn @click="abrirModalCampos(bloco.id_aba_bloco)" color="info">Adicionar campo</v-btn>
											</div>
										</v-card-text>
									</v-card>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</div>

					</div>
				</v-tab-item>
			</v-tabs>
		</div>
		<v-dialog v-model="modalNovaAba" max-width="500px" persistent>
			<v-icon v-if="!loading" class="close" @click='modalNovaAba = false'>mdi-close</v-icon>

			<v-card>
				<v-card-title class="headline">
					<div class="h1">
						Adicionar nova Aba
					</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex x12>
							<v-select v-model="novaAba.aba" :items="infoAbas" item-value="id" item-text="aba" label="Selecione a aba"></v-select>
							<v-text-field single-line v-model="novaAba.ordemBloco" label="Digite a ordem da aba" clearable outline solo mask="###"></v-text-field>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex x12>
							<v-select v-model="novaAba.bloco" :items="infoBlocos" item-value="id" item-text="bloco" label="Selecione o bloco"></v-select>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex x12>
							<v-text-field single-line v-model="novaAba.campos" label="Digite o número dos campo separado por ';' Ex: 1;2;4;5;5" clearable outline solo></v-text-field>
						</v-flex>
					</v-layout>
					<v-btn :loading=loading :disabled="(novaAba.aba == '' || novaAba.bloco == '' || novaAba.campos == '')" color="success" style="color:white" @click="adicionarAba">Adicionar Aba</v-btn>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-dialog v-model="modalNovoBloco" max-width="500px" persistent>
			<v-icon v-if="!loading" class="close" @click='modalNovoBloco = false'>mdi-close</v-icon>

			<v-card>
				<v-card-title class="headline">
					<div class="h1">
						Adicionar novo bloco
					</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex x12>
							<v-select v-model="novaAba.bloco" :items="infoBlocos" item-value="id" item-text="bloco" label="Selecione o bloco"></v-select>
							<v-text-field single-line v-model="novaAba.ordemBloco" label="Digite a ordem do bloco" clearable outline solo mask="###"></v-text-field>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex x12>
							<v-text-field single-line v-model="novaAba.campos" label="Digite o número dos campo separado por ';' Ex: 1;2;4;5;5" clearable outline solo></v-text-field>
						</v-flex>
					</v-layout>
					<v-btn :loading=loading :disabled="(novaAba.bloco == '' || novaAba.campos == '')" color="success" style="color:white" @click="submitNovoBloco()">Adicionar bloco</v-btn>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-dialog v-model="modalAdicionarCampos" max-width="500px" persistent>
			<v-icon v-if="!loading" class="close" @click='modalAdicionarCampos = false'>mdi-close</v-icon>

			<v-card>
				<v-card-title class="headline">
					<div class="h1">
						Adicionar campos
					</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex x12>
							<v-text-field single-line v-model="novaAba.campos" label="número:ordem dos campo separado por ';' Ex: 1:1;2:2;4:3;5:5;5" clearable outline solo></v-text-field>
						</v-flex>
					</v-layout>
					<v-btn :loading=loading :disabled="(novaAba.campos == '')" color="success" style="color:white" @click="submitNovosCampos()">Adicionar campos</v-btn>
				</v-card-text>
			</v-card>
		</v-dialog>
        
        <v-dialog v-model="modalConfirmarExcluir" max-width="500px" persistent>
			<v-icon v-if="!loading" class="close" @click='modalConfirmarExcluir = false'>mdi-close</v-icon>

			<v-card>
				<v-card-title class="headline">
					<div class="h1">
						Deseja excluir este bloco e seus campos ?
					</div>
				</v-card-title>
				<v-card-text>
					<v-layout row wrap>
						<v-flex x12 class="d-flex">
                            <v-btn :loading=loading color="info" style="color:white" @click="modalConfirmarExcluir = false">Cancelar</v-btn>
							<v-btn :loading=loading color="error" style="color:white" @click="submitExcluirBloco()">Excluir</v-btn>
						</v-flex>
					</v-layout>
				</v-card-text>
			</v-card>
		</v-dialog>
        
	</v-container>
</template>

<script src="./Template.js"></script>

<style lang="scss">
	@import "./Template.scss";
</style>