export class Parent {
    
    #dragObj = null;
    dropBorder = 'solid 5px #4169e1';
    noDropBorder = 'solid 1px #000000';

    #dragAndDropFromMap = new WeakMap();
    
    constructor() {
    }

    init(data) {
    }
    
    
    //** drag and sort **//

    sortItem_dragstart(event) {
        event.dataTransfer.clearData();
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = 'move';
        this.#dragObj = event.currentTarget;
    }

    sortArea_dragover(event) {
        event.preventDefault();
        if (!this.sortArea.contains(this.#dragObj)) {
            return;
        }
        
        let rowList = this.sortArea.childNodes;
        for (let i = 0; i < rowList.length; i++) {
            if (rowList.item(i).nodeType === Node.ELEMENT_NODE) {
                rowList.item(i).style.borderTop = this.noDropBorder;
                rowList.item(i).style.borderBottom = this.noDropBorder;
            }
        }
        
        let rowObj = event.target;
        while (rowObj.parentNode !== this.sortArea) {
            rowObj = rowObj.parentNode;
        }
        
        let rowRect = rowObj.getBoundingClientRect();
        let rowHalf = window.scrollY + rowRect.y + (rowRect.height / 2);
        if (event.pageY < rowHalf) {
            rowObj.style.borderTop = this.dropBorder;
        } else {
            rowObj.style.borderBottom = this.dropBorder;
        }
    }
    
    sortArea_dragleave(event) {
        event.preventDefault();
        
        let rowList = this.sortArea.childNodes;
        for (let i = 0; i < rowList.length; i++) {
            if (rowList.item(i).nodeType === Node.ELEMENT_NODE) {
                rowList.item(i).style.borderTop = this.noDropBorder;
                rowList.item(i).style.borderBottom = this.noDropBorder;
            }
        }
        
    }
    
    sortArea_drop(event) {
        event.preventDefault();
        event.dataTransfer.clearData();
        if (!this.sortArea.contains(this.#dragObj)) {
            return;
        }
        
        let rowObj = event.target;
        while (rowObj.parentNode !== this.sortArea) {
            rowObj = rowObj.parentNode;
        }
        
        if (this.#dragObj !== rowObj) {
            let rowRect = rowObj.getBoundingClientRect();
            let rowHalf = window.scrollY + rowRect.y + (rowRect.height / 2);
            if (event.pageY < rowHalf) {
                this.sortArea.insertBefore(this.#dragObj, rowObj);
            } else {
                this.sortArea.removeChild(this.#dragObj);
                this.sortArea.replaceChild(this.#dragObj, rowObj);
                this.sortArea.insertBefore(rowObj, this.#dragObj);
            }
        }
        
    }
    
    sortArea_dragend(event) {
        event.preventDefault();
        event.dataTransfer.clearData();
        
        let rowList = this.sortArea.childNodes;
        for (let i = 0; i < rowList.length; i++) {
            if (rowList.item(i).nodeType === Node.ELEMENT_NODE) {
                rowList.item(i).style.borderTop = this.noDropBorder;
                rowList.item(i).style.borderBottom = this.noDropBorder;
            }
        }
        
        this.#dragObj = null;
        
    }
    
    
    
    //** drag and drop **//
    
    dragItem_dragstart(event) {
        event.dataTransfer.clearData();
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData("text/plain", event.currentTarget.id);
    }

    dropContainer_dragover(event) {
        event.preventDefault();
    }
    
    dropContainer_drop(event) {
        event.preventDefault();
        let id = event.dataTransfer.getData("text/plain");
        let dropObj = document.getElementById(id);
        event.dataTransfer.clearData();
        
        if (!this.dragContainer.contains(dropObj)) {
            return;
        }
        
        $f.appendLoadStringTemplate(this.dropContainer, this.dragAndDropTemplate(), {'id': id})
          .then(() => {
               this.#dragAndDropFromMap.set(dropObj, dropObj.parentNode);
               this['dragAndDropPlace' + id] = dropObj;
          })
          .catch((e) => console.error(e));
        
    }
    
    dragAndDropUndo_click(event) {
        let id = event.currentTarget.dataset.undo;
        let dropObj = document.getElementById(id);
        if (dropObj && this.#dragAndDropFromMap.has(dropObj)) {
            let fromObj = this.#dragAndDropFromMap.get(dropObj);
            this['dragAndDropResultContainer' + id] = null;
            fromObj.appendChild(dropObj);
        }
    }
    
    dragAndDropTemplate() {
        return `
            <div style='white-space: nowrap;' data-prop='{"dataset": {"obj": "dragAndDropResultContainer" + v.id}}'>
                <div data-prop='{"dataset": {"obj": "dragAndDropPlace" + v.id}}'></div>
                <button data-name='dragAndDropUndo' type='button' data-prop='{"dataset": {"undo": v.id}}'>undo</button>
            </div>
        `;
    }

}