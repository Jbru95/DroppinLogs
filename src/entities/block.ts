export class Block{
    constructor(x: number, y: number, blockSprite: Phaser.GameObjects.Sprite, blockType: string, isInPlay: boolean, isSet: boolean = false){
        this.xpos = x;
        this.ypos = y;
        this.blockSprite = blockSprite;
        this.blockType = blockType
        this.isInPlay = isInPlay;
        this.isSet = isSet;
    }

    xpos: number;
    ypos: number;
    blockSprite: Phaser.GameObjects.Sprite;
    blockType: string;
    isInPlay: boolean;
    isSet: boolean;
}