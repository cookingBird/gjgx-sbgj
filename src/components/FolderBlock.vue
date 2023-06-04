<template>
<div
	class="flow-fold"
	@click="isShowFold = !isShowFold"
	:style="{
		'min-height': isShowFold ? '0px' : '10px'
	}"
>
	<slot :show="isShowFold"></slot>
	<div :class="[
          'fold-btn',
          isShowFold === true ? 'el-icon-arrow-down' : 'el-icon-arrow-up',
        ]">
	</div>
</div>
</template>

<script>

	export default {
		name: "FolderBlock",
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				isShowFold: this.show
			};
		}
	}
</script>
<style lang='scss'>
	$--cas-color10: #ffffff;

	.flow-fold {
		width: 100%;
		height: auto;
		position: relative;
		color: #333;
		cursor: pointer;
		background-color: $--cas-color10;
		border-radius: 5px;

		&::after,
		.fold-btn {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}

		&::after {
			content: "";
			top: 100%;
			width: 60px;
			height: 10px;
			border-radius: 3px;
			transform: translate(-50%, -50%);
			background-color: $--cas-color10;
			box-shadow: 0px 6px 5px -3px rgba(127, 127, 127, 0.35);
		}

		.fold-btn {
			top: calc(100% - 12px);
			height: 8px;
			z-index: 9;
			font-size: 20px;
			font-weight: bold;
		}
	}
</style>
