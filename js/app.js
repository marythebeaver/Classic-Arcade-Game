    /*
     * Representation and state of the enemy.
     */
    var Enemy = function() {
        this.sprite = 'images/enemy-bug.png';

        // initial position of the enemies, wherein y axis is radom
        this.initial_x = 0;
        this.initial_y = (Math.floor(Math.random()*3)+1)*83-20;
        this.x = this.initial_x;
        this.y = this.initial_y;

        // radom speed from 100 to 500
        this.x_speed = Math.floor(Math.random()*400)+100;

        // the enemies' imagine range
        this.x1 = 2;
        this.x2 = 99;
        this.width = this.x2-this.x1;

        this.y1 = 78;
        this.y2 = 142;
        this.height = this.y2-this.y1;

    };

    /*
     * Update the enemy's position
     */
    Enemy.prototype.update = function(dt) {
        // moving the enemy forward
        var increment = this.x_speed*dt;
        this.x += increment;

        // reset the enemy to the start point if the enemy is out of the screen
        if(this.x > 1000) {
           this.x = 0;
           this.y = (Math.floor(Math.random()*3)+1)*83-20;
        }
    };

    /*
     * Draw the enemys
     */
    Enemy.prototype.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

     /*
     * Representation and state of the player.
     */
    var Player = function(allEnemies) {
        this.x = 0;
        this.y = 0;

        this.sprite = 'images/char-boy.png';
        this.allEnemies = allEnemies;
        // range of the player and enemies
        //(bounding box) actually contains the enemy figure.
        this.x1 = 17;
        this.x2 = 84;
        this.width = this.x2-this.x1;

        this.y1 = 50;
        this.y2 = 107;
        this.height = this.y2-this.y1;
    }

    /*
     * Updates the boy's position
     */
    Player.prototype.update = function() {
        this.x = this.raw_x*101;
        this.y = this.raw_y*83-10;
    }


    /*
     * Reset the position of the player
     */
    Player.prototype.reset = function() {

        this.raw_x = Math.floor(Math.random()*5);
        this.raw_y = Math.floor(Math.random()*2)+4;
        this.x = this.raw_x*101;
        this.y = this.raw_y*83-10;
    }

    /*
     * updates boy's position according to keyboard input
     */
    Player.prototype.handleInput = function(keyCode) {
        switch(keyCode) {
            case 'up':
                this.raw_y = Math.max(0, this.raw_y-1);
                break;
            case 'down':
                this.raw_y = Math.min(5, this.raw_y+1);
                break;
            case 'right':
                this.raw_x = Math.min(4, this.raw_x+1);
                break;
            case 'left':
                this.raw_x = Math.max(0, this.raw_x-1);
                break;
        }
    }


    /*
     * function for checking impact event with single enemy
     */
    Player.prototype.impact = function(player, enemy) {
        var p_y = player.y + player.y1;
        var p_x = player.x + player.x1;
        var e_y = enemy.y + enemy.y1;
        var e_x = enemy.x + enemy.x1;


        //return false when the player's boundaries does not overlap the enemy's
        //otherwise, return true
        if(((p_x+player.width) < e_x)||(p_x > (e_x+enemy.width))||((p_y+player.height) < e_y)||(p_y > (e_y+enemy.height))) {
            return false;
        }

        return true;
    }


    /*
     * use above impact function to check impact event with all enemies
     */
    Player.prototype.impactAll = function() {
        for(var i=0; i<this.allEnemies.length; ++i) {
            var enemy = this.allEnemies[i];
            if(this.impact(this, enemy)) {
                return true;
            }
        }
        return false;
    }

    /*
     * use to delay time
     */
    Player.prototype.sleep = async function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /*
     * show a congratulation message
     */
    Player.prototype.congrats = async function() {
      const winMsg = document.createElement('h1');
      const textContent = document.createTextNode('Congrates! You made it!');
      winMsg.appendChild(textContent);
      document.body.appendChild(winMsg);

      // reset player
      this.reset();
      // clean the message after 3 sec
      await this.sleep(3000);
      winMsg.innerHTML = "";
    }

    /*
     * draw the player.
     */
    Player.prototype.render = async function() {
        // if an impact event occurs, reset player
        if(this.impactAll()) {
            this.reset();
        }

        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

        // load the win message and reset player when the player is on the top
        if(this.y < 10) {
            await this.congrats();
        }
    }


    // Creates all the enemy objects
    var allEnemies = [new Enemy(), new Enemy(), new Enemy(),
                   new Enemy(), new Enemy()];


    // Creates the player
    var player = new Player(allEnemies);
    player.reset();


    // This listens for key presses and sends the keys to your
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });
