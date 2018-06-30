var scoreManager = server.getScoreboardManager();
var scoreObj = scoreManager.getNewScoreboard();
var obj = scoreObj.registerNewObjective('battle','');
var DisplaySlot = org.bukkit.scoreboard.DisplaySlot;
obj.setDisplaySlot(DisplaySlot.SIDEBAR);
obj.setDisplayName('mars war');

function show(player) {
    player.setScoreboard(scoreObj);
}

function update(player,score) {
    var scoreItem = obj.getScore(player.name);
    scoreItem.setScore(score);
}

module.exports = {
    show: show,
    update:update
}

