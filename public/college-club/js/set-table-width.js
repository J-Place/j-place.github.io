    function setTableWidth() {
        const windowWidth = window.innerWidth;
        const container = document.querySelector('.ccs-records table');
        container.style.width = `${windowWidth}px`;
    }
    window.addEventListener('load', setTableWidth);
    window.addEventListener('resize', setTableWidth);