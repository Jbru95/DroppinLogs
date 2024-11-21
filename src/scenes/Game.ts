import testFiles from '../boardFiles/test.json';
import { Block, BlockTypes } from '../entities/block';
import { Selector } from '../entities/selector';
import * as _ from 'lodash';

//Things to work on
//bugs with combos, play to figure them out, but its not totally perfect
//Add more to gameover functionality
//maybe add sounds to combos
//add better art for blocks and background of game scene
//slight visual bug with end of draw wreath/border function

export default class Game extends Phaser.Scene{

    //#region Init Variables and Preload
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    public selector1!: Selector;
    public selector2!: Selector;
    public boardArray: Block[][] = [];
    public score: number = 0;
    public scoreReading!: Phaser.GameObjects.Text;

    public swapSpeed!: number;
    public fallSpeed!: number;
    public clearSpeed!: number;
    public fallDelay!: number;

    public keyDownObject = {
        left: false,
        up: false,
        down: false, 
        right: false,
        space: false,
        shift: false
    }
    public topLeftBoardCorner!: Phaser.GameObjects.Sprite;
    public ceilingLine!: Phaser.GameObjects.Sprite;
    public blockScale!: number; //number to convert between index and pixel spaces
    public blockSize!: number; //pixel
    public upSpeed!: number;
    public yBoundBottom!: number;
    public yBoundTop!: number;
    public offsetx!: number;
    public offsety!: number;

    public shouldCheckForMatches: boolean = false;
    public shouldCheckForFalling: boolean = false;
    public shouldResetComboCounters: boolean = false;
    public shouldCheckForSpeedChanges: boolean = false;

    constructor(){
        super('game');
    }

    init() {
        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    preload ()
    {
        //meausured in ms
        this.swapSpeed = 100;
        this.fallSpeed = 100;  
        this.clearSpeed = 100;
        this.fallDelay = 100;
        //measured in px/s
        this.upSpeed = -5;

        this.blockScale = 0.2;
        this.blockSize = 50;
        this.yBoundBottom = ((this.game.config.height as number) - this.blockSize/2);
        this.yBoundTop = this.blockSize/2;
        this.offsetx = (this.game.config.width as number)/2 - (this.blockSize*3); //how far from the left edge the board starts
        this.offsety = this.blockSize/2;
    }
    //#endregion

    //#region Create Functions
    create ()
    {
        this.sound.mute = false;
        this.createMiscObjects();
        // this.createRandom(6,8);
        this.createFromFile(testFiles.generalTest);
    }

    createMiscObjects(): void {
        this.initScore();
        this.drawWreath(304, this.game.config.height as number, 0, (3/20), 0.5)
        this.drawWreath(642, this.game.config.height as number, 0, (3/20), 0.5)

        //add a sprite to the corner to help calculate sprite positions from board row and column
        let corner = this.add.sprite(this.offsetx, this.offsety, 'selector');
        corner.alpha = 0;     
        corner.scale = 0.01;
        this.physics.add.existing(corner, false);
        if(corner.body != null){
            corner.body.velocity.y = this.upSpeed;
        }
        this.topLeftBoardCorner = corner;

        let selector1Sprite = this.add.sprite(this.offsetx, this.offsety, 'selector');
        selector1Sprite.scale = this.blockScale;
        selector1Sprite.setDepth(100);
        this.physics.add.existing(selector1Sprite, false);
        if(selector1Sprite.body != null){
            selector1Sprite.body.velocity.y = this.upSpeed;
        }
        this.selector1 = new Selector(0, 0, selector1Sprite);

        let selector2Sprite = this.add.sprite(this.offsetx + this.blockSize, this.offsety, 'selector');
        selector2Sprite.scale = this.blockScale;
        selector2Sprite.setDepth(100);
        this.physics.add.existing(selector2Sprite, false);
        if(selector2Sprite.body != null){
            selector2Sprite.body.velocity.y = this.upSpeed;
        }
        this.selector2 = new Selector(0,1, selector2Sprite);
    }
    
    createFromFile(boardString: string): void {
        this.createBoard(boardString);
    }

    createRandom(height: number, width: number): void {
        const possibleBlockArray: Array<string> = ['b', 'r', 'g', 'y', 'p'];
        let boardString = "";
        for (let i=0; i < height; i++) {            
            for(let j=0; j < width; j++){
                let randomBlockType: string = possibleBlockArray[Math.floor(possibleBlockArray.length * Math.random())]
                boardString += randomBlockType;
            }
            boardString += ',';
        }
        this.createBoard(boardString);
    }

    createBoard(boardString: string): void {
        const possibleBlockArray: Array<string> = [BlockTypes.blueBlock, BlockTypes.redBlock, BlockTypes.greenBlock, BlockTypes.yellowBlock, BlockTypes.purpleBlock, BlockTypes.emptyBlock];
        let x = 50;
        let y = 50;

        let charArray = boardString.split(',');
        const height = charArray.length;
        const width = charArray[0].length;
        for (let i=0; i < height; i++) {    
            let blockRow: Block[] = [];
            for(let j=0; j < width; j++){
                const blockType = possibleBlockArray.find(el => el[0] == charArray[i][j])!;

                let blockSprite = this.add.sprite(x*j + this.offsetx, y*i + this.offsety, blockType)
                blockSprite.scale = this.blockSize/blockSprite.height;
                this.physics.add.existing(blockSprite, false);
                if(blockSprite.body != null){ 
                    blockSprite.body.velocity.y = this.upSpeed;
                }
                let blockObj = new Block(i,j, blockSprite, blockType, true);
                blockRow.push(blockObj);
            }
            this.boardArray.push(blockRow);
        }
    }
    //#endregion

    //#region Update Functions
    update(){
        this.checkGameOver();
        this.setBlockOpacities();
        this.handleUserInput();
        if(this.shouldResetComboCounters){
            this.shouldResetComboCounters = false;
            this.resetComboOnSetBlocks();
        }
        if(this.shouldCheckForMatches){
            this.shouldCheckForMatches = false;
            this.clearBlocks();
        }
        if(this.shouldCheckForFalling){
            this.shouldCheckForFalling = false;
            this.handleFallingBlocks();
        }
        if(this.shouldCheckForSpeedChanges){
            this.shouldCheckForSpeedChanges = false;
            this.handleSpeedChanges();
        }
	}

    setBlockOpacities(): void {
        const height: number = Number.parseInt(this.game.config.height.toString());
        this.boardArray.forEach(row => {
            row.forEach(block => {
                if(block.blockSprite.getBottomCenter().y! > height){
                    block.blockSprite.alpha = 0.4;
                    block.isInPlay = false;
                }
                else if(block.blockSprite.alpha == 0.4){
                    block.blockSprite.clearAlpha();
                    block.isInPlay = true;
                }
                if(block.blockType == BlockTypes.emptyBlock){
                    block.blockSprite.alpha = 0.001;
                }
            })
        })
    }

    handleUserInput(): void {
        if(this.cursors?.space.isDown && this.keyDownObject.space == false){
            this.swapBlocksInSelectors();
            this.keyDownObject.space = true;
        }
        if(this.cursors?.space.isUp){
            this.keyDownObject.space = false;
        }
        //when user hits shift, it should push up all the blocks so the next row is revealed
		if(this.cursors?.shift.isDown && this.keyDownObject.shift == false){
            this.updateScore(1);
            this.shouldCheckForSpeedChanges = true;
            this.upSpeed = this.upSpeed * 21;
			this.keyDownObject.shift = true;
            this.time.delayedCall(215, () => {
                this.upSpeed = this.upSpeed / 21;
                this.shouldCheckForSpeedChanges = true;
            });
            // console.log(_.clone(this.boardArray));
		}
		if(this.cursors?.shift.isUp){
			this.keyDownObject.shift = false;
		}	
        
		if(this.cursors?.left.isDown && this.keyDownObject.left == false){
            if(this.selector1.colNum > 0){
                this.selector1.colNum -= 1;
                this.selector2.colNum -= 1;

                this.selector1.selectorSprite.x -= this.blockSize;
                this.selector2.selectorSprite.x -= this.blockSize;
            }
			this.keyDownObject.left = true;
		}
		if(this.cursors?.left.isUp){
			this.keyDownObject.left = false;
		}		

		if(this.cursors?.right.isDown && this.keyDownObject.right == false){
            if(this.selector2.colNum < this.boardArray[0].length-1){
                this.selector1.colNum += 1;
                this.selector2.colNum += 1;

                this.selector1.selectorSprite.x += this.blockSize;
                this.selector2.selectorSprite.x += this.blockSize;
            }
			this.keyDownObject.right = true;
		}		
		if(this.cursors?.right.isUp){
			this.keyDownObject.right = false;
		}		

		if(this.cursors?.up.isDown && this.keyDownObject.up == false){
            if(this.selector1.rowNum >= 1){
                this.selector1.rowNum -= 1;
                this.selector2.rowNum -= 1;
    
                this.selector1.selectorSprite.y -= this.blockSize;
                this.selector2.selectorSprite.y -= this.blockSize;
            }
			this.keyDownObject.up = true;
		}	
		if(this.cursors?.up.isUp){
			this.keyDownObject.up = false;
		}			

		if(this.cursors?.down.isDown && this.keyDownObject.down == false){
            if(this.boardArray[this.selector1.rowNum+1][this.selector1.colNum].isInPlay){
                this.selector1.rowNum += 1;
                this.selector2.rowNum += 1;
    
                this.selector1.selectorSprite.y += this.blockSize;
                this.selector2.selectorSprite.y += this.blockSize;
            }
			this.keyDownObject.down = true;
		}	
		if(this.cursors?.down.isUp){
			this.keyDownObject.down = false;
		}
    }

    swapBlocksInSelectors(): void {
        this.sound.play('swap');
        this.swapBlocksAndAnimate(this.selector1.colNum, this.selector1.rowNum, this.selector2.colNum, this.selector2.rowNum, this.swapSpeed);
    }

    swapBlocksAndAnimate(col1: number, row1: number, col2: number, row2: number, swapSpeed: number, isFalling: boolean = false): void {
        if((!this.boardArray[row1][col1].isSet || !this.boardArray[row2][col2].isSet) && !isFalling){
            return;
        }
        let block1 = _.clone(this.boardArray[row1][col1]);
        let block2 = _.clone(this.boardArray[row2][col2]);

        let block1Col = block1.colNum;
        let block1Row = block1.rowNum;
        let block2Col = block2.colNum;
        let block2Row = block2.rowNum;

        block1.colNum = block2Col;
        block1.rowNum = block2Row;
        block1.isSet = false;
        this.boardArray[row2][col2] = block1;
        
        this.tweens.add({
            targets: block1.blockSprite,
            y: this.calculateYfromRow(block1.rowNum) + this.upSpeed*(swapSpeed/1000),
            x: this.calculateXfromCol(block1.colNum),
            duration: swapSpeed,
            onComplete: () => {
                if(this.boardArray[row2+1] && this.boardArray[row2+1][col2].blockType != BlockTypes.emptyBlock){
                    this.boardArray[row2][col2].isSet = true;
                }
                if(this.boardArray[row2][col2].blockType == BlockTypes.emptyBlock){
                    this.boardArray[row2][col2].isSet = true;
                }
            }
        });

        block2.colNum = block1Col;
        block2.rowNum = block1Row;
        block2.isSet = false;
        this.boardArray[row1][col1] = block2;

        this.tweens.add({
            targets: block2.blockSprite,
            y: this.calculateYfromRow(block2.rowNum) + this.upSpeed*(swapSpeed/1000),
            x: this.calculateXfromCol(block2.colNum),
            duration: swapSpeed,
            onComplete: () => {
                if(this.boardArray[row1+1] && this.boardArray[row1+1][col1].blockType != BlockTypes.emptyBlock){
                    this.boardArray[row1][col1].isSet = true;
                }    
                if(this.boardArray[row1][col1].blockType == BlockTypes.emptyBlock){
                    this.boardArray[row1][col1].isSet = true;
                }
                this.shouldCheckForFalling = true;
                this.shouldCheckForMatches = true;
            }
        });
    }

    clearBlocks(): void {
        let blocksToRemove = this.matchAndReturnBlocks(this.boardArray);
        if(blocksToRemove.size == 0){
            this.shouldResetComboCounters = true; //TODO: fix this
        }
        else{
            this.clearChainsFromBoard(blocksToRemove);
        }
    }

    matchAndReturnBlocks(board: Block[][]): Set<Block>{
        //checks and returns the board for all matches called next frame after shouldCheckForMatches is true
        const chains = new Set<Block>();

        //horizontal chain detection
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const block = board[row][col];
                if (block.blockType == BlockTypes.emptyBlock || !block.isInPlay || !block.isSet) continue;
        
                // Check to the right (horizontal match)
                let count = 1;
                while (col + count < board[row].length && board[row][col + count]?.blockType === block.blockType && board[row][col + count].isInPlay && board[row][col + count].isSet) {
                    count++;
                }

                // If 3 or more blocks match, mark them
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        chains.add(this.boardArray[row][col+i]);
                    }
                }
            }
        }

        // Vertical match detection
        for (let col = 0; col < board[0].length; col++) {
            for (let row = 0; row < board.length; row++) {
                const block = board[row][col];
                if (block.blockType == BlockTypes.emptyBlock || !block.isInPlay || !block.isSet) continue;

                // Check downward (vertical match)
                let count = 1;
                while (row + count < board.length && board[row + count][col]?.blockType === block.blockType && board[row + count][col]?.isInPlay && board[row + count][col]?.isSet) {
                    count++;
                }

                // If 3 or more blocks match, mark them
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        chains.add(this.boardArray[row+i][col]);
                    }
                }
            }
        }
        return chains;
    }

    clearChainsFromBoard(blocks: Set<Block>){
        //clears chains if match returns any blocks, sets checkforfalling to true if any are cleared after they are removed
        let blockArray = [...blocks];

        let highestCombo = 1;
        blocks.forEach(block => {
            if(block.comboCounter > highestCombo){
                highestCombo = block.comboCounter;
            }
        });

        if(blockArray.length > 3) this.createPopUpTextAtBlock(blockArray.length.toString(), blockArray[0]);
        if(highestCombo > 1) this.createPopUpTextAtBlock('x' + highestCombo.toString(), blockArray[0]);

        this.updateScore(blockArray.length*highestCombo);
        //send garbage blocks here

        this.sound.play('clear');
        blockArray.forEach(block => {
            this.boardArray[block.rowNum][block.colNum].isSet = false;
            this.tweens.add(({
                targets: block.blockSprite,
                scaleX: 0.05,
                scaleY: 0.05,
                duration: this.clearSpeed,
                onComplete: () => {
                    //add a pop or star sprites maybe

                    block.blockType = BlockTypes.emptyBlock;
                    block.blockSprite.setTexture(BlockTypes.emptyBlock);
                    this.boardArray[block.rowNum][block.colNum].isSet = true; //set these empty blocks
                    this.time.delayedCall(this.fallDelay, () => {
                        if(block == blockArray.at(-1)){ //if this is the last block in the array
                            this.incrementComboCounterForBlocksAbove(blockArray); //do this(we only want to call this once)
                        }
                        this.shouldCheckForFalling = true;
                    })
                }
            }))
        })
    }

    handleFallingBlocks(){
        for (let col = 0; col < this.boardArray[0].length; col++) {
            let highestEmptyRow = -1;  // Track the highest row that is empty
            for (let row = this.boardArray.length - 1; row >= 0; row--) {
                if (this.boardArray[row][col].blockType ==  BlockTypes.emptyBlock && highestEmptyRow == -1) {
                    highestEmptyRow = row;  // Found the highest number(lowest on board) empty row in that column
                }
                if (this.boardArray[row][col].blockType != BlockTypes.emptyBlock && highestEmptyRow !== -1) {
                    this.swapBlocksAndAnimate(col, highestEmptyRow, col, row, this.fallSpeed, true);
                    highestEmptyRow -= 1;
                }
            }
        }
    }

    incrementComboCounterForBlocksAbove(blocks: Block[]): void {
        //Need to increment combo of blocks, but only once for the blocks above each block(not run multiple times)
        let trackerObj: any = {}; //object that holds {colNum: lowest index(highest on board) rowNum}
        let highestComboNum: number = 0;
        blocks.forEach(block => {
            if(block.comboCounter > highestComboNum) highestComboNum = block.comboCounter;

            if(trackerObj[block.colNum]){
                if(block.rowNum < trackerObj[block.colNum]){
                    trackerObj[block.colNum] = block.rowNum;
                }
            }
            else{
                trackerObj[block.colNum] = block.rowNum;
            }
        });

        Object.entries(trackerObj).forEach((rowColArray: any) => {
            this.boardArray.forEach(row => {
                row.forEach(block => {
                    if(block.colNum == rowColArray[0] && block.rowNum < rowColArray[1]){ //if the block is in the same row and higher on the board
                        block.comboCounter = highestComboNum + 1
                    }
                })
            })
        });
    }

    handleSpeedChanges(){
        if(this.selector1.selectorSprite.body != null){
            this.selector1.selectorSprite.body.velocity.y = this.upSpeed;
        }
        if(this.selector2.selectorSprite.body != null){
            this.selector2.selectorSprite.body.velocity.y = this.upSpeed;
        }
        if(this.topLeftBoardCorner.body != null){
            this.topLeftBoardCorner.body.velocity.y = this.upSpeed;
        }

        this.boardArray.forEach(row => {
            row.forEach(block => {
                if(block.blockSprite.body != null){
                    block.blockSprite.body.velocity.y = this.upSpeed;
                }
            })
        });
    }

    //make sure to use these results immediately, as the velocity will change in the meantime and make this out of date
    calculateXfromCol(col: number): number{
        return this.topLeftBoardCorner.x + this.blockSize*col;
    } 

    calculateYfromRow(row: number): number{
        return this.topLeftBoardCorner.y + this.blockSize*row;
    }

    checkGameOver(): void {
        //can maybe change this to just check the highest row on the screen by keeping track of the highest and lowest the user can see
        this.boardArray.forEach(row => {
            row.forEach(block => {
                if (block.blockSprite.y < this.yBoundTop && block.blockType != BlockTypes.emptyBlock) {
                    // Add Game Over logic here, such as stopping the scene, showing a menu, etc.
                    this.scene.pause();
                    // this.scene.restart();
                    // this.scene.start('Game'); //create a separate game-over scene
                }
            });
        });
    }

    createPopUpTextAtBlock(text: string, block: Block): void {
        const popUpText = this.add.text(
            block.blockSprite.x,
            block.blockSprite.y - this.blockSize / 4,
            text,
            {
                font: '28px Arial',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 5,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5); // Centering the text

        // Add animation for the pop-up effect
        this.tweens.add({
            targets: popUpText,
            y: block.blockSprite.y - this.blockSize,
            alpha: 0.2,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => {
                popUpText.destroy(); // Remove text from the scene after animation
            }
        });
    }

    initScore(): void {
        this.add.text(
            750,
            100,
            "Score: ",
            {
                font: '28px Arial',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 5,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        this.scoreReading = this.add.text(
            850,
            100,
            this.score.toString(),
            {
                font: '28px Arial',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 5,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
    }

    drawWreath(xval:number, bottomBound:number, upperBound: number, scale: number, alpha: number ): void {
        //may Need to work out a slight tweak for the end image, sometimes its off for some scales/bounds
        //this can be used for any texture we want to display like a border(vertical for now)
        let a = this.add.image(0,0,'wreathStart').setScale(scale).setAlpha(0);
        let b = this.add.image(0,0,'wreathMiddle').setScale(scale).setAlpha(0);
        let c = this.add.image(0,0,'wreathEnd').setScale(scale).setAlpha(0);

        this.add.image(xval, bottomBound-(a.height/2*scale), 'wreathStart').setScale(scale).setAlpha(alpha);
        let middlePieceCount = (bottomBound-upperBound-(a.height*scale)-(c.height*scale)) / (b.height*scale);
        for (let i = 0; i < middlePieceCount; i++) {
            this.add.image(xval, (bottomBound - (b.height*scale/2) - (a.height*scale))-(b.height*scale*i), 'wreathMiddle').setScale(scale).setAlpha(alpha);
        }
        this.add.image(xval, upperBound+c.height/2*scale, 'wreathEnd').setScale(scale).setAlpha(alpha);
    }

    updateScore(scoreToAdd: number){
        this.scoreReading.text = (Number.parseInt(this.scoreReading.text) + scoreToAdd).toString();
    }

    resetComboOnSetBlocks(): void {
        this.boardArray.forEach(row => {
            row.forEach(block => {
                if (block.isSet && block.comboCounter > 1 && block.isInPlay && block.blockType != BlockTypes.emptyBlock) {
                    console.log(_.clone(block));
                    block.comboCounter = 1;
                }
            });
        });
    }
    //#endregion

}