export class Block{
    constructor(rowNum: number, colNum: number, blockSprite: Phaser.GameObjects.Sprite, blockType: string, isInPlay: boolean, isSet: boolean = false){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.blockSprite = blockSprite;
        this.blockType = blockType
        this.isInPlay = isInPlay;
        this.isSet = isSet;
    }

    rowNum: number;
    colNum: number;
    blockSprite: Phaser.GameObjects.Sprite;
    blockType: string;
    isInPlay: boolean;
    isSet: boolean;
}