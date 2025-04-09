document.addEventListener("DOMContentLoaded", () => {
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");
    const page3 = document.getElementById("page3");
    const continueBtn = document.getElementById("continueBtn");
    const captureBtn = document.getElementById("captureBtn");
    const video = document.getElementById("video");
    const overlay = document.getElementById("overlay");
    const statusMessage = document.getElementById("statusMessage");
    const faceDetection = new FaceDetection.FaceDetection({ model: 'short' });

    // Navigate to Camera Page
    continueBtn.addEventListener("click", () => {
        page1.classList.add("hidden");
        page2.classList.remove("hidden");

        // Start Camera
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.srcObject = stream;
        });
    });

    // Capture Photo
    captureBtn.addEventListener("click", async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Detect Face
        const faces = await faceDetection.detect(canvas);
        if (faces.length > 0) {
            const base64Image = canvas.toDataURL();
            sendImage(base64Image);
        } else {
            alert("No face detected! Please try again.");
        }
    });

    // Send Image to API
    async function sendImage(image) {
        try {
            const response = await axios.post("https://www.x.com", { image });
            if (response.status === 200) {
                displayResult(true);
            } else {
                displayResult(false);
            }
        } catch (error) {
            displayResult(false);
        }
    }

    // Display Result
    function displayResult(success) {
        page2.classList.add("hidden");
        page3.classList.remove("hidden");
        statusMessage.textContent = success ? "Okay to Proceed" : "Please Check";
        statusMessage.style.color = success ? "green" : "red";
    }
});