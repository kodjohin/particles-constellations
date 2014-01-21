(function () {
    var PARTICLES_NUM = 500;
    var BANG_SIZE = Math.pow( 60, 3 );

    var stats;

    var cvs = document.querySelector('canvas');
    var ctx = cvs.getContext('2d');

    var cW = window.innerWidth;
    var cH = window.innerHeight;

    var particles = [];
    var isMouseDown = false;
    var mouseX, mouseY;
    var dx, dy, d, t, f;

    cvs.width = cW;
    cvs.height = cH;

    cvs.onmousedown = onMouseDown;
    //Push some particles into particles array
    for (var i = 0; i < PARTICLES_NUM; i++) {
        particles.push(new Particle());
    }

    // Stats.js to monitor the FPS
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '20px';
    stats.domElement.style.top = '20px';
    document.body.appendChild( stats.domElement );

    function Particle(){
        this.x = Math.random()*cW;
        this.y = Math.random()*cH;

        this.w = Math.random();
        this.h = Math.random();

        //some velocity for the particles
        this.vx = -1 + Math.random() * 2;
        this.vy = -1 + Math.random() * 2;

        this.draw = function(){
            ctx.fillStyle = '#ccc';
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }

    // Function to draw everything on the canvas that we'll use when
    // animating the whole scene.

    function draw() {
        stats.begin();

        //re-draw in each next frame
        ctx.fillStyle = "#000";
        ctx.fillRect(0,0,cW,cH);

        for (var i = 0; i < PARTICLES_NUM; i++) {
            var p = particles[i];
            p.draw();
        }
        update();

        stats.end();
    }

    function update() {

        // Update every particle's position according to their velocities
        for (var i = 0; i < PARTICLES_NUM; i++) {
            var p = particles[i];

            if(isMouseDown){
                d = ( dx = mouseX - p.x ) * dx + ( dy = mouseY - p.y ) * dy;
                f = -BANG_SIZE / d;
                if ( d < BANG_SIZE ) {
                    t = Math.atan2( dy, dx );
                    p.vx = f * Math.cos(t);
                    p.vy = f * Math.sin(t);
                }
            }
            p.x += p.vx;
            p.y += p.vy;

            // Change particle position when out of bounds
            if(p.x > cW){p.x = 0;}
            else if(p.x < 0) {p.x = cW;}

            if(p.y > cH){p.y = 0;}
            else if(p.y < 0) {p.y = cH;}

            // Check the distance between particles and compare
            // them to the minDist
            for(var j = i + 1; j < PARTICLES_NUM; j++) {
                var p2 = particles[j];
                checkDistance(p, p2);
            }
        }
    }

    function checkDistance(p1, p2) {
        var dist;
        var minDist = 70;
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;

        dist = Math.sqrt(dx*dx + dy*dy);

        if(dist <= minDist) {
            // particles acceleration depending on their distance
            var ax = dx/2000,
                ay = dy/2000;

            // Apply the acceleration on the particles
            p1.vx -= ax;
            p1.vy -= ay;
            p2.vx += ax;
            p2.vy += ay;
        }
    }

    function anim(){
        draw();
        requestAnimFrame(anim);
    }
    anim();

    window.onresize = function(){
        cW = window.innerWidth;
        cH = window.innerHeight;
        ctx.canvas.width  = cW;
        ctx.canvas.height = cH;
    }
    function onMouseDown(e) {
        var rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseDown = true;
    }
}());
