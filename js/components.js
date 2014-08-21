//
// Player
//

Crafty.c('Player', {
  deviceOrientation: false, // state
  deviceMotion: false, // state
  previousMotion: {
    ox: 0,
    oy: 0,
    oz: 0
  },
  motion: 0,
  angle: 0, // angle < 0 => move right, angle > 0 => move left
  angleStresshold: 10,
  shakeStresshold: 1000,
  angleMotion: false,
  shakeMotion: false,
  keyboardMotion: true,
  stepLength: 5,
  keyboardDirection: true,
  idle: false,
  idleTime: (new Date()).getTime(),
  playerLine: null,
  floor: 0, // current floor
  solving: false,
  tipping: false,
  solved: false,
  taskBar: null,
  gameOver: false,
  trapping: false, // taking hit from trap

  startDeviceOrientationListener: function() {
    var _this = this;

    if (isiPad) {
      _this.deviceMotion = true;
      _this.shakeMotion = true;
      _this.deviceOrientation = true;
      _this.deviceMotion = true;

      _this.keyboardMotion = false;
    }

    function deviceOrientationListener(event) {
      _this.angle = Math.round(-1 * (window.orientation / 90) * event.beta);
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", deviceOrientationListener);
    } else {
      console.log("Sorry, your browser doesn't support Device Orientation");
    }
  },
  startDeviceMotionListener: function() {
    var _this = this;

    function deviceMotionListener(event) {
      var x = Math.round(Math.abs(event.acceleration.x * 1000));
      var y = Math.round(Math.abs(event.acceleration.y * 1000));
      var z = Math.round(Math.abs(event.acceleration.z * 1000));

      var xx = Math.pow(x - _this.previousMotion.ox, 2);
      var yy = Math.pow(y - _this.previousMotion.oy, 2);
      var zz = Math.pow(z - _this.previousMotion.oz, 2);

      _this.motion = Math.abs(Math.round(Math.sqrt(xx + yy + zz)));
      _this.previousMotion = {
        ox: x,
        oy: y,
        oz: z
      };
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", deviceMotionListener);
    } else {
      console.log("Sorry, your browser doesn't support Device Motion");
    }
  },
  solveLevel: function() {
    var axisLength = 890, // 890 <= 930x - 40x
      question = world.world[0].levels[world.level].question,
      answer = question.decimal ? question.answer.denominator / 100 : question.answer.denominator / question.answer.numerator,
      answerX = answer * axisLength,
      playerX = world.playerLine._x - 40,
      dX = Math.abs(answerX - playerX),
      arrowDir = (answerX - playerX) >= 0 ? false : true,
      accuracy = 100 - Math.round((dX / axisLength) * 100),
      percentToTarget = 100 - accuracy;

    var accuracyTitle, accuracyText;

    if (accuracy < 95) {

      var $el = $('.TipLine');
      $el.addClass('animated flash');
      setTimeout(function() {
        $el.removeClass('animated flash');
      }, 1200);

      var arrowX = arrowDir ? playerX - 30 : playerX + 80;

      world.tipArrow = Crafty.e('2D, DOM, Image')
        .image('images/components/arrow.png')
        .attr({
          x: arrowX,
          y: player._y + 30,
          z: player._z + 1,
        });

      accuracyText = Crafty.e('2D, DOM, ConsoleText, FractionText, AccuracyPercent')
        .text(accuracy + '%').textColor('#FFA500', 1)
        .attr({
          x: player._x - 20,
          y: player._y - 40,
          z: player._z + 1,
          w: 100,
          h: 30
        });

      accuracyTitle = Crafty.e('2D, DOM, ConsoleText, FractionText, AccuracyPercent')
        .text('Tarkkuus').textColor('#FFA500', 1)
        .attr({
          x: accuracyText._x,
          y: accuracyText._y - 20,
          z: accuracyText._z,
          w: 100,
          h: 16
        })
        .textFont({
          size: '20px',
          lineHeight: "20px"
        });

      accuracyText.attach(accuracyTitle);

      world.accuracyText = accuracyText;

      if (!arrowDir) world.tipArrow.flip();

      world.healthBar.changeValue(Math.round((100 - accuracy) / 5) * -1);
      world.healthBar.flash();

      _this.solving = true;

    } else {

      _this.disableControl();

      if (!_this.isPlaying("stand")) {
        _this.pauseAnimation().animate("stand", -1);
      }

      world.answerAxis = createAnswerAxis(answerX, accuracy);
      if (world.answerBox) world.answerBox.visible = false;

      accuracyText = Crafty.e('2D, DOM, ConsoleText, FractionText, AccuracyPercent')
        .text(accuracy + '%')
        .attr({
          x: player._x - 20,
          y: player._y - 40,
          z: player._z + 1,
          w: 100,
          h: 30
        });

      accuracyTitle = Crafty.e('2D, DOM, ConsoleText, FractionText, AccuracyPercent')
        .text('Tarkkuus')
        .attr({
          x: accuracyText._x,
          y: accuracyText._y - 20,
          z: accuracyText._z,
          w: 100,
          h: 16
        })
        .textFont({
          size: '20px',
          lineHeight: "20px"
        });

      accuracyText.attach(accuracyTitle);

      world.accuracyText = accuracyText;

      _this.tipping = false;
      _this.solved = true;
      _this.solving = false;
    }

  },
  showAnswer: function() {
    var _this = this;

    world.healthBar.changeValue(-25);
    world.healthBar.flash();

    var axisLength = 890, // 890 <= 930x - 40x
      question = world.world[0].levels[world.level].question,
      answer = question.decimal ? question.answer.denominator / 100 : question.answer.denominator / question.answer.numerator,
      answerX = answer * axisLength,
      playerX = world.playerLine._x - 40,
      dX = answerX - playerX;

    _this.tipping = true;

    world.tipLine = Crafty.e('2D, DOM, Color, TipLine')
      .color('orange')
      .attr({
        w: 8,
        h: 50,
        x: answerX + 40,
        y: 550 + 38,
        z: 903
      });
  },
  changeLevel: function() {
    var _this = this;

    if (!_this.isPlaying("stand")) {
      _this.pauseAnimation().animate("stand", -1);
    }

    // buginen paska player.tween({ y: -250, x: -240 }, 2000);
    _this.move('n', 400);

    world.level += 1;

    world.answerAxis.destroy();
    world.accuracyText.destroy();
    if (world.tipLine) world.tipLine.destroy();

    var question = world.world[0].levels[world.level].question;

    if (question.type > 0) {
      world.trapConsole.updateConsole(question);
      world.questionConsole.updateConsole(question);

      // ei toimi kääntö. mit vit
      var foo = _this.angle < 0 ? _this.flip() : _this.unflip();
    } else {
      world.jumpButton.destroy();
      world.solveButton.destroy();
      world.playerLine.destroy();
      world.taskBar.destroy();

      _this.gameOver = true;
    }

    _this.solving = false;
    _this.solved = false;

    world.tipButton.triggered = false;

    setTimeout(function() {
      if (question.type > 0) {
        world.ent.move('n', -340);
        _this.enableControl();
      } else {
        world.ent.move('n', -340 - 190);
      }
    }, 1000);

  },
  addPlayerLine: function() {
    var _this = this;

    var playerLine = Crafty.e('2D, DOM, Color, PlayerLine')
      .color('#FFF')
      .attr({
        w: 8,
        h: 50,
        x: _this._x,
        y: 568,
        z: 999
      });

    world.playerLine = playerLine;

    return false;

  },
  init: function() {
    this.startDeviceOrientationListener();
    this.startDeviceMotionListener();
    this.addComponent('2D, Canvas, SpriteAnimation, Keyboard, Collision, Twoway, Gravity, playerSprite')
      .twoway(4, 5)
      .gravity("Platform")
      .reel("stand", 30, 0, 0, 1)
      .reel("walk", 360, 3, 0, 10)
      .reel("jumpStart", 90, [
        [0, 1]
      ])
      .reel("jump", 30, [
        [1, 1]
      ])
      .reel("trap", 120, 0, 2, 2)
      .reel("fly", 30, 0, 3, 2)
      .reel("change", 30, 0, 4, 2)
      .reel("god", 30, 0, 5, 2)
      .bind('Move', function() {
        if (world.tipArrow) world.tipArrow.destroy();
        if (world.accuracyText) world.accuracyText.destroy();
      })
      .bind('AnimationEnd', function(animation) {
        if (animation.id === 'jumpStart') {
          _this.pauseAnimation().animate("jump", -1);
        }
      })
      .bind("EnterFrame", function(frame) {
        _this = this;
        _this.idle = (new Date()).getTime() - _this.idleTime > 60000 ? true : false; // 60 sek

        if (_this.angle < -5) {
          _this.unflip();
        } else if (_this.angle > 5) {
          _this.flip();
        }

        // move playerLine
        if (_this._x < 30) {
          world.playerLine.x = 40;
        } else if (_this._x > 920) {
          world.playerLine.x = 930;
        } else {
          world.playerLine.x = _this._x + 10;
        }

        // motion vars
        var step = 1;

        // Move player with changing angle of the device
        if (_this.deviceOrientation && _this.angleMotion && !_this.solved && !_this.gameOver & !_this.trapping) {
          // Run
          if (Math.abs(_this.angle) > _this.angleStresshold) {
            // Reset idleTimer
            _this.idleTime = (new Date()).getTime();

            if (!_this.isPlaying("walk")) {
              _this.pauseAnimation().animate("walk", -1);
            }

            // step values between 0 and 4
            step = Math.floor(Math.sqrt(Math.abs(_this.angle)));
            // move player
            _this.x = _this._x + (step * (_this.angle < 0 ? 1 : -1));

          } else {
            if (!_this.isPlaying("stand")) {
              _this.pauseAnimation().animate("stand", -1);
            }
          }

          // Jump
          if (_this._falling) {
            if (!_this.isPlaying("jump")) {
              _this.animate("jump", 1);
            }
          }
        }

        // Move player with cha changing angle of the device
        if (_this.deviceMotion && _this.shakeMotion && !_this.solved && !_this.gameOver & !_this.trapping) {

          // force jump to work
          if (_this._falling) {
            _this.motion = 2000;
          }
          // Run
          if (_this.motion > _this.shakeStresshold) {
            // Reset idleTimer
            _this.idleTime = (new Date()).getTime();

            if (_this._falling) {
              if (!_this.isPlaying("jump")) {
                _this.pauseAnimation().animate("jump", -1);
              }
            } else {
              if (!_this.isPlaying("walk")) {
                _this.pauseAnimation().animate("walk", -1);
              }
            }

            // step values between 0 and 4
            step = Math.floor(Math.sqrt(Math.abs(_this.angle)));
            // move player
            _this.x = _this._x + (step * (_this.angle < 0 ? 1 : -1));

          } else {
            if (!_this.isPlaying("stand")) {
              _this.pauseAnimation().animate("stand", -1);
            }
          }

          // Jump
          if (_this._falling) {
            if (!_this.isPlaying("jump")) {
              _this.animate("jump", 1);
            }
          }
        }

        // Keyboard
        if (_this.keyboardMotion && !_this.solved && !_this.gameOver & !_this.trapping) {
          if (_this.isDown("UP_ARROW")) {
            // Reset idleTimer
            _this.idleTime = (new Date()).getTime();

            if (_this._falling) {
              if (!_this.isPlaying("jump") && !_this.isPlaying("jumpStart")) {
                _this.pauseAnimation().animate("jumpStart");
              }
            } else {
              if (!_this.isPlaying("stand")) {
                _this.pauseAnimation().animate("stand");
              }
            }

          } else if (_this.isDown("RIGHT_ARROW")) {
            _this.angle = -(_this.angleStresshold);
            // Reset idleTimer
            _this.idleTime = (new Date()).getTime();

            if (_this._falling) { // jump
              if (!_this.isPlaying("jump")) {
                _this.animate("jump", 1);
              }
            } else { // run
              if (!_this.isPlaying("walk")) {
                _this.pauseAnimation().animate("walk", -1);
              }
            }
          } else if (_this.isDown("LEFT_ARROW")) {
            _this.angle = _this.angleStresshold;
            // Reset idleTimer
            _this.idleTime = (new Date()).getTime();

            if (_this._falling) { // jump
              if (!_this.isPlaying("jump")) {
                _this.pauseAnimation().animate("jump");
              }
            } else { // run
              if (!_this.isPlaying("walk")) {
                _this.pauseAnimation().animate("walk", -1);
              }
            }
          } else {
            if (!_this.isPlaying("stand")) {
              _this.pauseAnimation().animate("stand");
            }
          }
        }

        if (_this.trapping) {
          if (!_this.isPlaying("trap")) {
            _this.pauseAnimation().animate("trap", -1);
          }
        }

        // boundaries min&max
        if (_this._x < 30) {
          _this.x = 30;
          if (!_this.isPlaying("stand")) {
            _this.pauseAnimation().animate("stand");
          }
        } else if (_this._x > 920) {
          _this.x = 920;
          if (!_this.isPlaying("stand")) {
            _this.pauseAnimation().animate("stand");
          }
        }

      })
      .addPlayerLine();
  }

});


Crafty.c('GoalSprite', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, goalSprite')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('BgSprite01', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, bgSprite01')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('BgSprite02', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, bgSprite02')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('BgSprite03', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, bgSprite03')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('BgSprite04', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, bgSprite04')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('BgSprite05', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, bgSprite05')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('BgSprite06', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, bgSprite06')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('SkySprite01', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, skySprite01')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('SkySprite02', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, skySprite02')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('SkySprite03', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, skySprite03')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('VaseSprite01', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, Gravity, vaseSprite01')
      .gravity("Platform")
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('VaseSprite02', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, Gravity, vaseSprite02')
      .gravity("Platform")
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('GoatSprite', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, Gravity, goatSprite')
      .gravity("Platform")
      .reel("init", 30, 0, 0, 1);
  }
});

Crafty.c('Fog', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, fogSprite')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('Ground', {
  init: function() {
    this.addComponent('2D, Canvas, SpriteAnimation, groundSprite')
      .reel("init", 30, [
        [0, 0]
      ]);
  }
});

Crafty.c('JumpButton', {
  init: function() {
    this.addComponent('Button, Image')
      .image("images/gui/jumpButton.png")
      .button(function() {
        player.idleTime = (new Date()).getTime();
        if (player.solved) {
          player.solved = false;
          player.changeLevel();
        } else {
          Crafty.trigger("KeyDown", {
            key: 38
          });
        }

      });
  }
});

Crafty.c('ExitButton', {
  init: function() {
    this.addComponent('Button, Image')
      .image("images/gui/closeButton.png")
      .button(function() {
        location.href = '/tulos-4';
      });
  }
});

Crafty.c('SolveButton', {
  init: function() {
    this.addComponent('Button, Image')
      .image("images/gui/solveButton.png")
      .button(function() {
        if (!player.solved) {
          player.solveLevel();
        }
      });
  }
});

function createTaskBar() {
  var tb = Crafty.e('2D, DOM, Color, TaskBar')
    .color('#888')
    .attr({
      w: TULOS.canvas.width,
      h: 190,
      x: 0,
      y: 748 - 190,
      z: 900
    });

  var qc = createQuestionConsole(tb);
  world.questionConsole = qc;

  var tc = createTrapConsole(tb, qc);
  world.trapConsole = tc;

  var bar = createHealthBar(tb);

  var a = createQuestionAxis(tb);

  tb.attach(qc, tc, a, bar);

  return tb;
}

function createQuestionAxis(tb) {
  var a = Crafty.e('2D, DOM, Color, QuestionAxis')
    .color('#666')
    .attr({
      w: 960,
      h: 50,
      x: 10,
      y: tb._y + 10,
      z: tb._z + 1
    });

  var line = Crafty.e('2D, DOM, Color, Line')
    .color('#FFF')
    .attr({
      w: 898,
      h: 8,
      x: a._x + 30,
      y: a._y + 22,
      z: a._z + 1
    });

  var startLine = Crafty.e('2D, DOM, Color, StartLine')
    .color('#FFF')
    .attr({
      w: 8,
      h: 50,
      x: a._x + 30,
      y: a._y,
      z: a._z + 1
    });

  var endLine = Crafty.e('2D, DOM, Color, EndLine')
    .color('#FFF')
    .attr({
      w: 8,
      h: 50,
      x: a._x + a._w - 40,
      y: a._y,
      z: a._z + 1
    });

  var zero = Crafty.e("2D, DOM, Text")
    .attr({
      x: a._x + 6,
      y: a._y,
      z: a._z + 1
    })
    .textFont({
      size: '46px',
      family: 'BebasNeue'
    })
    .textColor('#ffffff', 1)
    .text("0");

  var one = Crafty.e("2D, DOM, Text")
    .attr({
      x: a._x + a._w - 25,
      y: a._y,
      z: a._z + 1
    })
    .textFont({
      size: '46px',
      family: 'BebasNeue'
    })
    .textColor('#ffffff', 1)
    .text("1");

  a.attach(line, startLine, endLine, zero, one);

  return a;
}

function createAnswerAxis(answerX, accuracy) {
  var a = Crafty.e('2D, DOM, Color, AnswerAxis')
    .attr({
      w: 960,
      h: 50,
      x: 10,
      y: 748 - 190 + 10,
      z: 910
    });

  var line = Crafty.e('2D, DOM, Color, Line')
    .color('#6EC96E')
    .attr({
      w: answerX,
      h: 8,
      x: a._x + 30,
      y: a._y + 22,
      z: a._z + 1
    });

  var startLine = Crafty.e('2D, DOM, Color, StartLine')
    .color('#6EC96E')
    .attr({
      w: 8,
      h: 50,
      x: a._x + 30,
      y: a._y,
      z: a._z + 1
    });

  var answerLine = Crafty.e('2D, DOM, Color, AnswerLine')
    .color('#6EC96E')
    .attr({
      w: 8,
      h: 50,
      x: answerX + 40,
      y: world.playerLine._y,
      z: world.playerLine._z + 3,
    });

  var playerLine = Crafty.e('2D, DOM, Color, PlayerAnswerLine')
    .color('#FFFFFF')
    .attr({
      w: 8,
      h: 50,
      x: world.playerLine._x,
      y: world.playerLine._y,
      z: world.playerLine._z + 2,
    });

  a.attach(line, startLine, answerLine, playerLine);

  return a;
}

function createHealthBar(tb) {

  var bar = Crafty.e('2D, DOM, Color, HealthBarContainer')
    .color('#666')
    .attr({
      w: 34,
      h: 600,
      x: 980,
      y: tb._y - 420,
      z: tb._z + 1
    });

  var healthBar = Crafty.e('HealthBar')
    .attr({
      w: bar._w - 16,
      h: bar._h - 16,
      x: bar._x + 8,
      y: bar._y + 8,
      z: bar._z + 1
    });

  bar.attach(healthBar);

  world.healthBar = healthBar;

  return bar;
}

function createQuestionConsole(tb) {

  var qc = Crafty.e('QuestionConsole')
    .attr({
      x: 10,
      y: tb._y + 70,
      z: tb._z + 1
    });

  var qi = Crafty.e('2D, DOM, Color, TrapIcon')
    .color('#999')
    .attr({
      x: qc._x + 5,
      y: qc._y + 5,
      h: qc._h - 10,
      w: qc._h - 10,
      z: qc._z + 1
    });

  qc.attach(qi);

  world.questionConsole = qc;

  return qc;
}

function createTrapConsole(tb, qc) {

  var tc = Crafty.e('TrapConsole')
    .attr({
      x: qc._x + qc._w + 10,
      y: tb._y + 70,
      z: tb._z + 1
    });

  var ti = Crafty.e('2D, DOM, Color, TrapIcon')
    .color('#999')
    .attr({
      x: tc._x + 5,
      y: tc._y + 5,
      h: tc._h - 10,
      w: tc._h - 10,
      z: tc._z + 1
    });

  tc.attach(ti);

  world.trapConsole = tc;

  return tc;
}

Crafty.c('TipButton', {
  triggered: false,
  init: function() {
    this.addComponent('Button, Collision')
      .attr({
        z: 999
      })
      .button(function() {
        if (!this.triggered) {
          this.triggered = true;
          player.showAnswer();
        }
      });
  }
});

Crafty.c('HealthBar', {
  value: 100,
  origHeight: 584,
  init: function() {
    this.addComponent('2D, DOM, Color')
      .color('#6EC96E');
  },
  flash: function() {
    var $hb = $('.HealthBar');
    $hb.addClass('animated flash');
    setTimeout(function() {
      $hb.removeClass('animated flash');
    }, 1200);
  },
  changeValue: function(diff) {
    var _this = this;

    _this.value = _this.value + diff;

    if (_this.value <= 0) {
      _this.h = 0;
      _this.value = 0;
      alert('Game Over!');
    } else if (_this.value < 33) { // < 33%
      _this.color('#C90E0E'); // red
    } else if (_this.value > 33 && _this.value < 75) { // 33 < value < 75
      _this.color('#DFA81B'); // orange
    }

    var newHeight = (_this.origHeight * _this.value) / 100;
    var oldHeight = _this._h;

    _this.h = newHeight;
    _this.y = _this._y + (oldHeight - newHeight);
  }

});

Crafty.c('QuestionConsole', {
  ent: null,
  init: function() {
    this.addComponent('2D, DOM, Color')
      .color('#666')
      .attr({
        w: 600,
        h: 110,
      });
  },
  updateConsole: function(question) {
    var _this = this;

    // clear old one
    if (!_.isNull(_this.ent)) _this.ent.destroy();

    if (question.decimal) {
      if (question.type === 1) {
        _this.ent = Crafty.e("QuestionDecimal").text("0," + question.values[0].denominator);
      } else {

        var cont = Crafty.e('QuestionContainer');

        var frst = Crafty.e("QuestionDecimal")
          .text("0," + question.values[0].denominator)
          .attr({
            x: cont._x,
            y: cont._y,
            w: cont._w / 3,
            h: cont._h
          });

        var scnd = Crafty.e("QuestionDecimal")
          .text("0," + question.values[0].denominator)
          .attr({
            x: cont._x + cont._w / 3,
            y: cont._y,
            w: cont._w / 3,
            h: cont._h
          });

        var sgn = Crafty.e("2D, DOM, ConsoleText, QuestionSign")
          .text("0," + question.values[1].denominator)
          .attr({
            x: cont._x + (cont._w / 3) - 15,
            y: cont._y + 3,
            z: cont._z + 1,
            w: 30,
            h: cont._h
          }).text(question.type === 2 ? '+' : '-');

        var ql = Crafty.e("2D, DOM, ConsoleText, EqualSign")
          .attr({
            x: cont._x + ((cont._w / 3) * 2) - 15,
            y: cont._y + 3,
            z: cont._z + 4,
            w: 30,
            h: cont._h
          }).text("=");

        var nswr = Crafty.e("QuestionDecimal")
          .text("0," + question.answer.denominator)
          .attr({
            x: cont._x + (cont._w / 3) * 2,
            y: cont._y,
            w: cont._w / 3,
            h: cont._h
          });

        var nswrBox = Crafty.e('2D, DOM, Color, AnswerBox')
          .color('#666')
          .attr({
            w: nswr._w,
            h: nswr._h,
            x: nswr._x,
            y: nswr._y,
            z: nswr._z + 1
          });

        world.answerBox = nswrBox;

        cont.attach(frst, scnd, sgn, ql, nswr, nswrBox);
        _this.ent = cont;
      }
    } else {
      _this.ent = Crafty.e("QuestionFraction");
      _this.ent.updateFraction(question);
    }

    _this.attach(_this.ent);
  }
});

Crafty.c('QuestionDecimal', {
  init: function() {
    this.addComponent("2D, DOM, ConsoleText, QuestionDecimal")
      .attr({
        x: 120,
        y: 634,
        z: 902,
        w: 485,
        h: 100
      });
  }
});

Crafty.c('QuestionContainer', {
  init: function() {
    this.addComponent("2D, DOM")
      .attr({
        w: 485,
        h: 100,
        z: 902,
        x: 120,
        y: 633
      });
  }
});

Crafty.c('QuestionFraction', {
  init: function() {
    this.addComponent("2D, DOM")
      .attr({
        w: 485,
        h: 100,
        z: 902,
        x: 120,
        y: 633
      });
  },
  updateFraction: function(question) {
    var _this = this;

    if (_.isObject(question)) {

      if (question.type === 1) {

        var questionNumerator = Crafty.e("2D, DOM, ConsoleText, FractionText, QuestionNumerator")
          .attr({
            x: _this._x,
            y: _this._y + 55,
            z: _this._z + 1,
            w: _this._w,
            h: _this._h / 2 - 5
          }).text(question.values[0].numerator);

        var questionDenominator = Crafty.e("2D, DOM, ConsoleText, FractionText, QuestionDenominator")
          .attr({
            x: _this._x,
            y: _this._y + 3,
            z: _this._z + 1,
            w: _this._w,
            h: _this._h / 2 - 10
          }).text(question.values[0].denominator);

        var fractionLine = Crafty.e('2D, DOM, Color, FractionLine')
          .color('#FFF')
          .attr({
            w: 70,
            h: 7,
            x: _this._x + 210,
            y: _this._y + 48,
            z: _this._z + 1
          });

        _this.attach(fractionLine, questionDenominator, questionNumerator);

      } // one number
      else {

        var questionNumerator0 = Crafty.e("2D, DOM, ConsoleText, FractionText, QuestionNumerator")
          .attr({
            x: _this._x,
            y: _this._y + 55,
            z: _this._z + 1,
            w: _this._w / 3,
            h: _this._h / 2 - 5
          }).text(question.values[0].numerator);

        var questionDenominator0 = Crafty.e("2D, DOM, ConsoleText, FractionText, QuestionDenominator")
          .attr({
            x: _this._x,
            y: _this._y + 3,
            z: _this._z + 1,
            w: _this._w / 3,
            h: _this._h / 2 - 10
          }).text(question.values[0].denominator);

        var fractionLine0 = Crafty.e('2D, DOM, Color, FractionLine')
          .color('#FFF')
          .attr({
            w: 70,
            h: 7,
            x: _this._x + 45,
            y: _this._y + 48,
            z: _this._z + 1
          });

        var questionNumerator1 = Crafty.e("2D, DOM, ConsoleText, FractionText, QuestionNumerator")
          .attr({
            x: _this._x + 225 - 55 - 9,
            y: _this._y + 55,
            z: _this._z + 1,
            w: _this._w / 3,
            h: _this._h / 2 - 5
          }).text(question.values[1].numerator);

        var questionDenominator1 = Crafty.e("2D, DOM, ConsoleText, FractionText, QuestionDenominator")
          .attr({
            x: _this._x + 225 - 55 - 9,
            y: _this._y + 3,
            z: _this._z + 1,
            w: _this._w / 3,
            h: _this._h / 2 - 10
          }).text(question.values[1].denominator);

        var fractionLine1 = Crafty.e('2D, DOM, Color, FractionLine')
          .color('#FFF')
          .attr({
            w: 70,
            h: 7,
            x: _this._x + 310 - 55 - 40 - 9,
            y: _this._y + 48,
            z: _this._z + 1
          });

        var sign = Crafty.e("2D, DOM, ConsoleText,  QuestionSign")
          .attr({
            x: _this._x + 150 - 5,
            y: _this._y + 3,
            z: _this._z + 1,
            w: 30,
            h: _this._h
          }).text(question.type === 2 ? '+' : '-');

        var equal = Crafty.e("2D, DOM, ConsoleText, EqualSign")
          .attr({
            x: _this._x + 325 - 17,
            y: _this._y + 3,
            z: _this._z + 10,
            w: 30,
            h: _this._h
          }).text('=');

        var answerContainer = Crafty.e('2D, DOM, Color, AnswerContainer')
          .attr({
            w: _this._w / 3,
            h: _this._h,
            x: _this._x + 350 - 27,
            y: _this._y,
            z: _this._z + 1
          });

        var answerNumerator = Crafty.e("2D, DOM, ConsoleText, FractionText, AnswerNumerator")
          .attr({
            x: answerContainer._x,
            y: answerContainer._y + 55,
            z: answerContainer._z + 1,
            w: answerContainer._w,
            h: answerContainer._h / 2
          }).text(question.answer.numerator);

        var answerDenominator = Crafty.e("2D, DOM, ConsoleText, FractionText, AnswerDenominator")
          .attr({
            x: answerContainer._x,
            y: answerContainer._y + 3,
            z: answerContainer._z + 1,
            w: answerContainer._w,
            h: answerContainer._h / 2
          }).text(question.answer.denominator);

        var fractionLine2 = Crafty.e('2D, DOM, Color, FractionLine')
          .color('#FFF')
          .attr({
            w: 70,
            h: 7,
            x: answerContainer._x + 45,
            y: answerContainer._y + 48,
            z: answerContainer._z + 1
          });

        var answerBox = Crafty.e('2D, DOM, Color, AnswerBox')
          .color('#666')
          .attr({
            w: answerContainer._w,
            h: answerContainer._h,
            x: answerContainer._x,
            y: answerContainer._y,
            z: answerContainer._z + 2
          });

        world.answerBox = answerBox;

        _this.attach(fractionLine0, questionDenominator0, questionNumerator0, fractionLine1, questionDenominator1, questionNumerator1, sign, equal, answerContainer, answerNumerator, answerDenominator, fractionLine2, answerBox);

      } // + and -

    }
  }
});

Crafty.c('ConsoleText', {
  init: function() {
    this.addComponent('Text')
      .textFont({
        size: '46px',
        family: 'BebasNeue',
        lineHeight: "100px"
      })
      .css("textAlign", "center")
      .textColor('#ffffff', 1);
  }
});

Crafty.c('FractionText', {
  init: function() {
    this.addComponent('Text')
      .textFont({
        lineHeight: "45px"
      });
  }
});

Crafty.c('TrapConsole', {
  ent: null,
  init: function() {
    this.addComponent('2D, DOM, Color')
      .color('#666')
      .attr({
        w: 350,
        h: 110
      });
  },
  updateConsole: function(question) {
    var _this = this,
      trap = question.trap;

    // clear old one
    if (!_.isNull(_this.ent)) _this.ent.destroy();

    if (question.decimal) {
      _this.ent = Crafty.e("TrapDecimal").text("0," + trap.denominator);
    } else {
      _this.ent = Crafty.e("TrapFraction");
      _this.ent.updateFraction(trap);
    }

    _this.attach(_this.ent);
  }
});
Crafty.c('Trap', {
  triggered: false,
  init: function() {
    this.addComponent('2D, Canvas, Collision')
      .attr({
        w: 5,
        h: 5,
        z: 2
      })
      .onHit('Player', function()  {
        if (!this.triggered) {
          this.triggered = true;
          this.addComponent('Color').color('#222');

          player.trapping = true;
          player.disableControl();

          setTimeout(function() {
            player.trapping = false;
            player.enableControl();
          }, 1500);

          world.healthBar.changeValue(-5);
          world.healthBar.flash();
        }
      });
  }
});

Crafty.c('TrapFraction', {
  init: function() {
    this.addComponent("2D, DOM")
      .attr({
        w: 235,
        h: 100,
        z: 902,
        x: 730,
        y: 633
      });
  },
  updateFraction: function(trap) {
    var _this = this;

    if (_.isObject(trap)) {

      var trapNumerator = Crafty.e("2D, DOM, ConsoleText, FractionText, TrapNumerator")
        .attr({
          x: _this._x,
          y: _this._y + 55,
          z: _this._z + 1,
          w: _this._w,
          h: _this._h / 2 - 5
        }).text(trap.numerator);

      var trapDenominator = Crafty.e("2D, DOM, ConsoleText, FractionText, TrapDenominator")
        .attr({
          x: _this._x,
          y: _this._y + 5,
          z: _this._z + 1,
          w: _this._w,
          h: _this._h / 2 - 10
        }).text(trap.denominator);

      var fractionline = Crafty.e('2D, DOM, Color, FractionLine')
        .color('#FFF')
        .attr({
          w: 70,
          h: 7,
          x: _this._x + 80,
          y: _this._y + 48,
          z: _this._z + 1
        });

      _this.attach(fractionline, trapDenominator, trapNumerator);

    }
  }
});

Crafty.c('TrapDecimal', {
  init: function() {
    this.addComponent("2D, DOM, Text, TrapDecimal")
      .attr({
        x: 735,
        y: 634,
        z: 902,
        w: 230,
        h: 100
      })
      .textFont({
        size: '46px',
        family: 'BebasNeue',
        lineHeight: "100px"
      })
      .css("textAlign", "center")
      .textColor('#ffffff', 1);
  }
});