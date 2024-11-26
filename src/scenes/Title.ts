import { Utils } from '../helpers/Helpers';

export default class Title extends Phaser.Scene {
    private Utils = new Utils();

    menuOffset = 135;
    menuSpacing = 56;
    menuScale = 0.22;

    constructor() {
        super('title');
    }

    create(): void {
        this.add.image(this.game.config.width as number/2, this.game.config.height as number/2, 'pantheonTitle2').setScale(0.70);
        this.createMenuTextButtons();
    }

    createMenuTextButtons(): void {
        this.Utils.drawButton(this, () => this.startGame(), this.game.config.width as number/2 + 18, this.game.config.height as number/2 + this.menuOffset, 'SOLO', this.menuScale);
        this.Utils.drawButton(this, () => this.startGame(), this.game.config.width as number/2 + 18, this.game.config.height as number/2 + this.menuOffset + this.menuSpacing*1, '1 V 1', this.menuScale);
        this.Utils.drawButton(this, () => this.startGame(), this.game.config.width as number/2 + 18, this.game.config.height as number/2 + this.menuOffset + this.menuSpacing*2, '1 V CPU', this.menuScale);
        this.Utils.drawButton(this, () => this.startGame(), this.game.config.width as number/2 + 18, this.game.config.height as number/2 + this.menuOffset + this.menuSpacing*3, 'VERSUS', this.menuScale);
    }

    private startGame(): void {
        // Switch to another scene (e.g., GameScene)
        console.log('do something');
        this.sound.play('clear');
        this.scene.start('select'); //can pass data into this i.e. what character key they select
    }
}