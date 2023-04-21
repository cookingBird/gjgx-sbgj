<template>
	<main>
		<div class="search-bar shadow-content">
			<el-form :model="searchForm" :inline="true">
				<el-form-item>
					<el-input v-model="searchForm.keyWords" placeholder="请输入任务名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
						range-separator="至" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button type="primary" @click="handleReset">重置</el-button>
					<el-button type="primary" @click="handleTaskContrast" :disabled="taskContrastDisable">对比分析</el-button>
					<el-button type="primary" @click="handleBatchSync" :disabled="batchSyncDisable">同步</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="page-content">
			<div class="page-content-left shadow-content">
				<el-scrollbar>
					<pipe-selector :optionsKey="{ title: 'name', key: 'code', children: 'children' }" :data="leftTreeData"
						:defaultOpen="true" @select="handleTreeSelect" :defaultSelect="selectInfo?.code"></pipe-selector>
				</el-scrollbar>
			</div>
			<div class="page-content-right shadow-content">
				<MixTable v-if="loaded" ref="mixTableRef" :url="tableReqUrl" :tableColumns="tableColumns" :config="mixTableCfg"
					:query="searchForm" @onData="onTableGetData" @handleCommand="tableCommand"
					@selection-change="handleSelectionChange">
				</MixTable>
			</div>
		</div>
	</main>
</template>

<script>
import { syncData, queryOrgList, hgcResultSyncPrompt } from '@/api/result';
import { arrHasRepeatValue } from '@/utils/tool';
import MixTable from '@/components/mixTable';
import PipeSelector from '@/components/pipeSelector';
import * as Misc from '@/utils/misc'

export default {
	components: {
		MixTable,
		PipeSelector
	},
	data() {
		return {
			selectRows: [],
			loaded: false,
			leftTreeData: [],
			tableReqUrl: window.URL_CONFIG.baseUrl + '/result/taskList',
			date: [],
			total: 0,
			selectInfo: null,
			searchForm: {
				endTime: "",
				startTime: "",
				keyWords: "",
				orgCode: "",
				pipeSegmentCode: "",
			},
			mixTableCfg: {
				switcher: false,
				index: true,
				selection: true,
				class: "my-el-table-ctx",
				buttons: {
					fixed: 'right',
					list: [
						{
							size: 'normal',
							label: '详情',
							key: 'info'
						},
						{
							size: 'normal',
							label: '同步',
							key: 'sync',
							show: ({ hasSyncButton }) => {
								return hasSyncButton === 1;
							}
						}
					],
					width: '100px'
				},
			},
			tableColumns: [{
				label: '任务名称',
				prop: 'taskName'
			}, {
				label: '创建时间',
				prop: 'createTime'
			}, {
				label: '管线名称',
				prop: 'pipeSegmentName'
			}, {
				label: '起点',
				prop: 'beginCode'
			}, {
				label: '终点',
				prop: 'endCode'
			}, {
				label: '识别成果',
				prop: 'recognitionResults',
			}, {
				label: '长度（m）',
				prop: 'hcaLength'
			}, {
				label: '影响半径(m)',
				prop: 'impactRadius'
			}, {
				label: '暴露半径(m)',
				prop: 'exposureRadius'
			}],
		}
	},
	watch: {
		date(val) {
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
		mapRef() {
			return this.$refs['mixTableRef'].$refs['basemap'];
		},
		tableRef() {
			return this.$refs['mixTableRef'].$refs['table'];
		},
		taskContrastDisable() {
			const uniqueField = 'pipeSegmentCode';
			return !(this.selectRows.length > 1 && Misc.reduceFiledEqual(this.selectRows, uniqueField));
		},
		batchSyncDisable() {
			let hasSync = [];
			const valueArr = this.selectRows.map(item => {
				item.hasSyncButton === 1 && hasSync.push(item);
				return item.pipeSegmentCode;
			});
			return !this.selectRows.length || !arrHasRepeatValue(valueArr) || !(hasSync.length === this.selectRows.length);
		},
	},
	created() {
		this.getTreeData();
	},
	methods: {
		async getTreeData() {
			const { code, data } = await queryOrgList();
			if (code === 200) {
				this.leftTreeData = data;
				data.length && this.handleTreeSelect(data[0], true);
			}
		},
		//分析对比
		handleTaskContrast() {
			const selectRows = this.selectRows;
			this.$router.push({
				path: '/DiscernResultManage/contrast',
				query: {
					taskIds: selectRows.map(pipe => pipe.id).join(','),
					pipeSegmentCode: selectRows[0].pipeSegmentCode
				}
			})
		},
		handleTreeSelect({ code, type }, init = false) {
			this.selectInfo = {
				code, type
			}
			if (type === 1) {
				this.searchForm.orgCode = code;
				this.searchForm.pipeSegmentCode = "";
			} else {
				this.searchForm.orgCode = "";
				this.searchForm.pipeSegmentCode = code;
			}
			if (init) {
				this.loaded = true;
				return;
			}
			this.handleSearch();
		},
		handleSelectionChange(val) {
			this.selectRows = val;
		},
		onTableGetData(data) {
			this.mapRef.pipeRadiusRemove();
			this.mapRef.pipeRender(data);

			let ghgqs = [];
			data.forEach(item => {
				ghgqs = ghgqs.concat(item.highWkt);
			})
			this.mapRef.sectionLevelRender(ghgqs, 'higLevel');
		},
		handleSearch() {
			this.tableRef.refresh();
		},
		handleReset() {
			this.searchForm.endTime = "";
			this.searchForm.startTime = "";
			this.searchForm.keyWords = "";
			this.date = [];
			this.$nextTick(this.handleSearch);
		},
		tableCommand(key, row) {
			switch (key) {
				case 'sync':
					this.handleSync([row]);
					break;
				case 'info':
					this.$router.push({
						path: '/DiscernResultManage/detail',
						query: Misc.pickFileds(row, ['id', 'pipeSegmentCode'])
					})
					break;
			}
		},
		handleBatchSync() {
			this.handleSync(this.selectRows);
		},
		async handleSync(params) {
			const { code, data, msg } = await hgcResultSyncPrompt(params);
			if (code === 200) {
				submit();
			} else {
				this.$confirm(msg, '操作提示', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(() => {
					submit();
				}).catch(() => { })
			}

			async function submit() {
				const { code, data } = await syncData(params)
				if (code === 200) {
					this.getPipeList();
					this.$message.success(data);
				}
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
		width: 100%;
		display: flex;

		.page-content-left {
			width: 400px;
			height: 100%;
			margin-right: 10px;
			padding: 8px;

			::v-deep .el-scrollbar {
				height: 100%;
				background-color: #EEF2F6;

				.el-scrollbar__wrap {
					overflow-x: hidden;
				}
			}
		}

		.page-content-right {
			overflow: visible;
			flex: 1;
		}

	}

}
</style>
