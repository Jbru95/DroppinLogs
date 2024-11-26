export default class Select extends Phaser.Scene {

    constructor() {
        super('select');
    }

    create(): void {
        this.add.text(this.game.config.width as number/2, 50, 'char select', { fontSize: '24px', fontFamily: 'Times New Roman', color: 'white' })
        .setOrigin(0.5)
        .setDepth(2)

        //display a list of the god pictures and let the user select them, then pass that into the game scene to start it up
    }
}