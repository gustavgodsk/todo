<script>
  export let handleScale;
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let offsetX = 0;
	let offsetY = 0;

	let scale = 1;
	const minScale = 0.1;
	const maxScale = 3;
	const zoomSpeed = 0.0015;

	let container;

	function handleMouseDown(event) {
		isDragging = true;
		startX = event.clientX - offsetX;
		startY = event.clientY - offsetY;
	}

	function handleMouseMove(event) {
		if (!isDragging) return;
		offsetX = event.clientX - startX;
		offsetY = event.clientY - startY;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleMouseLeave() {
		isDragging = false;
	}

	function handleWheel(event) {
		event.preventDefault();

		const { clientX, clientY } = event;
		const rect = container.getBoundingClientRect();
		const mouseX = (clientX - rect.left);
		const mouseY = (clientY - rect.top);

		const delta = -event.deltaY * zoomSpeed;
		const newScale = Math.min(maxScale, Math.max(minScale, scale + delta));
		const zoomFactor = newScale / scale;

		offsetX -= (mouseX - offsetX) * (zoomFactor - 1);
		offsetY -= (mouseY - offsetY) * (zoomFactor - 1);

		scale = newScale;
    handleScale(scale)
	}
</script>

<!-- Main pan+zoom wrapper -->
<div
	class="w-screen h-screen overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:mouseleave={handleMouseLeave}
	on:wheel={handleWheel}
>

	<div
		bind:this={container}
		class="absolute top-0 left-0 relative"
		style="transform: translate({offsetX}px, {offsetY}px);"
	>
  	<div
		style="
			position: absolute;
			left: {300 * scale}px;
			top: {100 * scale}px;
			width: {120 * scale}px;
			height: {60 * scale}px;
			font-size: {14 * scale}px;
		"
		class="bg-green-300 border"
	></div>

		<slot {scale}></slot>
	</div>
</div>
