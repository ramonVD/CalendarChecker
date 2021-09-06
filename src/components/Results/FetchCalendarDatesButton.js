import {CALENDARS_URL} from "../generic/CalendarSelector";
import React from "react";
require('dotenv').config();

/*Button that fetches data from an external api when clicked*/
class FetchCalendarDatesButton extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			loading: false,
			error: 0
		}

		this.updateMainDataAfterFetch = this.updateMainDataAfterFetch.bind(this);
		this.errorFetching = this.errorFetching.bind(this);
	}

	render() {
		let fetchDataButtonName;
		let pressMeAnimation = (this.props.canLoadNewCalendar) ? " pressMeButton" : "";
		if (this.state.loading) {
			fetchDataButtonName = <span>Carregant&nbsp;&nbsp;<div className="spinner-border text-white" role="status">
			<span className="visually-hidden">...</span></div></span>;
		} else if (this.state.error === -1) {
			fetchDataButtonName = "Error al descarregar el calendari, reintenta-ho!";
		} else if (this.state.error === -2) {
			fetchDataButtonName = "Adreça del calendari incorrecta, reintenta-ho!";
		} else {
			fetchDataButtonName = (this.props.canLoadNewCalendar) ? "Carrega les dades del calendari⠀▸" : "Calendari carregat";
		}
		return (
			<button className={"btn btn-primary btn-lg lh-sm" + pressMeAnimation} id="fetchCalendarBtn" onClick={() => {
								if (this.state.loading) { return; }
								fetchDates(CALENDARS_URL[this.props.selectedCalendar], this.updateMainDataAfterFetch, this.errorFetching);
								this.setState({loading: true, error: 0}); }}
								disabled={!this.props.canLoadNewCalendar && this.props.resultsExist}>
					 			{fetchDataButtonName} 
					 			</button>
			);
	}

	updateMainDataAfterFetch(data) {
		this.setState({loading: false, error: 0});
		this.props.updateStoredData(data);
	}

	errorFetching(newErrorValue) {
		this.setState({error: newErrorValue, loading: false});
	}

	

}

export default FetchCalendarDatesButton;




/*Function to fetch the calendar data from the API*/
function fetchDates(calendarID, callbackOK, callbackError) {
	//Aconsegueix els valors de la URL en comptes d'usar testvalues...
	const proxyUrl = process.env.REACT_APP_APIURL;

	const usedID = calendarID.replace(/\s+|&|<|>|"|'/g, '');

	//const timeBeforeCheck = Date.now();
	fetch(proxyUrl + usedID, {
		mode: 'cors',
		headers: {
		'Content-Type': "text/plain"
		}
	    })
    .then((res) => {
    	if (res.status >= 300 ) {
    		throw Error("Calendar not found");
    	} else {
    		return res.text();
    	}})
    .then( (data) => {
    	const finalData = JSON.parse(data);
    	callbackOK(finalData.data);
    }).catch((error) => {
    	console.log(error)
			callbackError(-1);
			return;
	});
		  
}