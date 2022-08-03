function init() {
    /* 
        DESCRIPTION: Inicializa los elementos del html.
    */
    let btn_select = document.getElementById("btn-select")
    btn_select.addEventListener("click", select_warrior)

}


function select_warrior() {
    /* 
        DESCRIPTION: Selecciona el personaje del jugador.
    */
    let rd_knight = document.getElementById("rd-knight")
    let rd_archer = document.getElementById("rd-archer")
    let rd_mage = document.getElementById("rd-mage")
    let warrior_selected = ""

    if (rd_knight.checked) {
        warrior_selected = "Caballero"
    } else if (rd_archer.checked) {
        warrior_selected = "Arquero"
    } else if (rd_mage.checked) {
        warrior_selected = "Mago"
    }
    alert("Has seleccionado al " + warrior_selected)
}


window.addEventListener("load", init)