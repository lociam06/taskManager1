const changeFormBtns = document.querySelectorAll(".changeFormBtn");
const formsContiner = document.querySelector("#forms");
const wraper = document.querySelector("#wraper");
let formActived = "loginForm";

/*Par los estilos de los formulrios*/
function activeRegistreForm(){
    wraper.classList.add("registreFormActive");
    wraper.classList.remove("loginFormActive");
    formsContiner.classList.add("registreFormActive");
    formsContiner.classList.remove("loginFormActive");
    formActived = "registreForm";
}
function activeLoginForm(){
    wraper.classList.add("loginFormActive");
    wraper.classList.remove("registreFormActive");
    formsContiner.classList.add("loginFormActive");
    formsContiner.classList.remove("registreFormActive");
    formActived = "loginForm";
}
changeFormBtns.forEach(btn => {
    btn.addEventListener("click", function(){
        console.log("yes")
        if(formActived == "loginForm") activeRegistreForm();
        else activeLoginForm();
    })
})

/*En caso de error al iniciar sesion o registrarse*/
window.onload = function() {
    //verifica si hay parametros en la url
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("formError");
    if (message) {
        if(message == "login"){
            let loginMesageError = document.querySelector("main #wraper #forms #loginForm .errorMessage");
            loginMesageError.classList.add("d-block");
            loginMesageError.classList.remove("d-none");

        }
        else if(message == "registre"){
            let nameMesageError = document.querySelector("main #wraper #forms #registerForm .nameErrorMessage");
            let emailMesageError = document.querySelector("main #wraper #forms #registerForm .emailErrorMessage");
            let passMesageError = document.querySelector("main #wraper #forms #registerForm .passErrorMessage");
            const errorMessage = urlParams.get('error');

            if(errorMessage == "user") displayError(nameMesageError);
            else if(errorMessage == "email") displayError(emailMesageError);
            else if(errorMessage == "dispearsPass") displayError(passMesageError);

            activeRegistreForm();
            function displayError(element){
                element.classList.add("d-block");
                element.classList.remove("d-none");
            }
        }
    }

    //Para auto iniciar seccion
    const autoLog = urlParams.get("autoLog");
    let userData;
    if(localStorage.getItem("userData") && autoLog != 'false'){
        let userDataJSON = localStorage.getItem("userData");
        userData = JSON.parse(userDataJSON); 
        const loginEmailInput = document.querySelector('#loginForm input[name="emailInput"]');
        const loginPassInput = document.querySelector('#loginForm input[name="passInput"]');
        loginEmailInput.value = userData.email;
        loginPassInput.value = userData.pass;
        const loginForm = document.getElementById("loginForm");
        loginForm.submit();
    }
};

//Guardar datos de inico de seccion
const loginSubmitButton = document.querySelector('#forms #loginForm button[type="submit"]');
loginSubmitButton.addEventListener("click", () =>{
    const emailInput = document.querySelector('#loginForm input[name="emailInput"]');
    const passInput = document.querySelector('#loginForm input[name="passInput"]');
    let userData = {
        email: emailInput.value,
        pass: passInput.value
    }
    let userDataJSON = JSON.stringify(userData); 
    localStorage.setItem("userData", userDataJSON);
});
    