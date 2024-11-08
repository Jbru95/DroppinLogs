export class Selector{
    constructor(rowNum: number, colNum: number, selectorSprite: Phaser.GameObjects.Sprite){
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.selectorSprite = selectorSprite;
    }

    rowNum: number;
    colNum: number;
    selectorSprite: Phaser.GameObjects.Sprite;
}