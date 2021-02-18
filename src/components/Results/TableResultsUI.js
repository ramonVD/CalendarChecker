import React from "react";
import {formatDateCatalan, reverseArray} from "../utils/CalendarEventsParser";
import CopyTextButton from "./CopyTextButton";
import "../../styles/TableResultsUI.css";

class EndResultTables extends React.PureComponent {

	render() {	
		let eventArray = this.props.selectedEvents.slice();
		const iocStyleTable = this.props.options.iocStyleTable;
		const addEmptySpaceEndLine = this.props.options.addEmptySpaceEndLine;
		let orderingAsc = this.props.options.orderingAsc;
		if (!this.props.resultsExist) { return <div className="mb-5" id="taulaDiv"></div>; }
		if (this.props.selectedEvents === undefined || this.props.selectedEvents.length < 1) { return <div className="text-center fs-5 mb-5 mt-5" id="taulaDiv">Selecciona com a mínim un event del llistat per generar una taula</div>; }
		let correctedEndDate, formattedStartData, currentDate, event;
		let counter = 1;
		let normalTableRows = [];
		let codeTableRows = [];
		const notShowingYear = (this.props.options.notShowingYear === undefined) ? "true" : this.props.options.notShowingYear;
		//Ordenada sempre la llista d'events
		eventArray = orderArrayDescDates(eventArray);
		if (!iocStyleTable && !orderingAsc) { eventArray = reverseArray(eventArray); }

		for (let i = 0; i < eventArray.length; i++){
			event = eventArray[i];
			currentDate = new Date(event.start);
			formattedStartData = formatDateCatalan(currentDate.getDay(), currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear(), notShowingYear);
			if (addEmptySpaceEndLine) formattedStartData += " ";

			//A la taula estil ioc juntem publicació i validació. Només passa si són events consecutius
			if (iocStyleTable && i < eventArray.length - 1 && eventArray[i].summary.search(/validació/g) >= 0 && eventArray[i+1].summary.search(/notes/g) >= 0) {
				let nextEvent = eventArray[i+1];
				currentDate = new Date(nextEvent.start);
				correctedEndDate = isNaN(nextEvent.start) ? "" : formatDateCatalan(currentDate.getDay(), currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear(), notShowingYear);
				if (addEmptySpaceEndLine) correctedEndDate += " ";
				normalTableRows.push(<tr key={"normalTable"+counter}><td>Validació-publicació</td><td>{formattedStartData}</td>
									<td>{correctedEndDate}</td></tr>);
				codeTableRows.push(<p key={"codeTable"+counter}>{"<tr><td>Validació-publicació</td>"}<br />
						{"<td><div id=textDiv" + counter + "></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent='" + formattedStartData + "';var text" + counter++ +"= div.textContent;</script>"}<br />
						{"<td><div id=textDiv" + counter + "></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent='" + correctedEndDate + "';var text" + counter++ +"= div.textContent;</script></tr>"}
						</p>);
				i++;
			} else {
				currentDate = new Date(event.end);
				correctedEndDate = isNaN(event.end) ? "" : formatDateCatalan(currentDate.getDay(), currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear(), notShowingYear);
				if (addEmptySpaceEndLine) correctedEndDate += " ";
				normalTableRows.push(<tr key={"normalTable"+counter}><td>{event.summary}</td><td>{formattedStartData}</td>
											<td>{correctedEndDate}</td></tr>);
				codeTableRows.push(<p key={"codeTable"+counter}>{"<tr><td>" + event.summary + "</td>"}<br />
								{"<td><div id=textDiv" + counter + "></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent='" + formattedStartData + "';var text" + counter++ +"= div.textContent;</script>"}<br />
								{"<td><div id=textDiv" + counter + "></div></td><script>var div=document.getElementById('textDiv"+counter + "');div.textContent='" + correctedEndDate + "';var text" + counter++ +"= div.textContent;</script></tr>"}
								</p>);
			}
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
					  <td>Mòdul:</td>
					  <td>Introdueix aquí el nom del mòdul</td>
					  <td></td>
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
		  			<tbody><tr><td>Mòdul:</td>
		  			<td><div id="textDiv0"></div>
		  			<script>var div=document.getElementById('textDiv0');
		  			div.textContent="Introdueix aquí el nom del mòdul";
		  			var text0=div.textContent;</script>
					  </td><td></td></tr>`}</span>
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

export default EndResultTables;