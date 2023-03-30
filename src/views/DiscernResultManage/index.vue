<template>
	<main>
		<div class="search-bar shadow-content">
			<el-form :model="searchForm" :inline="true">
				<el-form-item>
					<el-input placeholder="请输入任务名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-select placeholder="请选择管线名称" clearable></el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
						range-separator="至"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
					<el-button type="primary">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="page-content m-t-10">
			<div id="map">
				<base-map></base-map>
			</div>
			<div class="table-wrapper">
				<common-table ref="table" :tableColumns="tableColumns" :url="tableRequestAPI" :query="searchForm"
					:config="tableConfig" @handleCommand="tableCommand">
				</common-table>
			</div>
		</div>
	</main>
</template>

<script>
import Map from '@/components/Map.vue';
export default {
	components: {
		BaseMap: Map
	},
	data() {
		return {
			total: 0,
			searchForm: {
				pageNo: 1,
				pageSize: 10
			},
			tableColumns: [{
				label: '任务名称',
				prop: ''
			}, {
				label: '识别时间',
				prop: ''
			}, {
				label: '所属管线',
				prop: ''
			}, {
				label: '高后果区编号',
				prop: ''
			}, {
				label: '是否高后果区',
				prop: ''
			}, {
				label: '等级',
				prop: ''
			}, {
				label: '长度（m）',
				prop: ''
			}, {
				label: '起始里程（m）',
				prop: ''
			}, {
				label: '终止里程（m）',
				prop: ''
			}, {
				label: '地区等级',
				prop: ''
			}, {
				label: '影响半径',
				prop: ''
			}, {
				label: '暴露半径',
				prop: ''
			}, {
				label: '人居（户）',
				prop: ''
			}, {
				label: '特定场所（个）',
				prop: ''
			}, {
				label: '易燃易爆场所（个）',
				prop: ''
			}],
			tableConfig: {
				buttons: {
					fixed: 'right',
					list: [{
						size: 'normal',
						label: '同步'
					}],
					width: '100px'
				}
			},
		}
	},

	mounted() {

	},

	methods: {
		tableCommand() {

		},
		tableRequestAPI() { }
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
