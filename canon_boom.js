var blocks = require('blocks');
var Drone = require('drone');

function afterBoxBuilt(player, builtBox) {
  var builtBlock = builtBox.getBlock();
  var builtState = builtBlock.getState();       // 这个就发射器本身
  var builtInventory = builtState.inventory;

  if (!builtState.inventory) {
    player.sendTitle('No BuiltInventory!', 'So sorry', 10, 100, 20);
    return;
  }

  function projectileLaunched(event) {

    player.sendTitle('Fire!', 'Who?', 10, 100, 20);

    setTimeout(function() {
      builtInventory.addItem(items.fireball(1));
      builtState.dispense();
    }, 1000);
  }
  events.projectileLaunch(projectileLaunched);

  setTimeout(function() {       // 先等 2 秒再发射
    builtInventory.addItem(items.fireball(1));
    builtState.dispense();
  }, 5000);
}

function canonBoom(player) {
  var loc = player.location;
  var drone = new Drone(loc);

  var builtBox = drone.box(blocks.dispenser);

  setTimeout(function() {
    afterBoxBuilt(player, builtBox);
  }, 2000);
}

exports.canonBoom = canonBoom;