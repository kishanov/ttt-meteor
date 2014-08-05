var createEmptyBoard = function (size) {
    var result = [];

    for (var i = 0; i < size; i++) {
        result.push([]);
        for (var j = 0; j < size; j++) {
            result[i].push({i: i, j: j, p: " "});
        }
    }

    return result;
}

var makeAMove = function (board, movement) {
    var newState = _.clone(board);
    newState[movement.i][movement.j] = movement;
    return newState;
}


Template.gamePage.helpers({
    board: function () {
        return _.reduce(this.movements, makeAMove, createEmptyBoard(this.size));
    }
});


Template.gamePage.events({
    'click .board-cell': function (e) {
        var i = e.target.getAttribute("data-i");
        var j = e.target.getAttribute("data-j");
        console.log(e.target.innerHTML);
    }
});
