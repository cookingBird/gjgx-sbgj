<template>
<div class="flex flex-col w-full h-full space-y-2">
	<div class="flex items-center justify-between flex-grow-0 flex-shrink-0 w-auto h-12 p-1 bg-white rounded shadow-content">
		<span class="px-2 text-2xl font-bold text-black"> 对比分析</span>
		<el-button
			class="absolute right-0 mr-56"
			@click="$router.push('/DiscernResultManage')"
		>
			返回
		</el-button>
		<div class="!relative mix-table__action">
			<el-button
				v-for="item in ['混合', '表格', '地图']"
				:class="{'selected': type === item }"
				:key="item"
				@click="type = item"
				class="mix-table__action-item"
			>
				{{ item }}
			</el-button>
		</div>
	</div>
	<div class="relative flex-grow rounded">
		<BaseMap ref="map">
			<div
				class="absolute map-layer-switcher-group"
				v-show="type !== '表格'"
			>
				<LayerSwitcher
					v-model="visible.populationShow"
					:number="pipeAroundTotal.people"
					title="人居"
					@change="(val)=>toggleVisible(val,'people')"
				></LayerSwitcher>
				<LayerSwitcher
					v-model="visible.placeShow"
					:number="pipeAroundTotal.place"
					title="特定场所"
					@change="(val)=>toggleVisible(val,'place')"
				></LayerSwitcher>
			</div>
		</BaseMap>
		<section
			v-show="type == '表格' || type == '混合'"
			class="absolute flex-col p-2 m-2 rounded-lg table-wrapper"
			:class="[ type == '表格' ? 'inset-0' : 'top-0 bottom-0 left-0 w-[675px]']"
		>
			<div class="flex justify-between flex-grow-0 flex-shrink-0 w-auto py-2">
				<span class="text-2xl font-bold text-white"> 对比分析</span>
				<i
					class="text-2xl text-white cursor-pointer el-icon-close"
					@click="type='地图'"
				></i>
			</div>
			<div class="relative flex-grow">
				<MyTable
					ref="table"
					height="100%"
					:data="pipeSegmentList"
					:columns="tableCols"
					:span-method="objectSpanMethod"
					@row-click="handleRowClick"
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
	import {
		createTableSpanMethods,
		createFiledRecordCtx,
		statisticFiled,
		createArrayContrast
	} from '@/utils/misc';
	import LayerSwitcher from "@/components/LayerSwitcher.vue";
	import { v4 as uuidv4 } from 'uuid';
	const UNIQUE_KEY = 'taskId';

	export default {
		name: "contrast",
		components: {
			BaseMap: Map,
			MyTable,
			LayerSwitcher
		},
		mixins: [Refs.createMap('map','refs'),Refs.createTable('table','refs'),mapMix()],
		props: {},
		data () {
			return {
				tableCols: [
					{ width: 55,type: 'selection',prop: 'selection',align: 'center' },
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
						formatter: function (val) {
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
				type: '混合',
				visible: {
					populationShow: true,
					placeShow: true,
				},
				pipeAroundTotal: {
					people: 0,
					place: 0
				}
			};
		},
		computed: {
			pipes () {
				return this.$route.query.pipes
			},
			taskIds () {
				return this.$route.query.taskIds
			},
			pipeSegmentCode () {
				return this.$route.query.pipeSegmentCode
			},
		},
		created () {
			this.__getTaskColor = createFiledRecordCtx('randomColor','taskId');
			this.__mergeRowByTaskId = createTableSpanMethods(['taskName','color','selection'],'taskId')
		},
		mounted () {
			this.getPipeDetail();
			this.getTasksDetail();
		},
		updated () { },
		beforeDestroy () { },
		methods: {
			async getPipeDetail () {
				const data = await Helper.queryPipeRegion(
					this.taskIds.split(',')[0],
					this.pipeSegmentCode
				)
				console.log('queryPipeRegion -----------------------------',data);
				const { regionWkt,flammableWkt,specificWkt,populationWkt,wkt } = data;

				this.pipeAroundTotal = {
					people: populationWkt.length,
					place: specificWkt.length,
				};

				const mixMapRef = await this.syncMapLoaded();
				this.renderPipeLine([data],mixMapRef);
				this.renderRadius({ regionDto: { regionWkt } },mixMapRef);
				this.renderFeatureByType(populationWkt,'population',mixMapRef);
				this.renderFeatureByType(specificWkt,'specific',mixMapRef);
				mixMapRef.locationByLineString(wkt,{
					padding: { left: 700,right: 50 }
				})

			},
			/**@description 获取任务详情 */
			getTasksDetail () {
				Helper.queryPipesDetail(this.taskIds,this.pipeSegmentCode,{ pageNo: 1,pageSize: -1 })
					.then(async (res) => {
						this.pipeSegmentList = res.data.map(item => {
							return {
								...item,
								colorHex: this.__getTaskColor(item),
								_id: uuidv4()
							}
						})
						const pipesObj = statisticFiled(this.pipeSegmentList,'taskId','obj');
						await this.syncMapLoaded();
						//渲染管段
						this.renderPipes(pipesObj);
						const tableRef = await this.syncTableMounted();
						tableRef.$refs['ElTable'].toggleAllSelection();
					})
			},
			// 控制管线显隐
			handleSelectionChange (rows) {
				if (!this.__selectContrast) {
					this.__selectContrast = createArrayContrast(this.pipeSegmentList,'_id')
				}
				const { isAdd,list } = this.__selectContrast(rows);
				if (isAdd) {
					const visibleItem = list[0];
					const controller =
						this.__renderedPipes.find(p => p.id === visibleItem[UNIQUE_KEY]);
					controller.toggleVisibility(true);
				} else if (list.length > 0) {
					const hiddenItems = list[0];
					const controller =
						this.__renderedPipes.find(p => p.id === hiddenItems[UNIQUE_KEY]);
					controller.toggleVisibility(false);
				}
			},
			async renderPipes (pipesMap) {
				const mapRef = await this.syncMapLoaded();
				if (!this.__pipesColorMap) {
					this.__pipesColorMap = Object.entries(this.__getTaskColor(null,true))
						.flat()
						.concat('yellow');
				}
				this.__renderedPipes = Object.entries(pipesMap)
					.map(
						([taskId,pipeSegments]) =>
							mapRef.sectionLevelRender(pipeSegments,UNIQUE_KEY,taskId,this.__pipesColorMap)
					);
			},

			objectSpanMethod (scope) {
				return this.__mergeRowByTaskId(scope,this.pipeSegmentList)
			},

			async handleRowClick (row) {
				const mixMapRef = await this.syncMapLoaded()
				mixMapRef.locationByLineString(row.wkt);
			},

			toggleVisible (val,type) {
				if (type === 'people') {
					this.__populationLayer && this.__populationLayer.toggleVisibility(val)
				}
				if (type === 'place') {
					this.__placeLayer && this.__placeLayer.toggleVisibility(val)
					this.__boomLayer && this.__boomLayer.toggleVisibility(val)
				}
			}
		},
	}
</script>
<style lang='css' scoped>
	::v-deep.table-wrapper {
		background-color: rgba(39, 79, 125, 0.75);
	}

	::v-deep.gislife-table-pagination .el-table {
		background-color: transparent;
	}

	::v-deep.gislife-table-pagination .el-table tr {
		background-color: transparent;
		color: #ffffff;
	}

	::v-deep.gislife-table-pagination .el-table tr.el-table__row:hover {
		background-color: transparent;
	}

	::v-deep.gislife-table-pagination .el-table tr.el-table__row:hover>td {
		background-color: transparent;
	}

	::v-deep.gislife-table-pagination .el-table th.el-table__cell {
		background-color: transparent;
		color: #ffffff;
	}

	.table-wrapper {
		display: flex;
	}
</style>
