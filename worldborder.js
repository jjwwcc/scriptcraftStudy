function wb(e) {

    var centerX = 626;
    var centerZ = 97;

    var random = Math.floor(Math.random() * 50);
    if (Math.random() < 0.5) {
        var randome = 1;
    } else {
        var randome = -1;
    }

    var randomX = centerX + random * randome;
    var randomZ = centerZ + random * randome;

    var worldborder = e.player.world.getWorldBorder();

    worldborder.setCenter(randomX, randomZ);
    worldborder.setDamageAmount(1);
    worldborder.setSize(900);

    setTimeout(
        function () {
            worldborder.setSize(700, 25);
            echo(e.player, '700')
        }, 80000
    );

    setTimeout(
        function () {
            worldborder.setSize(500, 25);
            echo(e.player, '500')
        }, 140000
    );

    setTimeout(
        function () {
            worldborder.setSize(300, 30);
            echo(e.player, '300')
        }, 200000
    );

    setTimeout(
        function () {
            worldborder.setSize(100, 30);
            echo(e.player, '100')
        }, 260000
    );

    setTimeout(
        function () {
            worldborder.setSize(30, 30);
            echo(e.player, '30')
        }, 320000
    );

}

events.playerRespawn(wb);