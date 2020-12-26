import React from "react";

//should create a purecomponent for radios and checkboxes, or just a function to create em...

class OrderingOptions extends React.PureComponent {

	render() {
		const orderingByInitialDate = this.props.options.orderingByInitialDate;
		const orderingAsc = this.props.options.orderingAsc;
		const iocStyleTable = this.props.options.iocStyleTable;
		const acceptWrongEndDate = this.props.options.acceptWrongEndDate;
		return (
			<div className="container-fluid">
			<div className="row justify-content-end mt-1">
				<p className="text-center">Ordenació dels events</p>
			</div>
				<div className="row">
					<div className="col centeredInColumn">
						<div className="form-check">
						  <input className="form-check-input" type="radio" name="orderingDate" id="orderingDate1" checked={orderingByInitialDate}
						  onChange={() => {this.props.changeProperty("orderingByInitialDate", !orderingByInitialDate);}} />
						  <label className="form-check-label" htmlFor="orderingDate1">
						    Data inicial
						  </label>
						</div>
						<div className="form-check">
						  <input className="form-check-input" type="radio" name="orderingDate" id="orderingDate2"  checked={!orderingByInitialDate}
						  onChange={() => {this.props.changeProperty("orderingByInitialDate", !orderingByInitialDate);}} />
						  <label className="form-check-label" htmlFor="orderingDate2">
						    Data final
						  </label>
						</div>
					</div>
					<div className="col">
						<div className="form-check">
						  <input className="form-check-input" type="radio" name="orderingMode" id="orderingMode1" checked={orderingAsc}
						  onChange={() => {this.props.changeProperty("orderingAsc", !orderingAsc);}} />
						  <label className="form-check-label" htmlFor="orderingMode1">
						    Ascendent&nbsp;
						  </label>
						</div>
						<div className="form-check">
						  <input className="form-check-input" type="radio" name="orderingMode" id="orderingMode2"  checked={!orderingAsc}
						  onChange={() => {this.props.changeProperty("orderingAsc", !orderingAsc);}} />
						  <label className="form-check-label" htmlFor="orderingMode2">
						    Descendent
						  </label>
						</div>
					</div>
				</div>
				<div className="row my-2" title="Hi ha events que no tenen data final, no per ser erronis sinó per com s'han creat.">
					<div className="form-check form-switch form-check-inline mx-1">
				 		<input className="form-check-input" type="checkbox" id="acceptWrongEndDate" checked={acceptWrongEndDate} 
					  onChange={() => {this.props.changeProperty("acceptWrongEndDate", !acceptWrongEndDate);}} />
					  	<label className="form-check-label" htmlFor="acceptWrongEndDate">Inclou events amb dates finals no definides</label>
					</div>
				</div>
				<div className="row my-1" title="S'ajunten validació i publicació en una sola fila, si apareixen com events consecutius. Sempre posa les dates de manera ascendent.">
					<div className="form-check form-switch form-check-inline mb-3 mx-1">
						<input className="form-check-input" type="checkbox" id="iocStyleTable" checked={iocStyleTable} 
					  onChange={() => {this.props.changeProperty("iocStyleTable", !iocStyleTable);}} />
					  	<label className="form-check-label" htmlFor="iocStyleTable">Genera taula a l'estil GAM del GES</label>
					</div>
				</div>
			</div>
			);
	}

}

export default OrderingOptions;