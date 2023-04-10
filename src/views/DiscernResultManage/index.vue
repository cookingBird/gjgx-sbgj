<template>
<main>
	<div class="search-bar shadow-content">
		<el-form
			:model="searchForm"
			:inline="true"
		>
			<el-form-item>
				<el-input
					v-model="searchForm.keyWords"
					placeholder="请输入任务名称"
					clearable
				></el-input>
			</el-form-item>
			<el-form-item>
				<el-select
					v-model="searchForm.pipeCode"
					placeholder="请选择管线名称"
					clearable
					filterable
				>
					<el-option
						v-for="item in pipeList"
						:key="item.id"
						:label="item.pipeName"
						:value="item.pipeCode"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="date"
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
	<div class="page-content">
		<MixTable
			ref="mixTableRef"
			:url="tableReqUrl"
			:tableColumns="tableColumns"
			:config="mixTableCfg"
			:query="searchForm"
			@onData="onTableGetData"
			@handleCommand="tableCommand"
		>
		</MixTable>
	</div>
</main>
</template>

<script>
	import Map from '@/components/Map.vue';
	import { pipeListAPI,syncData } from '@/api/result';
	import MixTable from '@/components/mixTable';

	export default {
		components: {
			BaseMap: Map,
			MixTable
		},
		data () {
			return {
				tableReqUrl: window.URL_CONFIG.baseUrl + '/task/resultListVo',
				date: [],
				total: 0,
				searchForm: {
					endTime: "",
					startTime: "",
					keyWords: "",
					pipeCode: ""
				},
				mixTableCfg: {
					switcher: false,
					index: true,
					class: "my-el-table-ctx",
					buttons: {
						fixed: 'right',
						list: [
							{
								size: 'normal',
								label: '同步',
								key: 'sync'
							}
						],
						width: '100px'
					},
				},
				tableColumns: [{
					label: '任务名称',
					prop: 'taskName'
				},{
					label: '识别时间',
					prop: 'recognitionTime'
				},{
					label: '所属管线',
					prop: 'pipeSegmentName'
				},{
					label: '高后果区编号',
					prop: 'hcaNo'
				},{
					label: '是否高后果区',
					prop: 'isHigh',
					format (val) {
						if (val === null) {
							return '-'
						} else if (val == 0) {
							return '否'
						} else if (val == 1) {
							return '是'
						}
					}
				},{
					label: '等级',
					prop: 'hcaLevel',
					format: function (val) {
						if (val == 0) {
							return '-'
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
				},{
					label: '长度（m）',
					prop: 'hcaLength'
				},{
					label: '起始里程（m）',
					prop: 'beginMileage'
				},{
					label: '终止里程（m）',
					prop: 'endMileage'
				},{
					label: '地区等级',
					prop: 'regionLevel',
					format: function (val) {
						if (val == 0) {
							return '-'
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
				},{
					label: '影响半径',
					prop: 'impactRadius'
				},{
					label: '暴露半径',
					prop: 'exposureRadius'
				},{
					label: '人居（户）',
					prop: 'population'
				},{
					label: '特定场所（个）',
					prop: 'specificProduction'
				},{
					label: '易燃易爆场所（个）',
					prop: 'flammableExplosivePlace'
				}],
				tableConfig: {
					buttons: {
						fixed: 'right',
						list: [{
							size: 'normal',
							label: '同步',
							key: 'sync'
						}],
						width: '100px'
					}
				},
				pipeList: [],
			}
		},
		watch: {
			date (val) {
				if (Array.isArray(val)) {
					this.searchForm.startTime = val[0] || "";
					this.searchForm.endTime = val[1] || "";
				} else {
					this.searchForm.startTime = "";
					this.searchForm.endTime = "";
				}
			},
		},
		computed: {
			mapRef () {
				return this.$refs['mixTableRef'].$refs['basemap'];
			},
		},
		created () {
			this.getPipeList();
		},

		methods: {
			onTableGetData (data) {
				this.mapRef.pipeRadiusRemove();
				this.mapRef.pipeRender(data);
			},
			handleSearch () {
				this.$refs['table'].refresh();
			},
			handleReset () {
				this.searchForm = {
					endTime: "",
					startTime: "",
					keyWords: "",
					pipeCode: ""
				}
				this.date = [];
				this.$nextTick(this.handleSearch);
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
			tableCommand (key,row) {
				switch (key) {
					case 'sync':
						this.handleSync(row);
						break;
				}
			},
			async handleSync ({ taskId,pipeCode }) {
				const { code,data } = await syncData({
					taskId: taskId,
					pipeCode: pipeCode
				})
				if (code === 200) {
					this.getPipeList();
					this.$message.success(data);
				}
			},
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
		
		#map {
			height: 380px;
			background-color: #000;
		}

		.table-wrapper {
			height: calc(100% - 390px);
			width: 100%;
		}
	}

}
</style>
