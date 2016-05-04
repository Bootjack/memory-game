function Card (config) {
    config = config || {};
    this.value = config.value || '';
    this.isFaceUp = false;
    this.element = document.createElement('div');
    this.element.addEventListener('click', function (evt) {
        this.clickHandler(evt)
    });

    // If no click handler is provided, let it use the prototype
    if (config.clickHandler) {
        this.clickHandler = config.clickHandler;
    }
}
Card.prototype = {
    clickHandler: function () {
        this.flip();
    },
    flip: function () {
        // TODO: Flip the card, toggling its visibility
    },
    render: function () {
        // TODO: Update the element to display the current card state
    }
};

function Pair () {}
Pair.prototype = {};

function Deck () {}
Deck.prototype = {};

function Game () {}
Game.prototype = {
    start: function () {
        // TODO: Kick off the gameplay
    }
};

window.addEventListener('load', function () {
    var game = new Game();
    game.start();
});
