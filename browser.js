let main=async function() {
    var domBody=document.body;
    let heading=document.createElement("h1");
    heading.innerText="SpellCheckJS HTML Client";
    domBody.appendChild(heading);
    let initButton=document.createElement("button");
    initButton.innerText="Start";
    initButton.addEventListener("click", function() {
        let script=async function() {
            let fileRefs=await window.showOpenFilePicker();
            fileRefs.forEach(async function(fileRef) {
                window.fileRef=fileRef;
                let fileReadHandle=await fileRef.getFile();
                var fileText=await fileReadHandle.text();
                let dbFetch=await fetch("https://raw.githubusercontent.com/SpellCheckJS/SpellCheckJS/main/spellcheck.json");
                let dbJSON=await dbFetch.json();
                let fileTextOut=fileText;
                console.log(fileTextOut);
                Object.keys(dbJSON).forEach(entryName => {
                    let entry=dbJSON[entryName];
                    while(fileTextOut.includes(entryName)) {
                        fileTextOut=fileTextOut.replace(entryName,entry);
                        console.log(fileTextOut);
                    }
                    // This while loop is where the biggest risk is. With a malicious entry, a user could dOS clients by repetitively increasing input length. Thus the need for thorough submission review.
                });
                var fileWriteHandle=await fileRef.createWritable();
                fileWriteHandle.write(fileTextOut);
                fileWriteHandle.close();
            });
        };
        script();
    });
    domBody.appendChild(initButton);
};
main()