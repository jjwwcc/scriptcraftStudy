var Material = org.bukkit.Material;
var Location = org.bukkit.Location;

function echo_fall(player) {
  var width = 10;
  var length = 10;
  var fallArr = [];       // 这将是一个二维数组

  var world = player.world;
  var playerLoc = player.location;

  for (var i = 0; i < width; i++) {
    fallArr[i] = [];      // 这是二维数组中的一行
    for (var j = 0; j < length; j++) {
      var drone = new Drone(new Location(playerLoc.world, playerLoc.x + i, playerLoc.y, playerLoc.z + j));
      drone.box(1);
      fallArr[i][j] = {   // 这是第 i 行中的的第 j 个元素（i/j 均从 0 算起）
        time: Math.floor(Math.random() * 1000),       // 因为 setTimeout 函数是以毫秒计算的，所以 X 1000
        drone: drone      // drone 要保留，后面会用到
      };
    }
  }

  function startFall(item) {
    var drone = item.drone;   // 获取当前的 drone 对象
    var time = item.time;     // 获取要延迟的时间
    setTimeout(function() {
      drone.box(12);
    }, time);
  }

  setTimeout(function() {   // 等个 5 秒，先保证类型 1 的方块建造完毕
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < length; j++) {
        startFall(fallArr[i][j]);
      }
    }
  }, 5000);
}


exports.echo_fall = echo_fall;