export default class Menu extends Phaser.Scene {
    private soloText!: Phaser.GameObjects.Text;
    private oneVOneText!: Phaser.GameObjects.Text;
    private oneVCPUText!: Phaser.GameObjects.Text;
    private onlineVersusText!: Phaser.GameObjects.Text;

    constructor() {
        super('menu');
    }

    create(): void {

        this.add.image(500, 101, 'godBanner').setScale(0.2);

        this.add.image(500, 350, 'pantheonTitle').setScale(0.4);

        this.soloText = this.add.text(500, 500, 'Solo', { fontSize: '24px', fontFamily: 'Times New Roman',  color: '#bbbbbb' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .on('pointerover', () => this.soloText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.soloText.setStyle({ fill: '#bbbbbb' }))
        .on('pointerdown', () => this.startGame());

        this.oneVOneText= this.add.text(500, 540, '1 v 1', { fontSize: '24px', fontFamily: 'Times New Roman', color: '#bbbbbb' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .on('pointerover', () => this.oneVOneText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.oneVOneText.setStyle({ fill: '#bbbbbb' }))
        .on('pointerdown', () => this.startGame());

        this.oneVCPUText = this.add.text(500, 580, '1 v CPU', { fontSize: '24px', fontFamily: 'Times New Roman', color: '#bbbbbb' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .on('pointerover', () => this.oneVCPUText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.oneVCPUText.setStyle({ fill: '#bbbbbb' }))
        .on('pointerdown', () => this.startGame());

        this.onlineVersusText = this.add.text(500, 620, 'Online Versus', { fontSize: '24px', fontFamily: 'Times New Roman', color: '#bbbbbb' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .on('pointerover', () => this.onlineVersusText.setStyle({ fill: '#ffffff' }))
        .on('pointerout', () => this.onlineVersusText.setStyle({ fill: '#bbbbbb' }))
        .on('pointerdown', () => this.startGame());

    }

    private startGame(): void {
        // Switch to another scene (e.g., GameScene)
        this.scene.start('game'); //can pass data into this i.e. what character key they select
    }
    
}