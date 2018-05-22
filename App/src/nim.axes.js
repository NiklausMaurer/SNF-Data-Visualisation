DiscreteAxis = function(axisParam){

    var levels = axisParam.levels;
    var padding = axisParam.padding;
    var length = axisParam.length;
    var center = axisParam.center;
    var property = axisParam.property;
    var orientation = axisParam.orientation;
    var caption = axisParam.caption;
    var levelvalues = levels.map(function(l){return l.value;});
    var levelcaptions = levels.map(function(l){return l.caption;});

    var columnWidth = Math.round((length - 2 * padding)/levels.length);

    var axis = Object();

    var getCenterOffset = function(level) {
        if(orientation == 'y') return padding + Math.round(columnWidth/2) + levelvalues.indexOf(level) * columnWidth;
        else return center -  Math.round((length - 2 * padding) / 2) + Math.round(columnWidth/2) + levelvalues.indexOf(level) * columnWidth;
    }

    axis.getCenterOffset = function(level) {
        return getCenterOffset(level);
    }

    axis.getCenter = function() {
        return center;
    }

    axis.getLevels = function() {
        return levels;
    }

    axis.getLength = function() {
        return length;
    }

    axis.getColumnWidth = function() {
        return columnWidth;
    }

    axis.getProperty = function() {
        return property;
    }

    axis.getCaption = function() {
        return caption;
    }

    axis.getLevelCaption = function(d) {
        return levelcaptions[levelvalues.indexOf(d.data[property])];
    }

    function getAdditonalNodeXOffset(nodeGroupProperty) {
        switch(nodeGroupProperty) {
            case "Media relations: print media, online media":
                return 1;
            case "New media (web, blogs, podcasts, news feeds etc.)":
                return 0.77;
            case "Media relations: radio, television":
                return 0.17;
            case "Talks/events/exhibitions":
                return -0.5;
            case "Print (books, brochures, leaflets)":
                return -0.94;
            case "Other activities":
                return -0.94;
            case "Video/Film":
                return -0.5;
            case "Start-up":
                return 0.17;
            case "Software":
                return 0.77;
        }
    }

    function getAdditonalNodeYOffset(nodeGroupProperty) {
        switch(nodeGroupProperty) {
            case "Media relations: print media, online media":
                return 0;
            case "New media (web, blogs, podcasts, news feeds etc.)":
                return 0.64;
            case "Media relations: radio, television":
                return 0.98;
            case "Talks/events/exhibitions":
                return 0.87;
            case "Print (books, brochures, leaflets)":
                return 0.34;
            case "Other activities":
                return -0.34
            case "Video/Film":
                return -0.87;
            case "Start-up":
                return -0.98;
            case "Software":
                return -0.64;
        }
    }

    axis.getNodeOffset = function(d) {
        if(property === 'none') return center;

        if(orientation === 'x') return getCenterOffset(d.data[property]) /*+ getAdditonalNodeXOffset(d.group) * 90*/;
        else if(orientation === 'y') return getCenterOffset(d.data[property]) /*+ getAdditonalNodeYOffset(d.group) * 90*/;
        else throw 'orientation ' + orientation + ' is not supported.'
    }

    axis.getForceStrength = function(s) {
        if(property === 'none') return s / 1;
        return s * 1;
    }

    return axis;    
}


AxisFactory = function() {

    var supportedXAxes = {
        Discipline: DiscreteAxis({
            property: 'Discipline',
            caption: 'Forschungsdisziplin',
            levels: [
                {value: 'Biology and Medicine', caption: 'Biologie und Medizin'},
                {value: 'Humanities and Social Sciences', caption: 'Geistes- und Sozialwissenschaften'},
                {value: 'Mathematics, Natural- and Engineering Sciences', caption: 'Mathematik, Natur- und Ingenieurwissenschaften'}
            ],
            padding: 50,
            length: 1200,
            center: 1000,
            orientation: 'x'
          }),
        InstitutionType: DiscreteAxis({
            property: 'InstitutionType',
            caption: 'Institution',
            levels: [
                {value: 'University', caption: 'Universität'},
                {value: 'ETH Domain', caption: 'ETH'},
                {value: 'UAS / UTE', caption: 'FH und PH'},
                {value: 'Other', caption: 'Andere'}
            ],
            padding: 50,
            length: 1200,
            center: 1000,
            orientation: 'x'
          }),
        AmountCatecory: DiscreteAxis({
            property: 'AmountCatecory',
            caption: 'Bewilligte Mittel (CHF)',
            levels: [
                {value: '1 - 200\'000', caption: '1 - 200\'000'},
                {value: '200\'000 - 400\'000', caption: '200\'000 - 400\'000'},
                {value: '400\'000 - 600\'000', caption: '400\'000 - 600\'000'},
                {value: '600\'000 - 800\'000', caption: '600\'000 - 800\'000'},
                {value: '800\'000 - 1\'000\'000', caption: '800\'000 - 1\'000\'000'},
                {value: '1\'000\'000+', caption: '1\'000\'000+'}
            ],
            padding: 50,
            length: 1200,
            center: 1000,
            orientation: 'x'
        }),
        FundingInstrument: DiscreteAxis({
            property: 'FundingInstrument',
            caption: 'Förderungskategorie',
            levels: [
                {value: 'Careers', caption: 'Karrieren'},
                {value: 'Infrastructure', caption: 'Infrastruktur'},
                {value: 'Programmes', caption: 'Programme'},
                {value: 'Project funding', caption: 'Projektförderung'},
                {value: 'Science communication', caption: 'Wissenschaftskommunikation'},
                {value: 'Unknown', caption: 'Unbekannt'}
            ],
            padding: 50,
            length: 1600,
            center: 1000,
            orientation: 'x'
        }),
        Type: DiscreteAxis({
            property: 'Type',
            caption: 'Output-Typ',
            levels: [
                {value: 'Media relations: print media, online media', caption: 'Medienarbeit'},
                {value: 'Software', caption: 'Software'},
                {value: 'Media relations: radio, television', caption: 'Radio und Fernsehen'},
                {value: 'New media (web, blogs, podcasts, news feeds etc.)', caption: 'Neue Medien'},
                {value: 'Other activities', caption: 'Andere'},
                {value: 'Print (books, brochures, leaflets)', caption: 'Druckerzeugnisse'},
                {value: 'Start-up', caption: 'Start-up\'s'},
                {value: 'Talks/events/exhibitions', caption: 'Events'},
                {value: 'Video/Film', caption: 'Video und Film'}
            ],
            padding: 50,
            length: 1600,
            center: 1000,
            orientation: 'x'
        }),
        none: DiscreteAxis({
            property: 'none',
            levels: ['Alle'],
            padding: 50,
            length: 1200,
            center: 1000,
            orientation: 'x'
          })
    }
    var supportedYAxes = {
        Discipline: DiscreteAxis({
            property: 'Discipline',
            caption: 'Forschungsdisziplin',
            levels: [
                {value: 'Biology and Medicine', caption: 'Biologie und Medizin'},
                {value: 'Humanities and Social Sciences', caption: 'Geistes- und Sozialwissenschaften'},
                {value: 'Mathematics, Natural- and Engineering Sciences', caption: 'Mathematik, Natur- und Ingenieurwissenschaften'}
            ],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
          }),
        InstitutionType: DiscreteAxis({
            property: 'InstitutionType',
            caption: 'Institution',
            levels: [
                {value: 'University', caption: 'Universität'},
                {value: 'ETH Domain', caption: 'ETH'},
                {value: 'UAS / UTE', caption: 'FH und PH'},
                {value: 'Other', caption: 'Andere'}
            ],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
          }),
        AmountCatecory: DiscreteAxis({
            property: 'AmountCatecory',
            caption: 'Bewilligte Mittel (CHF)',
            levels: [
                {value: '1 - 200\'000', caption: '1 - 200\'000'},
                {value: '200\'000 - 400\'000', caption: '200\'000 - 400\'000'},
                {value: '400\'000 - 600\'000', caption: '400\'000 - 600\'000'},
                {value: '600\'000 - 800\'000', caption: '600\'000 - 800\'000'},
                {value: '800\'000 - 1\'000\'000', caption: '800\'000 - 1\'000\'000'},
                {value: '1\'000\'000+', caption: '1\'000\'000+'}
            ],
            padding: 50,
            length: 1600,
            center: 300,
            orientation: 'y'
        }),
        FundingInstrument: DiscreteAxis({
            property: 'FundingInstrument',
            caption: 'Förderungskategorie',
            levels: [
                {value: 'Careers', caption: 'Karrieren'},
                {value: 'Infrastructure', caption: 'Infrastruktur'},
                {value: 'Programmes', caption: 'Programme'},
                {value: 'Project funding', caption: 'Projektförderung'},
                {value: 'Science communication', caption: 'Wissenschaftskommunikation'},
                {value: 'Unknown', caption: 'Unbekannt'}
            ],
            padding: 50,
            length: 1600,
            center: 300,
            orientation: 'y'
        }),
        Type: DiscreteAxis({
            property: 'Type',
            caption: 'Output-Typ',
            levels: [
                {value: 'Media relations: print media, online media', caption: 'Print- und Onlinemedien'},
                {value: 'Software', caption: 'Software'},
                {value: 'Media relations: radio, television', caption: 'Radio und Fernsehen'},
                {value: 'New media (web, blogs, podcasts, news feeds etc.)', caption: 'Web, Blogs, Podcasts, Newsfeed'},
                {value: 'Other activities', caption: 'Andere'},
                {value: 'Print (books, brochures, leaflets)', caption: 'Bücher und Broschüren'},
                {value: 'Start-up', caption: 'Start-up\'s'},
                {value: 'Talks/events/exhibitions', caption: 'Vorträge, Events und Ausstellungen'},
                {value: 'Video/Film', caption: 'Video und Film'}
            ],
            padding: 50,
            length: 1600,
            center: 300,
            orientation: 'y'
        }),
        none: DiscreteAxis({
            property: 'none',
            levels: ['Alle'],
            padding: 50,
            length: 1200,
            center: 300,
            orientation: 'y'
          })
    }

    var axisFactory = Object();

    axisFactory.getXAxis = function(property) {
        return supportedXAxes[property]
    }

    axisFactory.getYAxis = function(property) {
        return supportedYAxes[property]
    }

    axisFactory.getSupportedXAxes = function() {
        return supportedXAxes;
    }
	
	axisFactory.getSupportedYAxes = function() {
		return supportedYAxes;
	}
	
    return axisFactory;
}