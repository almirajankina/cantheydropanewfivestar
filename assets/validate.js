const uname = document.querySelector("#user");
const name1 = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPass = document.querySelector("#Cpassword");
const submitbtn = document.querySelector("#submit");

const nameError = document.querySelector("#nameError");
const uNameError = document.querySelector("#uNameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const cPasswordError = document.querySelector("#cPasswordError");

let validate = [1, 1, 1, 1, 1];

const regname = /^[a-zA-Z][a-zA-Z][a-zA-Z ]*$/;
const regmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

submitbtn.addEventListener("click", () => {
  if (uname.value == "") {
    uNameError.textContent = "Provide a username";
  }
  if (name1.value == "") {
    nameError.textContent = "Provide your name";
  }
  if (email.value == "") {
    emailError.textContent = "Provide your email";
  }
  if (password.value == "") {
    passwordError.textContent = "Create a password";
  }
  if (confirmPass.value == "") {
    cPasswordError.textContent = "Confirm your password";
  }
});

uname.addEventListener("focusout", () => {
  if (uname.value == "") {
    uNameError.textContent = "Provide a username";
    validate[0] = 0;
  } else if (uname.value.match(regname) != uname.value) {
    uNameError.textContent = "Provide a proper name";
    validate[0] = 0;
  } else {
    uNameError.textContent = "";
    validate[0] = 1;
  }
});

email.addEventListener("focusout", () => {
  if (email.value == "") {
    emailError.textContent = "Provide your email";
    validate[1] = 0;
  } else if (email.value.match(regmail) != email.value) {
    emailError.textContent = "Provide a proper Email";
    validate[1] = 0;
  } else {
    emailError.textContent = "";
    validate[1] = 1;
  }
});

name1.addEventListener("focusout", () => {
  if (name1.value == "") {
    nameError.textContent = "Provide your name";
    validate[2] = 0;
  } else if (name1.value.length < 2) {
    nameError.textContent = "Provide a proper name";
    validate[2] = 0;
  } else {
    nameError.textContent = "";
    validate[2] = 1;
  }
});

password.addEventListener("focusout", () => {
  if (password.value == "") {
    passwordError.textContent = "Create a password";
    validate[3] = 0;
  } else if (password.value.length < 6) {
    passwordError.textContent = "Atleast 6 charecters required";
    validate[3] = 0;
  } else {
    passwordError.textContent = "";
    validate[3] = 1;
  }
});

confirmPass.addEventListener("focusout", () => {
  if (confirmPass.value == "") {
    cPasswordError.textContent = "Confirm your password";
    validate[4] = 0;
  } else if (confirmPass.value != password.value) {
    cPasswordError.textContent = "Passwords dont match";
    validate[4] = 0;
  } else {
    cPasswordError.textContent = "";
    validate[4] = 1;
  }
});

$("#submit-form").submit((e) => {
  let sum = validate.reduce(function (a, b) {
    return a + b;
  }, 0);
  console.log("in ajax");
  console.log(sum);
  e.preventDefault();
  if (sum == 5) {
    sum = 0;
    $.ajax({
      url: "/route/register",
      data: $("#submit-form").serialize(),
      method: "post",
      success: function (response) {
        if (response.result == "redirect") {
          window.location.replace(response.url);
        }
      },
      error: function (err) {
        console.log(err.message);
      },
    });
  }
});
