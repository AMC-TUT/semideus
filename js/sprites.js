
var sprites = {
  "playerSprite": {
    "image": {
      "url": "images/player/player.png",
      "frameWidth": 84,
      "frameHeight": 190
    },
    "stand": {
      "x": 0,
      "y": 0
    },
    "walk": {
      "x": 2,
      "toX": 12,
      "y": 0,
      "duration": 30,
      "repeats": -1
    },
    "jump": {
      "x": 0,
      "toX": 1,
      "y": 1
    },
    "trap": {
      "x": 0,
      "toX": 1,
      "y": 2
    },
    "fly": {
      "x": 0,
      "toX": 1,
      "y": 3
    },
    "change": {
      "x": 0,
      "toX": 1,
      "y": 4
    },
    "god": {
      "x": 0,
      "toX": 1,
      "y": 5
    },
  },
  "goatSprite": {
    "image": {
      "url": "images/elements/mountaingoat.png",
      "frameWidth": 110,
      "frameHeight": 115
    },
    "init": {
      "x": 0,
      "toX": 5,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "goalSprite": {
    "image": {
      "url": "images/elements/goal.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "bgSprite01": {
    "image": {
      "url": "images/elements/back01.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "bgSprite02": {
    "image": {
      "url": "images/elements/back02.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "bgSprite03": {
    "image": {
      "url": "images/elements/back03.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "bgSprite04": {
    "image": {
      "url": "images/elements/back04.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "bgSprite05": {
    "image": {
      "url": "images/elements/back05.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "bgSprite06": {
    "image": {
      "url": "images/elements/back06.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "skySprite01": {
    "image": {
      "url": "images/elements/sky01.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "skySprite02": {
    "image": {
      "url": "images/elements/sky02.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "skySprite03": {
    "image": {
      "url": "images/elements/sky03.png",
      "frameWidth": 1024,
      "frameHeight": 340
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "fogSprite": {
    "image": {
      "url": "images/elements/fog.png",
      "frameWidth": 1027,
      "frameHeight": 233
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "groundSprite": {
    "image": {
      "url": "images/elements/ground.png",
      "frameWidth": 1027,
      "frameHeight": 10
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "vaseSprite01": {
    "image": {
      "url": "images/elements/vase01.png",
      "frameWidth": 59,
      "frameHeight": 51
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  },
  "vaseSprite02": {
    "image": {
      "url": "images/elements/vase02.png",
      "frameWidth": 59,
      "frameHeight": 51
    },
    "init": {
      "x": 0,
      "toX": 1,
      "y": 0,
      "duration": 30,
      "repeats": -1
    }
  }
};

// _.each(sprites, function(sprite, name) {
//   var image = sprite.image;
//   console.log(image);
//   console.log(name);

//   Crafty.sprite(image.frameWidth, image.frameHeight, image.url, {
//     name: [0,0]
//   });

// });


    // Sprites
    // _.each(floor.items, function(item) {
    //   var ent = Crafty.e('2D, DOM, SpriteAnimation, ' + item.name)
    //     .attr({ x: 0, y: 0, z: 2 });

    //   // var animations = _.find(sprites, function(sprite, key){ return  key === item.name; });
    //   // _.each(animations, function(animation, name) {
    //   //   if(name !== 'image') {
    //   //     // var array = [animation.x, animation.y];
    //   //     // if(_.isNumber(animation.toX)) {
    //   //     //   var slice = animation.x  + 1;
    //   //     //   while(slice <= animation.toX) {
    //   //     //     array.push([slice, animation.y]);
    //   //     //     console.log(name + ' ' + animation.toX + ' ' + slice);
    //   //     //     slice += 1;
    //   //     //   }
    //   //     // }
    //   //     // console.log(array);
    //   //     var duration = animation.duration ? animation.duration : 0;
    //   //     var repeats = animation.repeats ? animation.repeats : 0;
    //   //     var toX = animation.toX ? (animation.toX - animation.x) + 1 : 1;

    //   //     ent.reel(name, duration, animation.x, animation.y, toX);
    //   //   }
    //   // });
    // });