import testFiles from '../boardFiles/test.json';

export default class Game extends Phaser.Scene{

    //#region Init Variables and Preload
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    public selector1!: Phaser.GameObjects.Image;
    public selector2!: Phaser.GameObjects.Image;
	public blocks: Record<string, any[]> = {
        'electricBlocks': [],
        'grassBlocks': [],
        'waterBlocks': [],
        'fireBlocks': [],
        'psychicBlocks': []
    }
    public allBlocks: any[] = [];
    public keyDownObject = {
        left: false,
        up: false,
        down: false, 
        right: false,
        space: false,
        shift: false
    }
    public selectedBlock1!: Phaser.GameObjects.Image | null;
    public selectedBlock2!: Phaser.GameObjects.Image | null;
    public ceilingLine!: Phaser.GameObjects.Image;

    public blockScale!: number;
    public blockSize!: number;
    public upSpeed!: number;
    public downSpeed!: number;
    public xBoundLeft!: number;
    public xBoundRight!: number;
    public yBoundBottom!: number;
    public yBoundTop!: number;

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
        this.selector1 = this.add.image(150, 450, 'selector');
        this.selector1.scale = this.blockScale;
        this.selector1.setDepth(100);
        this.physics.add.existing(this.selector1, false);
        if(this.selector1.body != null){
            this.selector1.body.setSize(50, 50, true);
            this.selector1.body.velocity.y = this.upSpeed;
        }

        this.selector2 = this.add.image(200, 450, 'selector');
        this.selector2.scale = this.blockScale;
        this.selector2.setDepth(100);
        this.physics.add.existing(this.selector2, false);
        if(this.selector2.body != null){
            this.selector2.body.setSize(50, 50, true);
            this.selector2.body.velocity.y = this.upSpeed;
        }
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
        const possibleBlockArray: Array<string> = ['waterBlock', 'fireBlock', 'grassBlock', 'lightningBlock', 'psychicBlock'];
        let x = 50;
        let y = 50;
        let offsetx = 50;
        let offsety = 500;

        let charArray = boardString.split(',');
        const height = charArray.length;
        const width = charArray[0].length;
        for (let i=0; i < height; i++) {            
            for(let j=0; j < width; j++){
                if(charArray[i][j] == " "){
                    continue;
                }
                const blockType = possibleBlockArray.find(el => el[0] == charArray[i][j]);
                let newBlock = this.add.image(x*j + offsetx, y*i + offsety, blockType);
                newBlock.scale = this.blockSize/newBlock.height;
                this.physics.add.existing(newBlock, false);
                if(newBlock.body != null){ 
                    //this is a godsend, detects boundarys but only for blocks above and below not corners cuz circle :)
                    newBlock.body.setCircle(this.blockSize/this.blockScale*0.53);
                    newBlock.body.velocity.y = this.upSpeed;
                }
                this.addToBlockBucket(newBlock);
                this.allBlocks.push(newBlock);
            }
        }
    }

    addToBlockBucket(newBlock: Phaser.GameObjects.Image): void {
        if(newBlock.texture.key == 'lightningBlock') this.blocks.electricBlocks.push(newBlock);
        if(newBlock.texture.key == 'waterBlock') this.blocks.waterBlocks.push(newBlock);
        if(newBlock.texture.key == 'grassBlock') this.blocks.grassBlocks.push(newBlock);
        if(newBlock.texture.key == 'psychicBlock') this.blocks.psychicBlocks.push(newBlock);
        if(newBlock.texture.key == 'fireBlock') this.blocks.fireBlocks.push(newBlock);
    }
    //#endregion

    //#region Update Functions
    update(){
        this.setBlockOpacity();
        this.handleUserInput()
        this.clearBlocks();
        this.makeBlocksFall();
	}

    //setBlockOpacity
    //using block opacity to determine whether blocks can be interacted with
    //blocks with opacity != 1, shouldn't interact with other blocks
    setBlockOpacity(): void {
        this.allBlocks.forEach(block => {
            if(block.getBottomCenter().y > this.game.config.height){
                block.alpha = 0.5;
            }
            else{
                block.clearAlpha()
            }
        })
    }

    handleUserInput(): void {
        if(this.cursors?.space.isDown && this.keyDownObject.space == false){
            this.swapOrMoveBlocks();
            this.keyDownObject.space = true;
        }
        if(this.cursors?.space.isUp){
            this.keyDownObject.space = false;
        }
        //when user hits shift, it should push up all the blocks so the next row is revealed
		if(this.cursors?.shift.isDown && this.keyDownObject.shift == false){
            this.upSpeed = 20*this.upSpeed;
			this.keyDownObject.shift = true;
            this.time.delayedCall(215, () => this.upSpeed = this.upSpeed/20);
		}
		if(this.cursors?.shift.isUp){
			this.keyDownObject.shift = false;
		}	
		if(this.cursors?.left.isDown && this.keyDownObject.left == false){
            if(this.selector1.x > this.xBoundLeft){
                this.selector1.x -= this.blockSize;
                this.selector2.x -= this.blockSize;
            }
			this.keyDownObject.left = true;
		}
		if(this.cursors?.left.isUp){
			this.keyDownObject.left = false;
		}		
		if(this.cursors?.right.isDown && this.keyDownObject.right == false){
            if(this.selector1.x < this.xBoundRight){
                this.selector1.x += this.blockSize;
                this.selector2.x += this.blockSize;
            }
			this.keyDownObject.right = true;
		}		
		if(this.cursors?.right.isUp){
			this.keyDownObject.right = false;
		}		
		if(this.cursors?.up.isDown && this.keyDownObject.up == false){
			this.selector1.y -= this.blockSize;
            this.selector2.y -= this.blockSize;
			this.keyDownObject.up = true;
		}	
		if(this.cursors?.up.isUp){
			this.keyDownObject.up = false;
		}			
		if(this.cursors?.down.isDown && this.keyDownObject.down == false){
			this.selector1.y += this.blockSize;
            this.selector2.y += this.blockSize;
			this.keyDownObject.down = true;
		}	
		if(this.cursors?.down.isUp){
			this.keyDownObject.down = false;
		}
    }

    swapOrMoveBlocks(): void {
        this.selectedBlock1 = null;
        this.selectedBlock2 = null;
        Object.values(this.blocks).forEach(blockArray => {
            blockArray.forEach(indivBlock => {
                if(this.physics.overlap(this.selector1, indivBlock)){
                    this.selectedBlock1 = indivBlock;
                }
                if(this.physics.overlap(this.selector2, indivBlock)){
                    this.selectedBlock2 = indivBlock;
                }            
            });
        });
        if(this.selectedBlock1 != null && this.selectedBlock2 != null){
            const tempX = this.selectedBlock2.x;
            const tempY = this.selectedBlock2.y;
            this.selectedBlock2.setPosition(this.selectedBlock1.x, this.selectedBlock1.y);
            this.selectedBlock1.setPosition(tempX, tempY);
            this.keyDownObject.space = true;
        }
        else if(this.selectedBlock1 == null && this.selectedBlock2 != null){
            this.selectedBlock2.setPosition(this.selector1.x, this.selector1.y);
        }
        else if(this.selectedBlock2 == null && this.selectedBlock1 != null){
            this.selectedBlock1.setPosition(this.selector2.x, this.selector2.y);
        }
    }

    clearBlocks(): void {
        Object.values(this.blocks).forEach(blockArray => {
            this.findAndClearChainsOfASingleColor(blockArray)
        });
    }

    //findAndClearChainsOfASingleColor 
    //algorithm to find and clear chains of blocks, uses DFS and physics.overlap to find longest chains
    findAndClearChainsOfASingleColor(blocks: any) {
        let visited = new Set();
        var that = this;
        function dfs(block, chain) {
            if (visited.has(block)) {
                return;
            }
            visited.add(block);
            chain.push(block);
            const neighbors = getConnectedNeighbors(block);
            for (const neighbor of neighbors) {
                dfs(neighbor, chain);
            }
        }
    
        function getConnectedNeighbors(block) {
            //return blocks that are valid neightbor that can be cleared
            return blocks.filter(otherBlock => {
                return (that.physics.overlap(block, otherBlock)  //if the blocks are overlapping
                        && block.body.velocity.y == that.upSpeed //and both blocks are at rest(not mid fall)
                        && otherBlock.body.velocity.y == that.upSpeed)
                        && block.alpha == 1 //opacity = 1 (blocks arent totally above the floor)
                        && otherBlock.alpha == 1
            });
        }
        function clearChain(chain: any) {
            if (chain.length >= 3) {
                that.removeBlockChainFromGame(chain);
            }
        }
        for (let block of blocks) {
            visited = new Set();
            const chain = [];
            dfs(block, chain);
            clearChain(chain);
        }
    }

    removeBlockFromGame(block: any): void {
        Object.entries(this.blocks).forEach(entry => {
            const filteredBlocks = entry[1].filter(indivBlock => indivBlock != block);
            this.blocks[entry[0]] = filteredBlocks;
        });
        this.allBlocks.filter(el => el != block);
        block.destroy()
    }

    removeBlockChainFromGame(chain: any[]){
        Object.entries(this.blocks).forEach(entry => {
            const filteredBlocks = entry[1].filter(indivBlock => (chain.findIndex(chainBlock => chainBlock == indivBlock) == -1));
            this.blocks[entry[0]] = filteredBlocks;
        });
        chain.forEach(block => {
            this.allBlocks = this.allBlocks.filter(el => el != block);
            block.destroy()
        });
    }

    makeBlocksFall(): void {
        let fallBool = true;
        this.allBlocks.forEach(block => {
            this.allBlocks.forEach(otherBlock => {
                if((this.physics.overlap(block, otherBlock) && otherBlock.y > block.y + 30) || block.y >= this.yBoundBottom){
                    fallBool = false;
                }
            });
            if(fallBool){
                block.body.setVelocityY(this.downSpeed);
            }
            else{
                block.body.setVelocityY(this.upSpeed);
            }
            fallBool = true;
        });
    }
    //#endregion

}