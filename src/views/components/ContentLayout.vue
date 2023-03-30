<template>
	<section class="gjgx-discern-container">
		<header class="shadow-content">
			<slot name="header"> This is Header </slot>
		</header>
		<main class="shadow-content">
			<slot name="main"> This is Main </slot>
		</main>
		<footer class="shadow-content">
			<slot name="footer"> This is Footer </slot>
		</footer>
	</section>
</template>


<style lang='css' scoped>
.gjgx-discern-container {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.gjgx-discern-container> :nth-child(1) {
	flex-grow: 0;
	position: relative;
	/* margin-top: 10px; */
}

.gjgx-discern-container> :nth-child(2) {
	flex-grow: 1;
	position: relative;
	/* margin-top: 10px; */
}

.gjgx-discern-container> :nth-child(3) {
	position: relative;
	flex-grow: 0;
}

.gjgx-discern-container> :not([hidden])~ :not([hidden]) {
	margin-top: 10px;
}

.gjgx-discern-container> :not([hidden]) {
	background-color: #ffffff;
}
</style>
