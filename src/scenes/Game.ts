import testFiles from '../boardFiles/test.json';
import { Block, BlockTypes } from '../entities/block';
import { Selector } from '../entities/selector';
import * as _ from 'lodash';

//Things to work on
//Add lose functionality when the blocks hit the top
//Add sprites/animation for when 4/5/6/7/8 blocks are cleared
//Add combos
//Add sprites/sounds for combos
//Make blocks move over then fall after
//bug when you move a block over and it hits a horizontal clear when it should fall instead
//maybe add some scoring that counts up for the number of blocks cleared

export default class Game extends Phaser.Scene{

    //#region Init Variables and Preload
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    public selector1!: Selector;
    public selector2!: Selector;
    public boardArray: Block[][] = [];

    public swapSpeed: number = 100;
    public fallSpeed: number = 400;

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
    public xBoundLeft!: number; //index based
    public xBoundRight!: number; //index based
    public yBoundBottom!: number;
    public yBoundTop!: number;
    public offsetx!: number;
    public offsety!: number;

    public shouldCheckForMatches: boolean = false;
    public shouldCheckForFalling: boolean = false;
    public shouldCheckForSpeedChanges: boolean = false;

    constructor(){
        super('game');
    }

    init() {
        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    preload ()
    {
        this.blockScale = 0.2;
        this.blockSize = 50;
        this.upSpeed = -10;
        this.xBoundLeft = 50;
        this.xBoundRight = 250;
        this.yBoundBottom = ((this.game.config.height as number) - this.blockSize/2);
        this.yBoundTop = 25;
        this.offsetx = 50;
        this.offsety = 200;
    }
    //#endregion

    //#region Create Functions
    create ()
    {
        // this.sound.mute = true;
        this.createSelectors();
        // this.createRandom(6,8);
        this.createFromFile(testFiles.test3);
    }

    createSelectors(): void {
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
        const possibleBlockArray: Array<string> = ['w', 'f', 'g', 'l', 'p'];
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
        const possibleBlockArray: Array<string> = ['waterBlock', 'fireBlock', 'grassBlock', 'lightningBlock', 'psychicBlock', 'emptyBlock'];
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
        this.setBlockOpacities();
        this.handleUserInput();
        if(this.shouldCheckForMatches){
            this.clearBlocks();
        }
        if(this.shouldCheckForFalling){
            this.handleFallingBlocks();
        }
        if(this.shouldCheckForSpeedChanges){
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
            this.shouldCheckForMatches = true;
            this.swapBlocksInSelectors();
            this.keyDownObject.space = true;
        }
        if(this.cursors?.space.isUp){
            this.keyDownObject.space = false;
        }
        //when user hits shift, it should push up all the blocks so the next row is revealed
		if(this.cursors?.shift.isDown && this.keyDownObject.shift == false){
            this.shouldCheckForSpeedChanges = true;
            this.upSpeed = this.upSpeed * 21;
			this.keyDownObject.shift = true;
            this.time.delayedCall(215, () => {
                this.upSpeed = this.upSpeed / 21;
                this.shouldCheckForSpeedChanges = true;
            });
		}
		if(this.cursors?.shift.isUp){
			this.keyDownObject.shift = false;
		}	
        
		if(this.cursors?.left.isDown && this.keyDownObject.left == false){
            if(this.selector1.colNum > (this.xBoundLeft - this.offsetx)/this.blockSize){
                this.selector1.colNum -= 1;
                this.selector2.colNum -= 1;

                //debating whether I should even do this here, or just make all the array based calculations then just repaint the blocks
                //and selectors based on the array at the start of each frame, will need to do this if we have multiplayer with array stuff on backend
                //and frontend just does painting and handling user input.
                this.selector1.selectorSprite.x -= this.blockSize;
                this.selector2.selectorSprite.x -= this.blockSize;
            }
			this.keyDownObject.left = true;
		}
		if(this.cursors?.left.isUp){
			this.keyDownObject.left = false;
		}		

		if(this.cursors?.right.isDown && this.keyDownObject.right == false){
            if(this.selector1.colNum < (this.xBoundRight - this.offsetx)/this.blockSize){
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

    swapBlocksAndAnimate(col1: number, row1: number, col2: number, row2: number, swapSpeed: number): void {
        let block1 = _.clone(this.boardArray[row1][col1]);
        let block2 = _.clone(this.boardArray[row2][col2]);

        let block1Col = block1.colNum;
        let block1Row = block1.rowNum;
        let block2Col = block2.colNum;
        let block2Row = block2.rowNum;

        block1.colNum = block2Col;
        block1.rowNum = block2Row;
        this.boardArray[row2][col2] = block1;
        this.shouldCheckForFalling = true;
        
        this.tweens.add({
            targets: block1.blockSprite,
            y: this.calculateYfromRow(block1.rowNum) + this.upSpeed*(swapSpeed/1000),
            x: this.calculateXfromCol(block1.colNum),
            duration: swapSpeed
        });

        block2.colNum = block1Col;
        block2.rowNum = block1Row;
        this.boardArray[row1][col1] = block2;
        this.shouldCheckForFalling = true;

        this.tweens.add({
            targets: block2.blockSprite,
            y: this.calculateYfromRow(block2.rowNum) + this.upSpeed*(swapSpeed/1000),
            x: this.calculateXfromCol(block2.colNum),
            duration: swapSpeed
        });
    }

    clearBlocks(): void {
        let blocksToRemove = this.matchAndReturnsBlocks(this.boardArray);
        if(blocksToRemove.size == 0){
            this.shouldCheckForMatches = false;
        }
        else{
            this.clearChainsFromBoard(blocksToRemove);
        }
    }

    matchAndReturnsBlocks(board: Block[][]): Set<Block>{
        const chains = new Set<Block>();

        //horizontal chain detection
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const block = board[row][col];
                if (block.blockType == BlockTypes.emptyBlock || !block.isInPlay || !block.isSet) continue;
        
                // Check to the right (horizontal match)
                let count = 1;
                while (col + count < board[row].length && board[row][col + count]?.blockType === block.blockType && board[row][col + count].isInPlay) {
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
                while (row + count < board.length && board[row + count][col]?.blockType === block.blockType && board[row + count][col]?.isInPlay) {
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
        [...blocks].forEach(block => {
            block.isSet = false;
            console.log(block);
            this.tweens.add(({
                targets: block.blockSprite,
                scaleX: 0.05,
                scaleY: 0.05,
                duration: 200,
                onComplete: () => {
                    //add a pop or star sprites maybe
                    this.sound.play('clear');
                    block.blockType = BlockTypes.emptyBlock;
                    block.blockSprite.setTexture(BlockTypes.emptyBlock);
                    this.shouldCheckForFalling = true;
                }
            }))
        })

        
    }

    handleFallingBlocks(){
        //works, TODO: now we need to work on detecting combos from the falling blocks(the only way to combo)
        for (let col = 0; col < this.boardArray[0].length; col++) {
            let highestEmptyRow = -1;  // Track the highest row that is empty
            for (let row = this.boardArray.length - 1; row >= 0; row--) {
                if (this.boardArray[row][col].blockType ==  BlockTypes.emptyBlock && highestEmptyRow == -1) {
                    highestEmptyRow = row;  // Found the highest number(lowest on board) empty row in that column
                }
                if (this.boardArray[row][col].blockType != BlockTypes.emptyBlock && highestEmptyRow !== -1) {
                    this.swapBlocksAndAnimate(col, highestEmptyRow, col, row, this.fallSpeed);
                    highestEmptyRow -= 1;
                }
            }
        }
        this.shouldCheckForFalling = false;
        this.shouldCheckForMatches = true; //potential combo
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
        this.shouldCheckForSpeedChanges = false;
    }

    //make sure to use these results immediately, as the velocity will change in the meantime and make this out of date
    calculateXfromCol(col: number): number{
        return this.topLeftBoardCorner.x + this.blockSize*col;
    } 

    calculateYfromRow(row: number): number{
        return this.topLeftBoardCorner.y + this.blockSize*row;
    }
    //#endregion

}