export class Dialog {

    #mousedownStatus = null;

    #statusTopLeft = 'topLeft';
    #statusTop = 'top';
    #statusTopRight = 'topRight';
    #statusLeft = 'left';
    #statusRight = 'right';
    #statusBottomLeft = 'bottomLeft';
    #statusBottomRight = 'bottomRight';
    #statusBottom = 'bottom';
    #statusBar = 'bar';

    #preX = null;
    #preY = null;

    #disabledMap = null;

    #mousemoveFunc = null;
    #mouseupFunc = null;
    #userSelect = null;
    
    #dialogType = null;
    
    #beforeMaxTop = null;
    #beforeMaxLeft = null;
    #beforeMaxWidth = null;
    #beforeMaxHeight = null;
    #beforeMaxMiddleCenterHeight = null;

    #name = null;

    constructor() {
    }
    
    init(data) {
        
        this.#name = data.name;

        this.#dialogType = data.type;

        if ('modeless' !== this.#dialogType) {
            this.#disabledMap = new Map();
            let disabledTagList = ['input', 'select', 'textarea', 'a', 'button', 'form'];
            for (let disabledTag of disabledTagList) {
                let eleList = document.getElementsByTagName(disabledTag);
                for (let i = 0; i < eleList.length; i++) {
                    if (!eleList.item(i).disabled && eleList.item(i) !== this.closeButton && eleList.item(i) !== this.maxButton && eleList.item(i) !== this.minButton) {
                        this.#disabledMap.set(eleList.item(i), eleList.item(i));
                        eleList.item(i).disabled = true;
                    }
                }
            }
        }

        this.#mousemoveFunc = this.mousemoveSomewhere.bind(this);
        window.addEventListener('mousemove', this.#mousemoveFunc);

        this.#mouseupFunc = this.mouseupSomewhere.bind(this);
        window.addEventListener('mouseup', this.#mouseupFunc);
        
        let bodyList = document.getElementsByTagName('body');
        this.#userSelect = bodyList[0].style.userSelect;
        
        if ('component' === data.contentType) {
            $f.loadUniqueComponent(this.middleCenter, data.content, data.contentParam)
            .then(this.loadSuccess.bind(this))
            .catch(this.loadError.bind(this));
        } else {
            $f.loadTemplate(this.middleCenter, data.content, data.contentParam)
            .then(this.loadSuccess.bind(this))
            .catch(this.loadError.bind(this));
        }
        
    }

    loadSuccess() {

        this.dialog.style.display = 'flex';

        let documentWidthHalf =   document.documentElement.clientWidth / 2;
        let documentHeightHalf = document.documentElement.clientHeight / 2;

        let dialogWidthHalf = this.dialog.offsetWidth / 2;
        let dialogHeightHalf = this.dialog.offsetHeight / 2;

        let left = documentWidthHalf - dialogWidthHalf;
        let top = documentHeightHalf - dialogHeightHalf;
        this.dialog.style.left = (left < 0 ? 0 : window.scrollX + left) + 'px';
        this.dialog.style.top = (top < 0 ? 0 : window.scrollY + top) + 'px';
        
        if ('modeless' !== this.#dialogType) {
            this.dialogBack.style.width = document.documentElement.scrollWidth + 'px';
            this.dialogBack.style.height = document.documentElement.scrollHeight + 'px';
        }

        let rect = this.dialog.getBoundingClientRect();
        this.#beforeMaxTop = window.scrollY + rect.y;
        this.#beforeMaxLeft = window.scrollX + rect.x;
        this.#beforeMaxWidth = rect.width;
        this.#beforeMaxHeight = rect.height;
        let middleCenterRect = this.middleCenter.getBoundingClientRect();
        this.#beforeMaxMiddleCenterHeight = middleCenterRect.height;

        let bodyList = document.getElementsByTagName('body');
        let body = bodyList[0];
        this.#activate(body);
    }

    loadError(exception) {
        this.close();
    }

    getName() {
        return this.#name;
    }

    show() {
        this.dialog.style.display = 'flex';
    }

    hide() {
        this.dialog.style.display = 'none';
    }

    min_click(event) {
        let bodyList = document.getElementsByTagName('body');
        let body = bodyList[0];
        $f.appendLoadSingleComponent(body, 'minimumDialog', {'dialog': this});
    }

    max_click(event) {
        
        let minimumDialogController = $f.getComponentController('minimumDialog');
        
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight - 1;
        
        let maxW = clientWidth;
        let maxH = clientHeight;
        
        if (minimumDialogController && minimumDialogController.getContainer().children.length > 1) {
            let minContainer = minimumDialogController.getContainer();
            let minContainerRect = minContainer.getBoundingClientRect();
            maxH -= minContainerRect.height;
        }
        
        let rect = this.dialog.getBoundingClientRect();
        let w = rect.width;
        let h = rect.height;
        
        let middleCenterRect = this.middleCenter.getBoundingClientRect();
        
        let changeHeight = maxH - h;
        let newDialogHeight = h - 2 + changeHeight;
        let newMiddleCenterHeight = middleCenterRect.height + changeHeight;
        
        if (w !== maxW || h !== maxH) {
            this.dialog.style.top = window.scrollY + 'px';
            this.dialog.style.left = window.scrollX + 'px';
            this.dialog.style.width = maxW + 'px';
            this.dialog.style.height = newDialogHeight + 'px';
            this.middleCenter.style.height = newMiddleCenterHeight + 'px';
            this.#beforeMaxTop = window.scrollY + rect.y;
            this.#beforeMaxLeft = window.scrollX + rect.x;
            this.#beforeMaxWidth = w;
            this.#beforeMaxHeight = h - 2;
            this.#beforeMaxMiddleCenterHeight = middleCenterRect.height;
        } else {
            this.middleCenter.style.height = this.#beforeMaxMiddleCenterHeight + 'px';
            this.dialog.style.top = this.#beforeMaxTop + 'px';
            this.dialog.style.left = this.#beforeMaxLeft + 'px';
            this.dialog.style.width = this.#beforeMaxWidth + 'px';
            this.dialog.style.height = this.#beforeMaxHeight + 'px';
        }
        
        let bodyList = document.getElementsByTagName('body');
        let body = bodyList[0];
        this.#activate(body);
        
    }

    bar_dblclick(event) {
        this.max_click(event);
    }
    
    close_click(event) {
        this.close();
    }

    close() {
        window.removeEventListener("mousemove", this.#mousemoveFunc);
        window.removeEventListener("mouseup", this.#mouseupFunc);
        
        let bodyList = document.getElementsByTagName('body');
        bodyList[0].style.userSelect = this.#userSelect;
        
        if (this.#disabledMap !== null) {
            let eleList = this.#disabledMap.keys();
            for (let ele of eleList) {
                ele.disabled = false;
            }
        }
        this.#disabledMap = null;
        this.dialog = null;
        
        if ('modeless' !== this.#dialogType) {
            this.dialogBack = null;
        }

    }

    dialog_mousedown(event) {
        if (this.closeButtonTotal) {
            for (const item of this.closeButtonTotal.values()) {
                if (event.target === item) {
                    return;
                }
            }
        }
        
        if (this.#mousedownStatus !== null) {
            
            let bodyList = document.getElementsByTagName('body');
            let body = bodyList[0];
            this.#activate(body);
            
            this.#userSelect = body.style.userSelect;
            body.style.userSelect = 'none';
        
            window.getSelection().removeAllRanges();
        
        }
        
    }

    dialog_click(event) {
        let bodyList = document.getElementsByTagName('body');
        let body = bodyList[0];
        this.#activate(body);
    }
    
    #activate(body) {
        
        let minimumDialogController = $f.getComponentController('minimumDialog');
        
        let lastChild = body.children.item(body.children.length - 1);
        if (
            (!minimumDialogController && lastChild !== this.dialog && this.dialog !== null) ||
            (minimumDialogController && lastChild.previousSibling !== this.dialog && this.dialog !== null)
        ) {
            
            body.removeChild(this.dialog);
            body.appendChild(this.dialog);
            if (this.closeButton) {
                this.closeButton.disabled = false;
            }
            if (this.minButton) {
                this.minButton.disabled = false;
            }
            if (this.maxButton) {
                this.maxButton.disabled = false;
            }
            
            if (minimumDialogController && minimumDialogController.getContainer()) {
                body.removeChild(minimumDialogController.getContainer());
                body.appendChild(minimumDialogController.getContainer());
            }
            
        }
        
    }

    mousemoveSomewhere(event) {

        if (this.#mousedownStatus === this.#statusTopLeft) {
            this.topDrag(event);
            this.leftDrag(event);
        } else if (this.#mousedownStatus === this.#statusTop) {
            this.topDrag(event);
        } else if (this.#mousedownStatus === this.#statusTopRight) {
            this.topDrag(event);
            this.rightDrag(event);
        } else if (this.#mousedownStatus === this.#statusLeft) {
            this.leftDrag(event);
        } else if (this.#mousedownStatus === this.#statusRight) {
            this.rightDrag(event);
        } else if (this.#mousedownStatus === this.#statusBottomLeft) {
            this.bottomDrag(event);
            this.leftDrag(event);
        } else if (this.#mousedownStatus === this.#statusBottom) {
            this.bottomDrag(event);
        } else if (this.#mousedownStatus === this.#statusBottomRight) {
            this.bottomDrag(event);
            this.rightDrag(event);
        } else if (this.#mousedownStatus === this.#statusBar) {
            this.barDrag(event);
        }
        
        if ('modeless' !== this.#dialogType && this.#mousedownStatus !== null) {
            this.dialogBack.style.width = document.documentElement.scrollWidth + 'px';
            this.dialogBack.style.height = document.documentElement.scrollHeight + 'px';
        }

    }

    barDrag(event) {

        let rect = this.dialog.getBoundingClientRect();
        let curX = window.scrollX + rect.x;
        let curY = window.scrollY + rect.y;

        if (event.pageY < 10) {
            return;
        }

        if (event.pageY >= document.documentElement.scrollHeight - 80) {
            return;
        }

        if (event.pageX < 80) {
            return;
        }

        if (event.pageX >= document.documentElement.scrollWidth - 50) {
            return;
        }

        this.dialog.style.top = curY + (event.pageY - this.#preY) + 'px';
        this.dialog.style.left = curX + (event.pageX - this.#preX) + 'px';

        this.#preX = event.pageX;
        this.#preY = event.pageY;
    }

    topDrag(event) {

        if (this.#preY < event.pageY && this.dialog.offsetHeight <= 50) {
            return;
        }

        if (event.pageY < 15) {
            return;
        }

        if (event.pageY < this.#preY) {
            let plusHeight = this.#preY - event.pageY;
            let dialogHeight = this.dialog.offsetHeight - 2 + plusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight + plusHeight + 'px';
        } else {
            let minusHeight = event.pageY - this.#preY;
            let dialogHeight = this.dialog.offsetHeight - 2 - minusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight - minusHeight + 'px';
        }
        this.dialog.style.top = event.pageY + 'px';

        this.#preX = event.pageX;
        this.#preY = event.pageY;
    }

    leftDrag(event) {

        let rect = this.dialog.getBoundingClientRect();
        let curX = window.scrollX + rect.x;

        if (event.pageX >= curX + this.dialog.offsetWidth - 50) {
            return;
        }

        if (event.pageX < curX) {
            let dialogWidth = this.dialog.offsetWidth + (curX - event.pageX);
            if (dialogWidth <= 50) {
                return;
            }
            this.dialog.style.width = dialogWidth + 'px';
        } else {
            let dialogWidth = this.dialog.offsetWidth - (event.pageX - curX);
            if (dialogWidth <= 50) {
                return;
            }
            this.dialog.style.width = dialogWidth + 'px';
        }
        this.dialog.style.left = event.pageX + 'px';
        
        this.#preX = event.pageX;
        this.#preY = event.pageY;
    }

    rightDrag(event) {

        let rect = this.dialog.getBoundingClientRect();
        let curX = window.scrollX + rect.x;
        let newWidth = event.pageX - curX;

        if (newWidth <= 50) {
            return;
        }

        this.dialog.style.width = newWidth + 'px';

        this.#preX = event.pageX;
        this.#preY = event.pageY;
    }

    bottomDrag(event) {

        if (this.#preY > event.pageY && this.dialog.offsetHeight <= 50) {
            return;
        }

        if (event.pageY < 15) {
            return;
        }

        if (event.pageY > this.#preY) {
            let plusHeight =  event.pageY - this.#preY;
            let dialogHeight = this.dialog.offsetHeight - 2 + plusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight + plusHeight + 'px';
        } else {
            let minusHeight = this.#preY - event.pageY;
            let dialogHeight = this.dialog.offsetHeight - 2 - minusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight - minusHeight + 'px';
        }

        this.#preX = event.pageX;
        this.#preY = event.pageY;
    }

    mouseupSomewhere(event) {
        this.#mousedownStatus = null;
        let bodyList = document.getElementsByTagName('body');
        bodyList[0].style.userSelect = this.#userSelect;
    }

    topLeft_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.topLeft.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusTopLeft;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    top_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.top.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusTop;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    topRight_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.topRight.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusTopRight;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    left_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.left.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusLeft;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    right_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.right.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusRight;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    bottomLeft_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.bottomLeft.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusBottomLeft;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    bottom_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.bottom.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusBottom;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    bottomRight_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.bottomRight.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusBottomRight;
                this.#preX = event.pageX;
                this.#preY = event.pageY;
                return;
            }
        }
    }

    bar_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        if (event.currentTarget === this.bar) {
            this.#mousedownStatus = this.#statusBar;
            this.#preX = event.pageX;
            this.#preY = event.pageY;
            return;
        }
    }

}