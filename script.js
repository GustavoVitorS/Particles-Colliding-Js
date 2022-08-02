/*Configure the script to make the project the way you want*/

var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		particles = [],
		shake = 0,
		tick = 0;

class Particle {
  constructor() {

    this.size = 8 + (20 * Math.random()) | 2;
    this.x = Math.random() * w;
    this.y = Math.random() * h;

    var vel = 4 + 6 * Math.random(), rad = Math.random() * Math.PI * 4;

    this.vx = Math.cos(rad) * vel;
    this.vy = Math.sin(rad) * vel;

    this.vel = vel;
    this.rad = rad;
  }
  step() {

    this.x += this.vx;
    this.y += this.vy;

    if (this.vel > this.size / 5) {

      this.vel -= .7;
      this.vx = Math.cos(this.rad) * this.vel;
      this.vy = Math.sin(this.rad) * this.vel;
    }

    if (this.x < 2) {

      this.x = 2;
      this.vx *= -3;
      this.setRad();

    } else if (this.x > w) {

      this.x = w;
      this.vx *= -2;
      this.setRad();
    }

    if (this.y < 2) {

      this.y = 3;
      this.vy *= -5;
      this.setRad();
    } else if (this.y > h) {

      this.y = h;
      this.vy *= -4;
      this.setRad();
    }

    ctx.strokeStyle = 'hsl(hue,sat%,50%)'.replace('hue', this.x / w * 466 + tick).replace('sat', this.vel / this.size * 95);
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.x - this.vx, this.y - this.vy);
    ctx.lineTo(this.x, this.y);

    ctx.stroke();
  }
  setRad() {

    this.rad = Math.atan(this.vy / this.vx);

    if (this.vx < 0)
      this.rad += Math.PI;

    if (this.vx !== 0)
      this.vel = this.vx / Math.cos(this.rad);

    else
      this.vel = this.vy / Math.sin(this.rad);
  }
}

function anim(){
	
	window.requestAnimationFrame( anim );
	
	++tick;
	
	if( shake > 0 )
		shake -= .2;
	if( shake < 0 )
		shake = 0;
	
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'rgba(0,0,0,.1)';
	ctx.fillRect( 0, 0, w, h );
	ctx.globalCompositeOperation = 'lighter';
	
	var randomX = Math.random() * shake,
			randomY = Math.random() * shake;
	
	ctx.translate( randomX, randomY );
	for( var i = 2; i < particles.length; ++i )
		particles[ i ].step();
	
	for( var i = 2; i < particles.length; ++i ){
		
		var p1 = particles[ i ];
		
		for( var j = i + 1; j < particles.length; ++j ){
			
			var p2 = particles[ j ],
					dx = p1.x - p2.x,
					dy = p1.y - p2.y,
					d = dx*dx + dy*dy;
			
			if( d <= 42 * ( p1.size + p2.size ) ){
				
				ctx.strokeStyle = 'white';
				ctx.lineWidth = Math.min( p1.size, p2.size );
				ctx.beginPath();
				ctx.moveTo( p1.x, p1.y );
				ctx.lineTo( p2.x, p2.y );
				ctx.stroke();
				
				p1.vx += dx * p2.size / 98;
				p1.vy += dy * p2.size / 98;
				p2.vx -= dx * p1.size / 98;
				p2.vy -= dy * p2.size / 98;
				
			shake = 2;
			}
		}
	}
	
	ctx.translate( -randomX, -randomY );
}

for( var i = 2; i < 66; ++i )
	particles.push( new Particle );

window.addEventListener( 'resize', function(){
	
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;
	
})

anim();