
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });

            console.log('Service worker registrado! 🤩', reg);
        } catch (err) {
            console.log('😢 Service worker registro falhou: ', err);
        }
    });
}


var constraints = { video: { facingMode: "user" }, audio: false };


const cameraView = document.querySelector("#camera-view"),
      cameraSensor = document.querySelector("#camera-sensor"),
      cameraTrigger = document.querySelector("#camera-trigger"),
      cameraOutput = document.querySelector("#camera-output");
      var constraints = { video: { facingMode: "user" }, audio: false };

 
      function cameraStart() {
          navigator.mediaDevices
              .getUserMedia(constraints)
              .then(function (stream) {
                  let track = stream.getTracks()[0];
                  cameraView.srcObject = stream;
              })
              .catch(function (error) {
                  console.error("Ocorreu um erro.", error);
              });
      }
      

      cameraTrigger.onclick = function () {
          cameraSensor.width = cameraView.videoWidth;
          cameraSensor.height = cameraView.videoHeight;
          cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
          cameraOutput.src = cameraSensor.toDataURL("image/webp");
          cameraOutput.classList.add("taken");
      };
      
      
      window.addEventListener("load", cameraStart, false);
      
