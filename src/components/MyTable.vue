<template>
<el-table
	height="100%"
	ref="ElTable"
	border
	v-bind="$attrs"
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
						pickDataAttrs(scope.row,item.dataAttrs),
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
</template>

<script>
	import compLifecycleBlock from '@/mixins/compLifecycleBlock';
	import { pickDataAttrs,pickAttrs } from '@/utils/misc'
	export default {
		name: "MyTable",
		components: {},
		mixins: [compLifecycleBlock()],
		props: {
			columns: {
				type: Array,
				required: true
			}
		},
		data () {
			return {};
		},
		computed: {},
		watch: {},
		created () { },
		mounted () { },
		methods: {
			pickDataAttrs,
			pickAttrs,
		},
	}
</script>
