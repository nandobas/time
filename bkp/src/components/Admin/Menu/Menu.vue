<template>
    <div class="menu">
			<v-toolbar>
				<v-toolbar-items>
					<v-btn text>
						<router-link :to="{ name: 'templates' }">Templates</router-link>
					</v-btn>
					<v-btn text>
						<router-link :to="{ name: 'mapas' }">Mapas</router-link>
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>
		</div>
</template>
<script src="./Menu.js"></script>

<style lang="sass">
    @import "Menu.scss"
</style>