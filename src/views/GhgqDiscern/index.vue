<template>
	<main>
		<div class="search-bar shadow-content">
			<el-form
				class="relative"
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
						v-model="searchForm.status"
						placeholder="请选择识别状态"
						clearable
					>
						<el-option
							v-for="item in statusOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker
						v-model="searchForm.time"
						type="daterange"
						value-format="yyyy-MM-dd HH:mm:ss"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						range-separator="至"
					></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="$refs.table.refresh()"
					>查询</el-button>
					<el-button
						type="primary"
						@click="onRest"
					>重置</el-button>
				</el-form-item>
				<el-button
					type="primary"
					class="absolute inline-block right-2"
					@click="()=>{dialogType=1;dialogVisible=true;formData.id=void 0;}"
				>新增</el-button>
			</el-form>
		</div>
		<div class="page-content m-t-10">
			<common-table
				ref="table"
				class="my-table-wrapper"
				:tableColumns="tableColumns"
				:url="appCtx.makeUrl('task/list')"
				reqMethods="POST"
				:config="tableConfig"
				:query="querySearch"
			>
				<template #operate="{ row }">
					<el-button
						type="text"
						v-show="taskIsFinish(row)"
						@click="onEdit(row)"
					>编辑</el-button>
					<el-button
						type="text"
						v-show="taskIsFinish(row)"
						@click="onSync(row)"
					>数据同步</el-button>
					<el-button
						type="text"
						v-show="!taskIsFinish(row)"
						@click="onContinue(row)"
					>继续识别</el-button>
					<el-button
						v-show="taskIsFinish(row)"
						type="text"
						@click="onPreview(row)"
					>查看报告</el-button>
					<el-button
						type="text"
						@click="onDelete(row)"
					>删除</el-button>
				</template>
			</common-table>
		</div>
		<el-dialog
			v-if="dialogVisible"
			:title="dialogTitle"
			:visible.sync="dialogVisible"
			width="30%"
		>
			<el-form
				:model="formData"
				ref="addForm"
				label-width="110px"
				:rules="rules"
			>
				<el-form-item
					label="任务名称："
					prop="taskName"
				>
					<el-input
						placeholder="请输入"
						v-model="formData.taskName"
					></el-input>
				</el-form-item>
				<el-form-item
					label="任务描述："
					prop="taskDescription"
				>
					<el-input
						type="textarea"
						autosize
						placeholder="请输入"
						v-model="formData.taskDescription"
					></el-input>
				</el-form-item>
				<div class="flex justify-center">
					<el-button
						type="primary"
						@click="onSubmit"
					>确定</el-button>
					<el-button @click="dialogVisible = false">取消</el-button>
				</div>
			</el-form>
		</el-dialog>
		<el-dialog
			title="标准预览"
			v-if="previewDialogVisible"
			:visible.sync="previewDialogVisible"
			class="dialog-preview"
		>
			<pdf :src="pdfPath"></pdf>
		</el-dialog>
	</main>
</template>

<script>
	import * as Helper from './Helper'
	import pdf from 'vue-pdf'
	export default {
		components: { pdf },
		inject: ['appCtx'],
		data () {
			return {
				searchForm: {
					status: void 0,
					keyWords: '',
					time: ['','']
				},
				tableColumns: [
					{
						label: '任务名称',
						prop: 'taskName',
					},
					{
						label: '创建时间',
						prop: 'updateTime'
					},
					{
						label: '识别状态',
						prop: 'nodeName'
					},
					{
						label: '管线数量',
						prop: 'pipeLineTotal'
					},
					{
						label: '包含管道',
						prop: 'includePipeLine'
					},
					{
						label: '任务描述',
						prop: 'taskDescription'
					},
					{
						label: '识别成果',
						prop: 'recognitionResults'
					},
					{
						label: '操作',
						prop: 'operate'
					}
				],
				tableConfig: {
					border: true
				},
				dialogVisible: false,
				dialogType: 1,
				rules: {
					taskName: [{ required: true,message: '请输入' }],
					taskDescription: [{ required: true,message: '请输入' }],
				},
				formData: {
					"status": 0,
					"keyWords": "",
					time: ''
				},
				previewDialogVisible: false,
				pdfPath: '',
				statusOptions: [
					{
						value: 1,
						label: '分段'
					},
					{
						value: 2,
						label: '地区等级划分'
					},
					{
						value: 3,
						label: '高后果区识别'
					},
					{
						value: 4,
						label: '已完成'
					}
				],
			};
		},
		computed: {
			querySearch: {
				get () {
					function convertNull (res) {
						for (const key in res) {
							if (Object.hasOwnProperty.call(res,key)) {
								const element = res[key];
								res[key] = element === '' ? null : element
							}
						}
						return res;
					}
					const res = {
						...this.searchForm,
						startTime: this.searchForm.time[0],
						endTime: this.searchForm.time[1],
						taskId: ''
					}
					delete res.time
					return convertNull(res)
				},
			},
			dialogTitle () {
				return this.dialogType === 1 ? '新增' : this.dialogType === 2 ? '修改' : '其它'
			},
			taskIsFinish () {
				return (task) => task.status === 1
			}
		},
		watch: {
			querySearch (val) {
				console.log('watch querySearch',val)
			}
		},
		mounted () {
			console.log('boolean',Boolean(''))
		},

		methods: {
			/**
			 * @description 成果预览
			 */
			onPreview ({ pdfPath }) {
				this.pdfPath = pdfPath;
				this.previewDialogVisible = true;
			},
			/**
			 * @description 删除任务
			 */
			onDelete ({ id }) {
				Helper.remove(id).then(_ => {
					this.$refs.table.refresh();
					this.$message.success("删除成功")
				},_ => {
					this.$message.error("删除失败")
				})
			},
			/**
			 * @description 新增、编辑任务
			 */
			onSubmit () {
				this.$refs.addForm.validate().then(res => {
					Helper.addOrUpdateTask(this.formData).then(res => {
						this.$router.push({
							path: '/DiscernSteps/choose',
							query: res
						})
					})
				})
			},
			/**
			 * @description 同步数据
			 */
			onSync (row) {
				Helper.syncData(row).then(
					_ => {
						this.$message.success('同步成功')
					},
					_ => {
						this.$message.error('同步失败')
					}
				)
			},
			/**
			 * @description 继续识别，跳转到识别阶段
			 */
			onContinue (row) {
				const step = row.node;
				let path;
				switch (step) {
					case 0: {
						path = '/DiscernSteps/choose'
						break;
					}
					case 1: {
						path = '/DiscernSteps/section'
						break;
					}
					case 2: {
						path = '/DiscernSteps/level'
						break;
					}
					case 3: {
						path = '/DiscernSteps/discern'
						break;
					}
				}
				console.log('onContinue------------',row)
				this.$router.push({
					path: path,
					query: {
						id: row.id,
						taskName: row.taskName
					}
				})
			},
			/**
			 * @description 编辑已识别完成的任务，跳转到选择管线页面
			 */
			onEdit (row) {
				this.$router.push({
					path: '/DiscernSteps/choose',
					query: {
						...row
					}
				})
			},
			onRest () {
				this.searchForm = {
					status: void 0,
					keyWords: '',
					time: ['','']
				};
				setTimeout(this.$refs.table.refresh);
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
		// background-color: #fff;
	}
}
</style>

<style>
	.my-table-wrapper>.gislife-table {
		background-color: #fff;
		border-radius: 4px;
		padding: 0px !important;
	}

	.my-table-wrapper>.gislife-table-pagination {
		background-color: #fff;
		border-radius: 4px;
		padding-top: 8px;
		padding-bottom: 8px;
	}
</style>
