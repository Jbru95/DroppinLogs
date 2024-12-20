export class Block{
    constructor(rowNum: number, colNum: number, blockSprite: Phaser.GameObjects.Sprite, blockType: string, isInPlay: boolean, isSet: boolean = true){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.blockSprite = blockSprite;
        this.blockType = blockType
        this.isInPlay = isInPlay;
        this.isSet = isSet;
        this.comboCounter = 1;
    }

    rowNum: number;
    colNum: number;
    blockSprite: Phaser.GameObjects.Sprite;
    blockType: string;
    isInPlay: boolean;
    isSet: boolean;
    comboCounter: number;
}

export enum BlockTypes {
    blueBlock =  'blueBlock',
    greenBlock = 'greenBlock',
    redBlock = 'redBlock',
    yellowBlock = 'yellowBlock',
    purpleBlock = 'purpleBlock',
    emptyBlock = 'emptyBlock'
}