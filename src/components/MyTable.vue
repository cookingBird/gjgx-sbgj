<template>
<div class="gislife-table-pagination">
	<div
		class="gislife-table-pagination__table"
		:class="[!pagination ? 'pb-1' : '']"
	>
		<el-table
			height="100%"
			ref="ElTable"
			border
			v-bind="$attrs"
			:data="tableData"
			v-on="$listeners"
		>
			<template v-for="(item, index) in columns">
				<el-table-column
					v-if="item.slotIs && item.slotIs !== 'slot'"
					:key="index"
					v-bind="item"
				>
					<template v-slot:default="scope">
						<el-input
							v-if="item.slotIs === 'input'"
							v-model="scope.row[item.prop]"
							v-bind="item.slotProps&&item.slotProps(scope)"
						/>
						<el-button
							v-else-if="item.slotIs === 'button' || item.slotIs === 'btn'"
							v-bind="item.slotProps&&item.slotProps(scope)"
							v-on="mapListeners(item.listeners,(val)=>val(scope))"
						>
							{{item.slotProps&&item.slotProps(scope).label}}
						</el-button>
						<div
							v-else-if="item.slotIs === 'div'"
							v-bind="Object.assign({},
								pickAttrs(scope.row,item.attrs),
								item.slotProps&&item.slotProps(scope))"
						>
							{{ item.formatter ? item.formatter(scope.row[item.prop]) : scope.row[item.prop] }}
						</div>
					</template>
				</el-table-column>
				<el-table-column
					v-else-if="item.slotIs === 'slot'"
					v-bind="item"
					:key="index"
				>
					<template v-slot:default="scope">
						<slot
							:name="item[item.prop]"
							v-bind="scope"
						></slot>
					</template>
				</el-table-column>
				<el-table-column
					v-else-if="item.formatter"
					v-bind="item"
					:key="index"
				>
					<template v-slot:default="scope">
						{{ item.formatter(scope.row[item.prop])}}
					</template>
				</el-table-column>
				<el-table-column
					v-else
					v-bind="item"
				></el-table-column>
			</template>
		</el-table>
	</div>
	<div
		v-if="pagination"
		class="gislife-table-pagination__pagination"
	>
		<el-pagination
			:background="paginationCfg.background"
			:small="paginationCfg.small"
			:total="totalItems"
			:page-size.sync="pageParams.pageSize"
			:pager-count="paginationCfg.pagerCount"
			:current-page.sync="pageParams.pageNo"
			:page-sizes="paginationCfg.pageSizes"
			:prev-text="paginationCfg.prevText"
			:next-text="paginationCfg.nextText"
			:layout="paginationCfg.layout"
			v-on="$listeners"
		></el-pagination>
	</div>
</div>
</template>

<script>
	import compLifecycleBlock from '@/mixins/compLifecycleBlock';
	import { pickAttrs } from '@/utils/misc'
	export default {
		name: "MyTable",
		components: {},
		mixins: [compLifecycleBlock()],
		props: {
			columns: {
				type: Array,
				required: true
			},
			pagination: {
				type: Object,
			},
			data: Array,
			autoPage: Boolean
		},
		data () {
			return {
				pageParams: this.pagination?.pageParams || { pageNo: 1,pageSize: 10 },
			};
		},
		computed: {
			tableData () {
				const pageSize = this.pageParams.pageSize;
				const currPage = this.pageParams.pageNo;
				return this.autoPage
					? this.data.slice((currPage - 1) * pageSize,(currPage * pageSize) - 1)
					: this.data
			},
			paginationCfg () {
				return Object.assign({
					layout: 'total, sizes, prev, pager, next, jumper',
					background: true,
					pageSizes: [10,30,60,80,100],
					pagerCount: 7,
				},this.pagination)
			},
			totalItems () {
				return this.autoPage
					? this.data.length
					: this.pageParams.total
			},
			getPageInfo () {
				return this.pageParams
			}
		},
		methods: {
			pickAttrs,
		},
	}
</script>

<style lang="css">
	.gislife-table-pagination {
		@apply w-full h-full max-h-full max-w-full flex flex-col space-y-1;
	}

	.gislife-table-pagination__table {
		@apply flex-grow px-1;
	}

	.gislife-table-pagination__pagination {
		@apply flex justify-center flex-grow-0 flex-shrink-0 p-2;
	}
</style>
