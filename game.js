function Card (config) {
    var self = this;
    config = config || {};
    this.value = config.value || '';
    this.isFaceUp = false;
    this.element = config.element || document.createElement('div');
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
        this.flip().render();
    },
    flip: function (forceDirection) {
        // Flip the card, toggling its visibility
        this.isFaceUp = (undefined === forceDirection ? !this.isFaceUp : !!forceDirection);

        return this;
    },
    render: function () {
        // Update the element to display the current card state
        this.element.className = 'memory-card';
        if (this.isFaceUp) {
            this.element.className += ' is-face-up';
            this.element.textContent = this.value;
        } else {
            this.element.innerHTML = '&nbsp;';
        }

        return this;
    }
};

function Deck (config) {
    var cards = [],
        size,
        value;

    config = config || {};
    this.size = size = config.size || 8;
    this.cards = cards;

    while (size > 0) {
        cards.push(new Card({value: size}));
        cards.push(new Card({value: size}));
        size -= 1;
    }
}
Deck.prototype = {
    shuffle: function () {
        var firstCut,
            secondCut,
            i = 0,
            rand;

        function reverseCardSort (a, b) {
            return a.value - b.value;
        }

        while (i < this.size * 4) {
            rand = Math.floor(Math.random() * this.cards.length);
            firstCut = this.cards.splice(rand);

            rand = Math.floor(Math.random() * this.cards.length);
            secondCut = this.cards.splice(rand);

            this.cards = secondCut.concat(this.cards, firstCut);
            i += 1;
        }

        return this;
    }
};

function Game (config) {
    config = config || {};
    this.deck = new Deck();
    this.element = config.element || document.createElement('div');
    this.element.className = 'memory-game';
}
Game.prototype = {
    start: function () {
        // Kick off the gameplay
        this.deck.shuffle();
        this.render();

        return this;
    },
    render: function () {
        var element = this.element;

        this.deck.cards.forEach(function (card) {
            element.appendChild(card.element);
            card.render();
        });
    }
};

window.addEventListener('load', function () {
    var game = new Game();
    document.body.appendChild(game.element);
    game.start();
});
