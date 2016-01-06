'use strict';

const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;
const EMPTY = "white";

class Block {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    }
}

class BlockGrid {
    constructor () {
        this.grid = [];

        for (let x = 0; x < MAX_X; x++) {
            let col = [];
            for (let y = 0; y < MAX_Y; y++) {
                col.push(new Block(x, y));
            }

            this.grid.push(col);
        }

        return this;
    }

    render (el = document.querySelector('#gridEl')) {
        for (let x = 0; x < MAX_X; x++) {
            let id = 'col_' + x;
            let colEl = document.createElement('div');
            colEl.className = 'col';
            colEl.id = id;
            el.appendChild(colEl);

            for (let y = MAX_Y - 1; y >= 0; y--) {
                let block = this.grid[x][y],
                    id = `block_${x}x${y}`,
                    blockEl = document.createElement('div');

                blockEl.id = id;
                blockEl.className = 'block';
                blockEl.style.background = block.colour;
                blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block));
                colEl.appendChild(blockEl);
            }
        }

        return this;
    }

    blockClicked (e, block) {
        console.log(e,block);

        this.markNeighboursAsEmpty(block.x,block.y,block.colour);
        this.moveEmpty();
        this.clearGrid();
        this.render();
    }

    // helper method to make blockClicked more readable
    clearGrid(){
        document.querySelector('#gridEl').innerHTML = '';
    }

    // helper method - check if x,y coordinates are inside grid to avoid errors
    // extracted to make markNeighboursAsEmpty more readable
    blockInsideGrid(x,y){
        return  x >= 0 &&
                y >= 0 &&
                x < MAX_X &&
                y < MAX_X;
    }

    // helper method to decide if the block needs to be processed
    // extracted to make markNeighboursAsEmpty more readable
    matchingBlock(x,y, colour){
        return this.grid[x][y].colour == colour &&
               this.grid[x][y].colour != EMPTY
    }

    // recursive method to process matching neighbours
    // this won't scale well with large grid and big clusters of same colour
    markNeighboursAsEmpty(x,y, colour){
        if(this.blockInsideGrid(x,y) &&
           this.matchingBlock(x,y,colour) ){

           this.grid[x][y].colour = EMPTY;

           this.markNeighboursAsEmpty(x-1,y, colour);
           this.markNeighboursAsEmpty(x+1,y, colour);
           this.markNeighboursAsEmpty(x,y+1, colour);
           this.markNeighboursAsEmpty(x,y-1, colour);
        }
    }

    // bubble sort of block colours to make sure 'non-empty' blocks fall down:
    moveEmpty(){
        for(var i=0;i<this.grid.length;i++){
            var swapped;
            do {
                swapped = false;
                for (var j=0; j < this.grid[i].length-1; j++) {
                    if (this.grid[i][j].colour == EMPTY && this.grid[i][j+1].colour != EMPTY) {
                        var temp = this.grid[i][j].colour;
                        this.grid[i][j].colour = this.grid[i][j+1].colour;
                        this.grid[i][j+1].colour = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
