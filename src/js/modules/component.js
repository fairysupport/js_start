export class Component {

    constructor() {
    }

    init(data) {
        let colorInfo = {'2000/01/01' : {'borderColor':'#0D920F', 'backgroundColor':'#8EF990'},
                          '2000/01/11' : {'borderColor':'#C47606', 'backgroundColor':'#FCC77A'},
                          '2020/02/02' : {'borderColor':'#AF02AF', 'backgroundColor':'#FA9AFA'},
                          '2021/03/02' : {'borderColor':'#01ABAD', 'backgroundColor':'#5EFCFE'}
        };
        let calendarData = {'colorInfo': colorInfo,
                            'name': 'sampleYmd',
                            'defaultYmd': '2022/02/01',
                            'minYear': -4712,
                            'maxYear': 9999};
        
        let menuInfo = {'content' : 'menuSample',
                        'contentParam' : {'hour': 24,
                                          'minute': 60,
                                          'seconds': 60}};
        
        $f.useDomAsTemplate(this.body, {'calendarData': calendarData, 'menuInfo' : menuInfo});
        
    }

    dialogBtn_click(event){
        let dialogInfo = {'content' : 'dialogSampleForm',
                          'contentParam' : {'hour': 24,
                                            'minute': 60,
                                            'seconds': 60},
                          'type': 'modal'};
        $f.appendLoadUniqueComponent(this.body, 'dialog', dialogInfo);
    }

    sideMenuBtn_click(event){
        $f.getComponentController('sideMenu').open(event.currentTarget);
    }

    button_click(event){
        alert('button click');
    }

}