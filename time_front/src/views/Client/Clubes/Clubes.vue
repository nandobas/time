<template>
	<v-content class="home">
		<Header :titulo="strTitulo"></Header>

		

	<div>
		<div class="lista-area mt-2">
			<v-layout >
				<v-flex xs12 md5 v-if='arClubes.length > 0'>
					<v-text-field autofocus single-line v-model="strFiltro" label="Pesquisar Clube" clearable append-icon="mdi-magnify" class='pt-0' outline solo>
					</v-text-field>
				</v-flex>
				<v-flex xs12 md5>
					<v-btn @click="novoClube();">Novo</v-btn>
				</v-flex>
			</v-layout>
			<v-data-table :items="filtered" hide-actions :pagination.sync="pagination">
				<template v-slot:headers="props" v-if='arClubes.length > 0'>
					<tr>
						<th class='text-xs-left'>
							Clube
						</th>
						<th class='text-xs-left'>
							Categoria
						</th>
						<th width='180px' :class="[
                                'column sortable', 
                                pagination.descending ? 'desc' : 'asc', 
                                'active',
                               'text-xs-center',
                                
                            ]" @click="pagination.descending = !pagination.descending">
							Última alteração
							<v-icon>mdi-arrow-up</v-icon>
						</th>
						<th class="acao text-xs-center" width='180px'>
							Ação
						</th>
					</tr>
				</template>
				<template v-slot:items="props">
					<td>
						{{ props.item.str_nome }}
					</td>
					<td>
						{{ props.item.str_categoria }}
					</td>
					<td class="acao text-xs-center">{{ props.item.updated_at }}</td>
					<td class='acao text-xs-center'>
						<v-tooltip top open-delay="0" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-icon @click="selecionaClube(props.item)" v-on='on'>
									mdi-pencil
								</v-icon>
							</template>
							<span>
								Editar Clube
							</span>
						</v-tooltip>
						<v-tooltip top open-delay="0" close-delay="0">
							<template v-slot:activator="{ on }">
								<v-icon @click="abrirDialogExcluir(props.item)" v-on='on'>
									mdi-trash-can-outline
								</v-icon>
							</template>
							<span>
								Excluir Clube
							</span>
						</v-tooltip>
					</td>
				</template>
				<template v-slot:no-data>
					<v-alert :value="true" class='info-cinza'>
						<span v-if='timeoutPesquisa'>
							<v-layout row justify-center align-center>
								<v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
							</v-layout>
						</span>
						<span v-else>
							Nenhum clube encontrado
						</span>
					</v-alert>
				</template>

			</v-data-table>

			<div class="text-xs-center pt-2" v-if='arClubes.length > 0 && pagination.paginas > 1'>
				<v-pagination v-model="pagination.page" :length="pagination.paginas" circle :total-visible="maxPaginas">
				</v-pagination>
			</div>
		</div>

		</div>



	<v-dialog v-model="dialogFormCLube" persistent max-width="600px">
	 <form @submit="salvarClube()">
      <v-card>
        <v-card-title>
          <span class="headline">Clube</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Nome*" 
				required
				name="str_nome" 
				v-model="clube.str_nome"
				></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="arCategorias"
				  name="str_categoria"
                  label="Categoria"
				  v-model="clube.str_categoria"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*campos obrigatórios</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogFormCLube = false">Fechar</v-btn>
          <v-btn color="blue darken-1" flat @click="salvarClube()">
			  <span v-if="blSalvandoClube">
				  <v-layout row justify-center align-center>
					<v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
				  </v-layout>
			  </span>
			  <span v-else>
			 	Salvar
			  </span>

		  </v-btn>
        </v-card-actions>
      </v-card>
	 </form>
    </v-dialog>

	<v-dialog v-model="dialogRemover" persistent max-width="290">
      <v-card>
        <v-card-title class="headline alert">Confirma a exclusão?</v-card-title>
        <v-card-text>{{clube.str_nome}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogRemover = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmaExclusao()">
			  
			  <span v-if="blSalvandoClube">
				  <v-layout row justify-center align-center>
					<v-progress-circular indeterminate :size="20" :width="2" color="grey"></v-progress-circular>
				  </v-layout>
			  </span>
			  <span v-else>
			 	Excluir
			  </span>
		  </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

	</v-content>


		
</template>

<script>
	export default {}
</script>

<script src="./Clubes.js"></script>
<style lang="scss">
	@import "./Clubes.scss";
</style>