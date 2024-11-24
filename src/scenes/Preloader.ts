import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene{
    constructor(){
        super('preloader');
    }

    preload() {
        //block images
        this.load.image('redBlock', 'textures/blocks/RedBlock.png');
        this.load.image('blueBlock', 'textures/blocks/BlueBlock.png');
        this.load.image('greenBlock', 'textures/blocks/GreenBlock.png');
        this.load.image('yellowBlock', 'textures/blocks/YellowBlock.png');
        this.load.image('purpleBlock', 'textures/blocks/PurpleBlock.png');
        this.load.image('emptyBlock', 'textures/blocks/EmptyBlock.png');
        this.load.image('selector', 'textures/blocks/Selector.png');

        //other images
        this.load.image('wreathStart', 'textures/WreathStart.png');
        this.load.image('wreathMiddle', 'textures/WreathMiddle.png');
        this.load.image('wreathEnd', 'textures/WreathEnd.png');
        this.load.image('columnWhiteStart', 'textures/ColumnWhiteStart.png');
        this.load.image('columnWhiteMiddle', 'textures/ColumnWhiteMiddle.png');
        this.load.image('columnWhiteEnd', 'textures/ColumnWhiteEnd.png');

        this.load.image('ares', 'textures/Ares.png')
        this.load.image('artemis', 'textures/Artemis.png')
        this.load.image('dionysis', 'textures/Dionysis.png')
        this.load.image('poseidon', 'textures/Poseidon.png')
        this.load.image('zeus', 'textures/Zeus.png')

        this.load.image('godBanner', 'textures/GodBanner.png');
        this.load.image('pantheonTitle', 'textures/PantheonTitle.png');
        //sounds
        this.load.audio('swap', 'sounds/swap.mp3');
        this.load.audio('clear', 'sounds/clear.mp3');
    }

    create() {
        //starts a new scene when all the assets are preloaded(the function of this scene)
        this.scene.start('menu'); //menu for menu, game for singleplayer mode
    }
}