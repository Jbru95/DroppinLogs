import { GameModes, Utils } from '../helpers/Helpers';
export default class Select extends Phaser.Scene {

    utils: Utils = new Utils();
    selectedGodName!: Phaser.GameObjects.Text;
    selectedGodImage!: Phaser.GameObjects.Image;
    selectedGodBackground!: Phaser.GameObjects.Image;

    constructor() {
        super('select');
    }

    //TODO: do something with the empty space behind the god select
    // maybe have like a background image with a pedestal or altar in the middle and the gods on the left and right sides of the page, clicking them makes their stuff appear in the middle

    //TODO: Add images of the god characters and intro sounds to each god other then Hephaestus
    //TODO: Add background images and maybe blocks for Ares???

    create(): void {
        this.add.text(250, 40, 'Choose your guardian', { fontSize: '24px', fontFamily: 'Times New Roman', color: 'white' }).setOrigin(0.5).setDepth(2);
        this.createGodList()
    }

    createGodList(): void {
        this.addEffects(this.add.image(150, 150, 'hephaestus').setScale(0.15));
        this.addEffects(this.add.image(350, 150, 'artemis').setScale(0.15));
        this.addEffects(this.add.image(150, 350, 'dionysis').setScale(0.15));
        this.addEffects(this.add.image(350, 350, 'zeus').setScale(0.15));
        this.addEffects(this.add.image(150, 550, 'poseidon').setScale(0.15));
        this.addEffects(this.add.image(350, 550, 'ares').setScale(0.15));
    }

    addEffects(image: Phaser.GameObjects.Image): void {
        image.setInteractive({ useHandCursor: true })
        .setDepth(2)
        .on('pointerover', () => {
            image.setScale(0.20);
        })
        .on('pointerout', () => {
            image.setScale(0.15);
        })
        .on('pointerdown', () => {
            this.selectGod(image.texture.key);
        });  
    }

    selectGod(godName: string): void {
        this.utils.drawButton(this, () => this.goToGame(this.selectedGodName.text), 900, 50, "PLAY", 0.2)
        //play their intro sound, maybe a flash animation, slide in their name, a background image, and a blown up image of their portrait
        // this.sound.play(godName+'_intro');

        if(this.selectedGodName){
            this.selectedGodName.destroy();
        }
        if(this.selectedGodImage){
            this.selectedGodImage.destroy();
        }
        if(this.selectedGodBackground){
            this.selectedGodBackground.destroy();
        }

        this.selectedGodName = this.add.text(-100, -100, godName.toUpperCase(), { fontSize: '40px', fontFamily: 'Times New Roman', color: 'white', fontStyle: 'bold' }).setOrigin(0.5);
        this.tweens.add({
            targets: this.selectedGodName,
            y: 100,
            x: 900,
            duration: 400
        });

        this.selectedGodImage = this.add.image(-400, 1500, godName + '2').setScale(0.3);
        this.tweens.add({
            targets: this.selectedGodImage,
            y: 380,
            x: 900,
            duration: 400
        });

        this.selectedGodBackground = this.add.image(900, this.game.config.height as number/2, godName + 'b2').setAlpha(0).setScale(0.70).setDepth(-4);
        this.tweens.add({
            targets: this.selectedGodBackground,
            alpha: 0.6,
            duration: 1000
        })
    }

    goToGame(godName: string): void {
        this.scene.start('game', {godName: godName.toLowerCase(), mode: GameModes.solo }); //make this generalized
    }


}