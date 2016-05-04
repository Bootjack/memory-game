function Card (config) {
    var self = this;
    config = config || {};
    this.value = config.value || '';
    this.isFaceUp = false;
    this.element = document.createElement('div');
    this.element.addEventListener('click', function (evt) {
        self.clickHandler(evt);
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
    flip: function (forceDirection) {
        // Flip the card, toggling its visibility
        this.isFaceUp = (undefined === forceDirection ? !this.isFaceUp : !!forceDirection);
        this.render();
    },
    render: function () {
        // Update the element to display the current card state
        this.element.className = 'memory-card';
        if (this.isFaceUp) {
            this.element.className += ' is-face-up';
            this.element.textContent = this.value;
        } else {
            this.element.textContent = '';
        }
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

    var card = new Card({
        value: '7'
    });
    document.body.appendChild(card.element);
    card.render();
});
