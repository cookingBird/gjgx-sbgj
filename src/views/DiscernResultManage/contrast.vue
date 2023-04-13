<template>
<div class="flex flex-col w-full h-full space-y-2">
	<div class="flex items-center justify-between flex-grow-0 flex-shrink-0 w-auto h-12 p-1 bg-white rounded shadow-content">
		<span class="px-2 text-2xl font-bold text-black"> 对比分析</span>
		<el-button
			class="absolute right-0 mr-56"
			@click="$router.go(-1)"
		>
			返回
		</el-button>
		<div class="relative mix-table__action">
			<el-button
				:class="{'selected': type === item }"
				class="mix-table__action-item"
				v-for="item in ['混合', '表格', '地图']"
				:key="item"
				@click="type = item"
			>
				{{ item }}
			</el-button>
		</div>
	</div>
	<div class="relative flex-grow rounded">
		<BaseMap ref="map"></BaseMap>
		<section class="absolute top-0 bottom-0 left-0 flex flex-col w-[675px] p-2 my-2 ml-1 rounded-lg table-wrapper">
			<div class="flex justify-between flex-grow-0 flex-shrink-0 w-auto py-2">
				<span class="text-2xl font-bold text-white"> 对比分析</span>
				<i class="text-2xl text-white cursor-pointer el-icon-close"></i>
			</div>
			<div class="flex-grow">
				<MyTable
					ref="table"
					:data="pipeSegmentList"
					:columns="tableCols"
					@selection-change="handleSelectionChange"
				>
				</MyTable>
			</div>
		</section>
	</div>
</div>
</template>

<script>
	import Map from '@/components/Map';
	import * as Helper from './Helper';
	import MyTable from '@/components/MyTable.vue';
	import * as Refs from '@/mixins/Refs';
	import mapMix from '../GhgqDiscern/mapMix';
	import { pickDataAttrs } from '@/utils/misc';
	export default {
		name: "contrast",
		components: {
			BaseMap: Map,
			MyTable
		},
		mixins: [Refs.createMap('map','refs'),Refs.createTable('table','refs'),mapMix()],
		props: {},
		data () {
			return {
				tableCols: [
					{ width: 55,type: 'selection',align: 'center' },
					{
						width: 55,prop: 'color',align: 'center',label: '顔色',slotIs: 'div',
						dataAttrs: ['colorHex'],
						slotProps ({ row }) {
							return {
								class: 'h-7 w-7',
								style: {
									backgroundColor: row.colorHex
								}
							}
						}
					},
					{ width: 120,prop: 'taskName',align: 'center',label: '任务名称' },
					{ width: 120,prop: 'code',align: 'center',label: '高后果区编号' },
					{
						width: 70,prop: 'hcaLevel',align: 'center',label: '等级',
						format: function (val) {
							if (val == 0) {
								return '非高后果区'
							} else if (val == 1) {
								return '一级'
							} else if (val == 2) {
								return '二级'
							} else if (val == 3) {
								return '三级'
							} else if (val == 4) {
								return '四级'
							} else {
								return val
							}
						}
					},
					{ width: 70,prop: 'hcaLength',align: 'center',label: '长度(m)' },
					{ width: void 0,prop: 'beginMileage',align: 'center',label: '起始里程(m)' },
					{ width: void 0,prop: 'endMileage',align: 'center',label: '终止里程(m)' },
				],
				pipeSegmentList: [],
				type: '混合'
			};
		},
		computed: {
			pipes () {
				return this.$route.query.pipes
			},
		},

		mounted () {
			this.getPipesList()
		},
		updated () { },
		beforeDestroy () { },
		methods: {
			pickDataAttrs,
			getPipesList () {
				Helper.queryPipesDetail(this.pipes,{ pageNo: 1,pageSize: -1 })
					.then(async (res) => {
						console.log('queryPipesDetail res.data',res.data)
						const getRandomColor = function () {
							return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
						}
						this.pipeSegmentList = res.data.map(item => ({
							...item,
							_id: item.pipeSegmentCode + item.taskId,
							colorHex: getRandomColor(),
						}))
						const tableRef = await this.syncTableMounted();
						tableRef.$refs['ElTable'].toggleAllSelection();
						console.log('this----------------',this)
						this.renderPipes(this.pipeSegmentList);
					})
			},
			handleSelectionChange (rows) {
				console.log('handleSelectionChange--------------',rows)
			},
			async renderPipes (pipes) {
				const uniqueKey = '_id';
				const colorKey = 'colorHex'
				const mapRef = await this.syncMapLoaded();
				if (!this.__pipesColorMap) {
					this.__pipesColorMap = pipes.reduce((pre,cur) => {
						return pre.concat(cur[uniqueKey],cur[colorKey])
					},[])
				}
				console.log('this.__pipesColorMap',this.__pipesColorMap)
				// this.__renderedPipes = pipes
				// 	.map(pipe =>
				// 		mapRef.sectionLevelRender(
				// 			[pipe],
				// 			uniqueKey,
				// 			pipe[uniqueKey],
				// 			this.__pipesColorMap.concat('#ccc'))
				// 	)
			},
			objectSpanMethod (scope) {
				function mergeRow (
					scope,
					dataList,
					statisticFiled = 'taskId',
					mergeShowField = 'name'
				) {
					const { row,column,rowIndex,columnIndex } = scope;
					const mergeRecord = `__${mergeShowField}MergeRecord`
					const mergeStatistic = `__${mergeShowField}MergeStatistic`
					if (!this[mergeRecord]) {
						this[mergeRecord] = {}
					}
					if (!this[mergeStatistic]) {
						this[mergeStatistic] = statisticArray(dataList,statisticFiled);
					}
					console.log('this[mergeStatistic]',mergeStatistic,this[mergeStatistic])
					console.log('this[mergeRecord]',mergeRecord,this[mergeRecord])
					if (column.property == mergeShowField) {
						if (!this[mergeRecord][row[statisticFiled]]) {
							this[mergeRecord][row[statisticFiled]] = true;
							return {
								rowspan: this[mergeStatistic][row[statisticFiled]].length,
								colspan: 1
							};
						} else {
							return {
								rowspan: 0,
								colspan: 0
							};
						}
					}
					function statisticArray (array,sFiled = 'id') {
						return array.reduce((pre,curr) => {
							const fVal = curr[sFiled];
							return {
								...pre,
								[fVal]: pre[fVal] ? pre[fVal].concat(curr) : [curr],
							}
						},{});
					}
				}

				return mergeRow.bind(this)(scope,this.pipeSegmentList,'taskId','taskName')
			}
		},
	}
</script>
<style lang='css' scoped>
	::v-deep.table-wrapper {
		background-color: rgba(39, 79, 125, 0.75);
	}

	::v-deep.el-table {
		background-color: transparent;
	}

	::v-deep.el-table tr {
		background-color: transparent;
		color: #ffffff;
	}

	::v-deep.el-table tr.el-table__row:hover {
		background-color: transparent;
	}

	::v-deep.el-table tr.el-table__row:hover>td {
		background-color: transparent;
	}

	::v-deep.el-table th.el-table__cell {
		background-color: transparent;
		color: #ffffff;
	}
</style>
