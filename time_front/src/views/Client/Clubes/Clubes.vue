<template>
	<v-content class="home">
		<Header :titulo="strTitulo"></Header>

		

	<div>
		<div class="lista-area mt-2">
			<v-layout v-if='arClubes.length > 0'>
				<v-flex xs12 md5>
					<v-text-field autofocus single-line v-model="strFiltro" label="Pesquisar Clube" clearable append-icon="mdi-magnify" class='pt-0' outline solo>
					</v-text-field>
				</v-flex>
			</v-layout>
			<v-data-table :items="filtered" hide-actions :pagination.sync="pagination">
				<template v-slot:headers="props" v-if='arClubes.length > 0'>
					<tr>
						<th class='text-xs-left'>
							Nome
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
						{{ props.item.strNome }}
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
	</v-content>
		
</template>

<script>
	export default {}
</script>

<script src="./Clubes.js"></script>
<style lang="scss">
	@import "./Clubes.scss";
</style>