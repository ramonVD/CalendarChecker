import React from "react";
import {formatDateCatalan, reverseArray} from "../utils/CalendarEventsParser";
import CopyTextButton from "./CopyTextButton";
import "../../styles/TableResultsUI.css";

/*Generates the two html tables using calendar event data*/
class ResultsTable extends React.PureComponent {

	render() {	
		let eventArray = this.props.selectedEvents.slice();
		const provaValidacio = this.props.options.provaValidacio;
		const addEmptySpaceEndLine = this.props.options.addEmptySpaceEndLine;
		let orderingAsc = this.props.options.orderingAsc;
		if (!this.props.resultsExist) { return <div className="mb-5" id="taulaDiv"></div>; }
		if (this.props.selectedEvents === undefined || this.props.selectedEvents.length < 1) { return <div className="text-center fs-5 mb-5 mt-5" id="taulaDiv">Selecciona com a mínim un event del llistat per generar una taula</div>; }
		let correctedEndDate, formattedStartData, currentDate, event;
		let counter = 1;
		let normalTableRows = [];
		let codeTableRows = [];
		let lastTestEvent = undefined;
		const options = {provaValidacio: provaValidacio}
		const notShowingYear = (this.props.options.notShowingYear === undefined) ? "true" : this.props.options.notShowingYear;
		//Ordenada sempre la llista d'events
		eventArray = orderArrayDescDates(eventArray);
		if (!orderingAsc) { eventArray = reverseArray(eventArray); }

		for (let i = 0; i < eventArray.length; i++){
			event = eventArray[i];

			//These two are filtering options that suit my needs, probably make this modular in the future so it can load custom filtering options

			/*Join the grade publication and test date events in the same row if they are consecutive, remove previous row, the "only the test date event" row*/
			if (event.summary.search(/(avaluacio|avaluació)/gi) >= 0 && lastTestEvent !== undefined) {
				currentDate = new Date(event.start);
				correctedEndDate = isNaN(lastTestEvent.start) ? "" : formatDateCatalan(currentDate.getDay(), currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear(), notShowingYear);
				if (addEmptySpaceEndLine) correctedEndDate += " ";
				counter-=2;
				normalTableRows.pop(); //Remove the previous test date row in the table
				normalTableRows.push(<tr key={"normalTable"+counter}><td>Prova validació - Publicació notes</td><td>{formattedStartData}</td>
									<td>{correctedEndDate}</td></tr>);
				codeTableRows.pop();
				codeTableRows.push(<p key={"codeTable"+counter}>{"<tr><td>Prova validació - Publicació notes</td>"}<br />
						{"<td><div id=textDiv" + counter + "></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent='" + formattedStartData + "';var text" + counter++ +"= div.textContent;</script>"}<br />
						{"<td><div id=textDiv" + counter + "></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent='" + correctedEndDate + "';var text" + counter++ +"= div.textContent;</script></tr>"}
						</p>);
				continue;
			}

			/*Don't show some elements according to the criteria, probably make this a more generalist function in the future,
			or maybe filter these out when the events are read, in CalendarEventsParser.*/
			if (event.summary.search(/proves|presencials|telemàtiques|telematiques/gi) >= 0) {
				if (provaValidacio === "0") {
					lastTestEvent = undefined; //not necessary, just for clarity. Dont show test dates in this mode
					continue;
				} else if (event.summary.search(/telematiques|telemàtiques/) >= 0) {
					if (provaValidacio === "2") {continue;}
					else { lastTestEvent = event; }
				} else if (event.summary.search(/presencials/) >= 0) {
					if (provaValidacio === "1") {continue;}
					else { lastTestEvent = event; }
				}
			} else {
				lastTestEvent = undefined;
			}



			const modifiedEvent = filter_output_values(event, options);


			currentDate = new Date(modifiedEvent.start);
			formattedStartData = (isNaN(currentDate.getTime())) ? "" : formatDateCatalan(currentDate.getDay(), currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear(), notShowingYear);
			if (addEmptySpaceEndLine) formattedStartData += " ";

			currentDate = new Date(modifiedEvent.end);
			correctedEndDate = isNaN(modifiedEvent.end) ? "" : formatDateCatalan(currentDate.getDay(), currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear(), notShowingYear);
			if (addEmptySpaceEndLine) correctedEndDate += " ";
			normalTableRows.push(<tr key={"normalTable"+counter}><td>{modifiedEvent.summary}</td><td>{formattedStartData}</td>
										<td>{correctedEndDate}</td></tr>);
			codeTableRows.push(<p key={"codeTable"+counter}>{"<tr><td>" + modifiedEvent.summary + "</td>"}<br />
							{"<td><div id=\"textDiv" + counter + "\"></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent=\"" + formattedStartData + "\";var text" + counter++ +"= div.textContent;</script>"}<br />
							{"<td><div id=\"textDiv" + counter + "\"></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent=\"" + correctedEndDate + "\";var text" + counter++ +"= div.textContent;</script></tr>"}
							</p>);
		}
		let tableTitle = "Codi de la taula (estil Miqui)";
		return (
		<div className="border border-2 px-1 rounded bg-white">
		<div className="row mb-1 text-center">
			<div className="col">
			<button className="btn btn-secondary  btn-sm mt-4" id="taulaDiv"
			onClick={() => { setTimeout( () => {document.getElementById("resultsDiv").scrollIntoView();}, 200);}}>
			Torna al llistat d'events
			</button>
			</div>
		</div>
		<div className="row mb-4">
			<div className="col">
			<CopyTextButton linkedId="textTaulaNoCode" />
				<p className="text-center fs-5 mb-5">Taula amb els events seleccionats</p>
				<div id="textTaulaNoCode">
				<table className="table table-condensed table-hover table-bordered" >
		  			<caption>Calendari del trimestre</caption>
		  			<tbody>
						<tr>
						  <th>Mòdul:</th>
						  <th>Introdueix aquí el nom del mòdul</th>
						  <th></th>
						</tr>
					{normalTableRows}
					</tbody>
				</table>
				</div>
			</div>
			<div className="col">
				<CopyTextButton linkedId="textTaulaCode" />
				<p className="text-center mb-5 fs-5">{tableTitle}</p>
				<div id="textTaulaCode">
				<span className="text-start tableCode">{`
				<table class="table table-condensed table-hover table-bordered" style="min-width:300px;">
					<caption>Calendari del trimestre</caption>
		  			<tbody><tr><th>Mòdul:</th>
		  			<th><div id="textDiv0"></div>
		  			<script>var div=document.getElementById('textDiv0');
		  			div.textContent="Introdueix aquí el nom del mòdul";
		  			var text0=div.textContent;</script>
					  </th><th></th></tr>`}</span>
				<span className="text-start tableCode">
					{codeTableRows}
				</span>
				<span className="text-start tableCode">{"</tbody></table>"}</span>
				</div>
			</div>
		</div>
		</div>
		);
	}
}


/*Main function to adapt the values of any event that you can identify.
Change what the end user sees if you get a concrete event in mind (identify it via
its name and change what its name will be in the output, for example, or remove 
its final date...*/
function filter_output_values(event, options) {
	let modifiedEvent = {};
	for (let key in event) {
		modifiedEvent[key] = event[key];
	}

	//Rules here
	if (event.summary.search(/(avaluació|avaluacio)/gi) >= 0) {
		modifiedEvent.summary = "Publicació notes";
		if (options.provaValidacio === "0") {
			modifiedEvent.end = modifiedEvent.start;
			modifiedEvent.start = "";
		}
	}
	if (event.summary.search(/proves/gi) >= 0) {
		modifiedEvent.summary = modifiedEvent.summary.replace("Proves", "Prova");
		modifiedEvent.summary = modifiedEvent.summary.replace("telemàtiques", "telemàtica");
		modifiedEvent.summary = modifiedEvent.summary.replace("presencials", "presencial");
	}
	if (event.summary.search(/(prova|proves)/gi) >= 0) {
		modifiedEvent.end = "";
	}
	return modifiedEvent;
}

function orderArrayDescDates(eventArray) {
	let tmpArray = eventArray.slice();
	let i = 0;
	let event, tmp;
	while (i < tmpArray.length - 1) {
		event = tmpArray[i];
		if (event.start > tmpArray[i+1].start) {
			tmp = tmpArray[i+1];
			tmpArray[i+1] = tmpArray[i];
			tmpArray[i] = tmp;
			i = -1;
		}
		i++;
	}
	return tmpArray;
}

export default ResultsTable;
