<template>
	<div id="menu">
		<v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" hide-overlay stateless :app="true" :width="250">
			<v-toolbar flat class="transparent">
				<v-list class="header">
					<v-list-tile>
						<v-list-tile-title class="title" v-show="!mini">
							<img alt="Logo Econet" src="@/assets/img/logo_econet.jpeg" class='logo' />
						</v-list-tile-title>
						<v-list-tile-action :class="{'aberto':!mini}">
							<v-btn icon @click.stop="mini = !mini">
								<v-icon v-show="!mini">mdi-chevron-left</v-icon>
								<v-icon v-show="mini">mdi-chevron-right</v-icon>
							</v-btn>
						</v-list-tile-action>
					</v-list-tile>
				</v-list>
			</v-toolbar>
			<v-list dense class="pt-0 body">
				<div v-for="(item, index) in items" :key="item.title">
					<v-list-tile v-if="!item.subMenu || item.subMenu.length == 0 || mini" :class="[index == 0 ? 'active' : '', 'linha']" :to='item.url'>
						<v-list-tile-action>
							<v-icon>mdi-{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ item.title }}</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-group v-else :class="[index == 0 ? 'active' : '', 'group-linha']">
						<template v-slot:activator>
							<v-list-tile>
								<v-list-tile-action>
									<v-icon>mdi-{{ item.icon }}</v-icon>
								</v-list-tile-action>
								<v-list-tile-content>
									<v-list-tile-title>{{item.title}}</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
						</template>
						<v-list-tile :to="sub.url" v-for="sub in item.subMenu" :key="sub.title" class="linha">
							<v-list-tile-title>
								<span class="pre"></span>
								<span class="item">{{sub.title}}</span>
							</v-list-tile-title>
						</v-list-tile>
					</v-list-group>
				</div>
			</v-list>

			<div class="suporte">
				<a class='link' href='http://www.econeteditora.com.br/solucoes/index.php?acao=envio&form[destino]=2&form[area]=34&form[tipo]=6&form[assunto]=415' target='_blank'>
					<v-icon>mdi-headset</v-icon>
					<span>Suporte técnico</span>
				</a>
				<a class='link' @click='abrirDialogOpiniao'>
					<v-icon>mdi-comment</v-icon>
					<span>Deixe sua opinião</span>
				</a>
			</div>
		</v-navigation-drawer>

		<DialogOpiniao :abrir='dialogOpiniao' @fechar='fecharDialogOpiniao'></DialogOpiniao>
	</div>
</template>
<script src="./Menu.js"></script>
<style lang="scss">
	@import "./Menu.scss";
</style>