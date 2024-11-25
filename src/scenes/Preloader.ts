import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene{
    constructor(){
        super('preloader');
    }

    preload() {
        //block images
        this.load.image('redBlock', 'src/assets/textures/blocks/RedBlock.png');
        this.load.image('blueBlock', 'src/assets/textures/blocks/BlueBlock.png');
        this.load.image('greenBlock', 'src/assets/textures/blocks/GreenBlock.png');
        this.load.image('yellowBlock', 'src/assets/textures/blocks/YellowBlock.png');
        this.load.image('purpleBlock', 'src/assets/textures/blocks/PurpleBlock.png');
        this.load.image('emptyBlock', 'src/assets/textures/blocks/EmptyBlock.png');
        this.load.image('selector', 'src/assets/textures/blocks/Selector.png');

        //other images
        this.load.image('wreathStart', 'src/assets/textures/WreathStart.png');
        this.load.image('wreathMiddle', 'src/assets/textures/WreathMiddle.png');
        this.load.image('wreathEnd', 'src/assets/textures/WreathEnd.png');
        this.load.image('columnWhiteStart', 'src/assets/textures/ColumnWhiteStart.png');
        this.load.image('columnWhiteMiddle', 'src/assets/textures/ColumnWhiteMiddle.png');
        this.load.image('columnWhiteEnd', 'src/assets/textures/ColumnWhiteEnd.png');

        this.load.image('ares', 'src/assets/textures/Ares.png')
        this.load.image('artemis', 'src/assets/textures/Artemis.png')
        this.load.image('dionysis', 'src/assets/textures/Dionysis.png')
        this.load.image('poseidon', 'src/assets/textures/Poseidon.png')
        this.load.image('zeus', 'src/assets/textures/Zeus.png')

        this.load.image('godBanner', 'src/assets/textures/GodBanner.png');
        this.load.image('pantheonTitle', 'src/assets/textures/PantheonTitle.png');

        //sounds
        this.load.audio('swap', 'src/assets/sounds/swap.mp3');
        this.load.audio('clear', 'src/assets/sounds/clear.mp3');
    }

    create() {
        //starts a new scene when all the assets are preloaded(the function of this scene)
        this.scene.start('menu'); //menu for menu, game for singleplayer mode
    }
}