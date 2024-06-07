// DOMContentLoaded 이벤트 리스너를 추가하여 HTML 문서가 완전히 로드된 후 onClick 함수를 버튼 클릭 이벤트에 연결
document.addEventListener("DOMContentLoaded", function () {
  const activateButton = document.getElementById('activateButton');
  if (activateButton) {
    activateButton.addEventListener('click', onClick);
  } else {
    console.error("Activate button not found.");
  }
});

// onClick 함수는 iOS 기기에서 motion 권한을 요청합니다.
function onClick() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', cb);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('devicemotion', cb);
    // iOS 13 이전 버전이나 다른 장치에서는 권한 요청 없이 바로 이벤트를 추가
  }
}

// devicemotion 이벤트 콜백 함수
function cb(event) {
  console.log("eventmotor");
  const acc = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
  const accWithoutGravity = event.acceleration || { x: 0, y: 0, z: 0 };

  // 중력 보정
  const alpha = 0.8;
  me.gravity = me.gravity || { x: 0, y: 0, z: 0 };

  me.gravity.x = alpha * me.gravity.x + (1 - alpha) * acc.x;
  me.gravity.y = alpha * me.gravity.y + (1 - alpha) * acc.y;
  me.gravity.z = alpha * me.gravity.z + (1 - alpha) * acc.z;

  const adjustedAcc = {
    x: acc.x - me.gravity.x,
    y: acc.y - me.gravity.y,
    z: acc.z - me.gravity.z,
  };

  const acceleration = Math.sqrt(adjustedAcc.x * adjustedAcc.x + adjustedAcc.y * adjustedAcc.y + adjustedAcc.z * adjustedAcc.z) || 0;

  if (!me.previousAcceleration) {
    me.previousAcceleration = acceleration;
  }

  const accelerationChange = Math.abs(acceleration - me.previousAcceleration);
  me.previousAcceleration = acceleration;

  // 초기 측정값 무시
  if (ignoreCount > 0) {
    ignoreCount--;
    me.accelerationChange = 0;
  } else {
    if (accelerationChange > threshold) { // 기준치를 넘는 경우에만 업데이트
      me.accelerationChange = accelerationChange;
      lastMotionTime = millis();
    } else {
      me.accelerationChange = 0;
    }
  }

  console.log(`Acceleration Change: ${me.accelerationChange}`); // 가속도 변화를 콘솔에 출력
}