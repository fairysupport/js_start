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
    
    constructor() {
    }

    init(data) {
        
        this.#dialogType = data.type;

        if ('modeless' !== this.#dialogType) {
            this.#disabledMap = new Map();
            let disabledTagList = ['input', 'select', 'textarea', 'a', 'button', 'form'];
            for (let disabledTag of disabledTagList) {
                let eleList = document.getElementsByTagName(disabledTag);
                for (let i = 0; i < eleList.length; i++) {
                    if (!eleList.item(i).disabled && eleList.item(i) !== this.closeButton) {
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
        
        $f.loadTemplate(this.middleCenter, data.content, data.contentParam)
        .then(this.loadSuccess.bind(this))
        .catch(this.loadError.bind(this));

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

    }

    loadError(exception) {
        this.close();
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
        for (const item of this.closeButtonTotal.values()) {
            if (event.target === item) {
                return;
            }
        }
        
        if (this.#mousedownStatus !== null) {
            
            let bodyList = document.getElementsByTagName('body');
            let body = bodyList[0];
            
            body.removeChild(this.dialog);
            body.appendChild(this.dialog);
            this.closeButton.disabled = false;
            
            this.#userSelect = body.style.userSelect;
            body.style.userSelect = 'none';
        
            window.getSelection().removeAllRanges();
        
        }
        
    }

    dialog_click(event) {
        let bodyList = document.getElementsByTagName('body');
        let body = bodyList[0];
        if (body.lastChild !== this.dialog && this.dialog !== null) {
            let bodyList = document.getElementsByTagName('body');
            bodyList[0].removeChild(this.dialog);
            bodyList[0].appendChild(this.dialog);
            this.closeButton.disabled = false;
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