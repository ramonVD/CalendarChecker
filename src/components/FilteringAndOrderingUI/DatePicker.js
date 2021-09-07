import React from "react";
import YesNoUseLinkedElement from "../genericElements/YesNoUseLinkedElement";

/*Element that lets you pick a date and be active or not (via the YesNo... element).
Date and active status will be passed to the ComponentDirector's state and used to filter events if its active.
LinkedProperties's second property is the one that regulates the usage or not of the filter, toggled when the YesNoButton is clicked*/
class DatePicker extends React.PureComponent{

	render() {
		const linkedProperties = (this.props.callbackProperty === "startDate") ? ["startDate", "filteringByStartDate"] : ["endDate", "filteringByEndDate"];
		return (
			<div className="input-group flex-nowrap mb-3">
			<span className="input-group-text" id="basic-addon1">{this.props.label}</span>
			<input type="date" className="form-control" value={this.props.date} min="2009/12/12" disabled={!this.props.active}
				onChange={(event) => {this.props.callback(linkedProperties[0], event.target.value);}} />
		 	<YesNoUseLinkedElement callback={() => {this.props.callback(linkedProperties[1], !this.props.active);}} active={this.props.active}/>
			</div>);
	}
}


export default DatePicker;