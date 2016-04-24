export function startTracking (video, callback){
  var canvas, context, imageData, detector;

  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 600;

  detector = new AR.Detector();
  requestAnimationFrame(tick);

  function tick(){
    requestAnimationFrame(tick);

    if (video.readyState === video.HAVE_ENOUGH_DATA){
      snapshot();
      var markers = detector.detect(imageData);

      if (markers.length > 0) {
        callback(markers.map(function (marker) {
          return marker.corners;

          /*return {
            x : marker.corners[0].x, //(marker.corners[0].x + marker.corners[1].x + marker.corners[2].x + marker.corners[3].x) / 4,
            y : marker.corners[0].y //(marker.corners[0].y + marker.corners[1].y + marker.corners[2].y + marker.corners[3].y) / 4
          }*/
        }));
      }
    }
  }
  function snapshot(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  }
}