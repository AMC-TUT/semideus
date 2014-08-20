var TULOS = {
  canvas: {
    width: 1024,
    height: 748
  },
  world: [{
    title: 'Floor 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, reiciendis, fuga, neque atque doloremque nostrum rerum hic id asperiores nihil natus sed modi quos ad quam unde vero impedit dicta',
    player: {
      x: 300
    },
    levels: [{
      question: {
        type: 1, // 1 = number, 2 = plus, 3 = minus
        decimal: false,
        trap: {
          denominator: 2,
          numerator: 3
        },
        answer: {
          denominator: 2, // osoittaja
          numerator: 4 // nimittäjä
        },
        values: [{
          denominator: 2, // osoittaja
          numerator: 4 // nimittäjä
        }]
      },
      items: [{
        name: 'VaseSprite01',
        x: 900,
        y: 160
      }, {
        name: 'VaseSprite02',
        x: 460,
        y: 260
      },
      {
        name: 'GoatSprite',
        x: 760,
        y: 60
      }]
    }, {
      question: {
        type: 2, // 1 = number, 2 = plus, 3 = minus
        decimal: false,
        trap: {
          denominator: 2,
          numerator: 5
        },
        answer: {
          denominator: 4, // osoittaja
          numerator: 4 // nimittäjä
        },
        values: [{
          denominator: 2, // osoittaja
          numerator: 4 // nimittäjä
        }, {
          decimal: false,
          denominator: 2, // osoittaja
          numerator: 4 // nimittäjä
        }]
      },
      items: [{
        name: 'VaseSprite01',
        x: 50,
        y: 260
      }, {
        name: 'VaseSprite02',
        x: 460,
        y: 260
      }]
    }, {
      question: {
        type: 3, // 1 = number, 2 = plus, 3 = minus
        decimal: false,
        trap: {
          denominator: 2,
          numerator: 6
        },
        answer: {
          denominator: 1, // osoittaja
          numerator: 4 // nimittäjä
        },
        values: [{
          denominator: 2, // osoittaja
          numerator: 4 // nimittäjä
        }, {
          denominator: 1, // osoittaja
          numerator: 4 // nimittäjä
        }]
      },
      items: [{
        name: 'VaseSprite01',
        x: 50,
        y: 260
      }, {
        name: 'VaseSprite02',
        x: 460,
        y: 260
      },{
        name: 'VaseSprite01',
        x: 500,
        y: 260
      }, {
        name: 'VaseSprite02',
        x: 760,
        y: 260
      }]
    }, {
      question: {
        type: 1, // 1 = number, 2 = plus, 3 = minus
        decimal: true,
        trap: {
          denominator: 2,
        },
        answer: {
          denominator: 33,
        },
        values: [{
          denominator: 33,
        }]
      },
      items: []
    }, {
      question: {
        type: 2, // 1 = number, 2 = plus, 3 = minus
        decimal: true,
        trap: {
          denominator: 15,
        },
        answer: {
          denominator: 50,
        },
        values: [{
          denominator: 25,
        }, {
          denominator: 25,
        }]
      },
      items: [{
        name: 'VaseSprite01',
        x: 50,
        y: 260
      }]
    }]
  }]
};