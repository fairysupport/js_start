export class SideMenu {

    #openBtn = null;
    #closeFunc = null;
    
    constructor() {
    }

    init(data) {
        
        this.#closeFunc = this.close.bind(this);
        window.addEventListener('click', this.#closeFunc);
        
        this.loadMenu(data);
        
    }

    loadMenu(data) {
        this.clearEffect();
        $f.loadTemplate(this.container, data.content, data.contentParam)
        .then(this.loadSuccess.bind(this))
        .catch(this.loadError.bind(this));
    }

    loadSuccess() {
        this.container.style.height = document.documentElement.scrollHeight + 'px';
        this.container.style.left = '-' + this.container.offsetWidth + 'px';
        setTimeout(this.openEffect.bind(this), 0);
    }

    loadError(exception) {
        this.container = null;
    }
    
    openEffect() {
        this.container.style.transition = 'left 200ms 0s linear';
    }

    clearEffect() {
        delete this.container.style.transition;
    }

    open(openBtn) {
        this.#openBtn = openBtn;
        this.container.style.height = document.documentElement.scrollHeight + 'px';
        this.container.style.left = '0px';
    }

    close(event) {
        if (event.target !== this.#openBtn && !this.container.contains(event.target)) {
            this.container.style.left = '-' + this.container.offsetWidth + 'px';
        }
    }

    beforeRemoveObj(data) {
        if ('container' === data['name']) {
            window.removeEventListener("click", this.#closeFunc);
        }
    }
    
}