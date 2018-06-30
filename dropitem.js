function r(e) {                //建造一个r函数
    var bkLocation = Packages.org.bukkit.Location;                //引用接口的location存为变量bkLocation
    var x = [-1, -15, -18, -16];                                  //x轴坐标数组
    var y = [84, 83, 87, 91];                                     //y轴坐标数组
    var z = [160, 151, 155, 157];                                 //z轴坐标数组

    var bone = items.bone(1);                                    //获取接口的骨头堆存为变量bone
    var stick = items.stick(1);                                  //获取接口的木棍堆存为变量stick
    var bread = items.bread(5);                                  //获取接口的面包堆存为变量bread
    var ironSword = items.ironSword(1);
    var 
    var item = [bone, stick, bread, ironSword];                             //把上面得到的物品堆存为数组item

    var world = e.player.world;                                  //通过事件获取world并存为变量world

    for (i = 0; i < 3; i++) {                                   //建立循环语句，变量i从0开始累加，并且不超过3
        var location = new bkLocation(world, x[i], y[i], z[i]);  //建立一个地点对象存为变量location，每次循环从x y z三个数组中顺序读出
        var randomitem = Math.floor(Math.random() * 3);         //生成一个0-2的随机整数
        world.dropItem(location, item[randomitem]);             //掉落物品在数组坐标位置，掉落item数组中的物品
    }
}

//events.playerRespawn(r);  //监听玩家重生事件，并调用r函数