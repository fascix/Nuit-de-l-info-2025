const button = document.getElementById('openButton');
const containerPrincipal = document.getElementById('containerPrincipal');
const hiddenContent = document.getElementById('hiddenContent');

button.addEventListener('click', function() {
    containerPrincipal.classList.add('open');

    setTimeout(() => {
        hiddenContent.classList.add('revealed');
    }, 2500);


});