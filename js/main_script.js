var xhttpHeader = new XMLHttpRequest();
xhttpHeader.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        document.getElementById("header_container").innerHTML = this.responseText;
    }
};
xhttpHeader.open("GET", "/header", true);
xhttpHeader.send();