<template>
	<ContentLayout>
		<template v-slot:header>
			<div class="relative px-2 py-2 action-header-ctx">
				<el-input
					class="inline-block w-24"
					placeholder="请输入标准名称"
				></el-input>
				<el-button class="ml-2 my-el-button">查询</el-button>
				<el-button class="my-el-button">重置</el-button>
				<el-upload
					class="absolute right-0 inline-block mr-2"
					:action="appCtx.makeUrl('/criterion/createOrUpdate/uploadFile')"
				>
					<el-button
						slot="trigger"
						class="my-el-button"
					>
						新增
					</el-button>
				</el-upload>
			</div>
		</template>
		<template v-slot:main>
			<div class="w-full h-full p-2">
				<el-table
					v-observe:tableEmptyRow
					v-observe:tableWrapperFix
					v-observe:tableCalcRow="{
							callback:calcRowCallback
						}"
					class="my-el-table-ctx"
					:data="data"
					border
				>
					<el-table-column
						type="index"
						width="90"
						label="序号"
						align="center"
					>
					</el-table-column>
					<el-table-column
						prop="standardName"
						label="标准名称"
						align="center"
					></el-table-column>
					<el-table-column
						prop="suitRange"
						label="适用范围"
						align="center"
					></el-table-column>
					<el-table-column
						prop="action"
						label="操作"
						align="center"
					>
						<template slot-scope="scope">
							<el-button class="my-el-button-none">
								编辑
							</el-button>
							<el-button class="my-el-button-none">
								删除
							</el-button>
							<el-button class="my-el-button-none">
								预览
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
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
	export default {
		components: { ContentLayout },
		inject: ['appCtx'],
		data () {
			return {
				currentPage: 1,
				data: [
					{
						standardName: '标准名称',
						suitRange: '适用范围',
					}
				]
			};
		},

		methods: {
			calcRowCallback (rowNum) {
				console.log('calcRowCallback------------------',rowNum)
			}
		},
};
</script>
