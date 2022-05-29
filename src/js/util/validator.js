export class Validator {

    constructor() {
    }

    initValidate (target, property, newValue, old, arg) {
        let meta = $f.getMeta(target);
        this.showMsg(meta, '');
        return true;
    }
    
    requireValidate (target, property, newValue, old, arg) {
        let meta = $f.getMeta(target);
        if (newValue === '' || newValue === null || newValue === undefined) {
            this.showMsg(meta, $f.msg('errorRequired'));
            return false;
        } else {
            return true;
        }
    }
    
    minValueValidate (target, property, newValue, old, arg) {
        if (newValue === '' || newValue === null || newValue === undefined) {
            return true;
        }
        let meta = $f.getMeta(target);
        if (!meta || !'min' in meta) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        } else if (meta.min > newValue) {
            this.showMsg(meta, $f.msg('errorMinValue', {'min': meta.min}));
            return false;
        } else {
            return true;
        }
    }
    
    maxValueValidate (target, property, newValue, old, arg) {
        if (newValue === '' || newValue === null || newValue === undefined) {
            return true;
        }
        let meta = $f.getMeta(target);
        if (!meta || !'max' in meta) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        } else if (meta.max < newValue) {
            this.showMsg(meta, $f.msg('errorMaxValue', {'max': meta.max}));
            return false;
        } else {
            return true;
        }
    }
    
    yearValidate (target, property, newValue, old, arg) {
        if (newValue === '' || newValue === null || newValue === undefined) {
            return true;
        }
        let meta = $f.getMeta(target);
        let castValue = String(newValue - 0);
        if (String(newValue) !== castValue) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        let reg = new RegExp('^[-]?[0-9]+$', 'g');
        if (!reg.test(newValue)) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        return true;
    }
    
    monthValidate (target, property, newValue, old, arg) {
        if (newValue === '' || newValue === null || newValue === undefined) {
            return true;
        }
        let meta = $f.getMeta(target);
        let castValue = String(newValue - 0);
        if (String(newValue) !== castValue) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        let reg = new RegExp('^[0-9]+$', 'g');
        if (!reg.test(newValue)) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        if (newValue < 1 || 12 < newValue) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        return true;
    }
    
    ymdValidate (target, property, newValue, old, arg) {
        if (newValue === '' || newValue === null || newValue === undefined) {
            return true;
        }
        let meta = $f.getMeta(target);
        let ymdSplit = newValue.split('/');
        if (ymdSplit.length !== 3) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        if (ymdSplit[1].length !== 2) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        if (ymdSplit[2].length !== 2) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        
        let castValue = String(ymdSplit[0] - 0);
        if (ymdSplit[0] !== castValue) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        
        let reg = new RegExp('^[-]?[0-9]+$', 'g');
        if (!reg.test(ymdSplit[0])) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        reg = new RegExp('^[0-9]+$', 'g');
        if (!reg.test(ymdSplit[1])) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        reg.lastIndex = 0;
        if (!reg.test(ymdSplit[2])) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        
        let date = new Date();
        date.setFullYear(ymdSplit[0] - 0);
        date.setMonth(ymdSplit[1] - 1);
        date.setDate(ymdSplit[2] - 0);
        if (date.getFullYear() !== ymdSplit[0] - 0) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        if (date.getMonth() !== ymdSplit[1] - 1) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        if (date.getDate() !== ymdSplit[2] - 0) {
            this.showMsg(meta, $f.msg('invalidValue'));
            return false;
        }
        return true;
    }
    
    showMsg(meta, msg){
        if (meta && 'msgObj' in meta) {
            meta.msgObj.textContent = msg;
        }
    }
    

}