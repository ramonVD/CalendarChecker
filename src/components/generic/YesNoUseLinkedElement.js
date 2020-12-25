import React from "react";
import "../../styles/YesNoUseLinkedElement.css";

class YesNoUseLinkedElement extends React.PureComponent {

	render() {
		const yesNoClass = this.props.active ? " btn-success" : " btn-danger";
		const extraClasses = (this.props.extraClasses === undefined) ? "" : this.props.extraClasses;
		const callback = (this.props.callback === undefined) ? () => {} : this.props.callback;
		const text = (this.props.active) ? "ON" : " OFF";
		return <button className={"btn btn-sm" + yesNoClass + extraClasses} onClick={callback}>{text}</button>
	}

}

export default YesNoUseLinkedElement;