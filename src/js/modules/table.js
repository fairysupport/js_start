export class Table {

    constructor() {
    }

    init() {
        console.log("init");
    }

    cell_click(event) {
        let cell = event.currentTarget;
        alert(cell.parentNode.sectionRowIndex + " : " + cell.cellIndex + " -> " + cell.innerHTML);
    }

}