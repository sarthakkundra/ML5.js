     // Your code will go here
      // open up your console - if everything loaded properly you should see 0.9.0
      console.log('ml5 version:', ml5.version);

      let poses = [];
      var video = document.getElementById('video');
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
     
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          video.srcObject=stream;
          video.play();
        });
      }

      function drawCameraIntoCanvas() {
          ctx.drawImage(video,  0, 0, 640, 480);
          drawKeyPoints();
          drawSkeleton();
          window.requestAnimationFrame(drawCameraIntoCanvas);
      }

      drawCameraIntoCanvas();
 
      
      const poseNet = ml5.poseNet(video, modelLoaded);

      function modelLoaded() {
          console.log('I think it works');
          poseNet.singlePose(video);
      }

      poseNet.on('pose', (results) => {
            poses = results;
      })
  
      function drawKeyPoints () {
          for(var i = 0; i < poses.length; i++){

            for(var j = 0; j < poses[i].pose.keypoints.length; j++){
                const keyPoint = poses[i].pose.keypoints[j];

                if(keyPoint.score > 0.2){
                    ctx.strokeStyle = `rgb(
                        0,
                        ${Math.floor(255 - 42.5 * i)},
                        ${Math.floor(255 - 42.5 * j)})`;

                    ctx.beginPath();
                    ctx.arc(keyPoint.position.x, keyPoint.position.y, 10, 0, 2*Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
            }
          }
      }

      function drawSkeleton() {

        for(var i = 0; i < poses.length; i++){

            for(var j = 0; j < poses[i].skeleton.length; j++){
                const startPoint =  poses[i].skeleton[j][0];
                const endPoint = poses[i].skeleton[j][1];

                ctx.strokeStyle = `rgb(
                    0,
                    ${Math.floor(255 - 42.5 * i)},
                    ${Math.floor(255 - 42.5 * j)})`;
                ctx.beginPath();
                ctx.moveTo(startPoint.position.x, startPoint.position.y);
                ctx.lineTo(endPoint.position.x, endPoint.position.y);
                ctx.stroke();
            }
        }
      }

      //preloader
      const preloader = document.querySelector('.preloader');

      const fadeEffect = setInterval(() => {
        // if we don't set opacity 1 in CSS, then
        // it will be equaled to "" -- that's why
        // we check it, and if so, set opacity to 1
        if (!preloader.style.opacity) {
          preloader.style.opacity = 1;
        }
        if (preloader.style.opacity > 0) {
          preloader.style.opacity -= 0.1;
        } else {
          clearInterval(fadeEffect);
        }
      }, 100);
