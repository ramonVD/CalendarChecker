import {CALENDARS_URL} from "../generic/CalendarSelector";
import React from "react";

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





function fetchDates(URL, callbackOK, callbackError) {
	//Aconsegueix els valors de la URL en comptes d'usar testvalues...
	const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

	const usedURL = URL.replace(/\s+|&|<|>|"|'/g, '');

	if (usedURL.search(/^https:\/\/calendar\.google\.com\//) < 0) {
		setTimeout( () => {callbackError(-2);}, 200);
	} else {
		//const timeBeforeCheck = Date.now();
		fetch(proxyUrl + usedURL, {
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
	    	callbackOK(data);
	    }).catch((error) => {
				callbackError(-1);
				return;
		});
	}
		  
}