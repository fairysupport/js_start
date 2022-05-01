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

    constructor() {
    }

    init(data) {

        if ('modeless' !== data.type) {
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

        this.mousemoveFunc = this.mousemoveSomewhere.bind(this);
        window.addEventListener('mousemove', this.mousemoveFunc);

        this.mouseupFunc = this.mouseupSomewhere.bind(this);
        window.addEventListener('mouseup', this.mouseupFunc);

        $f.loadTemplate(this.middleCenter, data.content, data.contentParam)
        .then(this.loadSuccess.bind(this))
        .catch(this.loadError.bind(this));

    }

    loadSuccess() {

        this.dialog.style.display = 'flex';

        let windowWidthHalf = window.innerWidth / 2;
        let windowHeightHalf = window.innerHeight / 2;

        let dialogWidthHalf = this.dialog.offsetWidth / 2;
        let dialogHeightHalf = this.dialog.offsetHeight / 2;

        let left = windowWidthHalf - dialogWidthHalf;
        let top = windowHeightHalf - dialogHeightHalf;
        this.dialog.style.left = (left < 0 ? 0 : left) + 'px';
        this.dialog.style.top = (top < 0 ? 0 : top) + 'px';

    }

    loadError(exception) {
        this.close();
    }

    close_click(event) {
        this.close();
    }

    close() {
        window.removeEventListener("mousemove", this.mousemoveFunc);
        window.removeEventListener("mouseup", this.mouseupFunc);
        if (this.#disabledMap !== null) {
            let eleList = this.#disabledMap.keys();
            for (let ele of eleList) {
                ele.disabled = false;
            }
        }
        this.#disabledMap = null;
        this.dialog = null;
    }

    dialog_mousedown(event) {
        for (const item of this.closeButtonTotal.values()) {
            if (event.target === item) {
                return;
            }
        }
        if (this.#mousedownStatus !== null) {
            let bodyList = document.getElementsByTagName('body');
            bodyList[0].removeChild(this.dialog);
            bodyList[0].appendChild(this.dialog);
            this.closeButton.disabled = false;
        }
    }

    dialog_click(event) {
        let bodyList = document.getElementsByTagName('body');
        let body = bodyList[0];
        if (body.lastChild !== this.dialog) {
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
        let curX = rect.x;
        let curY = rect.y;

        if (event.clientY < 10) {
            return;
        }

        if (event.clientY >= window.innerHeight - 80) {
            return;
        }

        if (event.clientX < 80) {
            return;
        }

        if (event.clientX >= window.innerWidth - 50) {
            return;
        }

        this.dialog.style.top = curY + (event.clientY - this.#preY) + 'px';
        this.dialog.style.left = curX + (event.clientX - this.#preX) + 'px';

        this.#preX = event.clientX;
        this.#preY = event.clientY;
    }

    topDrag(event) {

        if (this.#preY < event.clientY && this.dialog.offsetHeight <= 50) {
            return;
        }

        if (event.clientY < 15) {
            return;
        }

        if (event.clientY < this.#preY) {
            let plusHeight = this.#preY - event.clientY;
            let dialogHeight = this.dialog.offsetHeight - 2 + plusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight + plusHeight + 'px';
        } else {
            let minusHeight = event.clientY - this.#preY;
            let dialogHeight = this.dialog.offsetHeight - 2 - minusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight - minusHeight + 'px';
        }
        this.dialog.style.top = event.clientY + 'px';

        this.#preX = event.clientX;
        this.#preY = event.clientY;
    }

    leftDrag(event) {

        let rect = this.dialog.getBoundingClientRect();
        let curX = rect.x;

        if (event.clientX >= curX + this.dialog.offsetWidth - 50) {
            return;
        }

        if (event.clientX < curX) {
            let dialogWidth = this.dialog.offsetWidth + (curX - event.clientX);
            if (dialogWidth <= 50) {
                return;
            }
            this.dialog.style.width = dialogWidth + 'px';
        } else {
            let dialogWidth = this.dialog.offsetWidth - (event.clientX - curX);
            if (dialogWidth <= 50) {
                return;
            }
            this.dialog.style.width = dialogWidth + 'px';
        }
        this.dialog.style.left = event.clientX + 'px';
    }

    rightDrag(event) {

        let rect = this.dialog.getBoundingClientRect();
        let curX = rect.x;
        let newWidth = event.clientX - curX;

        if (newWidth <= 50) {
            return;
        }

        this.dialog.style.width = newWidth + 'px';

    }

    bottomDrag(event) {

        if (this.#preY > event.clientY && this.dialog.offsetHeight <= 50) {
            return;
        }

        if (event.clientY < 15) {
            return;
        }

        if (event.clientY > this.#preY) {
            let plusHeight =  event.clientY - this.#preY;
            let dialogHeight = this.dialog.offsetHeight - 2 + plusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight + plusHeight + 'px';
        } else {
            let minusHeight = this.#preY - event.clientY;
            let dialogHeight = this.dialog.offsetHeight - 2 - minusHeight;
            if (dialogHeight <= 50) {
                return;
            }
            this.dialog.style.height = dialogHeight + 'px';
            this.middleCenter.style.height = this.middleCenter.offsetHeight - minusHeight + 'px';
        }

        this.#preX = event.clientX;
        this.#preY = event.clientY;
    }

    mouseupSomewhere(event) {
        this.#mousedownStatus = null;
    }

    topLeft_mousedown(event) {
        if (this.#mousedownStatus !== null) {
            return;
        }
        for (const item of this.topLeft.values()) {
            if (event.currentTarget === item) {
                this.#mousedownStatus = this.#statusTopLeft;
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
                this.#preX = event.clientX;
                this.#preY = event.clientY;
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
            this.#preX = event.clientX;
            this.#preY = event.clientY;
            return;
        }
    }

}