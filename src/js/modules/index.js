export class Index {

    constructor() {
    }

    sample_click(event) {
        $f.loadTemplate(this.obj, 'tpl', {'key1': '<input type="text">', 'key2': {'val1': 2}, 'key3': {"key1": "str1", "key2": "str2", "key3": "str3", "key4": "str4", "key5": "str5"}})
        .then(this.success.bind(this))
        .catch(this.error.bind(this));
    }
    
    sample2_input(event) {
        this.obj2.textContent = event.target.value;
    }
    
    success() {
        alert("success");
    }
    
    error(exception) {
        alert("error");
        console.error(exception);
    }
    
}