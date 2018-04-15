
// =============================================================================================
// === Random Dungeon Generator (v 0.1.12 beta)                                               ===
// === Javascript Code and Interface Design by Mark A. Jindra                                ===
// === Room Descriptions by Matthew Sernett                                                  ===
// === (c) 2006 Wizards of the Coast, Inc., a Subsidary of Hasbro, Inc. All rights reserved. ===
// === (markjindra@hotmail.com)                                                              ===
// =============================================================================================

var NS = (document.layers) ? 1 : 0;
var NS6 = (document.getElementById) ? 1 : 0;
var IE = (document.all) ? 1 : 0;

var browser = navigator.appName;
var version = navigator.appVersion;
var bVer = browser + " " + version;

var xFilter = 1;
var xSeed = "";
var xSeed2 = "";

function loadData() {
    var seedvalue = document.form1.load.value;

    if (seedvalue != null && seedvalue != "") {
        var data = seedvalue.split(',');
        for (i = 0; (i < data.length); i++) {
            data[i] = unescape(data[i]);
        }
        document.form1.halllength.value = data[0];
        document.form1.dungeonrooms.value = data[1];
        document.form1.hallways.value = data[2];
        document.form1.size.value = data[3];
        document.form1.exits.value = data[4];
        document.form1.secretdoors.value = data[5];
        document.form1.portcullises.value = data[6];

        document.form1.skin.value = data[7];
        document.form1.startroomtype.value = data[8];
        document.form1.startexits.value = data[9];
        document.form1.grid.value = data[10];
        xSeed = data[11];
        document.form1.level.value = data[12];
        document.form1.map.value = data[13];
        xSeed2 = data[14];
        document.form1.details.value = data[15];
        xFilter = data[16];
        document.form1.theme.value = data[17];
        xSrcdata = data[18]

        if (xSrcdata.search(/C/i) >= 0) { document.form1.corebooks.checked = 1 } else { document.form1.corebooks.checked = 0 };
        if (xSrcdata.search(/2/i) >= 0) { document.form1.mm2.checked = 1 } else { document.form1.mm2.checked = 0 };
        if (xSrcdata.search(/3/i) >= 0) { document.form1.mm3.checked = 1 } else { document.form1.mm3.checked = 0 };
        if (xSrcdata.search(/4/i) >= 0) { document.form1.mm4.checked = 1 } else { document.form1.mm4.checked = 0 };
        if (xSrcdata.search(/F/i) >= 0) { document.form1.ff.checked = 1 } else { document.form1.ff.checked = 0 };
        if (xSrcdata.search(/X/i) >= 0) { document.form1.xph.checked = 1 } else { document.form1.xph.checked = 0 };
        if (xSrcdata.search(/P/i) >= 0) { document.form1.cpsi.checked = 1 } else { document.form1.cpsi.checked = 0 };
        if (xSrcdata.search(/H/i) >= 0) { document.form1.fci.checked = 1 } else { document.form1.fci.checked = 0 };
        if (xSrcdata.search(/L/i) >= 0) { document.form1.lm.checked = 1 } else { document.form1.lm.checked = 0 };
        if (xSrcdata.search(/A/i) >= 0) { document.form1.ab.checked = 1 } else { document.form1.ab.checked = 0 };

        document.form1.intro.value = data[19];
        document.form1.features.value = data[20];
        document.form1.traps.value = data[21];
        document.form1.hooks.value = data[22];
        document.form1.randenc.value = data[23];
        document.form1.advseed.value = data[24];

        alert("Save Value Loaded");
        sendData()
    }
}

function sendData() {

    var data = new Array();
    data[0] = document.form1.halllength.value;
    data[1] = document.form1.dungeonrooms.value;
    data[2] = document.form1.hallways.value;
    data[3] = document.form1.size.value;
    data[4] = document.form1.exits.value;
    data[5] = document.form1.secretdoors.value;
    data[6] = document.form1.portcullises.value;
    data[7] = document.form1.skin.value;
    data[8] = document.form1.startroomtype.value;
    data[9] = document.form1.startexits.value;
    data[10] = document.form1.grid.value;
    data[11] = xSeed;
    data[12] = document.form1.level.value;
    data[13] = document.form1.map.value;
    data[14] = xSeed2;
    data[15] = document.form1.details.value;
    data[16] = xFilter;
    data[17] = document.form1.theme.value;

    var srcdata = "";

    if (document.form1.corebooks.checked == 1) { srcdata += document.form1.corebooks.value };
    if (document.form1.mm2.checked == 1) { srcdata += document.form1.mm2.value };
    if (document.form1.mm3.checked == 1) { srcdata += document.form1.mm3.value };
    if (document.form1.mm4.checked == 1) { srcdata += document.form1.mm4.value };
    if (document.form1.ff.checked == 1) { srcdata += document.form1.ff.value };
    if (document.form1.xph.checked == 1) { srcdata += document.form1.xph.value };
    if (document.form1.cpsi.checked == 1) { srcdata += document.form1.cpsi.value };
    if (document.form1.fci.checked == 1) { srcdata += document.form1.fci.value };
    if (document.form1.lm.checked == 1) { srcdata += document.form1.lm.value };
    if (document.form1.ab.checked == 1) { srcdata += document.form1.ab.value };

    data[18] = srcdata;

    data[19] = document.form1.intro.value;
    data[20] = document.form1.features.value;
    data[21] = document.form1.traps.value;
    data[22] = document.form1.hooks.value;
    data[23] = document.form1.randenc.value;
    data[24] = document.form1.advseed.value;

    // alert (srcdata);

    //corebooks
    //mm2
    //mm3
    //mm4
    //ff
    //xph
    //cpsi
    //fci
    //lm

    // Initialize packed or we get the word 'undefined'
    var packed = "";
    for (i = 0; (i < data.length); i++) {
        if (i > 0) {
            packed += ",";
        }
        packed += escape(data[i]);
    }
    //alert("mapper.htm?" + packed);
    //  window.location = "mapper.htm?" + packed;
    pagedisp = "<a href=\"mapper.html?" + packed + "\" target=\"_blank\"><b>GENERATE</b></a>";

    display("generate", pagedisp);
}


// =======================================================

function display(id, str) {
    if (NS) {
        with (document[id].document) {
            open();
            write(str);
            close();
        }
    } else if (NS6) {
        document.getElementById(id).innerHTML = str;
    } else {
        document.all[id].innerHTML = str;
    }
}

//-->