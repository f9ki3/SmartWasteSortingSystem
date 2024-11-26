const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const noCameraMessage = document.getElementById('noCameraMessage');
const ctx = canvas.getContext('2d');
const itemScan = document.getElementById('itemScan'); // <p id="itemScan">Scanning</p>
let countdownTimer = 10; // Countdown duration in seconds
let countdownInterval;
let isScanning = false;

const URL = "./static/model_web/"; // Path to your Teachable Machine model
let model, maxPredictions;

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
    video.style.display = "block"; // Show the video element if webcam is available
    canvas.style.display = "block"; // Show the canvas for drawing detection boxes
}

// Load the Teachable Machine model
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Detect objects and draw bounding boxes
async function detectFrame() {
    const predictions = await model.predict(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        if (prediction.probability > 0.5) { // Only draw for predictions above a threshold
            const bbox = calculateBoundingBox(prediction); // Placeholder function for bounding box logic

            // Draw bounding box
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 4;
            ctx.strokeRect(
                bbox.x,
                bbox.y,
                bbox.width,
                bbox.height
            );

            // Draw label and score
            ctx.font = "18px Arial";
            ctx.fillStyle = "#00FF00";
            ctx.fillText(
                `${prediction.className} - ${Math.round(prediction.probability * 100)}%`,
                bbox.x,
                bbox.y > 20 ? bbox.y - 10 : 10
            );

            // If the object belongs to a recognized class and scanning is not already in progress
            if (['Plastic', 'Paper', 'Metal', 'Waste'].includes(prediction.className) && !isScanning) {
                startScanning(prediction.className); // Start scanning when detected
            }
        }
    });

    // Keep detecting
    requestAnimationFrame(detectFrame);
}

// Placeholder: Calculate bounding box based on prediction
function calculateBoundingBox(prediction) {
    return { x: 50, y: 50, width: 500, height: 400 }; // Example static box
}

// Start scanning, with a 5-second delay, then show the message, and initiate countdown
function startScanning(item) {
    isScanning = true;
    itemScan.textContent = "Preparing to scan...";

    // Delay the scanning by 5 seconds before starting
    setTimeout(() => {
        itemScan.textContent = `Scanning ${item}...`;

        // Clear the previous countdown, if any
        clearInterval(countdownInterval);
        
        // Start the countdown
        countdownTimer = 10; // Reset the countdown
        countdownInterval = setInterval(() => {
            itemScan.textContent = `Scanning ${item}... (${countdownTimer}s)`;
            countdownTimer--;

            // When countdown reaches 0, reset scanning
            if (countdownTimer <= 0) {
                clearInterval(countdownInterval);
                itemScan.textContent = "Scan complete!";
                // alert(`${item}`);
                sendData(item.toLowerCase());
                setTimeout(() => {
                    resetScanning();
                }, 5000);
            }
        }, 1000);
    }, 5000); // 5-second delay before starting the scanning process
}

// Reset scanning after countdown
function resetScanning() {
    setTimeout(() => {
        itemScan.textContent = "Scanning";
        isScanning = false;
    }, 3000); // Wait for 3 seconds before resetting
}

// Initialize everything
async function initialize() {
    const hasWebcam = await checkForWebcam();

    if (hasWebcam) {
        await setupWebcam();
        await loadModel();
        detectFrame();
    } else {
        // Show "No camera devices connected" message
        noCameraMessage.style.display = "block";
    }
}

initialize();
