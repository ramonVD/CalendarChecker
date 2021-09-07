import React from "react";
import DatePicker from "./DatePicker";
import WordSelector from "./WordSelector";

/*Generates the filter UI, sets up the "filter by starting/ending date" options and 
the "filter if you find these words" option. Basically the "left side" of the
options menu*/
class FilteringPanel extends React.PureComponent {

	render() {

			return (
				<div className="mb-2 mt-1">
				<p className="text-center">Filtres aplicats als events</p>
				<div className="row">
					<div className="col">
		  			  	<DatePicker label="Data inici mín:" active={this.props.filteringByStartDate} date={this.props.startDate} key="startDate"
		  			  	callback={this.props.changeProperty} callbackProperty={"startDate"}  />
					</div>
				</div>
				<div className="row">
					<div className="col">
						<DatePicker label="Data acabament màx:" active={this.props.filteringByEndDate} date={this.props.endDate} key="endDate"
						callback={this.props.changeProperty} callbackProperty={"endDate"} />

					</div>
				</div>
				<div className="row">
					<div className="col">
						<WordSelector label="Conté paraules clau:" words={this.props.words}
						active={this.props.filteringByWords} callback={this.props.changeProperty}/>
					</div>
				</div>
			</div>
			);
	}

}

export default FilteringPanel;