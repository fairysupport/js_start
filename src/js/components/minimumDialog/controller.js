export class MinimumDialog {

    #dialogMap = new WeakMap();

    constructor() {
    }

    init(data) {
        if (!('container' in this)) {
            let bodyList = document.getElementsByTagName('body');
            let body = bodyList[0];
            $f.appendLoadStringTemplate(body, this.templateContainer(), {})
            .then((nodeList) => {
                this.add(data.dialog);
            });
        } else {
            this.add(data.dialog);
        }
    }

    add(dialogController) {
        $f.beforeLoadStringTemplate(this.dialogLast, this.templateDialog(), {'name': dialogController.getName()})
        .then((nodeList) => {
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].nodeType === Node.ELEMENT_NODE) {
                    this.#dialogMap.set(nodeList[i], dialogController);
                    dialogController.hide();
                    $f.validate('component_minimumDialog', nodeList[i], 'disabled', [null], [this.changeDisabled.bind(this)], {});
                    break;
                }
            }
            let bodyList = document.getElementsByTagName('body');
            let body = bodyList[0];
            body.removeChild(this.container);
            body.appendChild(this.container);
        });
    }
    
    minDialog_click(event) {
        this.#dialogMap.get(event.currentTarget).show();
        this.#dialogMap.delete(event.currentTarget);
        event.currentTarget.parentNode.removeChild(event.currentTarget);
    }
    
    getContainer() {
        return this.container;
    }
    
    changeDisabled(target, property, newValue, oldValue, arg, event) {
        if (newValue) {
            target.style.backgroundColor = '#808080';
            target.style.cursor = 'not-allowed';
        } else {
            target.style.backgroundColor = '#005FFF';
            target.style.cursor = 'pointer';
        }
        return true;
    }

    templateContainer() {
        return `
            <script data-load-only='true'>
                l.minimumDialogContainer = {"position": "fixed", "padding": "0px", "paddingTop": "1px", "bottom": "0px", "left": "0px", "backgroundColor": "transparent", "boxSizing": "content-box", "overflowX": "auto", "overflowY": "hidden"};
                l.minimumDialogLast = {"clear": "both"};
            </script>
            <div data-minimum-dialog-obj='container' data-prop='{"style": l.minimumDialogContainer}'><span data-minimum-dialog-obj='dialogLast' data-prop='{"style": l.minimumDialogLast}'></span></div>
        `;
    }

    templateDialog() {
        return `
            <script data-load-only='true'>
                l.minimumDialog = {"width": "130px", "height": "25px", "cursor": "pointer", "paddingLeft": "5px", "paddingRight": "5px", "border": "solid 1px #000000", "backgroundColor": "#005FFF", "color": "#FFFFFF", "textAlign": "left", "overflow": "hidden", "fontSize": "0.8em", "borderRadius": "0.6rem", "float": "left", "whiteSpace": "nowrap"};
            </script>
            <button data-minimum-dialog-name='minDialog' data-prop='{"style": l.minimumDialog}' data-text='v.name'></button>
        `;
    }

}