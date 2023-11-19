function showpw(){
    var x = document.getElementById("register-pw");
    if(x.type=="password"){
        x.type="text";
    }else{
        x.type="password";
    }
}

const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

    if(toggle && nav){
        toggle.addEventListener('click', () =>{
            nav.classList.toggle('show');
            toggle.classList.toggle('bx-x');
        })
    }
}

showMenu('header-toggle','nav-menu');

/*active and reomve menu*/
const navLink = document.getElementById('.nav-link');

function linkAction(){
    navLink.forEach(n => n.classList.remove('active'));
    this.classList.add('active');
}


function thank(){
    location.reload();
    alert("Thank you!");
}