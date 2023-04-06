<template>
	<div class="switcher-container">
		<div class="switcher-container-panel">
			<p class="switcher-panel-title">
				<slot name="title">{{title}}</slot>
			</p>
			<el-switch
				v-bind="$attrs"
				class="switcher-panel-switcher"
				active-color="#13ce66"
				inactive-color="#eeeeee"
				v-on="$listeners"
			>
			</el-switch>
		</div>
		<div class="switcher-container-display">
			<span class="switcher-container-display__number">
				<slot name="number">{{number || 0}}</slot>
			</span>
			<span class="switcher-container-display__unit">
				<slot name="unit">{{unit}}</slot>
			</span>
		</div>
	</div>
</template>

<script>

	export default {
		name: "LayerSwitcher",
		props: {
			number: {
				type: Number,
				default: 500
			},
			title: {
				type: String,
				default: '人居'
			},
			unit: {
				type: String,
				default: '处'
			}
		},
		data () {
			return {};
		},
		methods: {},
	}
</script>
<style lang='css'>
	.switcher-container-panel {
		max-width: 57px;
		text-overflow: ellipsis;
	}

	.switcher-container {
		--x-gap: 9;
		display: inline-flex;
		padding: 7px;
		border-radius: 4px;
		background-color: #fff;
	}

	.switcher-container-display__number {
		color: #27a626;
		font-weight: 900;
		font-size: 30px;
		max-width: 61px;
		text-overflow: ellipsis;
	}

	.switcher-container-display {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.switcher-container-display>span+span {
		margin-left: 2px;
	}

	.switcher-container>div+div {
		margin-left: calc(var(--x-gap) * 1px);
	}

	.switcher-panel-switcher {
		text-align: center;
	}
</style>
