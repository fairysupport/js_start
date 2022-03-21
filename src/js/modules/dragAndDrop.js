export class DragAndDrop {

    constructor() {
        this.fromMap = new WeakMap();
    }

    dragItem_dragstart(event) {
        event.dataTransfer.clearData();
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData("text/plain", event.currentTarget.id);
    }

    dropContainer_dragover(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }
    
    dropContainer_drop(event) {
        event.preventDefault();
        let id = event.dataTransfer.getData("text/plain");
        let dropObj = document.getElementById(id);
        event.dataTransfer.clearData();
        
        if (!this.dragContainer.contains(dropObj)) {
            return;
        }
        
        $f.appendLoadStringTemplate(this.dropContainer, this.template(), {'id': id})
          .then(() => {
               this.fromMap.set(dropObj, dropObj.parentNode);
               this.place = dropObj;
          })
          .catch((e) => console.error(e));
        
    }
    
    undo_click(event) {
        let id = event.currentTarget.dataset.undo;
        let dropObj = document.getElementById(id);
        if (dropObj && this.fromMap.has(dropObj)) {
            let fromObj = this.fromMap.get(dropObj);
            this['dropWrap' + id] = null;
            fromObj.appendChild(dropObj);
        }
    }
    
    template() {
        return `
            <div style='white-space: nowrap;' data-prop='{"dataset": {"obj": "dropWrap" + v.id}}'>
                <div data-obj='place'></div>
                <button data-name='undo' type='button' data-prop='{"dataset": {"undo": v.id}}'>undo</button>
            </div>
        `;
    }

}