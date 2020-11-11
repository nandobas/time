<template>
	<div class="home-logado">
		<h1 class='mb-0'>Importar Arquivo ECF</h1>

		<form class="form-horizontal pt-4" enctype="multipart/form-data">
			<div class="row">
				<div class="col-sm-12 col-md-6 pl-0">
					<vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
					<div class="form-group">
						<label class="col-sm-12 col-md-12 col-form-label">ARQUIVO CSV:</label>
						<div class="col-md-12">
							<input type="file" ref="myFiles" accept=".txt" name="file" placeholder="Selecione um arquivo" />
						</div>
						<div class="col-md-12">
							<span v-html="retornoArquivo"></span>
						</div>
					</div>
				</div>
				<div class="col-sm-12 col-md-6 pl-0">
					<div class="form-group mb-2 pb-0" v-show="msgs.length > 0">
						<label class="col-sm-12 col-md-12 col-form-label">Logs da Importação:</label>
					</div>
					<div class="div-retornos">
						<p :key="msg" v-for="msg in msgs" v-html="msg"><span v-html="msg"></span></p>
					</div>
				</div>
			</div>
		</form>

		<div slot="modal-footer" class="col-md-12">
			<div class="row">
				<div class="col-sm-12 col-md-12 pr-0">
					<button :disabled="blLoadingImportar" type="button" class="btn btn-primary float-right" @click="onClickImportar()">
						<font-awesome-icon icon="spinner" spin class='mr-2' v-if="blLoadingImportar" />
						Importar
					</button>
					<button type="button" class="btn btn-secondary mr-2 float-right">Cancelar</button>
				</div>
			</div>
		</div>
		<div class="alert-area">
			<div class="v-alert warning">
				<span>Analisando somente a atividade, não há impedimento é opção pelo Simples Nacional.</span>
			</div>
		</div>
	</div>
</template>
<script src="./ImportarECF.js"></script>
<style lang="scss">
	@import "./ImportarECF.scss";
</style>