var xhttpHeader = new XMLHttpRequest();
xhttpHeader.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        document.getElementById("header_container").innerHTML = this.responseText;
    }
};
xhttpHeader.open("GET", "/header", true);
xhttpHeader.send();

var xhttpSection = new XMLHttpRequest();
xhttpSection.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        document.getElementById("section_container").innerHTML = this.responseText;
    }
};
xhttpSection.open("GET", "/section", true);
xhttpSection.send();