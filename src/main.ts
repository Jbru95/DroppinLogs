import Phaser from 'phaser';
import Game from './scenes/Game';
import Preloader from './scenes/Preloader';
import Menu from './scenes/Menu';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {y: 0}
    }
  },
  scene: [Preloader, Game, Menu]
}

export default new Phaser.Game(config);