import React from "react";

export const DEFAULT_CALENDARS_NAME = ["GES", "BATX", "Custom"];
const DEFAULT_CALENDARS_TEXT = {GES: "Calendari del GES", BATX: "Calendari de BATX", Custom: "Altre (escriu direcció HTML de l'arxiu ical)" };
export let CALENDARS_URL = { GES: "https://calendar.google.com/calendar/ical/k0aqkiq40e79pokavpkg9fqu60%40group.calendar.google.com/public/basic.ics",
					 BATX: "https://calendar.google.com/calendar/ical/ioc.cat_7fqpufpt2a59n9usn3kkta6h5o%40group.calendar.google.com/public/basic.ics", 
					 Custom: "https://"};

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
			onChange={(event) => {this.props.changeProperty("selectedCalendar", event.target.value);}}>
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

