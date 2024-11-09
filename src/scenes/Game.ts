import testFiles from '../boardFiles/test.json';
import { Block, BlockTypes } from '../entities/block';
import { Selector } from '../entities/selector';
import * as _ from 'lodash';


export default class Game extends Phaser.Scene{

    //#region Init Variables and Preload
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    public selector1!: Selector;
    public selector2!: Selector;
    public boardArray: Block[][] = [];

    public keyDownObject = {
        left: false,
        up: false,
        down: false, 
        right: false,
        space: false,
        shift: false
    }
    public ceilingLine!: Phaser.GameObjects.Sprite;
    public blockTypes!: BlockTypes;

    public blockScale!: number; //number to convert between index and pixel spaces
    public blockSize!: number; //pixel
    public upSpeed!: number;
    public downSpeed!: number;
    public xBoundLeft!: number; //index based
    public xBoundRight!: number; //index based
    public yBoundBottom!: number;
    public yBoundTop!: number;
    public boardWidth!: number;
    public offsetx!: number;
    public offsety!: number;

    public shouldCheckForMatches: boolean = false;
    public shouldCheckForFalling: boolean = false;

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
        this.downSpeed = 200;
        this.xBoundLeft = 50;
        this.xBoundRight = 250;
        this.yBoundBottom = ((this.game.config.height as number) - this.blockSize/2);
        this.yBoundTop = 25;
        this.offsetx = 50;
        this.offsety = 500;
    }
    //#endregion

    //#region Create Functions
    create ()
    {
        this.createSelectors();
        // this.createRandom(6,8);
        this.createFromFile(testFiles.test3);
    }

    createSelectors(): void {
        let selector1Sprite = this.add.sprite(150, 500, 'selector');
        selector1Sprite.scale = this.blockScale;
        selector1Sprite.setDepth(100);
        this.physics.add.existing(selector1Sprite, false);
        if(selector1Sprite.body != null){
            selector1Sprite.body.velocity.y = this.upSpeed;
        }
        this.selector1 = new Selector(0, 2, selector1Sprite);

        let selector2Sprite = this.add.sprite(200, 500, 'selector');
        selector2Sprite.scale = this.blockScale;
        selector2Sprite.setDepth(100);
        this.physics.add.existing(selector2Sprite, false);
        if(selector2Sprite.body != null){
            selector2Sprite.body.velocity.y = this.upSpeed;
        }
        this.selector2 = new Selector(0,3, selector2Sprite);
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
        this.setBlocksOutOfFrame();
        this.handleUserInput();
        if(this.shouldCheckForMatches){
            this.clearBlocks();
        }
        if(this.shouldCheckForFalling){
            this.handleFallingBlocks();
        }
	}

    //setBlocksOutOfFrame
    setBlocksOutOfFrame(): void {
        const height: number = Number.parseInt(this.game.config.height.toString());
        this.boardArray.forEach(row => {
            row.forEach(block => {
                if(block.blockSprite.getBottomCenter().y! > height){
                    block.blockSprite.alpha = 0.5;
                    block.isInPlay = false;
                }
                else{
                    block.blockSprite.clearAlpha();
                    block.isInPlay = true;
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
            this.upSpeed*20
			this.keyDownObject.shift = true;
            this.time.delayedCall(215, () => this.upSpeed/20);
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
        //animate them to slide like .1 seconds before making this swap to make it look smooth
        this.shouldCheckForFalling = true;
        this.exchangeTypesAndTextures(this.selector1.colNum, this.selector1.rowNum, this.selector2.colNum, this.selector2.rowNum);
    }

    exchangeTypesAndTextures(col1: number, row1: number, col2: number, row2: number): void {
        let block1 = _.clone(this.boardArray[row1][col1]);
        let block2 = _.clone(this.boardArray[row2][col2]);

        this.boardArray[row1][col1].blockType = block2.blockType;
        this.boardArray[row2][col2].blockType = block1.blockType;

        this.boardArray[row1][col1].blockSprite.setTexture(block2.blockType);
        this.boardArray[row2][col2].blockSprite.setTexture(block1.blockType);
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

    matchAndReturnsBlocks(board: Block[][]): Set<string>{
        const chains = new Set<string>();

        //horizontal chain detection
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const block = board[row][col];
                if (block.blockType == BlockTypes.emptyBlock || !block.isInPlay) continue;
        
                // Check to the right (horizontal match)
                let count = 1;
                while (col + count < board[row].length && board[row][col + count]?.blockType === block.blockType && board[row][col + count].isInPlay) {
                    count++;
                }

                // If 3 or more blocks match, mark them
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        chains.add(`${row},${col + i}`);
                    }
                }
            }
        }

        // Vertical match detection
        for (let col = 0; col < board[0].length; col++) {
            for (let row = 0; row < board.length; row++) {
                const block = board[row][col];
                if (block.blockType == BlockTypes.emptyBlock || !block.isInPlay) continue;

                // Check downward (vertical match)
                let count = 1;
                while (row + count < board.length && board[row + count][col]?.blockType === block.blockType && board[row + count][col]?.isInPlay) {
                    count++;
                }

                // If 3 or more blocks match, mark them
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        chains.add(`${row + i},${col}`);
                    }
                }
            }
        }
        return chains;
    }

    clearChainsFromBoard(blockCoords: Set<string>){
        blockCoords.forEach(blockCoord => {
            const [row, col] = blockCoord.split(',').map(Number);
            this.boardArray[row][col].blockType = BlockTypes.emptyBlock;
            this.boardArray[row][col].blockSprite.setTexture(BlockTypes.emptyBlock);
        });
        this.shouldCheckForFalling = true;
    }

    handleFallingBlocks(){
        //works, TODO: now we need to work on detecting combos from the falling blocks(the only way to combo)
        for (let col = 0; col < this.boardArray[0].length; col++) {
            let highestEmptyRow = -1;  // Track the highest row that is empty
            for (let row = this.boardArray.length - 1; row >= 0; row--) {
                if (this.boardArray[row][col].blockType ==  BlockTypes.emptyBlock && highestEmptyRow == -1) {
                    highestEmptyRow = row;  // Found an empty space
                }
                else if (this.boardArray[row][col].blockType != BlockTypes.emptyBlock && highestEmptyRow !== -1) {
                    this.exchangeTypesAndTextures(col, highestEmptyRow, col, row);
                    highestEmptyRow -= 1; // Update the emptyRow to the next empty space

                }
            }
        }
        this.shouldCheckForFalling = false;
    }
    //#endregion

}