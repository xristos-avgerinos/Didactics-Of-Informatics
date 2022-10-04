      function Polynomial (config){
        this.a = config.a;
        this.b = config.b;
        this.c = config.c; 
        this.d = config.d; 
        this.increment = config.increment; 
      }

      Polynomial.prototype.fx = function(x){
        var y = a*x^3 + b*x^2 + c*x + d;
        return y; 
      }