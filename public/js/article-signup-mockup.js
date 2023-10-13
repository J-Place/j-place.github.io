
const articleSignupBtn = document.getElementById("sign-up__button");
articleSignupBtn.addEventListener("click", toggleSignup);

function toggleSignup() {    
    const signupContainer = document.getElementsByClassName("sign-up__container");
    const signupSuccess = document.getElementsByClassName("sign-up__confirmation");
    // console.log(signupContainer[1]);
    if (signupContainer[0].style.display === "block") {
      signupContainer[0].style.display = "none";
      signupSuccess[0].style.display = "block";
        // console.log("Yes");
    } else {
      signupContainer[0].style.display = "block";
      signupSuccess[0].style.display = "none";
        // console.log("No");
    }
}
