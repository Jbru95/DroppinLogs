import Phaser from 'phaser';
import Game from './scenes/Game';
import Preloader from './scenes/Preloader';
import Select from './scenes/Select';
import Title from './scenes/Title';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {y: 0}
    }
  },
  scene: [Preloader, Game, Title, Select]
}

export default new Phaser.Game(config);