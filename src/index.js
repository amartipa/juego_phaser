import Phaser from "phaser";


//Variables i funcions comuns a totes les nostres classes
let player = ""
let music_salto;
let coins = "";
let scoreText = ""
let score=0;
let music_bucle,sound_die
let viu 


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
  if(! completed) { // no hem arribat al final
    this.physics.pause() // atura tot moviment
    console.log("S'atura")
    music_bucle.stop();  
    
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

    // this.load.spritesheet('mario',
    //       'assets/Mario.png',
    //       { frameWidth: 32, frameHeight: 32 }
    //   );
    this.load.spritesheet('avatar_idle',
          'assets/avatar_idle.png',
          { frameWidth: 16, frameHeight: 16 }
      );
    this.load.spritesheet('avatar_run',
    'assets/avatar_run.png',
    { frameWidth: 16, frameHeight: 16 }
    );

    this.load.audio('bucle','assets/sounds/musicaJuego.mp3')
    this.load.audio('salto','assets/sounds/smb_jump-small.mp3')
    this.load.audio('die', 'assets/sounds/smb_mariodie.mp3')


    //objetos
    this.load.spritesheet('moneda',
      'assets/monedes.png',
      { frameWidth: 16, frameHeight: 16, }
    );

    this.load.spritesheet('estrella',
    'assets/star.png',
    { frameWidth: 32, frameHeight: 32, }
  );



  

  //   this.load.spritesheet('avatar',
  //   'assets/avatar.png',
  //   { frameWidth: 32, frameHeight: 32, }
  // );



  //   this.load.spritesheet('moneda',
  //     'assets/monedes.png',
  //     { frameWidth: 16, frameHeight: 16, }
  //   );

  //   this.load.audio('bucle', 'assets/sounds/MarioBrosBucle.mp3')
  //   this.load.audio('jumpsmall', 'assets/sounds/smb_jump-small.mp3')

  }

  create() {
    //1 únic cop

    viu = true
   
    const map = this.add.tilemap('tilemap');
    const tileset = map.addTilesetImage('Tiles', 'gameTiles');
    const platform_layer = map.createLayer('plataformas', tileset);

    //hacer que el personaje no atraviese el suelo
    player = this.physics.add.sprite(100,50,'avatar_idle');
    //player.body.setSize(80, 80, 0,0);



    platform_layer.setCollisionByExclusion([-1]);
    this.physics.add.collider(player,platform_layer);
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
    const onOverlapLayer = (jugador,colleccionable)=>{
      colleccionable.visible=false
      this.refreshScore(10)
      colleccionable.body.destroy();
      console.log('moneda recogida')
    }
    this.physics.add.overlap(player, collectables, onOverlapLayer);



    //obejeto power UP estrella
    const estrelles = this.physics.add.staticGroup();
    estrelles.create(190,210,"estrella")
    estrelles.create(500,10,"estrella")
    estrelles.create(700,100,"estrella")
    estrelles.create(1550,100,"estrella")

    const onOverlapStar = (jugador,estel)=>{

      this.refreshScore(100)
      estel.disableBody(true, true);
      console.log("AAAAA")
    
        }
    

    this.physics.add.overlap(player, estrelles, onOverlapStar);

    //puntuación
    scoreText = this.add.text(50,30,"Score: 0",{ fontSize: '32px', fill:'#000'})


  
  }


  update() {
    //De forma repetida, un i un altre cop
    var cursors = this.input.keyboard.createCursorKeys()
    scoreText.x = player.body.position.x -350
    scoreText.y = player.body.position.y -100
    



      if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.anims.play('left',true)
        player.setFlipX(true)
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right',true)
        player.setFlipX(false)
      } 
      else {
        player.setVelocityX(0)
        player.anims.play('idle',true)


      }
      if (cursors.up.isDown ) {
        //&& player.body.onFloor()

        player.setVelocityY(-195)
        music_salto = this.sound.add('salto');
        music_salto.play({
          volume: 1,
          loop: false
        }

        
      ) 
      }
          
      if (player.body.position.y > 300 && viu ) {
        console.log('has muerto')
        viu = false
        this.endGame(false)
      }

  }
  //scoretext
  
  
}

class Menu extends Phaser.Scene {
  constructor() {
    super('menuScene');
  }

  preload() {

  }

  create() {

  }

  update() {

  }
}

class Level extends Phaser.Scene {
  constructor() {
    super('levelScene');
  }

  preload() {

  }

  create() {

  }

  update() {

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

class Controls extends Phaser.Scene {
  constructor() {
    super('controlsScene');
  }

  preload() {

  }

  create() {

  }

  update() {

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
  height: 300,
  backgroundColor: '#a5aceb',
  //scene: [Menu, MainScene, Level, Mode, Controls, EndGame], //La primera escena és per on entra el joc
  scene: [MainScene,EndGame], //La primera escena és per on entra el joc
  scale: {
      mode: Phaser.Scale.FIT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },

  
}

//Inicialización del objeto Phaser
new Phaser.Game(config);