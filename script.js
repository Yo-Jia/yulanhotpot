let video = document.getElementById("video");
    let gifCanvas = document.getElementById("gifCanvas");
    let photoCanvas = document.getElementById("photoCanvas");
    let snap = document.getElementById("snap");
    let retake = document.getElementById("retake");
    let downloadBtn = document.getElementById("download");
    let frameThickness = 10;
    let frameColor = "#ffffff";
    let logoImage = new Image();
    logoImage.src = "logo.png";
    let likeImage = new Image();
    likeImage.src = "like.png";
    let context = photoCanvas.getContext("2d");
    let switchBtn=document.getElementById("switchCamera")

    window.addEventListener("resize", handleResize);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    width: { ideal: gifCanvas.width },
                    facingMode: "environment",
                },
            })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            });
    }

    let currentCamera = "user"; // Start with the user-facing camera

    document.getElementById("switchCamera").addEventListener("click", function () {
        if (currentCamera === "user") {
            currentCamera = "environment";
        } else {
            currentCamera = "user";
        }
        switchCamera();
    });

    function switchCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            let srcObject = video.srcObject;
            if (srcObject) {
                srcObject.getTracks().forEach(track => track.stop());
            }

            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        width: { ideal: gifCanvas.width },
                        facingMode: currentCamera,
                    }
                })
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();
                });
        }
    }

    console.log("connected");

    function drawFrame(ctx) {
        let relativeFrameThickness = frameThickness;
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, ctx.canvas.width, relativeFrameThickness); // Top border
        ctx.fillRect(
            0,
            ctx.canvas.height - relativeFrameThickness,
            ctx.canvas.width,
            relativeFrameThickness + 100
        ); // Bottom border
        ctx.fillRect(0, 0, relativeFrameThickness, ctx.canvas.height); // Left border
        ctx.fillRect(
            ctx.canvas.width - relativeFrameThickness,
            0,
            relativeFrameThickness,
            ctx.canvas.height
        ); // Right border
    }

    function handleResize() {
        let dpr = window.devicePixelRatio || 10;
        let containerWidth = video.parentElement.offsetWidth * dpr;
        let containerHeight = video.parentElement.offsetHeight * dpr;
        let videoAspectRatio = video.videoWidth / video.videoHeight;

        let canvasWidth, canvasHeight;
        if (containerWidth / containerHeight > videoAspectRatio) {
            canvasWidth = containerHeight * videoAspectRatio;
            canvasHeight = containerHeight;
        } else {
            canvasWidth = containerWidth;
            canvasHeight = containerWidth / videoAspectRatio;
        }

        photoCanvas.width = canvasWidth;
        photoCanvas.height = canvasHeight;
        gifCanvas.width = canvasWidth;
        gifCanvas.height = canvasHeight;

        context = photoCanvas.getContext("2d");
        context.scale(dpr, dpr);
        handleResize();
    }

    video.addEventListener("loadedmetadata", function () {
        let dpr = window.devicePixelRatio || 1;

        let videoAspectRatio = video.videoWidth / video.videoHeight;

        const container = video.parentElement;
        let containerWidth = container.offsetWidth * dpr;
        let containerHeight = container.offsetHeight * dpr;

        let canvasWidth, canvasHeight;
        if (containerWidth / containerHeight > videoAspectRatio) {
            canvasWidth = containerHeight * videoAspectRatio;
            canvasHeight = containerHeight;
        } else {
            canvasWidth = containerWidth;
            canvasHeight = containerWidth / videoAspectRatio;
        }

        photoCanvas.width = canvasWidth;
        photoCanvas.height = canvasHeight;
        gifCanvas.width = canvasWidth;
        gifCanvas.height = canvasHeight;

        context = photoCanvas.getContext("2d");
        context.scale(dpr, dpr);
        handleResize();
    });

    gifler("fish.gif").frames(
        gifCanvas,
        function (ctx, frame) {
            ctx.canvas.width = gifCanvas.width;
            ctx.canvas.height = gifCanvas.height;
            ctx.drawImage(frame.buffer, 0, 0, gifCanvas.width, gifCanvas.height);
            let frameThickness = 10;
            let frameColor = "#ffffff";
            ctx.fillStyle = frameColor;
            ctx.fillRect(0, 0, gifCanvas.width, frameThickness); // Top border
            ctx.fillRect(0, gifCanvas.height - 200, gifCanvas.width, 200); // Bottom border
            ctx.fillRect(0, 0, frameThickness, gifCanvas.height); // Left border
            ctx.fillRect(
                gifCanvas.width - frameThickness,
                0,
                frameThickness,
                gifCanvas.height
            ); // Right border

            let logoWidth = 350;
            let logoHeight = 480;
            let logoX = gifCanvas.width - logoWidth - 50;
            let logoY = gifCanvas.height - logoHeight - 10;
            ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

            let likeWidth = 100;
            let likeHeight = 100;
            let likeX = gifCanvas.width - likeWidth - 150;
            let likeY = gifCanvas.height - likeHeight - logoHeight - 10;
            ctx.drawImage(likeImage, likeX, likeY, likeWidth, likeHeight);
        },
        true
    );

    snap.addEventListener("click", function () {
        photoCanvas.width = video.videoWidth * 10;
        photoCanvas.height = video.videoHeight * 10;
        context.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);
        context.drawImage(gifCanvas, 0, 0, photoCanvas.width, photoCanvas.height);

        photoCanvas.style.display = "block";
        container.classList.add("scale-down");
        video.style.display = "none";
        gifCanvas.style.display = "none";
        switchBtn.style.display = "none";
        snap.style.display = "none";
        retake.style.display = "block";
        downloadBtn.style.display = "block";
    });

    retake.addEventListener("click", function () {
        video.style.display = "block";
        gifCanvas.style.display = "block";
        photoCanvas.style.display = "none";
        snap.style.display = "block";
        switchBtn.style.display="block";
        retake.style.display = "none";
        downloadBtn.style.display = "none";
        
        container.classList.remove("scale-down");
    });

    downloadBtn.addEventListener("click", function () {
        let downloadUrl = photoCanvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "image.png";
        link.click();
    });