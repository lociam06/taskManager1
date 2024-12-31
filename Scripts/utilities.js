function dNone(elem){
    elem.classList.remove("d-block");
    elem.classList.add("d-none");
}
function removeDNone(elem){
    elem.classList.remove("d-none");
}

export {dNone, removeDNone};