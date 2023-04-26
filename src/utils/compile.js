import Vue from 'vue';
import pipeInfoPop from '@/components/InfoPop.vue';

export function compileComponent(component, props) {
	const instance = (new Vue({ render: (h) => h(component, { props }) }));
	return instance.$mount().$el;
}


export function compilePop(props) {
	return compileComponent(pipeInfoPop, props)
}


// export function 

export default compilePop
