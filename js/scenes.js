//
// Loading
//
Crafty.scene("Loading", function() {
  Crafty.e("HTML").append('<br/><br/><div class="hero-unit span8 offset1"><div class="row"></div><div class="row"><div class="progress progress-warning active"><div class="bar"></div></div></div></div>');

  Crafty.load(
    [
      "images/menu/bg.png"
    ],
    function() {
      Crafty.scene("Lobby");
    },
    function(e) {
      $(".progress .bar").css("width", Math.round(e.percent) + "%");
    },
    function(e) {
      alert('Error loading ' + e.src + ' while loading game assets (loaded ' + e.loaded + ' of ' + e.total + ')');
    }
  );
});

//
// Lobby
//
Crafty.scene("Lobby", function() {
  Crafty.background("url(images/splash.jpg)");

  //var _this = this;

  setTimeout(function() {
    Crafty.scene("Game");
  }, 3000);

  /*
  var fontStyleMenu = {
    font: 'main',
    size: 20,
    color: '#FFFFFF'
  };

  if (_this.container) {
    _this.container.destroy();
  }

  _this.container = Crafty.e('2D, Canvas');
  _this._selectedLevelIndex = 0;
  _this._selectedLevelPicture = '';

  var levelName = Crafty.e('2D, DOM, Text2')
    .text('Lorem ipsum dolor sit')
    .setStyle(fontStyleMenu)
    .setAlign('center')
    .attr({
      x: ((1024 - 500) / 2),
      y: 360,
      w: 500
    });

  var levelDescription = Crafty.e('2D, DOM, Text2')
    .text('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, reiciendis, fuga, neque atque doloremque nostrum rerum hic id asperiores nihil natus sed modi quos ad quam unde vero impedit dicta')
    .setStyle(fontStyleMenu)
    .setAlign('center')
    .attr({
      x: ((1024 - 500) / 2),
      y: 420,
      w: 500
    });

  var startButton = Crafty.e('Button, Image')
    .image("images/menu/buttonStart.png")
    .button(function() {
      Crafty.scene("Game");
    })
    .attr({
      x: TULOS.canvas.width - 300, // - 200,
      y: TULOS.canvas.height - 200 // - 100
    });

  var nextLevelButton = Crafty.e('Button, Image')
    .image("images/menu/buttonForward.png")
    .button(function() {})
    .attr({
      x: 830,
      y: 390
    });

  var previousLevelButton = Crafty.e('Button, Image')
    .image("images/menu/buttonForward.png")
    .button(function() {})
    .attr({
      x: 90,
      y: 390
    });

  previousLevelButton.flip('X');

  _this.container.attach(nextLevelButton, previousLevelButton, levelName, levelDescription, startButton);
*/



});

//
// Game
//
var player;

var world = {
  world: TULOS.world,
  ent: null,
  taskbar: null,
  healthBar: null,
  height: 0,
  firstFloor: 0,
  entities: [],
  player: null,
  solveButton: null,
  jumpButton: null,
  level: 0, // index for levels array to pick up right question
  trapConsole: null,
  questionConsole: null,
  answerBox: null,
  answerAxis: null,
  tipLine: null
};

// push "game finish" level
world.world[0].levels.push({
  question: {
    type: 0, // 1 = number, 2 = plus, 3 = minus, 0 = game finish
  }
});

Crafty.scene("Game", function() {
  var building = world.world[0];
  var floorY = building.levels.length * 340;
  var floorHeight = 340;
  var bottomY = building.levels.length * 340;

  var activeFloorY = bottomY;

  world.height = 340 * building.levels.length;
  world.firstFloor = world.height - 340;

  world.ent = Crafty.e('2D').attr({
    x: 0,
    y: 0,
    w: 1024,
    h: world.height
  });

  // background sprites
  Crafty.sprite(sprites.bgSprite01.image.frameWidth, sprites.bgSprite01.image.frameHeight, sprites.bgSprite01.image.url, {
    bgSprite01: [0, 0]
  });

  Crafty.sprite(sprites.bgSprite02.image.frameWidth, sprites.bgSprite02.image.frameHeight, sprites.bgSprite02.image.url, {
    bgSprite02: [0, 0]
  });

  Crafty.sprite(sprites.bgSprite03.image.frameWidth, sprites.bgSprite03.image.frameHeight, sprites.bgSprite03.image.url, {
    bgSprite03: [0, 0]
  });

  Crafty.sprite(sprites.bgSprite04.image.frameWidth, sprites.bgSprite04.image.frameHeight, sprites.bgSprite04.image.url, {
    bgSprite04: [0, 0]
  });

  Crafty.sprite(sprites.bgSprite05.image.frameWidth, sprites.bgSprite05.image.frameHeight, sprites.bgSprite05.image.url, {
    bgSprite05: [0, 0]
  });

  Crafty.sprite(sprites.bgSprite06.image.frameWidth, sprites.bgSprite06.image.frameHeight, sprites.bgSprite06.image.url, {
    bgSprite06: [0, 0]
  });

  // goal
  Crafty.sprite(sprites.goalSprite.image.frameWidth, sprites.goalSprite.image.frameHeight, sprites.goalSprite.image.url, {
    goalSprite: [0, 0]
  });

  // fog
  Crafty.sprite(sprites.fogSprite.image.frameWidth, sprites.fogSprite.image.frameHeight, sprites.fogSprite.image.url, {
    fogSprite: [0, 0]
  });

  // fog
  Crafty.sprite(sprites.goatSprite.image.frameWidth, sprites.goatSprite.image.frameHeight, sprites.goatSprite.image.url, {
    goatSprite: [0, 0]
  });

  // ground
  Crafty.sprite(sprites.groundSprite.image.frameWidth, sprites.groundSprite.image.frameHeight, sprites.groundSprite.image.url, {
    groundSprite: [0, 0]
  });

  // sky sprites
  Crafty.sprite(sprites.skySprite01.image.frameWidth, sprites.skySprite01.image.frameHeight, sprites.skySprite01.image.url, {
    skySprite01: [0, 0]
  });

  Crafty.sprite(sprites.skySprite02.image.frameWidth, sprites.skySprite02.image.frameHeight, sprites.skySprite02.image.url, {
    skySprite02: [0, 0]
  });

  Crafty.sprite(sprites.skySprite03.image.frameWidth, sprites.skySprite03.image.frameHeight, sprites.skySprite03.image.url, {
    skySprite03: [0, 0]
  });

  //player sprites
  Crafty.sprite(sprites.playerSprite.image.frameWidth, sprites.playerSprite.image.frameHeight, sprites.playerSprite.image.url, {
    playerSprite: [0, 0]
  });

  // vase sprites
  Crafty.sprite(sprites.vaseSprite01.image.frameWidth, sprites.vaseSprite01.image.frameHeight, sprites.vaseSprite01.image.url, {
    vaseSprite01: [0, 0]
  });

  Crafty.sprite(sprites.vaseSprite02.image.frameWidth, sprites.vaseSprite02.image.frameHeight, sprites.vaseSprite02.image.url, {
    vaseSprite02: [0, 0]
  });

  world.solveButton = Crafty.e('SolveButton')
    .attr({
      x: 0,
      y: 0,
      z: 9999
    });

  world.jumpButton = Crafty.e('JumpButton')
    .attr({
      x: TULOS.canvas.width - 182,
      y: 0,
      z: 9999
    });

  var tipBtn = Crafty.e('TipButton')
    .attr({
      x: (1024 / 2) - (77 / 2),
      y: 20,
      z: 1000,
      w: 70,
      h: 100
    });

  world.tipButton = tipBtn;

  world.taskBar = createTaskBar();

  _.each(building.levels, function(floor, index) {

    // Level entity attach and holds all items in one level (question)
    var level = Crafty.e('2D, Canvas, Color')
      //.color(index % 2 ? '#47AF47' : '#6EC96E')
      .attr({
        x: 0,
        y: floorY - floorHeight,
        w: 1024,
        h: 340
      });

    // sky
    var sky;

    if (index === 0) {
      sky = Crafty.e('2D, Canvas, SkySprite01')
        .animate('init', -1)
        .attr({
          x: 0,
          y: (floorY - floorHeight),
          z: level._z
        });
      level.attach(sky);
    } else {
      var skySprite = 'SkySprite0' + (Math.random() < 0.5 ? '2' : '3');
      sky = Crafty.e('2D, Canvas, ' + skySprite)
        .animate('init', -1)
        .attr({
          x: 0,
          y: (floorY - floorHeight),
          z: level._z
        });
      level.attach(sky);
    }

    // background
    var backgroundSprite = 'BgSprite0' + (index + 1);
    var bg = Crafty.e('2D, Canvas, ' + backgroundSprite)
      .animate('init', -1)
      .attr({
        x: 0,
        y: (floorY - floorHeight),
        z: level._z + 1
      });
    level.attach(bg);

    // fog
    var xPos = Math.floor((Math.random() * 1024) + 1);
    var sign = Math.random() > 0.5 ? +1 : -1;
    var spritePos = xPos * sign;

    var fog = Crafty.e('2D, Canvas, Fog')
      .animate('init', -1)
      .attr({
        x: spritePos,
        y: (floorY - floorHeight),
        z: level._z + 2
      });
    level.attach(fog);

    // Platform to keep Player in level (Gravity)
    var platform = Crafty.e('2D, Canvas, Platform, Color')
      .color('#666')
      .attr({
        x: 0,
        y: floorY - 10,
        w: 1024,
        h: 10,
        z: 2
      });

    level.attach(platform);

    // Platform to keep Player in level (Gravity)
    var bg = Crafty.e('2D, Canvas, Platform, Color, Ground')
      //.color('#666')
      .attr({
        x: 0,
        y: floorY - 10,
        w: 1024,
        h: 10,
        z: 2
      });

    level.attach(bg);

    if (floor.question.type > 0) {
      var q = floor.question,
        trapX = q.decimal ? 15 / q.trap.denominator : (q.trap.denominator / q.trap.numerator) * 890;

      var trap = Crafty.e('Trap')
        .attr({
          x: trapX,
          y: floorY - 15
        });

      level.attach(trap);
    }

    _.each(floor.items, function(item) {

      var ent = Crafty.e('2D, Canvas, ' + item.name)
        .animate('init', -1)
        .attr({
          x: item.x,
          y: (floorY - floorHeight) + item.y,
          z: level._z + (Math.random() > 0.5 ? 1000 : 1)
        });

      level.attach(ent);

    }); // each floor.items

    if (floor.question.type > 0) {
      //
    } else {

      // // background
      // var goal = Crafty.e('2D, Canvas, GoalSprite')
      //   .animate('init', -1)
      //   .attr({
      //     x: 0,
      //     y: (floorY - floorHeight),
      //     z: level._z + 1
      //   });
      // level.attach(bg);

      var exitButton = Crafty.e('ExitButton')
        .attr({
          x: (TULOS.canvas.width / 2) - 92,
          y: floorY - 400,
          z: 9999
        });

      level.attach(exitButton);

    }

    world.ent.attach(level);

    floorY -= 340;
  });

  world.ent.move('s', -(world.firstFloor - 230));

  setTimeout(function() {
    player = Crafty.e('Player').attr({
      x: building.player.x,
      y: 450,
      z: 999
    });

    world.ent.attach(player);

    var question = world.world[0].levels[0].question;

    world.trapConsole.updateConsole(question);
    world.questionConsole.updateConsole(question);

  }, 100);



});