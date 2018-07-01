/**
 * 引入所有必要的系统模块
 */
var bkLocation = Packages.org.bukkit.Location;
var DisplaySlot = org.bukkit.scoreboard.DisplaySlot;
var gameMode = org.bukkit.GameMode;
var inventory = require('inventory');
var world = server.worlds.get(0);

/**
 * 游戏控制变量
 */
 var isStarted = false;        // 游戏是否正在进行
 var counter = 0;              // 当前已完成分配总人数
 var scoreboard = null;        // 分数板管理器

 /**
  * 事件监听器
  */
var eventListeners = {
  inventoryPickup: null,
  playerPickup: null,
  playerDrop: null,
  hitDamage: null,
  playerRespawn: null,
  blockBreak: null,
}

// 战队变量（分红队与蓝队）
var redTeam = null;
var blueTeam = null;

// 位置变量（包括分红队基地、蓝队基地）
var redBase = new bkLocation(world, -272, 66, 232, 92.5, 4.5);
var blueBase = new bkLocation(world, -380, 66, 232, -90.5, -4.5);

// var redBase = new bkLocation(world, 47, 7, 497, -90, 1.5);
// var blueBase = new bkLocation(world, 155, 7, 497, 90, -1.5);

var start = function() {
  redTeam = {
    name: 'redTeam',
    members: [],
    players: [],
    score: 0
  }
  scoreboard.setItemScore(redTeam.name, redTeam.score);
  blueTeam = {
    name: 'blueTeam',
    members: [],
    players: [],
    score: 0
  }
  scoreboard.setItemScore(blueTeam.name, blueTeam.score);
  addHandleEvents();
  distributePlayers();
}

/**
 * 分数管理器函数
 */
var initScoreboard = function() {
  var board = server.getScoreboardManager().getNewScoreboard();

  var obj = board.registerNewObjective('Fighting', 'sb');
  obj.setDisplaySlot(DisplaySlot.SIDEBAR);
  obj.setDisplayName('MC Fighting');

  return {
    setItemScore: function(name, score) {
      var teamName = obj.getScore(name);
      teamName.setScore(score);
    },
    showToPlayer: function(player) {
      player.setScoreboard(board);
    }
  }
}

/**
 * 处理各种事件
 */
var addHandleEvents = function() {
  // 当玩家拾起某些道具时
  eventListeners.inventoryPickup = events.inventoryPickupItem(pickupHandler);
  eventListeners.playerPickup = events.playerPickupItem(pickupHandler);
  // 当玩家扔掉某些道具时
  eventListeners.playerDrop = events.playerDropItem(dropHandler);
  // 当玩家被击中时
  eventListeners.hitDamage = events.entityDamageByEntity(hitHandler);
  // 当玩家重生时
  eventListeners.playerRespawn = events.playerRespawn(respawnHandler);
  // 当玩家破坏方块时
  eventListeners.blockBreak = events.blockBreak(blockBreakHandler);
}

/**
 * 取消所有注册的事件
 */
var removeHandleEvnets = function() {
  eventListeners.inventoryPickup.unregister();
  eventListeners.playerPickup.unregister();
  eventListeners.playerDrop.unregister();
  eventListeners.hitDamage.unregister();
  eventListeners.playerRespawn.unregister();
  eventListeners.blockBreak.unregister();
}

/**
 * 处理拾起事件
 */
var pickupHandler = function(event) {
  event.setCancelled(true);     // true 表示确认取消这次事件
}

/**
 * 处理扔掉事件
 */
var dropHandler = function(event) {
  event.setCancelled(true);     // true 表示确认取消这次事件
}

/**
 * 处理击中事件
 */
var hitHandler = function(event) {
  var target = event.entity;      // 受到伤害的实体（可能是某个玩家或其他生物）
  var tool = event.damager;       // 产生伤害的实体（通常是某个物品，如雪球）
  var source = tool.shooter;      // 发出伤害的实体（可能是某个玩家或其他生物）

  if (tool.name.toLowerCase() !== 'snowball') {
    return;
  }

  var redTeamTargetIndex = -1;
  var blueTeamTargetIndex = -1;
  var redTeamSourceIndex = -1;
  var blueTeamSourceIndex = -1;

  if (redTeam.players.indexOf(target) !== -1) {
    redTeamTargetIndex = redTeam.players.indexOf(target);
    slowdownThePlayer(redTeam.members[redTeamTargetIndex]);
    server.broadcastMessage(target.name + ' is hit by ' + source.name);
    scoreboard.setItemScore(redTeam.name, --redTeam.score);
    if (blueTeam.players.indexOf(source) !== -1) {
      blueTeamSourceIndex = blueTeam.players.indexOf(source);
      fastupThePlayer(blueTeam.members[blueTeamSourceIndex]);
      world.strikeLightning(target.location);
      scoreboard.setItemScore(blueTeam.name, ++blueTeam.score);
    }
  } else if (blueTeam.players.indexOf(target) !== -1) {
    blueTeamTargetIndex = blueTeam.players.indexOf(target);
    slowdownThePlayer(blueTeam.members[blueTeamTargetIndex]);
    server.broadcastMessage(target.name + ' is hit by ' + source.name);
    scoreboard.setItemScore(blueTeam.name, --blueTeam.score);
    if (redTeam.players.indexOf(source) !== -1) {
      redTeamSourceIndex = redTeam.players.indexOf(source);
      fastupThePlayer(redTeam.members[redTeamSourceIndex]);
      world.strikeLightning(target.location);
      scoreboard.setItemScore(redTeam.name, ++blueTeam.score);
    }
  }
}

/**
 * 使某个玩家减速
 */
var slowdownThePlayer = function(member) {
  if (member._isSlowdown || member._isFastup) {
    return;
  }
  var player = member.player;
  var originSpeed = player.walkSpeed;
  member._isSlowdown = true;
  
  player.walkSpeed = originSpeed * 0.5;
  setTimeout(function() {
    member._isSlowdown = false;
    player.walkSpeed = originSpeed;
  }, 3000);
}

/**
 * 使某个玩家加速
 */
var fastupThePlayer = function(member) {
  if (member._isSlowdown || member._isFastup) {
    return;
  }
  var player = member.player;
  var originSpeed = player.walkSpeed;
  member._isSlowdown = true;
  player.walkSpeed = originSpeed * 2;
  setTimeout(function() {
    member._isSlowdown = false;
    player.walkSpeed = originSpeed;
  }, 3000);
}

/**
 * 处理重生事件
 */
var respawnHandler = function(event) {
  var player = event.player;
  var member = null;
  var redTeamIndex = redTeam.players.indexOf(player);
  var blueTeamIndex = blueTeam.players.indexOf(player);
  if (redTeamIndex === -1 && blueTeamIndex === -1) {
    return;
  }
  player.gameMode = gameMode.SURVIVAL;  // 恢复游戏模式
  player.foodLevel = 20;                // 饥饿值恢复
  player.health = 20;                   // 生命值恢复

  player.inventory.clear();
  player.inventory.heldItemSlot = 0;      // 用户手上持有的物品就是第一栏的物品

  // 恢复玩家雪球数量并进行归队处理
  if (redTeamIndex !== -1) {
    member = redTeam.members[redTeamIndex];
    inventory(player).add(items.snowBall(member._snowBallNum));
    event.setRespawnLocation(redBase);
  } else if (blueTeamIndex !== -1) {
    member = redTeam.members[blueTeamIndex];
    inventory(player).add(items.snowBall(member._snowBallNum));
    event.setRespawnLocation(blueBase);
  }
}

/**
 * 处理方块破坏事件
 */
var blockBreakHandler = function(event) {
  event.setCancelled(true);     // true 表示确认取消这次事件
}




/**
 * 分配玩家到各个队伍中
 */
var distributePlayers = function() {
  var onlinePlayers = server.onlinePlayers;
  var player = null;
  for (key in onlinePlayers) {
    player = onlinePlayers[key];
    addPlayerToTeam(player);
    scoreboard.showToPlayer(player);
    counter = counter++;
  }
}

/**
 * 对某个玩家的具体分配操作
 */
var addPlayerToTeam = function(player) {
  // 先对玩家进行预处理
  player.gameMode = gameMode.SURVIVAL;
  player.foodLevel = 20;
  player.health = 20;
  // 并清除玩家的储物箱
  player.inventory.clear();
  // 然后便放置于我们构造出来的对象中
  var member = {
    player: player,
    _isSlowdown: false,       // 用户是否处于慢速状态
    _isFastup: false,         // 用户是否处于加速状态
    _snowBallNum: 30,         // 用于保存本玩家的雪球数量，以便于重生时恢复雪球数量
  }

  // 然后再根据需要为玩家的储物箱添加物品
  inventory(player).add(items.snowBall(member._snowBallNum));
  player.inventory.heldItemSlot = 0;      // 用户手上持有的物品就是第一栏的物品

  // 进行分队处理
  if (counter % 2 === 0) {
    redTeam.members.push(member);
    redTeam.players.push(player);
    echo(player, 'Remember: You are in the ' + redTeam.name.red());
    player.teleport(redBase);
  } else {
    blueTeam.members.push(member);
    blueTeam.players.push(player);
    echo(player, 'Remember: You are in the ' + blueTeam.name.blue());
    player.teleport(blueBase);
  }
}




/**
 * 游戏结束
 */
var end = function() {
  if (redTeam.score > blueTeam.score) {
    server.broadcastMessage(redTeam.name + ' won!!!');
  } else if (redTeam.score < blueTeam.score) {
    server.broadcastMessage(blueTeam.name + ' won!!!');
  } else {
    server.broadcastMessage('Both team Equal!!!');
  }
  removeHandleEvnets();
}

/**
 * 即将结束游戏的提示，以及到时便跳转到游戏结束函数
 */
 var prepareEnd = function(seconds) {
  server.broadcastMessage('only ' + seconds + ' seconds!');
  if (seconds > 0) {
    setTimeout(function() {
      prepareEnd(seconds - 1);
    }, 1000);
  } else {
    end();
    isStarted = false;      // 游戏结束的标记
  }
}




/**
 * 输出游戏
 */
exports.game_snowball = function(player) {
  if (!player.isOp()) {
    echo(player, 'Only the operator could start the game!');
    return;
  }
  if (isStarted) {
    echo(player, 'The game is running!');
    return;
  }
  scoreboard = initScoreboard();
  counter = 0;

  isStarted = true;         // 游戏开始的标记

  setTimeout(function() {
    prepareEnd(10);
  }, 50000);

  start();
}