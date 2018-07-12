function drone(player) {
    var material = org.bukkit.Material;
    var drone = new Drone(715, 100, 141, 3, player.world);
    drone.box(1, 10, 1, 10);
    for (j = 0; j < 600; j++) {
        var i = Math.floor(Math.random() * 10);
        var r = Math.floor(Math.random() * 10);
        drone.fwd(i).right(r);
        var bl = drone.getBlock();
        var blty = bl.type;
        if (blty != material.AIR) {
            drone.box(12).back(i).left(r);
        }

    }
}

exports.drone = drone;