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


var makeAMove = function (board, move) {
    var newState = _.clone(board);
    newState[move.i][move.j] = move;
    return newState;
}


var playAGame = function (board, moves) {
    return _.reduce(moves, makeAMove, board);
}


var nextPlayer = function (moves) {
    if (_.isEmpty(moves)) {
        return "X";
    } else {
        var rotation = {"X": "O", "O": "X"};
        return rotation[_.last(moves).p];
    }
}


var splitArray = function (a, n) {
    var len = a.length, out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
}


var allComboLines = function (rows) {
    var cols = splitArray(_.map(_.range(rows.length * rows.length), function (i) {
        return rows[i % rows.length][Math.floor(i / rows.length)]
    }), rows.length);

    var diag1 = _.map(_.range(rows.length), function (i) {
        return rows[i][i];
    });

    var diag2 = _.map(_.range(rows.length), function (i) {
        return rows[i][rows.length - i - 1];
    });

    return rows.concat(cols, [diag1], [diag2]);
}


var isWinningLine = function (line) {
    var sym = line[0].p;

    for (var i = 1; i < line.length; i++) {
        if (line[i].p != sym || line[i].p == " ") {
            return null;
        }
    }

    return line;
}


var gameState = function (game) {
    var lines = allComboLines(game);
    var winningCombos = _.filter(_.map(lines, isWinningLine), function (combo) {
        return combo != null;
    });

    return {
        status: (_.isEmpty(winningCombos) ? "in-progress" : "finished"),
        winner: (_.isEmpty(winningCombos) ? null : winningCombos[0][0].p),
        combos: winningCombos
    }
}


Template.gamePage.helpers({
    board: function () {
        var board = playAGame(createEmptyBoard(this.size), this.moves);
        var state = gameState(board);

        if (state.combos != null) {
            return _.reduce(_.flatten(state.combos), function (memo, cur) {
                memo[cur.i][cur.j].winner = true;
                return memo;
            }, board);
        } else {
            return board;
        }
    }
});


Template.gamePage.events({
    'click .board-cell': function (e) {
        var gameId = _.last(window.location.pathname.split("/"));
        var beforeMove = Games.findOne(gameId);
        var move = {
            i: parseInt(e.target.getAttribute("data-i")),
            j: parseInt(e.target.getAttribute("data-j")),
            p: nextPlayer(beforeMove.moves)
        };
        var isCellMarked = _.find(beforeMove.moves, function (m) {
            return move.i == m.i && move.j == m.j;
        });


        if (!isCellMarked && beforeMove.winner == null) {
            var moves = _.clone(beforeMove.moves);
            moves.push(move);

            var afterMove = playAGame(createEmptyBoard(beforeMove.size), moves);


            Games.update(gameId,
                {$set: _.extend(_.omit(gameState(afterMove), 'combos'),
                    {moves: moves})});
        }
    },

    'click #undo-last-move': function (e) {
        var gameId = _.last(window.location.pathname.split("/"));
        var game = Games.findOne(gameId);
        var moves = game.moves.slice(0, game.moves.length - 1);
        var afterUndo = playAGame(createEmptyBoard(game.size), moves);

        Games.update(gameId,
            {$set: _.extend(_.omit(gameState(afterUndo), 'combos'),
                {moves: moves})});
    }
});
