
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Check if a webcam is available
async function checkForWebcam() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
}

// Set up the webcam feed
async function setupWebcam() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

// Load the model and start detection
async function loadModelAndDetect() {
    const model = await cocoSsd.load();
    detectFrame(model);
}

// Detect objects and draw bounding boxes
async function detectFrame(model) {
    const predictions = await model.detect(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        // Draw bounding box
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 4;
        ctx.strokeRect(
            prediction.bbox[0],
            prediction.bbox[1],
            prediction.bbox[2],
            prediction.bbox[3]
        );

        // Draw label and score
        ctx.font = "18px Arial";
        ctx.fillStyle = "#00FF00";
        ctx.fillText(
            `${prediction.class} - ${Math.round(prediction.score * 100)}%`,
            prediction.bbox[0],
            prediction.bbox[1] > 20 ? prediction.bbox[1] - 10 : 10
        );
    });

    // Keep detecting
    requestAnimationFrame(() => detectFrame(model));
}

// Initialize everything
async function initialize() {
    const hasWebcam = await checkForWebcam();
    
    if (hasWebcam) {
        await setupWebcam();
        loadModelAndDetect();
    } else {
        console.log("No webcam detected.");
        // Do nothing if no webcam is available
    }
}

initialize();