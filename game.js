function Card (config) {
    var self = this;
    config = config || {};
    this.value = config.value || '';
    this.isFaceUp = false;
    this.isMatched = false;
    this.element = config.element || document.createElement('div');
    this.element.addEventListener('click', function (evt) {
        self.clickHandler(evt, self);
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
        if (!this.isMatched) {
            this.isFaceUp = (undefined === forceDirection ? !this.isFaceUp : !!forceDirection);
        }

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
    this.size = size = config.size || 10;
    this.cardClickHandler = config.cardClickHandler;
    this.cards = cards;

    while (size > 0) {
        cards.push(new Card({
            value: size,
            clickHandler: this.cardClickHandler
        }));
        cards.push(new Card({
            value: size,
            clickHandler: this.cardClickHandler
        }));
        size -= 1;
    }
}
Deck.prototype = {
    shuffle: function () {
        var cuts = {},
            i = 0,
            rand;

        function reverseCardSort (a, b) {
            return a.value - b.value;
        }

        while (i < this.size * this.size) {
            rand = Math.floor(Math.random() * this.cards.length);
            cuts.first = this.cards.splice(rand);

            rand = Math.floor(Math.random() * this.cards.length);
            cuts.second = this.cards.splice(rand);

            this.cards = cuts.first.concat(cuts.second, this.cards);
            i += 1;
        }

        return this;
    }
};

function Game (config) {
    config = config || {};
    this.deck = new Deck({
        cardClickHandler: this.cardClickHandler.bind(this)
    });
    this.isPaused = false;
    this.pauseDelay = config.pauseDelay || 1000;
    this.element = config.element || document.createElement('div');
    this.element.className = 'memory-game';
    this.choices = [];
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
    },
    cardClickHandler: function (evt, card) {
        if (!this.isPaused && -1 === this.choices.indexOf(card)) {
            card.flip().render();
            this.choices.push(card);
            this.testMatch();
            this.endTurn();
        }
    },
    testMatch: function () {
        var values = this.choices.map(card => card.value);
        if (this.choices.length === 2 && values[0] === values[1]) {
            this.choices.forEach(card => card.isMatched = true);
        }
    },
    endTurn: function () {
        if (this.choices.length > 1) {
            this.isPaused = true;
            setTimeout(() => {
                this.choices.forEach(card => card.flip(false).render());
                this.choices = [];
                this.isPaused = false;
                this.testWin();
            }, this.pauseDelay);
        }
    },
    testWin: function () {
        if (this.deck.cards.every(card => card.isMatched)) {
            this.deck.cards.forEach(function (card) {
                card.isMatched = false;
                card.isFaceUp = false;
                card.render();
            });
            this.start();
        }
    }
};

window.addEventListener('load', function () {
    var game = new Game();
    document.body.appendChild(game.element);
    game.start();
});
