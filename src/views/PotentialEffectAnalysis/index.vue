<template>
	<ContentLayout>
		<template v-slot:header>
			<div class="relative flex px-2 py-1 action-header-ctx">
				<el-input
					class="inline-block w-24"
					placeholder="请输入管道名称"
				></el-input>
				<el-date-picker
					v-model="pickedDate"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				>
				</el-date-picker>
				<el-button class="ml-2 my-el-button">查询</el-button>
				<el-button class="my-el-button">重置</el-button>
				<div class="absolute right-2 top-1 my-btn-group">
					<el-button
						v-for="item in actionType"
						:key="item.type"
						:data-action-type="item.type"
						class="my-btn-group-item"
						:class="[ currentActionType === item.type ? 'selected' : '']"
						@click="()=>switchView(item.type)"
					>
						{{ item.label }}
					</el-button>
				</div>
			</div>
		</template>
		<template v-slot:main>
			<MixTable
				:columns="tableCols"
				:config="mixTableCfg"
				:isPagination="false"
				:data="tableData"
			>
				<template v-slot:action>
					<el-button class="my-el-button-none">操作</el-button>
				</template>
			</MixTable>
		</template>
		<template v-slot:footer>
			<div class="flex items-center justify-center px-2 py-1">
				<el-pagination
					layout="total,sizes, prev, pager, next, jumper"
					:total="100"
					:current-page.sync="currentPage"
					:page-size="10"
					class="my-el-pagination-ctx"
					background
				></el-pagination>
			</div>
		</template>
	</ContentLayout>
</template>

<script>
	import ContentLayout from '../components/ContentLayout.vue';
	import PotentialMap from './PotentialMap.vue';
	import MixTable from '@/components/mixTable';
	export default {
		components: {
			ContentLayout,
			PotentialMap,
			MixTable
		},

		data () {
			return {
				pickedDate: '',
				currentPage: 1,
				tableCols: [
					{ prop: 'secGroup',label: '二级单位' },
					{ prop: 'thirdGroup',label: '三级单位' },
					{ prop: 'pipeName',label: '管道名称' },
					{ prop: 'startPoint',label: '起点' },
					{ prop: 'endPoint',label: '终点' },
					{ prop: 'pipeLength',label: '管道长度' },
					{ prop: 'pipeRadius',label: '管径' },
					{ prop: 'pressure',width: '90',label: '压力' },
					{ prop: 'transMedium',width: '90',label: '传输介质' },
					{ prop: 'effectRadius',width: '90',label: '影响半径' },
					{ prop: 'exposeRadius',width: '90',label: '暴露半径' },
					{ prop: 'action',label: '操作' }
				],
				tableData: [
					{
						secGroup: '二级单位',
						thirdGroup: '三级单位',
						pipeName: '管道名称',
						startPoint: '起点',
						endPoint: '终点',
						pipeLength: '管道长度',
						pipeRadius: '管径',
						pressure: '压力',
						transMedium: '传输介质',
						effectRadius: '影响半径',
						exposeRadius: '暴露半径',
					},
				],
				actionType: [
					{ type: 'mix',label: '混合' },
					{ type: 'table',label: '表格' },
					{ type: 'map',label: '地图' },
				],
				currentActionType: 'mix',
				mixTableCfg: {
					switcher: false,
					
					index: true,
				}
			};
		},

		mounted () {

		},

		methods: {
			onMapLoad () { },
			handleMapClick () { },
			switchView (type) {
				this.currentActionType = type
				console.log('switchView',type)
			}
		},
	};
</script>

<style>
	.action-header-ctx> :not([hidden])+ :not(.absolute) {
		margin-left: 7px;
	}

	.flex-basis-0 {
		flex-basis: 0;
	}
</style>


