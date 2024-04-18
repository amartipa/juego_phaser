import Phaser from "phaser";


//Variables i funcions comuns a totes les nostres classes
let player = ""
let enemy1 = ""
let enemy2 = ""
let enemy3= ""
let enemy4= ""
let enemy5= ""
let enemy6= ""
let music_salto;
let music_shoot;
let MoonJump = false
let sound_moon;
let music_boom;
let music_powerup;
let music_coin;
let coins = "";
let scoreText = ""
let score=0;
let music_bucle,sound_die
let viu 
let dispara = false 
//////////////////////////
let enemy7=""
let enemy8=""
let enemy9=""
let sound_jump;
let sonido_estrella,coin,sound_gun,sound_disparo,sound_victory
let muerto = false
let scoreFinal = 0
let enemy




//Les classes del nostre videojoc
// Idealment hauríem de posar una en cada fitxer i importar-les aquí
class MainScene extends Phaser.Scene {

  constructor() {
    super('gameScene');
  }

  refreshScore(value) {
    score += value
    scoreText.setText("Score: "+ score)
}

endGame(completed = false) {

  if(! completed) {
    player.anims.play('hurt',true)// no hem arribat al final
    this.physics.pause() // atura tot moviment
    console.log("S'atura")
    music_bucle.stop();
    dispara = false  
    score= 0
    sound_die.play({
      volume: 1,
      loop: false
    })
    this.time.addEvent({
       delay: 1500,
       
       loop:false,
       callback: ()=> {
        this.scene.restart()
       }
     })
    // Podríem generar una animació de mort del personatge
     //start('EndGame');
  } else { // Hem arribat al final bé
    // Podriem Generar una animació
    this.scene.start('endScene');
  }

 
}



  
  preload() {
    //1r cop i  1 únic cop

    this.load.image('gameTiles', 'assets/maps/Tiles.png');

    this.load.tilemapTiledJSON('tilemap', 'assets/maps/mapaPrincipal.json');

    this.load.spritesheet('avatar_idle',
          'assets/avatar_idle.png',
          { frameWidth: 16, frameHeight: 16 }
      );
    this.load.spritesheet('avatar_run',
    'assets/avatar_run.png',
    { frameWidth: 16, frameHeight: 16 }
    );

    this.load.spritesheet('avatar_hurt',
    'assets/avatar_hurt.png',
    { frameWidth: 16, frameHeight: 16 }
    );

    //enemy1 assets
    this.load.spritesheet('enemy1_idle',
      'assets/enemy1_idle.png',
      { frameWidth: 16, frameHeight: 16 }
    );

    this.load.spritesheet('enemy1_walk',
    'assets/enemy1_walk.png',
    { frameWidth: 16, frameHeight: 16 }
  );
    this.load.spritesheet('Effect_Arrow',
    'assets/Effect_Arrow.png',
    { frameWidth: 16, frameHeight: 16 }
    );
    //enemy2 assets
    this.load.spritesheet('enemy2_walk',
    'assets/enemy2.png',
    { frameWidth: 64, frameHeight: 64 }
    );

    //enemy3,4,5 y 6 assets
    this.load.spritesheet('enemy3',
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
    );
   this.load.image('luna','assets/moon.png')
    

    this.load.audio('bucle','assets/sounds/musicaJuego.mp3')
    this.load.audio('salto','assets/sounds/smb_jump-small.mp3')
    this.load.audio('die', 'assets/sounds/smb_mariodie.mp3')
    this.load.audio('shoot','assets/sounds/shoot.mp3')
    this.load.audio('boom','assets/sounds/boom.mp3')
    this.load.audio('powerUp','assets/sounds/power-up.mp3')
    this.load.audio('coin','assets/sounds/coin.mp3')
    this.load.audio('sound_moon','assets/sounds/sound-moon.mp3')
    this.load.audio('sound_victory', 'assets/sounds/victory.mp3')


    //objetos
    this.load.spritesheet('moneda',
      'assets/monedes.png',
      { frameWidth: 16, frameHeight: 16, }
    );

    this.load.spritesheet('estrella',
    'assets/star.png',
    { frameWidth: 32, frameHeight: 32, }
  );

    this.load.spritesheet('sword',
    'assets/sword.png',
    { frameWidth: 16, frameHeight: 16, }
  );
  this.load.spritesheet('bomb',
  'assets/bomb.png',
  { frameWidth: 16, frameHeight: 16, }
  );
  this.load.image('zafiro', 'assets/zafiro.png')


  }

  create() {
    //1 únic cop

    viu = true
   
    const map = this.add.tilemap('tilemap');
    const tileset = map.addTilesetImage('Tiles', 'gameTiles');
    const platform_layer = map.createLayer('plataformas', tileset);

    //hacer que el personaje no atraviese el suelo
    player = this.physics.add.sprite(25,50,'avatar_idle');
    enemy1 = this.physics.add.sprite(150,200,'enemy1_idle');
    enemy2 = this.physics.add.sprite(250,100,'enemy2_walk');
    enemy3 = this.physics.add.sprite(626,144,'enemy3');
    enemy4 = this.physics.add.sprite(938,144,'enemy3');
    enemy5 = this.physics.add.sprite(1264,208,'enemy3');
    enemy6 = this.physics.add.sprite(1453,208,'enemy3');
    enemy1.setDepth(-1)
    enemy2.setDepth(-1)
    enemy3.setDepth(-1)
    enemy4.setDepth(-1)
    enemy5.setDepth(-1)
    enemy6.setDepth(-1)

    enemy2.body.setAllowGravity(false)
    enemy2.setVelocityY(50)
    //player.body.setSize(80, 80, 0,0);
    //power ups
    const weapon = this.physics.add.staticGroup();
    weapon.create(200,144,"sword")
    const onOverlapWeapon = (jugador, weapon)=>{
      music_powerup = this.sound.add('powerUp');
      music_powerup.play({
          volume: 1,
          loop: false
      })
      weapon.disableBody(true, true);
      dispara = true
    }
    this.physics.add.overlap(player,weapon, onOverlapWeapon)

    //moon gravity
    const luna = this.physics.add.staticGroup();
    luna.create(307,150,'luna')
    const onOverlapMoon=(jugador,moon)=>{
      sound_moon = this.sound.add('sound_moon')
      sound_moon.play({
        volume:1,
        loop:false
      })
      this.refreshScore(20)
      moon.disableBody(true,true)
      MoonJump = true
    }
    this.physics.add.overlap(player,luna,onOverlapMoon)
///////////////////////////////////////////////////////

    platform_layer.setCollisionByExclusion([-1]);
    this.physics.add.collider(player,platform_layer);
    this.physics.add.collider(enemy1,platform_layer);
    this.physics.add.collider(enemy2,platform_layer);
    this.physics.add.collider(enemy3,platform_layer);
    this.physics.add.collider(enemy4,platform_layer);
    this.physics.add.collider(enemy5,platform_layer);
    this.physics.add.collider(enemy6,platform_layer);
    this.cameras.main.startFollow(player);


    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('avatar_run', { start:6 , end:11 }),
      frameRate: 5,
      repeat: -1
    })


     this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('avatar_run', { start:6 , end:11 }),
      frameRate: 5,
      repeat: -1
   
    })
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('avatar_idle', { start:0 , end:3 }),
      frameRate: 2,
      repeat: -1
    })

    this.anims.create({
      key: 'hurt',
      frames: this.anims.generateFrameNumbers('avatar_hurt', { start:0 , end:0 }),
      
     
    })

    //anims anemy1

    this.anims.create({
      key: 'right_enemy1',
      frames: this.anims.generateFrameNumbers('enemy1_walk', { start:0 , end:5 }),
      frameRate: 15,
      repeat: -1
    })


     this.anims.create({
      key: 'left_enemy1',
      frames: this.anims.generateFrameNumbers('enemy1_walk', { start:0 , end:5 }),
      frameRate: 15,
      repeat: -1
   
    })
    this.anims.create({
      key: 'idle_enemy1',
      frames: this.anims.generateFrameNumbers('enemy1_idle', { start:0 , end:5 }),
      frameRate: 2,
      repeat: -10
    })

    //anims enemy2
    this.anims.create({
      key: 'up_enemy2',
      frames: this.anims.generateFrameNumbers('enemy2_walk', { start:0 , end:3 }),
      frameRate: 10,
      repeat: -10
    })

    this.anims.create({
      key: 'down_enemy2',
      frames: this.anims.generateFrameNumbers('enemy2_walk', { start:0 , end:3 }),
      frameRate: 10,
      repeat: -10
    })
   
    //musica juego
    
    music_bucle = this.sound.add('bucle');
    music_bucle.play({
        volume: 1,
        loop: true
    })
    sound_die = this.sound.add('die')


    // Obtenim la capa
    const collectables_layer = map.getObjectLayer('coleccionables')
    // Creem un grup static on afegirem cada objecte de la capa
    const collectables = this.physics.add.staticGroup()
    // recorrem tots els objectes de la capa, creem sprite, l'afegim al grup i l'animen
    collectables_layer.objects.forEach(moneda => {
      var spriteMoneda = this.add.sprite(moneda.x, moneda.y, 'moneda');
      collectables.add(spriteMoneda).setDepth(-1)
      this.anims.create({
          key: 'moneda',
          frames: this.anims.generateFrameNumbers('moneda', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
      })
      
      spriteMoneda.anims.play('moneda', true)
      
    })
  const onOverlapLayer = (jugador, colleccionable) => {
  if (!colleccionable.collected) {// Verifica si la moneda no ha sido recolectada
    music_coin= this.sound.add('coin');
    music_coin.play({
        volume: 1,
        loop: false
    })
    this.refreshScore(10); // Incrementa el puntaje
    colleccionable.collected = true; // Marca la moneda como recolectada
    colleccionable.visible = false; // Oculta la moneda
    // No es necesario destruir el cuerpo de la moneda
  }
}
  const onOverlapEnemy1 = (jugador, enemy1) =>{
    viu=false
    console.log('mort per enemy1')
    this.endGame(false)

  }

  const onOverlapEnemy2 = (jugador, enemy2) =>{
    viu=false
    console.log('mort per enemic2')
    this.endGame(false)

  }

  const onOverlapEnemy3 = (jugador, enemy3) =>{
    viu=false
    console.log('mort per enemic3')
    this.endGame(false)

  }
  const onOverlapEnemy4 = (jugador, enemy4) =>{
    viu=false
    console.log('mort per enemic4')
    this.endGame(false)

  }
  const onOverlapEnemy5 = (jugador, enemy5) =>{
    viu=false
    console.log('mort per enemic5')
    this.endGame(false)

  }
  const onOverlapEnemy6 = (jugador, enemy6) =>{
    viu=false
    console.log('mort per enemic6')
    this.endGame(false)

  }
    this.physics.add.overlap(player, collectables, onOverlapLayer);
    this.physics.add.overlap(player, enemy1, onOverlapEnemy1);
    this.physics.add.overlap(player, enemy2, onOverlapEnemy2);
    this.physics.add.overlap(player, enemy3, onOverlapEnemy3);
    this.physics.add.overlap(player, enemy4, onOverlapEnemy4);
    this.physics.add.overlap(player, enemy5, onOverlapEnemy5);
    this.physics.add.overlap(player, enemy6, onOverlapEnemy6);


    //obejeto power UP estrella
    const estrelles = this.physics.add.staticGroup();
    estrelles.create(190,210,"estrella")
    estrelles.create(500,10,"estrella")
    estrelles.create(700,100,"estrella")
    estrelles.create(1550,100,"estrella")

    const onOverlapStar = (jugador,estel)=>{

      this.refreshScore(100)
      estel.disableBody(true, true);
      console.log("Estrella agafada")
    
        }
    

    this.physics.add.overlap(player, estrelles, onOverlapStar);

    //
    const zafiro = this.physics.add.staticGroup();

    zafiro.create(1579,130,"zafiro")

    const onOverlapFin = (jugador,zafiro)=>{
      music_bucle.stop();
      sound_victory = this.sound.add('sound_victory')
      sound_victory.play({
        volume: 1,
        loop: false
      })
      zafiro.disableBody(true, true);
      console.log("NEXT LEVEL")
      this.scene.start('gameScene2');
    
    }
  
  this.physics.add.overlap(player, zafiro, onOverlapFin);


    //puntuación
    scoreText = this.add.text(50,30,"Score: 0",{ fontSize: '32px', fill:'#000'})


  
  }


  update() {
    //De forma repetida, un i un altre cop
    // console.log('y:' +player.body.position.y)
    //  console.log('x:'+ player.body.position.x)
    var cursors = this.input.keyboard.createCursorKeys()
    scoreText.x = player.body.position.x -350
    scoreText.y = player.body.position.y -100
    



      if (cursors.left.isDown && viu) {
        player.setVelocityX(-160)
        player.anims.play('left',true)
        player.setFlipX(true)
      }
      else if (cursors.right.isDown && viu) {
        player.setVelocityX(160)
        player.anims.play('right',true)
        player.setFlipX(false)
      } 
      else if (viu) {
        player.setVelocityX(0)
        player.anims.play('idle',true)
      } 

      if (cursors.up.isDown && player.body.onFloor()) {
        if (MoonJump) {
          player.setVelocityY(-250)
          music_salto = this.sound.add('salto')
          music_salto.play({
            volume: 1,
            loop: false
        }) } else {
          player.setVelocityY(-195)
          music_salto = this.sound.add('salto')
          music_salto.play({
            volume: 1,
            loop: false
        }) }

      }
          
      if (player.body.position.y > 300 && viu ) {
        console.log('has muerto')
        
        viu = false
        this.endGame(false)
      }

      //enemy1 movement
      if(enemy1.body.position.x <165 && viu){
        enemy1.anims.play('left_enemy1',true)
        enemy1.setVelocityX(30)
      }else if(enemy1.body.position.x > 215 && viu){
        enemy1.anims.play('right_enemy1',true)
        player.setFlipX(true)
        
        enemy1.setVelocityX(-30)
      }

      //enemy2 movement
      
      if(enemy2.body.position.y <0  && viu){
        enemy2.anims.play('down_enemy2',true)
        
        enemy2.setVelocityY(100)
      }else if(enemy2.body.position.y > 90 && viu){
        enemy2.anims.play('up_enemy2',true)
        
        
        enemy2.setVelocityY(-100)
      }

      //powerUps
      if (this.input.mousePointer.isDown && dispara && !this.bombShot) {
        music_shoot = this.sound.add('shoot');
        music_shoot.play({
          volume: 1,
          loop: false
        })
        this.bomb = this.physics.add.sprite(player.x, player.y, 'bomb');
        this.bomb.setVelocityX(500);
        this.bomb.setGravityY(0);
        this.bombShot = true;
        this.bombTimer = this.time.delayedCall(1000, () => {
            this.bombShot = false;
        } );

        this.physics.add.overlap(enemy1, this.bomb, () => {
          music_boom = this.sound.add('boom');
          music_boom.play({
            volume: 1,
            loop: false
          })
          enemy1.disableBody(true, true);
          this.refreshScore(200);
        });

        this.physics.add.overlap(enemy2, this.bomb, () => {
          music_boom = this.sound.add('boom');
          music_boom.play({
            volume: 1,
            loop: false
          })
          enemy2.disableBody(true, true);
          this.refreshScore(200);
        });
        this.physics.add.overlap(enemy3, this.bomb, () => {
          music_boom = this.sound.add('boom');
          music_boom.play({
            volume: 1,
            loop: false
          })
          enemy3.disableBody(true, true);
          this.refreshScore(200);
        });
        this.physics.add.overlap(enemy4, this.bomb, () => {
          music_boom = this.sound.add('boom');
          music_boom.play({
            volume: 1,
            loop: false
          })
          enemy4.disableBody(true, true);
          this.refreshScore(200);
        });
        this.physics.add.overlap(enemy5, this.bomb, () => {
          music_boom = this.sound.add('boom');
          music_boom.play({
            volume: 1,
            loop: false
          })
          enemy5.disableBody(true, true);
          this.refreshScore(200);
        });
        this.physics.add.overlap(enemy6, this.bomb, () => {
          music_boom = this.sound.add('boom');
          music_boom.play({
            volume: 1,
            loop: false
          })
          enemy6.disableBody(true, true);
          this.refreshScore(200);
        });
    }

  }
  //scoretext
  
  
}

class Menu extends Phaser.Scene {
  constructor() {
      super('menuScene');
  }

  create() {
        const playButton = this.add.text(400, 150, 'JUGAR', { fontSize: '32px', fill: '#000' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('gameScene');
            });
  }
}

class MainScene2 extends Phaser.Scene {
  constructor() {
    super('gameScene2');
    this.bomba = null;

  }
  refreshScore(value) {

    score += value
    scoreText.setText("Score: "+ score)
    scoreFinal = score
    
  }
  endGame(completed = false) {
    player.anims.play('hurt',true)
    console.log("muerto")
    if(! completed) { 
      this.physics.pause()
      console.log("S'atura")
      music_bucle.stop();  
      score = 0
      sound_die.play({
        volume: 1,
        loop: false
      })
      this.time.addEvent({
         delay: 4500,
         loop:false,
         callback: ()=> {
           this.scene.restart()
         }
       })

    } else {
      this.scene.start('endScene');
    }

  }
  
  preload() {

    this.load.image('legacyTiles', 'assets/Tiles.png');
    this.load.image('estrella', 'assets/star.png')
    this.load.image('luna', 'assets/moon.png')
    this.load.image('gun', 'assets/gun.png')
    this.load.image('bomba', 'assets/bomb.png')
    this.load.image('zafiro', 'assets/zafiro.png')



    this.load.tilemapTiledJSON('tilemap2', 'assets/maps/Legacy.json');

    this.load.spritesheet('mario',
    'assets/Mario.png',
    { frameWidth: 32, frameHeight: 32, }
  );

  this.load.spritesheet('bird',
    'assets/birdSprite.png',
    { frameWidth: 16, frameHeight: 16, }
  );

  this.load.spritesheet('dude',
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48, }
  );

  this.load.audio('bucle','assets/sounds/MarioBrosBucle.mp3')
  this.load.audio('salto','assets/sounds/smb_jump-small.mp3')
  this.load.audio('die', 'assets/sounds/smb_mariodie.mp3')
  this.load.audio('sonido_estrella', 'assets/sounds/mario-bros-power.mp3')
  this.load.audio('coin', 'assets/sounds/mario-coin.mp3')
  this.load.audio('sound_moon', 'assets/sounds/sound-moon.mp3')
  this.load.audio('sound_gun', 'assets/sounds/sound-gun.mp3')
  this.load.audio('sound_disparo', 'assets/sounds/disparo.mp3')
  this.load.audio('sound_victory', 'assets/sounds/victory.mp3')



  this.load.spritesheet('moneda',
      'assets/monedes.png',
      { frameWidth: 16, frameHeight: 16, }
    );


  }

  create() {
    viu = true
    music_bucle = this.sound.add('bucle')
    sound_die = this.sound.add('die')
    music_bucle.play({
      volume: 1,
      loop: true
    })

    const map2 = this.add.tilemap('tilemap2');
    let tileset = map2.addTilesetImage('Tiles2', 'legacyTiles');


    let suelo = map2.createLayer('Suelo', tileset)
    let trampa = map2.createLayer('Trampa', tileset)

    
    player = this.physics.add.sprite(225, 120, 'mario')
    this.cameras.main.startFollow(player);

    enemy7 = this.physics.add.sprite(395, 30, 'bird')
    enemy7.setDepth(-1)
    this.physics.add.collider(enemy7, suelo)

    enemy8 = this.physics.add.sprite(600, 100, 'dude')
    enemy8.setDepth(-1)
    this.physics.add.collider(enemy8, suelo)

    enemy9 = this.physics.add.sprite(850, 110, 'bird')
    enemy9.setDepth(-1)
    this.physics.add.collider(enemy9, suelo)


    suelo.setCollisionByExclusion([-1]);
    this.physics.add.collider(player, suelo)

    player.isOnGround = false;

    this.physics.world.on('collide', function () {
      player.isOnGround = true;
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('mario', { start:1 , end:3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'left_enemy7',
      frames: this.anims.generateFrameNumbers('bird', { start:9 , end:14 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'right_enemy7',
      frames: this.anims.generateFrameNumbers('bird', { start:15 , end:18 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'left_enemy8',
      frames: this.anims.generateFrameNumbers('dude', { start:0 , end:4 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'right_enemy8',
      frames: this.anims.generateFrameNumbers('dude', { start:5 , end:8 }),
      frameRate: 10,
      repeat: -1
    })

   
    this.anims.create({
      key: 'hurt',
      frames: this.anims.generateFrameNumbers('avatar_hurt', { start:0 , end:0 }),
      
     
    })
    const estrelles = this.physics.add.staticGroup();

    estrelles.create(410,20,"estrella")
    estrelles.create(1540,40,"estrella")
    estrelles.create(2200,100,"estrella")

    const onOverlapStar = (jugador,estel)=>{
      sonido_estrella = this.sound.add('sonido_estrella')
      sonido_estrella.play({
        volume: 1,
        loop: false
      })
      this.refreshScore(10)
      estel.disableBody(true, true);
      console.log("AAAAA")
    
    }
  
  this.physics.add.overlap(player, estrelles, onOverlapStar);
   
  const luna = this.physics.add.staticGroup();

  luna.create(2078,105,"luna")
  luna.create(1078,40,"luna")
  luna.create(300,40,"luna")
  luna.create(2400,80,"luna")


  const onOverlapMoon = (jugador,moon)=>{
    sound_moon = this.sound.add('sound_moon')
    sound_moon.play({
      volume: 1,
      loop: false
    })
    this.refreshScore(20)
    moon.disableBody(true, true);
    console.log("Mas Gravedad")
    MoonJump = true

  }

this.physics.add.overlap(player, luna, onOverlapMoon);

const gun = this.physics.add.staticGroup();

  gun.create(70,200,"gun")

  const onOverlapGun = (jugador,gun)=>{
    sound_gun = this.sound.add('sound_gun')
    sound_gun.play({
      volume: 1,
      loop: false
    })
    gun.disableBody(true, true);
    console.log("Dispara")
    dispara = true
  }

this.physics.add.overlap(player, gun, onOverlapGun);

const zafiro = this.physics.add.staticGroup();

    zafiro.create(3200,150,"zafiro")

    const onOverlapFin = (jugador,zafiro)=>{
      sound_victory = this.sound.add('sound_victory')
      sound_victory.play({
        volume: 1,
        loop: false
      })
      zafiro.disableBody(true, true);
      console.log("Fin")
      this.scene.start('finalScene');
    
    }
  
  this.physics.add.overlap(player, zafiro, onOverlapFin);

  const collectables_layer = map2.getObjectLayer('Coleccionables')
  const collectables = this.physics.add.staticGroup()
  collectables_layer.objects.forEach(moneda => {
    var spriteMoneda = this.add.sprite(moneda.x, moneda.y, 'moneda');
    collectables.add(spriteMoneda).setDepth(-1)
    this.anims.create({
        key: 'moneda',
        frames: this.anims.generateFrameNumbers('moneda', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    })
    
    spriteMoneda.anims.play('moneda', true)
})

const onOverlapLayer = (jugador, colleccionable) => {
  if (!colleccionable.collected) {
    coin = this.sound.add('coin')
    coin.play({
      volume: 1,
      loop: false
    })
    this.refreshScore(1); 
    colleccionable.collected = true;
    colleccionable.visible = false;
  }
}


this.physics.add.overlap(player, collectables, onOverlapLayer);

scoreText = this.add.text(400,20,"Score: 0",{ fontSize: '32px', fill:'#000'})

  
  }


  update() {
    var cursors = this.input.keyboard.createCursorKeys()

      if (cursors.left.isDown ) {
        player.setVelocityX(-160)
        player.anims.play('left', true)
        player.setFlipX(true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right', true)
        player.setFlipX(false);
      } 
      else {
        player.setVelocityX(0)
      }

      
      if (cursors.up.isDown && player.body.onFloor()) {
        if (MoonJump) {
          player.setVelocityY(-250)
          sound_jump = this.sound.add('salto')
          sound_jump.play({
            volume: 1,
            loop: false
        }) } else {
          player.setVelocityY(-195)
          sound_jump = this.sound.add('salto')
          sound_jump.play({
            volume: 1,
            loop: false
        }) }
        
      }

      if (this.input.mousePointer.isDown && dispara && !this.bombShot) {
        this.bomba = this.physics.add.sprite(player.x, player.y, 'bomba');
        this.bomba.setVelocityX(500);
        this.bomba.setGravityY(0);
        this.bombShot = true;
        this.bombTimer = this.time.delayedCall(1000, () => {
            this.bombShot = false;
        });
        sound_disparo = this.sound.add('sound_disparo')
        sound_disparo.play({
          volume: 1,
          loop: false
        })
    }

    if (enemy7.body.position.x <= 387) {
      enemy7.setVelocityX(50);
      enemy7.anims.play('right_enemy7', true);
      enemy7.setFlipX(true)
    } else if (enemy7.body.position.x >= 425) {
      enemy7.setVelocityX(-50);
      enemy7.anims.play('left_enemy7', true);
      enemy7.setFlipX(false)
    }

    if (enemy8.body.position.x <= 587) {
      enemy8.setVelocityX(30);
      enemy8.anims.play('right_enemy8', true);
    } else if (enemy8.body.position.x >= 650) {
      enemy8.setVelocityX(-30);
      enemy8.anims.play('left_enemy8', true);
    }

    if (enemy9.body.position.x <= 837) {
      enemy9.setVelocityX(10);
      enemy9.anims.play('right_enemy7', true);
    } else if (enemy9.body.position.x >= 865) {
      enemy9.setVelocityX(-10);
      enemy9.anims.play('left_enemy7', true);
    }

      scoreText.x = player.body.position.x - 370
      scoreText.y = player.body.position.y - 110
    
      if (player.body.position.y > 240 && viu ) {
        console.log("muerto")
        viu = false
        this.endGame(false)
      }

      this.physics.add.overlap(player, enemy7, () => {
        if (viu) {
          viu = false
          this.endGame(false);

        }
        
      });

      this.physics.add.overlap(enemy7, this.bomba, () => {
        enemy7.disableBody(true, true);
      });

      this.physics.add.overlap(player, enemy8, () => {
        if (viu) {
          viu = false
          this.endGame(false);

        }
        
      });

      this.physics.add.overlap(enemy8, this.bomba, () => {
        enemy8.disableBody(true, true);
      });

      this.physics.add.overlap(player, enemy9, () => {
        if (viu) {
          viu = false
          this.endGame(false);

        }
        
      });

      this.physics.add.overlap(enemy9, this.bomba, () => {
        enemy9.disableBody(true, true);
      });
  }
  
}

class Mode extends Phaser.Scene {
  constructor() {
    super('modeScene');
  }

  preload() {

  }

  create() {

  }

  update() {

  }
}

class Final extends Phaser.Scene {
  constructor() {
      super('finalScene');
  }

  create() {
        dispara = false
        MoonJump = false
        music_bucle.stop();
        this.add.text(270, 90, 'ENHORABUENA!!!', { fontSize: '32px', fill: '#000' })
        this.add.text(290, 50, 'Score:' + scoreFinal, { fontSize: '32px', fill: '#000' })
        const playButton = this.add.text(400, 150, 'VOLVER A JUGAR', { fontSize: '32px', fill: '#000' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('gameScene');
            });
        score = 0

  }
}

class EndGame extends Phaser.Scene {
  constructor() {
    super('endScene');
  }

  preload() {

    console.log("EEEEE")

  }

  create() {

    scoreText = this.add.text(200,100,"Final del Joc",{ fontSize: '48px', fill:'#000'})




  }

  update() {

  }
}



//Configuración genérica del videojuego
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 250,
  backgroundColor: '#a5aceb',
  //scene: [Menu, MainScene, Level, Mode, Controls, EndGame], //La primera escena és per on entra el joc
  scene: [Menu,MainScene,MainScene2,EndGame,Final], //La primera escena és per on entra el joc
  // scale: {
  //     mode: Phaser.Scale.FIT
  // },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },

  
}

//Inicialización del objeto Phaser
new Phaser.Game(config);