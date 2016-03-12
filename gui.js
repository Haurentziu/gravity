var showPanel = true;

function tooglePanel(){
	showPanel = !showPanel;
	var panel = document.getElementById("settingsPanel");
	var button = document.getElementById("showPanelButton");
	if(showPanel){
		panel.classList.remove("hidePanel");
		button.value = "Hide";
	}
	else{
		panel.classList.add("hidePanel");
		button.value = "Control Panel";
	}
}