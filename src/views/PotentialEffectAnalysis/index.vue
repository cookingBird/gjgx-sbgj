<template>
	<main>
		<div class="search-bar shadow-content">
			<el-form
				:model="searchForm"
				:inline="true"
			>
				<el-form-item>
					<el-select
						class="inline-block w-40"
						v-model="searchForm.pipeCode"
						placeholder="请选择管线名称"
						clearable
						filterable
					>
						<el-option
							v-for="item in pipeList"
							:key="item.id"
							:label="item.pipeName"
							:value="item.pipeSegmentCode"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker
						v-model="pickedDate"
						type="daterange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						range-separator="至"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
					></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="handleSearch"
					>查询</el-button>
					<el-button
						type="primary"
						@click="handleReset"
					>重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="page-content m-t-10">
			<MixTable
				ref="mixTableRef"
				:url="tableReqUrl"
				:tableColumns="tableCols"
				:config="mixTableCfg"
				:data="tableData"
				:query="searchForm"
				@onData="onTableGetData"
				@handleCommand="tableCommand"
				@row-click="handleTableRowClick"
			>
			</MixTable>
		</div>
	</main>
</template>

<script>

	import { pipeListAPI } from '@/api/result';
	import MixTable from '@/components/mixTable';
	import { lineAround } from '@/api/analyse';

	export default {
		components: {
			MixTable
		},

		data () {
			return {
				pipeList: [],
				tableReqUrl: window.URL_CONFIG.baseUrl + '/task/reanalysis',
				searchForm: {
					pipeCode: '',
					startTime: '',
					endTime: '',
				},
				pickedDate: [],
				tableCols: [
					{ prop: 'secOrgName',label: '二级单位' },
					{ prop: 'orgName',label: '三级单位' },
					{ prop: 'pipeName',label: '管道名称' },
					{ prop: 'startPosition',label: '起点' },
					{ prop: 'endPosition',label: '终点' },
					{ prop: 'segmentLength',label: '管道长度' },
					{ prop: 'diameter',label: '管径' },
					{ prop: 'pressure',width: '90',label: '压力' },
					{ prop: 'transmissionMedium',width: '90',label: '传输介质' },
					{ prop: 'impactRadius',width: '90',label: '影响半径' },
					{ prop: 'exposureRadius',width: '90',label: '暴露半径' },
				],
				tableData: [],
				actionType: [
					{ type: 'mix',label: '混合' },
					{ type: 'table',label: '表格' },
					{ type: 'map',label: '地图' },
				],
				currentActionType: 'mix',
				mixTableCfg: {
					switcher: false,
					index: true,
					class: "my-el-table-ctx",
					buttons: {
						fixed: 'right',
						list: [
							{
								size: 'normal',
								label: '详情',
								key: 'info'
							}
						],
						width: '100px'
					},
				},
			};
		},
		watch: {
			pickedDate (val) {
				if (Array.isArray(val)) {
					this.searchForm.startTime = val[0] || "";
					this.searchForm.endTime = val[1] || "";
				} else {
					this.searchForm.startTime = "";
					this.searchForm.endTime = "";
				}
			}
		},
		computed: {
			mapRef () {
				return this.$refs['mixTableRef'].$refs['basemap'];
			},
			tableRef () {
				return this.$refs['mixTableRef'].$refs['table'];
			}
		},
		created () {
			this.getPipeList();
		},

		methods: {
			onTableGetData (data) {
				this.mapRef.pipeRadiusRemove();
				this.mapRef.pipeRender(data);
			},
			async handleTableRowClick (row) {
				const { code,data } = await lineAround({ id: row.id });
				if (code === 200) {

					const { regionWkt,flammableWkt,specificWkt,populationWkt } = data;
					//影响半径
					regionWkt && this.mapRef.pipeRadiusRender(regionWkt);
					//人居
					populationWkt.length && this.mapRef.renderMarkerByType(populationWkt,1);
					//特定场所
					specificWkt.length && this.mapRef.renderMarkerByType(specificWkt,2);
					//易燃易爆场所
					flammableWkt.length && this.mapRef.renderMarkerByType(flammableWkt,3);

				}
			},
			tableCommand (key,row) {
				switch (key) {
					case 'info':
						this.$router.push({
							path: '/detail',
							query: {
								code: row.code
							}
						})
						break;
				}
			},
			async getPipeList () {
				const { code,data } = await pipeListAPI({
					pageSize: -1,
					pageNo: 1
				})
				if (code === 200) {
					this.pipeList = data.data;
				}
			},
			handleSearch () {
				this.tableRef.refresh();
			},
			handleReset () {
				this.searchForm.pipeCode = '';
				this.pickedDate = [];
				setTimeout(this.tableRef.refresh)
			},
			onMapLoad () { },
			handleMapClick () { },
			switchView (type) {
				this.currentActionType = type
				console.log('switchView',type)
			}
		},
	};
</script>


<style lang="scss" scoped>
main {
	width: 100%;
	height: 100%;


	.search-bar {
		padding: 8px;
		background-color: #fff;

		.el-form-item {
			margin-bottom: 0;

			.el-input {
				width: 200px;
			}
		}

	}

	.page-content {
		height: calc(100% - 66px);

		>div {
			padding: 8px;
		}

	}

}
</style>
