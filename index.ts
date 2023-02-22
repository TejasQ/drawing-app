const canvas = document.querySelector('canvas')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
ctx.strokeStyle = '#BADA55';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 10;

let isDrawing = false;
let workingPath: [number, number][] = [];
let finalPaths: [number, number][][] = [];

const draw = (e: MouseEvent) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    ctx.lineTo(e.clientX, e.clientY);
    workingPath.push([e.clientX, e.clientY]);
    ctx.stroke();
}

const startDrawing = (e: MouseEvent) => {
    isDrawing = true;
    draw(e);
}

const stopDrawing = () => {
    isDrawing = false;
    finalPaths.push(workingPath);
    workingPath = [];
    savePaths();
}

const savePaths = () => {
    localStorage.setItem('paths', JSON.stringify(finalPaths));
}

const loadPaths = () => {
    try {
        const paths = JSON.parse(localStorage.getItem('paths')!);
        if (!paths) return;
        finalPaths = paths;
    } catch { }
}

const drawInitialPaths = () => {
    loadPaths();
    let currentPath = 0;
    let currentPoint = 0;
    const draw = () => {
        if (currentPath >= finalPaths.length) return;
        if (currentPoint >= finalPaths[currentPath].length) {
            currentPath++;
            currentPoint = 0;
        }
        ctx.beginPath();
        ctx.moveTo(finalPaths[currentPath][currentPoint][0], finalPaths[currentPath][currentPoint][1]);
        ctx.lineTo(finalPaths[currentPath][currentPoint][0], finalPaths[currentPath][currentPoint][1]);
        ctx.stroke();
        currentPoint++;
        requestAnimationFrame(draw);
    }
    draw();
}

drawInitialPaths();

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
