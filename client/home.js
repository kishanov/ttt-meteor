Template.home.helpers({
    games: function () {
        return Games.find();
    }
});


Template.home.events({
    'click #start-new-game': function (e) {
        var game = {
            status: "in-progress",
            size: parseInt($("#board-size").val()),
            winner: null,
            movements: []
        };

        game._id = Games.insert(game);
        Router.go('gamePage', game);
    }
});