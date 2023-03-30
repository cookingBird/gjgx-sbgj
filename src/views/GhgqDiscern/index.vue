<template>
	<main>
		<div class="search-bar shadow-content">
			<el-form :model="searchForm" :inline="true">
				<el-form-item>
					<el-input placeholder="请输入任务名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-select placeholder="请选择识别状态" clearable></el-select>
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
			<common-table ref="table" :tableColumns="tableColumns" :url="tableRequestAPI" :query="searchForm">
				<template #operate="{ row }">
					<el-button type="text">编辑</el-button>
					<el-button type="text">数据同步</el-button>
					<el-button type="text">继续识别</el-button>
					<el-button type="text">查看报告</el-button>
					<el-button type="text">删除</el-button>
				</template>
			</common-table>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			searchForm: {

			},
			tableColumns: [{
				label: '任务名称',
				prop: '',
			}, {
				label: '创建时间',
				prop: ''
			}, {
				label: '识别状态',
				prop: ''
			}, {
				label: '管线数量',
				prop: ''
			}, {
				label: '包含管道',
				prop: ''
			}, {
				label: '任务描述',
				prop: ''
			}, {
				label: '识别成果',
				prop: ''
			}, {
				label: '操作',
				prop: 'operate'
			}]
		};
	},

	mounted() {

	},

	methods: {

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
