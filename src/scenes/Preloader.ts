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
        this.load.image('menuButton', 'src/assets/textures/MenuButton.webp');

        // this.load.image('ares', 'src/assets/textures/Ares.png')

        //character images
        this.load.image('hephaestus', 'src/assets/textures/characters/Hephaestus.png')
        this.load.image('hephaestus2', 'src/assets/textures/characters/Hephaestus2.webp')
        this.load.image('artemis', 'src/assets/textures/characters/Artemis.png')
        this.load.image('dionysis', 'src/assets/textures/characters/Dionysis.png')
        this.load.image('poseidon', 'src/assets/textures/characters/Poseidon.png')
        this.load.image('zeus', 'src/assets/textures/characters/Zeus.png');
        this.load.image('ares', 'src/assets/textures/characters/Ares.png')

        //backgrounds
        this.load.image('artemisb1', 'src/assets/textures/backgrounds/Artemis1.webp');
        this.load.image('artemisb2', 'src/assets/textures/backgrounds/Artemis2.webp');
        this.load.image('artemisb3', 'src/assets/textures/backgrounds/Artemis3.webp');
        this.load.image('artemisb4', 'src/assets/textures/backgrounds/Artemis4.webp');
        this.load.image('artemisb5', 'src/assets/textures/backgrounds/Artemis5.webp');
        this.load.image('artemisb6', 'src/assets/textures/backgrounds/Artemis6.webp');

        this.load.image('dionysisb1', 'src/assets/textures/backgrounds/Dionysis1.webp');
        this.load.image('dionysisb2', 'src/assets/textures/backgrounds/Dionysis2.webp');
        this.load.image('dionysisb3', 'src/assets/textures/backgrounds/Dionysis3.webp');
        this.load.image('dionysisb4', 'src/assets/textures/backgrounds/Dionysis4.webp');
        this.load.image('dionysisb5', 'src/assets/textures/backgrounds/Dionysis5.webp');
        this.load.image('dionysisb6', 'src/assets/textures/backgrounds/Dionysis6.webp');

        this.load.image('hephaestusb1', 'src/assets/textures/backgrounds/Hephaestus1.webp');
        this.load.image('hephaestusb2', 'src/assets/textures/backgrounds/Hephaestus2.webp');
        this.load.image('hephaestusb3', 'src/assets/textures/backgrounds/Hephaestus3.webp');
        this.load.image('hephaestusb4', 'src/assets/textures/backgrounds/Hephaestus4.webp');
        this.load.image('hephaestusb5', 'src/assets/textures/backgrounds/Hephaestus5.webp');
        this.load.image('hephaestusb6', 'src/assets/textures/backgrounds/Hephaestus6.webp');

        this.load.image('poseidonb1', 'src/assets/textures/backgrounds/Poseidon1.webp');
        this.load.image('poseidonb2', 'src/assets/textures/backgrounds/Poseidon2.webp');
        this.load.image('poseidonb3', 'src/assets/textures/backgrounds/Poseidon3.webp');
        this.load.image('poseidonb4', 'src/assets/textures/backgrounds/Poseidon4.webp');
        this.load.image('poseidonb5', 'src/assets/textures/backgrounds/Poseidon5.webp');
        this.load.image('poseidonb6', 'src/assets/textures/backgrounds/Poseidon6.webp');

        this.load.image('zeusb1', 'src/assets/textures/backgrounds/Zeus1.webp');
        this.load.image('zeusb2', 'src/assets/textures/backgrounds/Zeus2.webp');
        this.load.image('zeusb3', 'src/assets/textures/backgrounds/Zeus3.webp');
        this.load.image('zeusb4', 'src/assets/textures/backgrounds/Zeus4.webp');
        this.load.image('zeusb5', 'src/assets/textures/backgrounds/Zeus5.webp');
        this.load.image('zeusb6', 'src/assets/textures/backgrounds/Zeus6.webp');

        this.load.image('generalb1', 'src/assets/textures/backgrounds/General1.webp');
        this.load.image('generalb2', 'src/assets/textures/backgrounds/General2.webp');
        this.load.image('generalb3', 'src/assets/textures/backgrounds/General3.webp');
        this.load.image('generalb4', 'src/assets/textures/backgrounds/General4.webp');
        this.load.image('generalb5', 'src/assets/textures/backgrounds/General5.webp');
        this.load.image('generalb6', 'src/assets/textures/backgrounds/General6.webp');
        this.load.image('templeInside', 'src/assets/textures/backgrounds/TempleInside.webp');

        //sounds
        this.load.audio('hephaestus_intro', 'src/assets/sounds/effects/hephaestus_intro.mp3')
        this.load.audio('swap', 'src/assets/sounds/effects/swap.mp3');
        this.load.audio('clear', 'src/assets/sounds/effects/clear.mp3');
    }

    create() {
        //starts a new scene when all the assets are preloaded(the function of this scene)
        this.scene.start('title');
    }
}