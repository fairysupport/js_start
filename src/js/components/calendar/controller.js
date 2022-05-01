import {Validator} from '../../util/validator.js';

export class Calendar {

    constructor() {
    }

    init(data) {

        this.closeFunc = this.clickSomewhere.bind(this);
        window.addEventListener('click', this.closeFunc);
        this.colorInfo = data.colorInfo;

        let v = new Validator();
        this.validator = v;

        $f.addMeta(this.calendarYear, {"min": ('minYear' in data ? data.minYear : 0), "max": ('maxYear' in data ? data.maxYear : 9999)});

        $f.validate(this.inputText, 'value', ['blur'], [v.initValidate.bind(v), v.ymdValidate.bind(v)]);
        $f.validate(this.calendarYear, 'value', ['input'], [v.initValidate.bind(v), v.requireValidate.bind(v), v.yearValidate.bind(v), v.minValueValidate.bind(v), v.maxValueValidate.bind(v)]);
        $f.validate(this.calendarMonth, 'value', ['input'], [v.initValidate.bind(v), v.requireValidate.bind(v), v.monthValidate.bind(v)]);

        if (this.inputText.value !== '') {
            this.inputText_input();
        } else {
            let date = new Date();
            let inputY = date.getFullYear();
            let inputM = date.getMonth() + 1;
            let inputD = date.getDate();
            this.calendarYear.value = inputY;
            this.calendarMonth.value = inputM;
            let selectDate = date.getFullYear() + '/' + (inputM < 10 ? '0'.concat(inputM) : inputM) + '/' + (inputD < 10 ? '0'.concat(inputD) : inputD);
            this.outputBody(selectDate);
        }
    }

    inputText_click(event) {
        this.calendarContainer.style.display = 'block';
    }

    inputText_input(){
        if (this.validator.ymdValidate(this.inputText, 'value', this.inputText.value)) {
            let inputYmd = this.inputText.value.split('/');
            let inputY = inputYmd[0];
            let inputM = inputYmd[1] - 0;
            this.calendarYear.value = inputY;
            this.calendarMonth.value = inputM;
            let selectDate = this.inputText.value;
            this.outputBody(selectDate);
        }
    }

    inputText_blur(){
        if (this.inputText.value !== '') {
            this.inputText.value = this.selectDate;
        }
    }

    preYear_click(event) {
        this.calendarYear.value--;
        this.outputBody();
    }

    nextYear_click(event) {
        this.calendarYear.value++;
        this.outputBody();
    }

    preMonth_click(event) {
        if (this.calendarMonth.value === '1') {
            this.calendarYear.value--;
            this.calendarMonth.value = 12;
        } else {
            this.calendarMonth.value--;
        }
        this.outputBody();
    }

    nextMonth_click(event) {
        if (this.calendarMonth.value === '12') {
            this.calendarYear.value++;
            this.calendarMonth.value = 1;
        } else {
            this.calendarMonth.value++;
        }
        this.outputBody();
    }

    calendar_input(event) {
        this.outputBody();
    }

    date_click(event) {
        if (event.target.parentNode && event.target.parentNode.parentNode && event.target.parentNode.parentNode.parentNode == event.currentTarget) {
            this.setDate(event.target.dataset.date);
            this.close();
        }
    }

    clickSomewhere(event) {
        if (this.calendarContainer && !this.calendarContainer.contains(event.target) && this.inputText !== event.target) {
            this.close();
        }
        if (this.inputText === null || this.inputText === undefined || !('parentNode' in this.inputText) ||  ('parentNode' in this.inputText && (this.inputText.parentNode === null || this.inputText.parentNode === undefined))) {
            window.removeEventListener("click", this.closeFunc);
        }
    }

    close() {
        this.calendarContainer.style.display = 'none';
    }

    setDate(selectDate) {
        let year = this.calendarYear.value;
        let month = this.calendarMonth.value;
        month = month < 10 ? '0'.concat(month) : month;
        let date = selectDate < 10 ? '0'.concat(selectDate) : selectDate;
        let ymd = year + '/' + month + '/' + date;
        if (this.inputText) {
            this.inputText.value = ymd;
        }
        this.outputBody(ymd);
    }

    outputBody(selectDate) {
        if (selectDate !== undefined && selectDate !== null) {
            this.selectDate = selectDate;
        }
        let dateObj = new Date();
        dateObj.setFullYear(this.calendarYear.value);
        dateObj.setMonth(this.calendarMonth.value - 1);
        dateObj.setDate(1);
        $f.loadStringTemplate(this.calendarBody, this.template(), {'dateObj': dateObj, 'selectDate': this.selectDate, 'colorInfo': this.colorInfo});
    }

    template() {
        return `
            <script data-load-only='true'>
                l.tdStyle = {"fontSize":        "0.8em",
                             "fontWeight":      "normal",
                             "padding":         "3px",
                             "textAlign":       "center"};
                l.divStyle = {"border":          "solid 1px",
                              "borderColor":     "#AAAAAA",
                              "backgroundColor": "#EEEEEE",
                              "padding":         "3px 6px 3px 6px",
                              "cursor": "pointer"};
                l.selectStyle = {"border":          "solid 1px",
                                 "borderColor":     "#E2D105",
                                 "backgroundColor": "#FCF05C",
                                 "padding":         "3px 6px 3px 6px",
                                 "cursor": "pointer"};
                l.blueStyle = {"border":          "solid 1px",
                                 "borderColor":     "#0477F9",
                                 "backgroundColor": "#8AC0FD",
                                 "padding":         "3px 6px 3px 6px",
                                 "cursor": "pointer"};
                l.redStyle = {"border":          "solid 1px",
                                 "borderColor":     "#BE1429",
                                 "backgroundColor": "#FC8C9A",
                                 "padding":         "3px 6px 3px 6px",
                                 "cursor": "pointer"};
                l.rowCount = 0;
                l.whileFlg = true;
                l.year = v.dateObj.getFullYear();
                l.month = v.dateObj.getMonth() + 1;
                l.month = l.month < 10 ? '0'.concat(l.month) : l.month;
            </script>
            <tr data-while='l.whileFlg'>
                <script data-load-only='true'>
                    l.rowCount++;
                </script>
                <td data-for-start='l.i = 0' data-for-end='l.i < 7' data-for-step='l.i++'  data-prop='{"style": l.tdStyle}'>
                    <script data-load-only='true'>
                        l.week = v.dateObj.getDay();
                        l.date = v.dateObj.getDate();
                        l.ymd = l.year + '/' + l.month + '/' + (l.date < 10 ? '0'.concat(l.date) : l.date);
                        if (l.rowCount > 1 && l.date === 1) {
                            l.whileFlg = false;
                        }
                        l.color = l.divStyle;
                        if (l.ymd === v.selectDate) {
                            l.color = l.selectStyle;
                        } else if (l.ymd in v.colorInfo) {
                            l.color = {"border":          "solid 1px",
                                       "borderColor":     v.colorInfo[l.ymd].borderColor,
                                       "backgroundColor": v.colorInfo[l.ymd].backgroundColor,
                                       "padding":         "3px 6px 3px 6px",
                                       "cursor": "pointer"};
                        } else if (l.week === 0) {
                            l.color = l.redStyle;
                        } else if (l.week === 6) {
                            l.color = l.blueStyle;
                        }
                    </script>
                    <div data-if='l.i === l.week && l.whileFlg' data-tag='hidden'>
                        <div data-prop='{"style": l.color, "dataset": {"date": l.date}}' data-text='l.date'></div>
                        <script data-load-only='true'>
                            v.dateObj.setDate(l.date + 1);
                        </script>
                    </div>
                </td>
            </tr>
        `;
    }

}