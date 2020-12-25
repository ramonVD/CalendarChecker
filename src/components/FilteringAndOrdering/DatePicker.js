import React from "react";
import YesNoUseLinkedElement from "../generic/YesNoUseLinkedElement";

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