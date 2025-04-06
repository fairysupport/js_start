export class Validator {

    constructor() {
    }

    init (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        valid = this.showMsg(arg, '');
        return valid;
    }
    
    require (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            valid = this.showMsg(arg, $f.msg('errorRequired'));
        }
        return valid;
    }
    
    intType (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        let reg = new RegExp('(^[-]{0,1}[1-9]{1}[0-9]*$|^[0]{1}$)', 'g');
        if (!(reg.test(newValue))) {
            valid = this.showMsg(arg, $f.msg('errorIntValue'));
        }
        return valid;
    }
    
    minValue (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        if (!arg || !'min' in arg) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
        } else if (arg.min > newValue) {
            valid = this.showMsg(arg, $f.msg('errorMinValue', {'min': arg.min}));
        }
        return valid;
    }
    
    maxValue (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        if (!arg || !'max' in arg) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
        } else if (arg.max < newValue) {
            valid = this.showMsg(arg, $f.msg('errorMaxValue', {'max': arg.max}));
        }
        return valid;
    }
    
    year (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        valid = this.intType(target, property, newValue, oldValue, arg, event);
        return valid;
    }
    
    month (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        valid = this.intType(target, property, newValue, oldValue, arg, event);
        if (!valid) {
            return valid;
        }
        if (newValue < 1 || 12 < newValue) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        return valid;
    }
    
    day (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        valid = this.intType(target, property, newValue, oldValue, arg, event);
        if (!valid) {
            return valid;
        }
        if (newValue < 1 || 31 < newValue) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        return valid;
    }
    
    ymd (target, property, newValue, oldValue, arg, event, untilNowResult) {
        let valid = true;
        if (this.isEmpty(newValue)) {
            return valid;
        }
        let ymdSplit = newValue.split('/');
        if (ymdSplit.length !== 3) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        if (ymdSplit[0].length <= 0) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        let month = ymdSplit[1].replace(/^0+/, '');
        if (ymdSplit[1].length !== 2 || month.length < 1) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        let day = ymdSplit[2].replace(/^0+/, '');
        if (ymdSplit[2].length !== 2 || day.length < 1) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        
        valid = this.year(target, property, ymdSplit[0], ymdSplit[0], null, event);
        if (!valid) {
            return valid;
        }
        
        valid = this.month(target, property, month, month, null, event);
        if (!valid) {
            return valid;
        }
        
        valid = this.day(target, property, day, day, null, event);
        if (!valid) {
            return valid;
        }
        
        let date = new Date();
        date.setFullYear(ymdSplit[0] - 0);
        date.setDate(day - 0);
        date.setMonth(month - 1);
        if (date.getFullYear() !== ymdSplit[0] - 0) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        if (date.getMonth() !== month - 1) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        if (date.getDate() !== day - 0) {
            valid = this.showMsg(arg, $f.msg('invalidValue'));
            return valid;
        }
        return valid;
    }
    
    inputFinalize (target, property, newValue, oldValue, arg, event, valid, validResult) {
        let result = {};
        if (this.isInput(event)) {
            result['forceNewValue'] = newValue;
            if (valid) {
                result['oldValueAllEvent'] = newValue;
            }
        }
        return result;
    }
    
    isEmpty(value){
        if (value === '' || value === null || value === undefined) {
            return true;
        }
        return false;
    }

    showMsg(arg, msg){
        let result = false;
        if (arg && 'msgObj' in arg) {
            arg.msgObj.textContent = msg;
        }
        if (this.isEmpty(msg)) {
            result = true;
        } else {
            result = false;
        }
        return result;
    }
    
    isInput(event){
        if (event && 'type' in event && 'input' === event.type) {
            return true;
        }
        return false;
    }

}