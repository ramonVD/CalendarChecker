import {getDefaultEventAmount} from "../ComponentDirector";
const ical = require('ical');

/*Parses all events in a calendar and returns them as a dictionary with the useful data as parameters*/
//Case don't matter
export function getFilteredEvents(data, options) {
	if (options === undefined) { 
		options = {searchWord: /(lliurament|lliurment|proves|avaluació|avaluacio)/gi } 
	}
	if (data === undefined) { return []; }

	let calendarData = {};
	/*Its been fed super bogus data (integers?, random dicts?)*/
	try {
		calendarData = ical.parseICS(data);
	} catch (error) {
		return [];
	}
	/*Should only reach an empty object due to trying to feed the app bogus strings*/
	if (isEmpty(calendarData)) { return []; } 

	let filteredEventsArray = [];
	let filteredEvent = {};
	let eventStartDate, eventFinalDate;
	const acceptWrongEndDate = (options.hasOwnProperty("acceptWrongEndDate")) ? options.acceptWrongEndDate : false;
	for (let k in calendarData) {
	    if (calendarData.hasOwnProperty(k)) {
	        let event = calendarData[k];
	        eventStartDate = Date.parse(event.start);
	        eventFinalDate = Date.parse(event.end);
	        let matchWord = options.hasOwnProperty("searchWord") ? false : true;
	        let matchDateStart = options.hasOwnProperty("initialDate") ? false : true;
	        let matchDateEnd = options.hasOwnProperty("finalDate") ? false : true;
	        if (event.type === 'VEVENT') {
	        	//Event contains some of the matching words or ...regexes maybe???
	        	if (options.hasOwnProperty("searchWord")) {
	        		matchWord = (event.summary.search(options.searchWord) >= 0) ? true : false;
	        	}
	        	//Event starts after initial date from filter
	        	if (options.hasOwnProperty("initialDate")) {
	        		matchDateStart = eventStartDate >= options.initialDate;
	        	}
	        	//Event ends before final date from filter
	        	if (options.hasOwnProperty("finalDate")) {
	        		if (isNaN(eventFinalDate) && acceptWrongEndDate) {
	        			matchDateEnd = eventStartDate <= options.finalDate;
	        		} else if (!isNaN(eventFinalDate)) {
	        			matchDateEnd = eventFinalDate <= options.finalDate;
	        		} else {
	        			matchDateEnd = false;
	        		}
	        	} else if (!options.hasOwnProperty("finalDate") && !acceptWrongEndDate) {
	        		if (isNaN(eventFinalDate)) {
	        			matchDateEnd = false;
	        		}
	        	}
	        	if (matchWord && matchDateStart && matchDateEnd) {
	        		//Si l'event entra dins els parametres dels filtres...
	        		let orderingCriteria;
	        		//L'ordenarem per data inicial o final, en ordre ascendent o descendent
	        		if (options.hasOwnProperty("orderingByInitialDate")) {
	        			orderingCriteria = options.orderingByInitialDate ? eventStartDate : eventFinalDate;
	        		}
	        		filteredEvent = { summary: event.summary,
	        						  start: eventStartDate, 
	        						  end: eventFinalDate,
	        						  uid: event.uid,
	        						 orderingCriteria: orderingCriteria};
	        		let tmpDate;
	        		//Els events per defecte acaben a les 00:00:00, pel que els considera el dia següent si no li treus hores...
	        		if (!isNaN(filteredEvent.end)) {
	        			tmpDate = new Date(filteredEvent.end);
	        			tmpDate.setHours(tmpDate.getHours() - 13);
	        			filteredEvent.end = Date.parse(tmpDate);
	        		}
	        		filteredEventsArray = orderArrayDesc(filteredEventsArray, filteredEvent);
	        	}
	        }
	    }
	}
	if (options.hasOwnProperty("orderingAsc") && options.orderingAsc) {
	    filteredEventsArray = reverseArray(filteredEventsArray);
	}
	return filteredEventsArray;
}


function orderArrayDesc(startingArray, element) {
	let tmpArray = startingArray.slice();
	 if (tmpArray.length === 0) {
	 	tmpArray.push(element);
	 }
	 else {
	 	let lastElementPos = tmpArray.length - 1;
		let counter = 0;
		while (element.orderingCriteria > tmpArray[lastElementPos - counter].orderingCriteria) {
			if (lastElementPos - counter === 0) {
				break;
			}
			counter++;
		}

		//Reached leftmost array element
		if (lastElementPos - counter === 0) {
			//It was bigger than all others
			if (element.orderingCriteria > tmpArray[0].orderingCriteria) {
				tmpArray.unshift(element);
			} else {
				//It was smaller than all the other elements except last one
				tmpArray.splice(1, 0, element);
			}
		//Or found an element that was bigger in a certain position
		} else  {	
			tmpArray.splice(lastElementPos-counter+1, 0, element);
		}
	 }
	 return tmpArray;
}

export function reverseArray(startingArray) {
	let tmpArray = startingArray.slice();
	let tmp;
	const length = tmpArray.length;
	for (let i = 0; i < tmpArray.length / 2; i++) {
		tmp = tmpArray[i];
		tmpArray[i] = tmpArray[length-i-1];
		tmpArray[length-i-1] = tmp;
	}
	return tmpArray;
}

function eventExistInArray(event, eventArray) {
	for (let i = 0; i < eventArray.length; i++) {
		if (event.uid === eventArray[i].uid) {
			return true;
		}
	}
	return false;
}

//Change, add 2 vars and move to another module probs
export function getSelectedEventsArray(eventArray, oldSelectedEvents, orderingAsc, forceSelect) {
	if (eventArray === undefined) return [];

	let selectedEvents = oldSelectedEvents.slice();

	let counter = 0, startingPoint = 0;
	const DEFAULT_AMOUNT_OF_SELECTED_EVENTS = getDefaultEventAmount();
	//By default, when a calendar is loaded we select 6 events (where depends on ordenation)
	if (selectedEvents.length < DEFAULT_AMOUNT_OF_SELECTED_EVENTS && forceSelect) {
		counter = DEFAULT_AMOUNT_OF_SELECTED_EVENTS;
		if (orderingAsc) {
			startingPoint = eventArray.length - counter;
		}
		let element;
		for (let i = 0; i < eventArray.length; i++) {
			element = eventArray[i];
			if (i === startingPoint && counter > 0) {
				if (!eventExistInArray(element, selectedEvents)) {
					selectedEvents.push(element);
					startingPoint++;
					counter--;
				}
			}
		}
	} else {
		selectedEvents = [];
		for (let j = 0; j < oldSelectedEvents.length; j++) {
			if (eventExistInArray(oldSelectedEvents[j], eventArray)) {
				selectedEvents.push(oldSelectedEvents[j]);
			}
		}
	}
	
	return selectedEvents;
}



export function formatDate(date, format) {
	if (date === undefined || date === "") { return "";}
    const map = {
    	dd: zerosToTheLeft(date.getDate(),2),
        mm: zerosToTheLeft(date.getMonth() + 1, 2),
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear()
    }

    return format.replace(/dd|mm|yyyy|yy/gi, matched => map[matched])
}

function zerosToTheLeft(originalStr, minLength) {
	originalStr = originalStr.toString();
	if (originalStr.length >= minLength) { return originalStr; }
	let numberOfZeroes = minLength - originalStr.length;
	return ( ( "0" * numberOfZeroes) + originalStr );
}

/*Not returning year by default since it's what was originally done*/
export function formatDateCatalan(diaSetmana, dia, mes, any, noYear) {
	const dies = ["diumenge", "dilluns","dimarts","dimecres","dijous","divendres","dissabte"];
	const mesos = ["gener","febrer","març","abril","maig","juny","juliol","agost","setembre","octubre","novembre","desembre"];
	const de = ["abril", "agost", "octubre"].includes(mesos[mes]) ? " d'" : " de ";
	if (noYear !== undefined && !noYear) { return (dies[diaSetmana] + " " + dia + de + mesos[mes] + " de " + any);}
	return (dies[diaSetmana] + " " + dia + de + mesos[mes]);
}

function isEmpty(obj) {
	for (var i in obj) return false;
	return true;
}