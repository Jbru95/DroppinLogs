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

        //game textures
        this.load.image('pantheonTitle1', 'src/assets/textures/PantheonTitle1.png');
        this.load.image('pantheonTitle2', 'src/assets/textures/PantheonTitle2.webp');
        this.load.image('pantheonTitle3', 'src/assets/textures/PantheonTitle3.webp');

        this.load.image('wreathStart', 'src/assets/textures/WreathStart.png');
        this.load.image('wreathMiddle', 'src/assets/textures/WreathMiddle.png');
        this.load.image('wreathEnd', 'src/assets/textures/WreathEnd.png');
        this.load.image('columnWhiteStart', 'src/assets/textures/ColumnWhiteStart.png');
        this.load.image('columnWhiteMiddle', 'src/assets/textures/ColumnWhiteMiddle.png');
        this.load.image('columnWhiteEnd', 'src/assets/textures/ColumnWhiteEnd.png');

        // this.load.image('ares', 'src/assets/textures/Ares.png')

        //character images
        this.load.image('hephaestus', 'src/assets/textures/Hephaestus.png')
        this.load.image('artemis', 'src/assets/textures/Artemis.png')
        this.load.image('dionysis', 'src/assets/textures/Dionysis.png')
        this.load.image('poseidon', 'src/assets/textures/Poseidon.png')
        this.load.image('zeus', 'src/assets/textures/Zeus.png')
        this.load.image('godBanner', 'src/assets/textures/GodBanner.png');

        //backgrounds
        this.load.image('artemis1', 'src/assets/textures/backgrounds/Artemis1.webp');
        this.load.image('artemis2', 'src/assets/textures/backgrounds/Artemis2.webp');
        this.load.image('artemis3', 'src/assets/textures/backgrounds/Artemis3.webp');
        this.load.image('artemis4', 'src/assets/textures/backgrounds/Artemis4.webp');
        this.load.image('artemis5', 'src/assets/textures/backgrounds/Artemis5.webp');
        this.load.image('artemis6', 'src/assets/textures/backgrounds/Artemis6.webp');

        this.load.image('dionysis1', 'src/assets/textures/backgrounds/Dionysis1.webp');
        this.load.image('dionysis2', 'src/assets/textures/backgrounds/Dionysis2.webp');
        this.load.image('dionysis3', 'src/assets/textures/backgrounds/Dionysis3.webp');
        this.load.image('dionysis4', 'src/assets/textures/backgrounds/Dionysis4.webp');
        this.load.image('dionysis5', 'src/assets/textures/backgrounds/Dionysis5.webp');
        this.load.image('dionysis6', 'src/assets/textures/backgrounds/Dionysis6.webp');

        this.load.image('poseidon1', 'src/assets/textures/backgrounds/Poseidon1.webp');
        this.load.image('poseidon2', 'src/assets/textures/backgrounds/Poseidon2.webp');
        this.load.image('poseidon3', 'src/assets/textures/backgrounds/Poseidon3.webp');
        this.load.image('poseidon4', 'src/assets/textures/backgrounds/Poseidon4.webp');
        this.load.image('poseidon5', 'src/assets/textures/backgrounds/Poseidon5.webp');
        this.load.image('poseidon6', 'src/assets/textures/backgrounds/Poseidon6.webp');

        this.load.image('zeus1', 'src/assets/textures/backgrounds/Zeus1.webp');
        this.load.image('zeus2', 'src/assets/textures/backgrounds/Zeus2.webp');
        this.load.image('zeus3', 'src/assets/textures/backgrounds/Zeus3.webp');
        this.load.image('zeus4', 'src/assets/textures/backgrounds/Zeus4.webp');
        this.load.image('zeus5', 'src/assets/textures/backgrounds/Zeus5.webp');
        this.load.image('zeus6', 'src/assets/textures/backgrounds/Zeus6.webp');

        this.load.image('general1', 'src/assets/textures/backgrounds/General1.webp');
        this.load.image('general2', 'src/assets/textures/backgrounds/General2.webp');
        this.load.image('general3', 'src/assets/textures/backgrounds/General3.webp');
        this.load.image('general4', 'src/assets/textures/backgrounds/General4.webp');
        this.load.image('general5', 'src/assets/textures/backgrounds/General5.webp');
        this.load.image('general6', 'src/assets/textures/backgrounds/General6.webp');

        //sounds
        this.load.audio('swap', 'src/assets/sounds/swap.mp3');
        this.load.audio('clear', 'src/assets/sounds/clear.mp3');
    }

    create() {
        //starts a new scene when all the assets are preloaded(the function of this scene)
        this.scene.start('menu'); //menu for menu, game for singleplayer mode
    }
}