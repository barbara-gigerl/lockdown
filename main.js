var currCounter;

var newImage = null;

function setFigure(path, caption)
{
    document.getElementById("curr").style.opacity = 0;
    document.getElementById("caption").style.opacity = 0;


    const fadeNewImageIn = (path, caption) => {
        document.getElementById("curr").setAttribute("src", "img/" + path);

        document.getElementById("caption").innerHTML = "";

        document.getElementById("caption").appendChild(caption[0]);
        if(caption.length > 1)
            document.getElementById("caption").appendChild(caption[1]);

        document.getElementById("curr").style.opacity = 1.0;
        document.getElementById("caption").style.opacity = 1.0;
    }
    newImage = new Image();
    newImage.style.position = "fixed";
    newImage.style.width = 1;
    newImage.style.height = 1;
    newImage.style.opacity = 0.01;
    newImage.style.pointerEvents = "none";
    newImage.id = "shadow_load";
    if (document.body.children[0].id === "shadow_load") {
        console.log("Remove");
        document.body.removeChild(document.body.children[0]);
    }

    document.body.prepend(newImage);

    const imgLoadPromise = new Promise((res, rej) => {
        console.log("Set path: ", path);
        newImage.src = "img/" + path;
        newImage.onload = () => {
            console.log("Loaded!", newImage.complete);
            res();
        };
    });

    const timeoutPromise = new Promise((res, rej) => {
        setTimeout(() => { 
            console.log("Timeout!");
            res(); }, 500);
    });

    Promise.all([imgLoadPromise, timeoutPromise]).then(() => {
        console.log("image loaded");
        document.getElementById("curr").setAttribute("src", "img/" + path);
        setTimeout(() => fadeNewImageIn(path, caption), 0);
    })
}

function setFigureFromImgDict(currCounter)
{
    img_data = img_dict[currCounter];
    path = img_data[0];

    if(img_data.length > 2)
    {
        src_div = document.createElement("div");
        src_div.setAttribute("id", "source");
        src_div.innerHTML = img_data[2];

        caption_text = document.createTextNode(img_data[1]);

        caption = [caption_text, src_div];

    }
    else {
        caption_text = document.createTextNode(img_data[1]);
        caption = [caption_text];
    }

    setFigure(path, caption);

    
}


function init()
{
    currCounter = 0;
    setFigureFromImgDict(currCounter);
    document.getElementById("prev").setAttribute("disabled", "true")
    

}


function next()
{
    currCounter = currCounter + 1;
    setFigureFromImgDict(currCounter);
    
    document.getElementById("prev").disabled=false;

    if(currCounter === (Object.keys(img_dict).length-1))
        document.getElementById("next").disabled = true; 
     
}

function prev()
{
    currCounter = currCounter - 1;
    setFigureFromImgDict(currCounter);


    document.getElementById("next").disabled = false;
    if(currCounter === 0)
        document.getElementById("prev").disabled = true;
}

function rescale()
{
  const img_size_h = window.innerHeight * (3/5);
  const img_size_w = img_size_h * (4/3);
  let padding = 0.0;
  if (img_size_w < window.innerWidth)
  {
    padding = 0.5 * (window.innerWidth - img_size_w);
  }
  console.log("Padding", padding);
  document.getElementById("caption").style.marginRight = padding+"px";
  document.getElementById("caption").style.marginLeft = padding+"px";
}

function imgLoadCallback() { 
    document.getElementById("curr").addEventListener("load", e => {
        const img = document.getElementById("curr");
        if (img.complete) {
            console.log("completed");
            imgLoadCallback();
        } else {
            console.log("Load event");
            imgLoadCallback();
        }
        document.getElementById("curr").style.opacity = 1;
    });
 }

window.addEventListener('resize', e => {rescale(); });
window.addEventListener('DOMContentLoaded', e => {rescale(); });

//window.addEventListener('DOMContentLoaded', e => imgLoadCallback()); 



window.addEventListener("keydown", e=> {
    if(e.key == "ArrowLeft") {
        if(currCounter !== 0)
            prev();
    }
    else if (e.key == "ArrowRight") {
        if(currCounter !== (Object.keys(img_dict).length-1))
            next();
    }
});


function imgClick() {
    console.log("imgClick");
    prev_btn = document.getElementById("prev");
    next_btn = document.getElementById("next");

    if(prev_btn.classList.contains("prev_next_hidden")) {
        prev_btn.classList.remove("prev_next_hidden");
        next_btn.classList.remove("prev_next_hidden")
    }
    else {
        prev_btn.classList.add("prev_next_hidden");
        next_btn.classList.add("prev_next_hidden");
    }

}


