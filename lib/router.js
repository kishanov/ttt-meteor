Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
        return Meteor.subscribe('games');
    }
});


Router.map(function () {
    this.route('home', {path: '/'});
    this.route('gamePage', {
        path: '/games/:_id',
        data: function () {
            return Games.findOne(this.params._id);
        }
    });
});

Router.onBeforeAction('loading');
