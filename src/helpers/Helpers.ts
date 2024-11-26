export class Utils{
    drawThreeSliceRepeatTexture(scene: Phaser.Scene, xval:number, yval:number, length: number, texture: string, scale: number = 1, alpha: number = 1, horizontal: boolean =  false, reverse: boolean = false): void {
        //fits as many middle piece as it can without being larger than the length, and then puts the end on top, but scales perfectly
        let a = scene.add.image(0,0, texture + 'Start').setScale(scale).setAlpha(0);
        let b = scene.add.image(0,0, texture + 'Middle').setScale(scale).setAlpha(0);
        let c = scene.add.image(0,0, texture + 'End').setScale(scale).setAlpha(0);
        let middlePieceCount = ((length-(a.height*scale)-(c.height*scale)) / (b.height*scale)) | 0;
        if (!reverse && !horizontal){ //vertical bottom to top
            scene.add.image(xval, yval-(a.height/2*scale), texture + 'Start').setScale(scale).setAlpha(alpha);
            for (let i = 0; i < middlePieceCount+1; i++) {
                scene.add.image(xval, (yval - (b.height*scale/2) - (a.height*scale)) - (b.height*scale*i), texture + 'Middle').setScale(scale).setAlpha(alpha);
            }
            scene.add.image(xval, yval - (a.height*scale) - b.height*scale*(middlePieceCount+1) - c.height*scale/2, texture + 'End').setScale(scale).setAlpha(alpha);    
        }
        else if(reverse && !horizontal){ //vertical top to bottom
            scene.add.image(xval, yval+(a.height/2*scale), texture + 'Start').setScale(scale).setAlpha(alpha).setAngle(180);
            for (let i = 0; i < middlePieceCount+1; i++) {
                scene.add.image(xval, (yval + (b.height*scale/2) + (a.height*scale)) + (b.height*scale*i), texture + 'Middle').setScale(scale).setAlpha(alpha).setAngle(180);
            }
            scene.add.image(xval, yval + (a.height*scale) + b.height*scale*(middlePieceCount+1) + c.height*scale/2, texture + 'End').setScale(scale).setAlpha(alpha).setAngle(180);
        }
        else if(!reverse && horizontal){ //horizontal left to right
            scene.add.image(xval+(a.height/2*scale), yval, texture + 'Start').setScale(scale).setAlpha(alpha).setAngle(90);
            for (let i = 0; i < middlePieceCount+1; i++) {
                scene.add.image((xval + (b.height*scale/2) + (a.height*scale)) + (b.height*scale*i), yval, texture + 'Middle').setScale(scale).setAlpha(alpha).setAngle(90);
            }
            scene.add.image(xval + (a.height*scale) + b.height*scale*(middlePieceCount+1) + c.height*scale/2, yval, texture + 'End').setScale(scale).setAlpha(alpha).setAngle(90);    
        }
        else if(reverse && horizontal){ //horizontal right to left
            scene.add.image(xval-(a.height/2*scale), yval, texture + 'Start').setScale(scale).setAlpha(alpha).setAngle(270);
            for (let i = 0; i < middlePieceCount+1; i++) {
                scene.add.image((xval - (b.height*scale/2) - (a.height*scale)) - (b.height*scale*i), yval, texture + 'Middle').setScale(scale).setAlpha(alpha).setAngle(270);
            }
            scene.add.image(xval - (a.height*scale) - b.height*scale*(middlePieceCount+1) - c.height*scale/2, yval, texture + 'End').setScale(scale).setAlpha(alpha).setAngle(270);    
        }
    }

    drawButton(scene: Phaser.Scene, onClick: Function, xval: number, yval: number, text: string, scale: number): void {
        let textObject = scene.add.text(xval, yval, text, { fontSize: '24px', fontFamily: 'Times New Roman', color: '#8c6a19', fontStyle: 'bold' }).setOrigin(0.5).setDepth(3);

        let imageObject = scene.add.image(xval, yval, 'menuButton').setScale(scale)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setDepth(2)
        .on('pointerover', () => {
            imageObject.setScale(scale*1.3);
            imageObject.setTint(0xffd700)
            textObject.setStyle({ fill: '#ffffff', fontSize: '28px' });
            scene.sound.play('swap');
        })
        .on('pointerout', () => {
            imageObject.setScale(scale);
            imageObject.clearTint();
            textObject.setStyle({ fill: '#8c6a19', fontSize: '24px' })
        })
        .on('pointerdown', onClick);
    }
}

