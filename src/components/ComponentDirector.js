import React from "react";
import EventResultsUI from "./Results/EventResultsUI";
import TableResultsUI from "./Results/TableResultsUI";
import FilteringOptions from "./FilteringAndOrdering/FilteringOptions";
import OrderingOptions from "./FilteringAndOrdering/OrderingOptions";
import {DEFAULT_CALENDARS_NAME} from "./generic/CalendarSelector";
import {getFilteredEvents, formatDate, getSelectedEventsArray} from "./utils/CalendarEventsParser";
import {loadPropertyCookie} from "./utils/CookieFunctions";


/*Loading old values from cookies for calendar name and all checkboxes. These are the default values before cookies.*/
let cookieProperties = {selectedCalendar: DEFAULT_CALENDARS_NAME[0], acceptWrongEndDate: "true", iocStyleTable: "true", notShowingYear: "true"};
/* TO-DO DEMÀ 24/12/21 
Deixar-ho tot maco (muntar estils wapos pels components, cal muntar tooltips).*/ 

class ComponentDirector extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		const DEFAULT_DAYS_BEFORE = 7;
		const DEFAULT_DAYS_AFTER = 100;
		const defaultStartDate = formatDate(new Date(Date.now() - DEFAULT_DAYS_BEFORE * 24 * 60 * 60 * 1000), "yyyy-mm-dd");
		const defaultEndDate = formatDate(new Date(Date.now() + (DEFAULT_DAYS_AFTER * 24 * 60 * 60 * 1000)), "yyyy-mm-dd");
		const defaultWords = "lliurament, lliurment, validació, notes";

		let cookieSelectedProperty;
		for (let property in cookieProperties) {
			cookieSelectedProperty = loadPropertyCookie(property);
			if (cookieSelectedProperty !== undefined) { cookieProperties[property] = cookieSelectedProperty;}
		}

		this.state = {
			selectedCalendar: cookieProperties.selectedCalendar,
			oldSelectedCalendar: undefined,
			filteringByStartDate: true,
			startDate: defaultStartDate,
			filteringByEndDate: true,
			endDate: defaultEndDate,
			filteringByWords: true,
			words: defaultWords,
			acceptWrongEndDate: strToBool(cookieProperties.acceptWrongEndDate),
			iocStyleTable: strToBool(cookieProperties.iocStyleTable),
			notShowingYear: strToBool(cookieProperties.notShowingYear),
			orderingByInitialDate: true,
			orderingAsc: true,
			customURL: "https://",
			oldCustomURL: "https://",
			storedCalendarData: undefined,
			selectedEvents: [],
			resultsChanged: true
		}

		this.changeProperty = this.changeProperty.bind(this);
		this.updateStoredData = this.updateStoredData.bind(this);
		this.generateOptions = this.generateOptions.bind(this);
	}

	render() {
		const options = this.generateOptions();
		//aki regeneraa eventsarray amb les noves options
		const eventArray = getFilteredEvents(this.state.storedCalendarData, options);
		const selectedEvents = getSelectedEventsArray(eventArray, this.state.selectedEvents, this.state.orderingAsc, false);
		const resultsExist = (this.state.storedCalendarData !== undefined);
		let resultsButtonName = (resultsExist) ? "Taula generada ↴" : "Carrega un calendari per generar una taula";
		return (
			<div className="container" id="resultsDiv">
		        <EventResultsUI filteringByStartDate={this.state.filteringByStartDate} startDate={this.state.startDate} 
		          filteringByEndDate={this.state.filteringByEndDate} endDate={this.state.endDate}
		          filteringByWords={this.state.filteringByWords} words={this.state.words}
		          customURL={this.state.customURL} selectedCalendar={this.state.selectedCalendar} updateStoredData={this.updateStoredData}
		          changeProperty={this.changeProperty} eventsArray={eventArray} 
		          selectedEvents={selectedEvents} resultsExist={resultsExist} colapseOpcButton={toggleColapsableCaretButton}
		          canLoadNewCalendar={this.state.customURL !== this.state.oldCustomURL || (this.state.oldSelectedCalendar !== this.state.selectedCalendar)} />
		          <div className="row justify-content-center mb-3">
			          <div className="d-grid gap-2 col-6 mx-auto">
							<button className={"btn btn-primary btn-lg"} type="button" disabled={!resultsExist} id="taulaButton"
								onClick={() => { if (resultsExist && selectedEvents.length > 0) {
									setTimeout( () => {document.getElementById("taulaDiv").scrollIntoView();} , 200);
									}}}>
								    {resultsButtonName}
							  </button>
					 </div>
			         <div className="d-grid gap-2 col-6 mx-auto">
				          <button className="btn btn-lg btn-dark btn-block lh-1" type="button" data-bs-toggle="collapse" data-bs-target="#colapsaOpcions" 
							aria-expanded="false" aria-controls="colapsaOpcions" id="colapsaButton"
							onClick={() => { toggleColapsableCaretButton("Opcions ", "colapsaButton", "colapsaOpcions", false);}}>
							    Opcions ▾
						   </button>
						</div>
				</div>
				<div className="collapse mb-3" id="colapsaOpcions">
					<div className="row border border-2 gx-5 bg-white">
						<div className="col mt-2">
							  	<FilteringOptions changeProperty={this.changeProperty} filteringByStartDate={this.state.filteringByStartDate} startDate={this.state.startDate} 
					          filteringByEndDate={this.state.filteringByEndDate} endDate={this.state.endDate}
					          filteringByWords={this.state.filteringByWords} words={this.state.words} />
						</div>
						  	<div className="col mt-2">
						  		<OrderingOptions changeProperty={this.changeProperty}  options={options}/>
					        </div>
					 </div>
				</div>
					<div className="mt-4">
						    <TableResultsUI selectedEvents={selectedEvents} options={options} resultsExist={resultsExist} />
					</div>
		    	<div className="row mt-5 mb-2">
		    		<p className="text-center"><small className="text-muted">Creat per Ramon Vicente en l'any 2020, primer any de la Pesta Corona. 
					<a href="mailto:&#114;&#118;&#105;&#99;&#101;&#110;&#116;&#101;&#100;&#105;&#97;&#122;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;"
					className="mx-3">Contacta</a>
					<a href="https://ioc.xtec.cat/educacio/" target="_blank" rel="noopener noreferrer">
						<img src="./MadeinIOC.png" alt="Fet a l'IOC" title="Fet a l'IOC" className="mainPageIcon mx-2" />
						</a>
					</small></p>
		    	</div>
		    </div>
		);        
	}

	updateStoredData(data){
		//add quality control to this data?

		const eventArray = getFilteredEvents(data, this.generateOptions());
		const selectedEvents = getSelectedEventsArray(eventArray, this.state.selectedEvents, this.state.orderingAsc, true);
		this.setState({storedCalendarData: data, selectedEvents: selectedEvents, oldSelectedCalendar: this.state.selectedCalendar, oldCustomURL: this.state.customURL});
	}

	changeProperty(property, value) {
		/*Scroll to top or bottom when changing ordering mode or changing parameter via UI that can change the amount of events, etc
		UNUSED - always scrolled to first event. Let users scroll if they want to... I guess? Or maybe always scroll to most recent
		if (propertyModifiesEvents(property)) {
			if ( this.state.orderingAsc && (property === "orderingAsc" && value === false ))  {
				setTimeout( () => { var scrollableDiv = document.getElementById("resultsRows");
								scrollableDiv.scrollTop = scrollableDiv.scrollHeight;}, 200);
			} else if ( !this.state.orderingAsc && (property === "orderingAsc" && value === true)) {
							setTimeout( () => { var scrollableDiv = document.getElementById("resultsRows");
										scrollableDiv.scrollTop = 0;}, 200);
			}
		}*/
		if (this.state.hasOwnProperty(property)) {
			this.setState({[property]: value});
		}
	}

	generateOptions() {
		let originalWords = this.state.words.split(",");
		//no encodeURI bc of accents...
		originalWords = originalWords.map(element => element.replace(/\s+|&|<|>|"|'/g, '')); 
		originalWords = originalWords.filter( element => element !== "");
		let composedWords = originalWords.join("|");
		let options = {searchWord: new RegExp("(" + composedWords + ")", "gi") ,
						initialDate: Date.parse(this.state.startDate),
						finalDate: Date.parse(this.state.endDate),
						orderingAsc: this.state.orderingAsc,
						orderingByInitialDate: this.state.orderingByInitialDate,
						acceptWrongEndDate: this.state.acceptWrongEndDate,
						iocStyleTable: this.state.iocStyleTable,
						notShowingYear: this.state.notShowingYear
					}
		if (!this.state.filteringByWords) { delete options.searchWord; }
		if (isNaN(options.initialDate) || !this.state.filteringByStartDate) { delete options.initialDate; }
		if (isNaN(options.finalDate) || !this.state.filteringByEndDate) { delete options.finalDate; }
		return options;
	}

}

/*UNUSED so far... needed if we want to selectively add changes to UI when
some properties are changed (decided not to)
function propertyModifiesEvents(propertyName) {
	switch(propertyName) {
	case "filteringByStartDate":
	case "startDate":
	case "filteringByEndDate":
	case "endDate":
	case "filteringByWords":
	case "words":
	case "acceptWrongEndDate":
	case "orderingByInitialDate":
	case "orderingAsc":
		return true;
	default:
		return false;

	}
}	
*/

function strToBool(str) {
	const lowStr = str.toLowerCase();
	if (lowStr === "true") { return true;}
	return false;
}

//Shoulda made this a component
function toggleColapsableCaretButton(textNoCaret, buttonId, colapsableId, focusOnButton) {
	let colapsaDiv = document.getElementById(colapsableId);
	let colapsaButton = document.getElementById(buttonId);
	if (colapsaDiv === null || colapsaDiv === undefined || colapsaButton === null || colapsaButton === undefined) { return; }

	setTimeout( () => {if (colapsaDiv.classList.contains("show") && focusOnButton) { colapsaButton.scrollIntoView();}
	let caretText = (!colapsaDiv.classList.contains("show")) ? textNoCaret + "▾" : textNoCaret + "▴";
	colapsaButton.innerText = caretText;}, 400);
}

export default ComponentDirector;