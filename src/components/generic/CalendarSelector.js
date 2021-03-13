import React from "react";
import {savePropertyCookie} from "../utils/CookieFunctions";

export const DEFAULT_CALENDARS_NAME = ["GES", "BATX", "Custom"];
const DEFAULT_CALENDARS_TEXT = {GES: "Calendari del GES", BATX: "Calendari de BATX", Custom: "Altre (escriu l'Identificador de calendari sense @group.calendar...)" };
export let CALENDARS_URL = { GES: "k0aqkiq40e79pokavpkg9fqu60",
					 BATX: "ioc.cat_7fqpufpt2a59n9usn3kkta6h5o", 
					 Custom: "..."};

export class CalendarSelector extends React.PureComponent {

	render() {
		const options = DEFAULT_CALENDARS_NAME.map( function(element) {
			return (<option value={element} key={element}>{DEFAULT_CALENDARS_TEXT[element]}</option>);
		});	
		/*const btnText = "Escull calendari";
		<div className="row">
				<p className="mb-2 fs-5">{btnText}</p>
			</div>*/
		return (
		<div className="container-fluid">
			
			<div className="row">
				<select className="form-select" aria-label=".form-select-lg example" value={this.props.selectedCalendar}
			onChange={(event) => {const newCalendarName = event.target.value;
								savePropertyCookie("selectedCalendar", newCalendarName);
								this.props.changeProperty("selectedCalendar", newCalendarName);}}>
				{options}
				</select>
			</div>
			<div className="row">
				<input type="text" value={CALENDARS_URL[this.props.selectedCalendar]} 
				className="form-control"
				onChange={(event) => {
					const newText = event.target.value;
					if (this.props.selectedCalendar === "Custom") {
						CALENDARS_URL["Custom"] = newText;
					}
					this.props.changeProperty("customURL", newText);}} 
				disabled={this.props.selectedCalendar !== "Custom"} />
			</div>
		</div>);
	}


}

