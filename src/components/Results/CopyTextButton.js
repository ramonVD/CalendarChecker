import React from "react";


/*Button that lets you copy some linked (via id) text to the clipboard*/
class CopyTextButton extends React.PureComponent {
	render(){
		const linkedId = this.props.linkedId;
		const classNames = (this.props.classNames === undefined) ? "btn btn-link text-secondary copyTextButtonPos" : this.props.classNames;
		const btnText = (this.props.btnText === undefined) ? "Copia" : this.props.btnText;
		return (
			<button className={classNames} onClick={() => {
				let selectedContainer = document.getElementById(linkedId);
				if (selectedContainer === undefined || selectedContainer === null) { console.log("No existeix el text a copiar.");return; }
				var range = document.createRange();
                range.selectNode(selectedContainer);
                window.getSelection().removeAllRanges(); // clear current selection
                window.getSelection().addRange(range); // to select text
                document.execCommand("copy");
                window.getSelection().removeAllRanges();// to deselect text again
				createCopyingAviso();
			}}>
				{btnText}
			</button>
			);

	}
}


/*Creates an element with an animation that shows that the copying action has been performed.
NOT REALLY STATEFUL.... but effort*/
function createCopyingAviso() {
	let oldAviso = document.getElementById("copiedButton");
    if (oldAviso === undefined || oldAviso === null ) { 
	let aviso = document.createElement("div");
	aviso.classList.add("disappearingCopiedButton");
	aviso.setAttribute("id", "copiedButton");
	aviso.innerText = "Text copiat...";
	document.body.appendChild(aviso);
	setTimeout( ()  => { let copiedButton = document.getElementById("copiedButton");
						if (copiedButton !== null && copiedButton !== undefined) {
							document.body.removeChild(copiedButton);
						}}, 800);
	}
}

export default CopyTextButton;