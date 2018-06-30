function choose(event) {
    
    var player = event.player;
    if (player.itemInHand.getType() == items.bone()) {
        ak47(player);
    } else if (player.itemInHand.getType() == items.stick()) {
        rpj(player);

    } else {
        return;
    }
}

function ak47(player) {
    var eye = player.eyeLocation;
    var gun = entities.arrow();
    var superak47 = player.world.spawnEntity(eye,gun);
    superak47.setVelocity(eye.getDirection().multiply(5));
    superak47.setShooter(player);
}

function rpj(e) {
    var eye1 = e.eyeLocation;
    var gun1 = entities.fireball();
    var superrpj = e.world.spawnEntity(eye1,gun1);
    superrpj.setVelocity(eye1.getDirection().multiply(1));
    superrpj.setShooter(e);
}

events.playerInteract(choose);