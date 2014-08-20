Crafty.c('Text2', {
  init: function() {
    this.requires('2D, DOM, Text');
    this.unselectable();
  },
  setStyle: function(styleObject) {
    for (var property in styleObject) {
      var propertyFunctionName = 'set' + property.substr(0, 1).toUpperCase() + property.substr(1);

      this[propertyFunctionName](styleObject[property]);
    }
    return this;
  },
  setAlign: function(align) {
    /*var parameters = align.split(',');

    this.css('text-align', parameters[0]);

    if(parameters.length > 1) {
      console.log(parameters[1]);
      this.css('vertical-align', parameters[1]);
    }*/
    this.css('text-align', align);
    return this;
  },
  //Arguments should be in order 'color, width, padding, style' like '#FF0000, 5, 4px 2px, dashed'
  //No arguments clear the border. Style is considered 'solid' unless 4th argument is defined
  setBorder: function(border) {
    var parameters = border.split(',');

    this.css('border-style', 'solid');

    switch (parameters.length) {
      case 4:
        this.css('border-style', parameters[3]);
        break;
      case 3:
        this.css('padding', parameters[2]);
        break;
      case 2:
        this.css('border-width', parameters[1]);
        break;
      case 1:
        this.css('border-color', parameters[0]);
        break;
      case 0:
        this.css('border-style', 'none');
    }
    return this;
  },
  setColor: function(color) {
    this.textColor(color);
    return this;
  },
  setFont: function(font) {
    this.textFont('family', font);
    return this;
  },
  setHeight: function(height) {
    //this.css('height', height);
    this.h = height;
    return this;
  },
  setSize: function(size) {
    this.textFont('size', size + 'px');
    return this;
  },
  setType: function(type) {
    if (type === 'bold') {
      this.textFont('weight', 'bold');
    } else if (type === 'italic') {
      this.textFont('type', 'italic');
    }
    return this;
  },
  setWidth: function(width) {
    //this.css('width', width);
    this.w = width;
    return this;
  }
});

Crafty.c('Button', {
  init: function() {
    this.requires('2D, DOM, Mouse');
  },
  button: function(clickFunction) {
    this._clickFunction = clickFunction;

    this.bind('MouseDown', function() {
      if (!this.has('disabled')) {
        this._clickFunction(this);
      }
    });
    return this;
  },
  disable: function(on) {
    if (on) {
      this.addComponent('disabled');
      this.attr({
        alpha: 0.5
      });
    } else {
      this.removeComponent('disabled');
      this.attr({
        alpha: 1
      });
    }
    return this;
  },
  execute: function(alwaysExecute) {
    if (alwaysExecute || !this.has('disabled')) {
      this._clickFunction(this);
    }
  },
  hide: function(hide) {
    if (arguments.length === 0) hide = true;

    this.visible = !hide;

    for (var i in this._children) {
      this._children[i].visible = !hide;
    }
  },
  setMouseHover: function(hoverFunction) {
    this._hoverFunction = hoverFunction;

    this.bind('MouseOver', function() {
      this._hoverFunction(this, true);
    });
    this.bind('MouseOut', function() {
      this._hoverFunction(this, false);
    });
  }
});

Crafty.c('Popup', {
  init: function() {
    this.requires('2D, DOM, Color');
  },
  setBackground: function(backgroundMargin, backgroundColor, alpha) {
    this._backgroundMargin = backgroundMargin;
    this._backgroundAlpha = alpha;
    this.color(backgroundColor);

    return this;
  },
  addContent: function(content) {
    this.w = Math.max(this._w, content._x + content._w) + this._backgroundMargin * 2;
    this.h = Math.max(this._h, content._y + content._h) + this._backgroundMargin * 2;
    this.alpha = this._backgroundAlpha;

    content.attr({
      x: content._x + this._x + this._backgroundMargin,
      y: content._y + this._y + this._backgroundMargin,
      z: this._z + 1
    });

    this.attach(content);

    return this;
  }
});