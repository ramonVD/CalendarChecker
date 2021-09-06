import React from "react";
import {savePropertyCookie} from "../utils/CookieFunctions";

/*Generates the options for ordering and some simple filtering of events, basically the "right side"
of the options menu*/

class OrderingOptions extends React.PureComponent {

	render() {
		const orderingByInitialDate = this.props.options.orderingByInitialDate;
		const orderingAsc = this.props.options.orderingAsc;
		const provaValidacio = this.props.options.provaValidacio;
		const acceptWrongEndDate = this.props.options.acceptWrongEndDate;
		const notShowingYear = this.props.options.notShowingYear;
		const addEmptySpaceEndLine = this.props.options.addEmptySpaceEndLine;
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
				<div className="form-check radioRow" title="Mostra la prova de validació a la taula">
					<label className="form-check-label" htmlFor="provaValidacio">Mostra prova validació&nbsp;&nbsp;&nbsp;</label>
					<div className="form-check form-check-inline">
					  <input className="form-check-input" type="radio" id="provaValidacioC" checked={provaValidacio === "0"}
					  onChange={ () => {savePropertyCookie("provaValidacio", "0");
					  					this.props.changeProperty("provaValidacio", "0");}}
					  				 />
					  <label className="form-check-label" htmlFor="inlineCheckbox1">Cap</label>
					</div>
					<div className="form-check form-check-inline">
					  <input className="form-check-input" type="radio" id="provaValidacioT" checked={provaValidacio === "1"}
					  onChange={ () => {savePropertyCookie("provaValidacio", "1");
					  					this.props.changeProperty("provaValidacio", "1");}} />
					  <label className="form-check-label" htmlFor="inlineCheckbox2">Telemàtica</label>
					</div>
					<div className="form-check form-check-inline">
					  <input className="form-check-input" type="radio" id="provaValidacioP"  checked={provaValidacio === "2"}
						onChange={ () => {savePropertyCookie("provaValidacio", "2");
					  					this.props.changeProperty("provaValidacio", "2");}} />
					  <label className="form-check-label" htmlFor="inlineCheckbox3">Presencial</label>
					</div>
				</div>
				<div className="row my-2" title="Hi ha events que no tenen data final, no per ser erronis sinó per com s'han creat.">
					<div className="form-check form-switch form-check-inline mx-1">
				 		<input className="form-check-input" type="checkbox" id="acceptWrongEndDate" checked={acceptWrongEndDate} 
					  onChange={() => {	savePropertyCookie("acceptWrongEndDate", !acceptWrongEndDate);
					  					this.props.changeProperty("acceptWrongEndDate", !acceptWrongEndDate);}} />
					  	<label className="form-check-label" htmlFor="acceptWrongEndDate">Inclou events amb dates finals no definides</label>
					</div>
				</div>
				<div className="row my-2" title="Per defecte al GES no es posa l'any.">
					<div className="form-check form-switch form-check-inline mx-1">
						<input className="form-check-input" type="checkbox" id="notShowingYear" checked={!notShowingYear} 
					  onChange={() => { savePropertyCookie("notShowingYear", !notShowingYear);
					  					this.props.changeProperty("notShowingYear", !notShowingYear);}} />
					  	<label className="form-check-label" htmlFor="notShowingYear">Inclou l'any al text de la taula</label>
					</div>
				</div>
								<div className="row my-2" title='Afegeix un espai en blanc al final del text de cada data de la taula. A vegades 
								el text generat està creat amb la idea que hi hagi aquests espais.'>
					<div className="form-check form-switch form-check-inline mb-3 mx-1">
						<input className="form-check-input" type="checkbox" id="addEmptySpaceEndLine" checked={addEmptySpaceEndLine} 
					  onChange={() => { savePropertyCookie("addEmptySpaceEndLine", !addEmptySpaceEndLine);
					  					this.props.changeProperty("addEmptySpaceEndLine", !addEmptySpaceEndLine);}} />
					  	<label className="form-check-label" htmlFor="addEmptySpaceEndLine">Afegeix un espai en blanc al final del text</label>
					</div>
				</div>
			</div>
			);
	}

}

export default OrderingOptions;