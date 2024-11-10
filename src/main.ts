import Phaser from 'phaser';
import Game from './scenes/Game';
import Preloader from './scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {y: 0}

    }
  },
  scene: [Preloader, Game]
}

export default new Phaser.Game(config);