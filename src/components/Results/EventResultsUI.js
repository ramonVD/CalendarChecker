import React from "react";
import {formatDate} from "../utils/CalendarEventsParser";
import {CalendarSelector} from "../generic/CalendarSelector";
import FetchCalendarDatesButton from "./FetchCalendarDatesButton";
import "../../styles/EventResultsUI.css";


/*Dema - que al titol llistat d'events ->posi calendari no carregat... i tal i que generant taula sigui un boto amb link...
POTSER QUE SIGUIN 2 LINIES*/

class ResultsContainer extends React.Component {
	constructor(props) {
		super(props);
		this.toggleSelectedElement = this.toggleSelectedElement.bind(this);
	}

	render() {
		let activeFiltersText = [];
		if (this.props.filteringByStartDate) { activeFiltersText.push(<li key="initial">{"L'event passa després del " + formatDate(new Date(this.props.startDate), "dd-mm-yyyy")}</li>); }
		if (this.props.filteringByEndDate) { activeFiltersText.push(<li key="final">{"L'event passa abans del " + formatDate(new Date(this.props.endDate), "dd-mm-yyyy")}</li>); }
		if (this.props.filteringByWords) { activeFiltersText.push(<li key="words">{"L'event conté alguna de les paraules clau - " + this.props.words}</li>); }
		let finalFilterText = (activeFiltersText.length) > 0 ? <ul className="text-center">{activeFiltersText}</ul> : 
		<ul className="list-unstyled text-center"><li key="none">Cap (Llistarà tots els events al calendari)</li></ul>
		let eventsTitle ="Events al calendari";
		let linkToTable = [];
		if (this.props.eventsArray.length > 0) { eventsTitle += " - " + this.props.selectedEvents.length + "/" +  this.props.eventsArray.length + " events seleccionats"; }
		else { linkToTable = <span> - <span className="textLink text-primary" title="Cal que carreguis un calendari amb el botó de sota!" onClick={() => 
								{ setTimeout( () => {document.getElementById("fetchCalendarBtn").scrollIntoView();} , 200);
								}}>cap calendari carregat</span></span>}
		const hiddenButton = (this.props.resultsExist) ? " " : " d-none";
		return (
			<div className="container-fluid">
				<div className="container-fluid mt-3">
				<div className="row">
					<p className="lead text-center fw-bold">{[eventsTitle, linkToTable]}</p>
				</div>
				<div className="row justify-content-center mb-3">
					<div className="col-6 text-end">
						<button className={"btn btn-link" + hiddenButton}
						 onClick={() => {this.props.changeProperty("selectedEvents", this.props.eventsArray.slice());}}>
						 Selecciona tots</button>
					</div>
					<div className="col-4 text-start">
						<button className={"btn btn-link" + hiddenButton}
						onClick={() => {this.props.changeProperty("selectedEvents", []);}}>
						Deselecciona tots</button>
					</div>
					<div className="col-2 text-center">
						<button className={"btn btn-link float-right" + hiddenButton}
						onClick={() => { setTimeout( () => {document.getElementById("taulaDiv").scrollIntoView();} , 200);
								}}>
						Taula</button>
			 		</div>
			 	</div>
				<div className="row justify-content-center lead">
					<div className="col text-center">Nom de l'event</div>
					<div className="col text-center">Data inicial</div>
					<div className="col text-center">Data final</div>
				</div>
				</div>

				<div className="container-fluid results border border-2 rounded shadow mb-4 mt-2" id="resultsRows">
					{generateRowsFromEvents(this.props.eventsArray, this.props.selectedEvents, this.toggleSelectedElement)}
				</div>

				<div className="container-fluid mb-5 mt-3 border border-2 mainGetResultsRow">
					<div className="row justify-content-center align-items-center">
						<div className="col mt-3">
							<CalendarSelector selectedCalendar={this.props.selectedCalendar} 
							canLoadNewCalendar={this.props.canLoadNewCalendar} changeProperty={this.props.changeProperty} customURL={this.props.customURL} />
						</div>
						<div className="col text-center mt-3">
								<FetchCalendarDatesButton canLoadNewCalendar={this.props.canLoadNewCalendar} selectedCalendar={this.props.selectedCalendar}
								updateStoredData={this.props.updateStoredData} resultsExist={this.props.resultsExist} />
					 	</div>
						<div className="col">
						<p className="text-center mt-3 fs-5">Filtres&nbsp;&nbsp;(<span className="textLink text-primary" 
							onClick={() => { let colapseDiv = document.getElementById("colapsaOpcions");
											if (!colapseDiv.classList.contains("show")) {
												colapseDiv.classList.add("show"); 
											}
											setTimeout( () => {document.getElementById("colapsaOpcions").scrollIntoView();} , 200);
								}}>Canvia'ls</span>)</p>
						{finalFilterText}
						</div>
					</div>
				</div>
	          </div>
	        );
	}

	toggleSelectedElement(element) {
		let eventArray = this.props.selectedEvents.slice();
		const selectedEventUID = element.uid;
		let foundElement = false;
		for (let i = 0; i < eventArray.length; i++) {
			if (selectedEventUID === eventArray[i].uid) {
				eventArray.splice(i,1);
				foundElement = true;
				break;
			}
		}
		if (!foundElement) {
			//IMPORTANT!!! FORCE REORDERING WHEN ADDING NEW SELECTED EVENTS, 
			//CRITERIA TO CHECK: this.props.orderingByDate(boolean) and orderingMode(asc/desc, string)
			eventArray.push(element);
		}
		this.props.changeProperty("selectedEvents", eventArray);
	}
}

function foundElementUID(elementUID, elementArray) {
	for (let element of elementArray) {
		if (element.uid === elementUID) {
			return true;
		}
	}
	return false;
}

function generateRowsFromEvents(eventsArray, selectedEvents, callback) {
	if (eventsArray === undefined || eventsArray.length < 1) { return []; }
	let rows = [];
	let selectedElement, startDate, finalDate;
	for (let element of eventsArray) {
		selectedElement = foundElementUID(element.uid, selectedEvents) ? " selected" : "";
		startDate = new Date(element.start).toLocaleDateString();
		finalDate = new Date(element.end).toLocaleDateString();
		rows.push(<div className={"row insideResultsRow" + selectedElement} 
				title="Prem amb el ratolí per seleccionar/deseleccionar l'event" key={element.uid} onClick={() => {callback(element);}}>
				<div className="col text-center">{element.summary}</div>
				<div className="col text-center">{startDate}</div>
				<div className="col text-center">{finalDate}</div>
				</div>);
	}
	return rows;
}

export default ResultsContainer;