
// const articleSignupBtn = document.getElementById("sign-up__button");
// articleSignupBtn.addEventListener("click", toggleSignup);
const signupTarget = document.getElementsByClassName("sign-up--inline");
signupTarget[0].addEventListener("click", toggleSignup);

function toggleSignup() {    
    const signupContainer = document.getElementsByClassName("sign-up__container");
    const signupSuccess = document.getElementsByClassName("sign-up__confirmation");
    if (signupContainer[0].style.display === "block") {
        signupContainer[0].style.display = "none";
        signupSuccess[0].style.display = "block";
    } else {
        signupContainer[0].style.display = "block";
        signupSuccess[0].style.display = "none";
    }
}
