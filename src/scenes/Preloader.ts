import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene{
    constructor(){
        super('preloader');
    }

    preload() {
        //images
        this.load.image('fireBlock', 'textures/FireBlock.png');
        this.load.image('waterBlock', 'textures/WaterBlock.png');
        this.load.image('grassBlock', 'textures/GrassBlock.png');
        this.load.image('lightningBlock', 'textures/LightningBlock.png');
        this.load.image('psychicBlock', 'textures/PsychicBlock.png');
        this.load.image('emptyBlock', 'textures/EmptyBlock.png');
        this.load.image('selector', 'textures/Selector.png');

        //sounds
        this.load.audio('swap', 'sounds/swap.mp3');
        this.load.audio('clear', 'sounds/clear.mp3');
    }

    create() {
        //starts a new scene when all the assets are preloaded(the function of this scene)
        this.scene.start('game');
    }
}