import React from "react";
import YesNoUseLinkedElement from "../generic/YesNoUseLinkedElement";

/*Element that lets you pick a list of words and be active or not (via the YesNo... element).
The words will be passed to state and used to filter events if its active*/
class WordSelector extends React.PureComponent {

	render() {
		const linkedProperties = ["words", "filteringByWords"];
		return (
				<div className="input-group">
						<span className="input-group-text flex-nowrap">{this.props.label}</span>
						<input type="text" className="form-control" placeholder="lliurament" value={this.props.words} disabled={!this.props.active}
						onChange={(event) => {this.props.callback(linkedProperties[0], event.target.value);}}/>
						<YesNoUseLinkedElement callback={() => {this.props.callback(linkedProperties[1], !this.props.active);}} active={this.props.active}/>
				</div>
			);
	}
}

export default WordSelector;