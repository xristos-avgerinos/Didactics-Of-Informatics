
      function Graph(config) {
		  
        // user defined properties
        this.canvas = document.getElementById(config.canvasId);
		//this.clearAll();
        this.minX = config.minX;
        this.minY = config.minY;
        this.maxX = config.maxX;
        this.maxY = config.maxY;
        this.unitsPerTick = config.unitsPerTick;

        // constants
        this.axisColor = '#232B2B';
        this.font = '10pt Calibri';
        this.tickSize = 18;

        // relationships
        this.context = this.canvas.getContext('2d');
        this.rangeX = this.maxX - this.minX;
        this.rangeY = this.maxY - this.minY;
        this.unitX = this.canvas.width / this.rangeX;
        this.unitY = this.canvas.height / this.rangeY;
        this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
        this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
        this.iteration = (this.maxX - this.minX) / 1000;
        this.scaleX = this.canvas.width / this.rangeX;
        this.scaleY = this.canvas.height / this.rangeY;

        // draw x and y axis
        this.drawXAxis();
        this.drawYAxis();
		
      }

      Graph.prototype.drawXAxis = function() {
        var context = this.context;
        context.save();
        context.beginPath();
        context.moveTo(0, this.centerY);
        context.lineTo(this.canvas.width, this.centerY);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();

        // draw tick marks
        var xPosIncrement = this.unitsPerTick * this.unitX;
        var xPos, unit;
        context.font = this.font;
        context.textAlign = 'center';
        context.textBaseline = 'top';

        // draw left tick marks
        xPos = this.centerX - xPosIncrement;
        unit = -1 * this.unitsPerTick;
        while(xPos > 0) {
          context.moveTo(xPos, this.centerY - this.tickSize / 2);
          context.lineTo(xPos, this.centerY + this.tickSize / 2);
          context.stroke();
          context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
          unit -= this.unitsPerTick;
          xPos = Math.round(xPos - xPosIncrement);
        }

        // draw right tick marks
        xPos = this.centerX + xPosIncrement;
        unit = this.unitsPerTick;
        while(xPos < this.canvas.width) {
          context.moveTo(xPos, this.centerY - this.tickSize / 2);
          context.lineTo(xPos, this.centerY + this.tickSize / 2);
          context.stroke();
          context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
          unit += this.unitsPerTick;
          xPos = Math.round(xPos + xPosIncrement);
        }
        context.restore();
      };

      Graph.prototype.drawYAxis = function() {
        var context = this.context;
        context.save();
        context.beginPath();
        context.moveTo(this.centerX, 0);
        context.lineTo(this.centerX, this.canvas.height);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();

        // draw tick marks
        var yPosIncrement = this.unitsPerTick * this.unitY;
        var yPos, unit;
        context.font = this.font;
        context.textAlign = 'right';
        context.textBaseline = 'middle';

        // draw top tick marks
        yPos = this.centerY - yPosIncrement;
        unit = this.unitsPerTick;
        while(yPos > 0) {
          context.moveTo(this.centerX - this.tickSize / 2, yPos);
          context.lineTo(this.centerX + this.tickSize / 2, yPos);
          context.stroke();
          context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
          unit += this.unitsPerTick;
          yPos = Math.round(yPos - yPosIncrement);
        }

        // draw bottom tick marks
        yPos = this.centerY + yPosIncrement;
        unit = -1 * this.unitsPerTick;
        while(yPos < this.canvas.height) {
          context.moveTo(this.centerX - this.tickSize / 2, yPos);
          context.lineTo(this.centerX + this.tickSize / 2, yPos);
          context.stroke();
          context.fillText(unit, this.centerX - this.tickSize / 2 - 3, yPos);
          unit -= this.unitsPerTick;
          yPos = Math.round(yPos + yPosIncrement);
        }
        context.restore();
      };

	var YaxisValues = [];
      Graph.prototype.drawPolynomial = function(polynomialequation, a, b, c, d, increment, isIntegral, color, thickness, startx, endx){


        var totalArea = 0.0;

        var context = this.context;
        context.save();
        context.save();
        this.transformContext();
        context.beginPath();
        context.moveTo(this.minX, polynomialequation(a, b, c, d, this.minX));

        for(var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
          context.lineTo(x, polynomialequation(a, b, c, d, x));
        }

        context.restore();
        context.lineJoin = 'round';
        context.lineWidth = thickness;
        context.strokeStyle = color;
        context.stroke();
        context.restore();

        if (isIntegral){
            var context = this.context;
            context.save();
            this.transformContext();

            var currentY = 0.0;

            context.lineWidth = 0.1;
            context.strokeStyle = '#BC1E47';

            for(var x = startx; x < endx; x += increment) {
              context.beginPath();
              currentY = polynomialequation(a, b, c, d, (x+increment/2.0));
              context.rect(x, 0, increment, currentY);
			  YaxisValues.push(currentY);
              totalArea += increment * currentY;
              context.stroke();
            }           
			
        }

        return totalArea.toFixed(2);

      }

      Graph.prototype.drawEquation = function(equation, color, thickness) {


        var context = this.context;
        context.save();
        context.save();
        this.transformContext();

        context.beginPath();
        context.moveTo(this.minX, equation(this.minX));

        for(var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
          context.lineTo(x, equation(x));
        }

        context.restore();
        context.lineJoin = 'round';
        context.lineWidth = thickness;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
      };

      Graph.prototype.clearAll = function(){
        var context = this.context; 
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      Graph.prototype.drawRect = function (x, y, width, height){
        var context = this.context; 
        this.transformContext();
        context.strokeStyle = 'pink';
        context.fillRect(x - (width/2), y - (height/2), width, height);
      }

       Graph.prototype.drawLine = function(slope, yintercept, color, thickness) {

        console.log("Inside drawline");

        console.log("this.maxX: " + this.maxX + " this.maxY: " + this.maxY);

        var context = this.context;

        // draw x and y axis
        this.drawXAxis();
        this.drawYAxis();

        //context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        context.save();
        context.save();
        this.transformContext();

        console.log("this.minX: " + this.minX);
        console.log("this.iteration: " + this.iteration);
        console.log("yintercept: " + yintercept);
        console.log("slope:" + slope);

        context.beginPath();
        context.moveTo(this.minX, slope * this.minX + yintercept);

        for(var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
          if (this.iteration % 200 == 0){
           console.log("x: " + x + " y: " + (slope * x + yintercept));
          }
          context.lineTo(x, slope * x + yintercept);
        }

        context.restore();
        context.lineJoin = 'round';
        context.lineWidth = thickness;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
      };

      Graph.prototype.drawPoint = function() {

      }

      Graph.prototype.transformContext = function() {
        var context = this.context;

        // move context to center of canvas
        this.context.translate(this.centerX, this.centerY);

        /*
         * stretch grid to fit the canvas window, and
         * invert the y scale so that that increments
         * as you move upwards
         */
        context.scale(this.scaleX, -this.scaleY);
      };
    