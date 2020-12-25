import React from "react";
import DatePicker from "./DatePicker";
import WordSelector from "./WordSelector";

class FilteringOptions extends React.PureComponent {

	render() {

			return (
				<div className="mb-1 mt-1">
				<p className="text-center">Filtres aplicats al llistat d'events</p>
				<div className="row mb-0">
					<div className="col">
		  			  	<DatePicker label="Data inicial:" active={this.props.filteringByStartDate} date={this.props.startDate} key="startDate"
		  			  	callback={this.props.changeProperty} callbackProperty={"startDate"}  />
					</div>
					<div className="col">
						<DatePicker label="Data final:" active={this.props.filteringByEndDate} date={this.props.endDate} key="endDate"
						callback={this.props.changeProperty} changingProperty={"endDate"} />
						<div className="form-check form-switch">
					</div>
					</div>
				</div>
				<div className="row">
					<div className="col mb-1">
						<WordSelector label="Conté paraules clau:" words={this.props.words}
						active={this.props.filteringByWords} callback={this.props.changeProperty}/>
					</div>
				</div>
			</div>
			);
	}

}

export default FilteringOptions;