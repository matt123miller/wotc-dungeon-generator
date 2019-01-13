
// =============================================================================================
// === Random Dungeon Generator (v 0.1.12 beta)                                              ===
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
var maxbooks = 11; // number of monster books + 1
var prevmons = 0;

var xTheme = "A";
var zTheme = "A"; // A=Any (Generic) C=Crypt S=Sewer  
var xSources = "C";
var zSources = "C";
var xCR = 1;
var xLevel = 1; // Dungeon Level
var xMap = 1;
var seedSelect = 0;

var xFilter = 1; // 1=Original
var zFilter = 1;
var xRoomHeigthMax = 6;
var xRoomWidthMax = 6;
var xRoomHeigthMin = 3;
var xRoomWidthMin = 3;
var zRoomWidthMin = 2;
var zRoomHeigthMin = 2
var zRoomWidthMax = 6;
var zRoomHeigthMax = 6;
var zHallLengthMin = 2;
var zHallLengthMax = 6;
var zExitsValue = 6;
var sExitsValue = 4; // 1-4 on this many sided die.
var zDungeonSize = 3;
var zHallPercentage = 50;
var zSkin = 0; // 0 = B&W ... 1 = Color
var zScrubPercent = 100 // remove hallyway doors this percent of the time
var zRoomSelect = 4; // 3=Random Small 4=Random Medium 5=Random Large
var zSeed = 0;
var zSeed2 = 0;
var zGrid = 0; // 0=on 1=off 
var zDetails = 0; // 0=on 1=off 
var zSecretDoorsValue = 1; // 0=none 1=some* 2=more
var zPortcullisesValue = 0;	// 0=none* 1=some 2=more
var zIntro = 0; // 0 = on 1 = off
var zfeatures = 0; // 0 = on 1 = off
var zTraps = 0; // 0 = on 1 = off
var zHooks = 3; // 0 = none 1-5 = amount
var zRandEnc = 0; // 0 = on 1 = off
var zAdvSeed = 0; // 0 = None 1 or higher is seed number.

var query = window.location.search;
if (query.substring(0, 1) == '?') {
    query = query.substring(1);
    var data = query.split(',');
    for (i = 0; (i < data.length); i++) {
        data[i] = unescape(data[i]);
    }
    zHallLengthMax = data[0];
    zRoomWidthMax = data[1];
    zRoomHeigthMax = data[1];
    zHallLengthMax = data[1];
    zHallPercentage = data[2];
    zDungeonSize = data[3];
    zExitsValue = data[4];
    zSecretDoorsValue = data[5];
    zPortcullisesValue = data[6];
    zSkin = data[7];
    zRoomSelect = data[8];
    sExitsValue = data[9];
    zGrid = data[10];
    zSeed = data[11];
    zLevel = data[12];
    zMap = data[13];
    zSeed2 = data[14];
    zDetails = data[15];
    zFilter = data[16];
    zTheme = data[17];
    zSources = data[18];
    zIntro = data[19];
    zFeatures = data[20];
    zTraps = data[21];
    zHooks = data[22];
    zRandEnc = data[23];
    zAdvSeed = data[24];
}

// =============================================   

// Have adventure seed make changes to some
// presets and load seed info into the adventure
// seed arrays

AdventureSeed(zAdvSeed);

// =============================================   

rnd.today = new Date();
rnd.seed = rnd.today.getTime();

rnd2.today = new Date();
rnd2.seed = rnd2.today.getTime();

if (zRoomSelect == 3) {
    xRoomHeigthMax = 3;
    xRoomWidthMax = 3;
}
if (zRoomSelect == 4) {
    xRoomHeigthMax = 6;
    xRoomWidthMax = 6;
}
if (zRoomSelect == 5) {
    xRoomHeigthMax = 8;
    xRoomWidthMax = 8;
}


if (zSeed.length > 2) {
    rnd.seed = zSeed;
}

if (zSeed2.length > 2) {
    rnd2.seed = zSeed2;
}


if (zLevel > 1) {
    xLevel = zLevel;
}

if (zMap >= 0) {
    xMap = zMap;
}

if (zFilter > 1) {
    xFilter = zFilter;
}

xTheme = zTheme;

xSources = zSources;

var chksrcs = new Array(0);

if (xSources.search(/C/i) >= 0) { chksrcs[0] = "C" } else { chksrcs[0] = "0" }
if (xSources.search(/2/i) >= 0) { chksrcs[1] = "2" } else { chksrcs[1] = "0" }
if (xSources.search(/3/i) >= 0) { chksrcs[2] = "3" } else { chksrcs[2] = "0" }
if (xSources.search(/4/i) >= 0) { chksrcs[3] = "4" } else { chksrcs[3] = "0" }
if (xSources.search(/F/i) >= 0) { chksrcs[4] = "F" } else { chksrcs[4] = "0" }
if (xSources.search(/X/i) >= 0) { chksrcs[5] = "X" } else { chksrcs[5] = "0" }
if (xSources.search(/P/i) >= 0) { chksrcs[6] = "P" } else { chksrcs[6] = "0" }
if (xSources.search(/H/i) >= 0) { chksrcs[7] = "H" } else { chksrcs[7] = "0" }
if (xSources.search(/L/i) >= 0) { chksrcs[8] = "L" } else { chksrcs[8] = "0" }
if (xSources.search(/A/i) >= 0) { chksrcs[9] = "A" } else { chksrcs[9] = "0" }

// alert(chksrcs)

xCR = Math.floor(xLevel * .5);
if (xCR <= 0) {
    xCR = 1;
}
// alert(xCR);

xSaveValue2 = "";
xSaveValue2 += zHallLengthMax + ",";
xSaveValue2 += zRoomWidthMax + ",";
xSaveValue2 += zHallPercentage + ",";
xSaveValue2 += zDungeonSize + ",";
xSaveValue2 += zExitsValue + ",";
xSaveValue2 += zSecretDoorsValue + ",";
xSaveValue2 += zPortcullisesValue + ",";
xSaveValue2 += zSkin + ",";
xSaveValue2 += zRoomSelect + ",";
xSaveValue2 += sExitsValue + ",";
xSaveValue2 += zGrid + ",";
xSaveValue2 += rnd.seed + ",";
xSaveValue2 += xLevel + ",";
xSaveValue2 += xMap + ",,";
xSaveValue2 += zDetails + ",";
xSaveValue2 += xFilter + ",";
xSaveValue2 += xTheme + ",";
xSaveValue2 += xSources + ",";
xSaveValue2 += zIntro + ",";
xSaveValue2 += zFeatures + ",";
xSaveValue2 += zTraps + ",";
xSaveValue2 += zHooks + ",";
xSaveValue2 += zRandEnc + ",";
xSaveValue2 += zAdvSeed;

xSaveValue2a = "";
xSaveValue2a += zHallLengthMax + ",";
xSaveValue2a += zRoomWidthMax + ",";
xSaveValue2a += zHallPercentage + ",";
xSaveValue2a += zDungeonSize + ",";
xSaveValue2a += zExitsValue + ",";
xSaveValue2a += zSecretDoorsValue + ",";
xSaveValue2a += zPortcullisesValue + ",";
xSaveValue2a += zSkin + ",";
xSaveValue2a += zRoomSelect + ",";
xSaveValue2a += sExitsValue + ",";
xSaveValue2a += zGrid + ",";
xSaveValue2a += rnd.seed + ",";
xSaveValue2a += xLevel + ",";
xSaveValue2a += "1,,";
xSaveValue2a += zDetails + ",";
xSaveValue2a += xFilter + ",";
xSaveValue2a += xTheme + ",";
xSaveValue2a += xSources + ",";
xSaveValue2a += zIntro + ",";
xSaveValue2a += zFeatures + ",";
xSaveValue2a += zTraps + ",";
xSaveValue2a += zHooks + ",";
xSaveValue2a += zRandEnc + ",";
xSaveValue2a += zAdvSeed;

xSaveValue2b = "";
xSaveValue2b += zHallLengthMax + ",";
xSaveValue2b += zRoomWidthMax + ",";
xSaveValue2b += zHallPercentage + ",";
xSaveValue2b += zDungeonSize + ",";
xSaveValue2b += zExitsValue + ",";
xSaveValue2b += zSecretDoorsValue + ",";
xSaveValue2b += zPortcullisesValue + ",";
xSaveValue2b += zSkin + ",";
xSaveValue2b += zRoomSelect + ",";
xSaveValue2b += sExitsValue + ",";
xSaveValue2b += zGrid + ",";
xSaveValue2b += rnd.seed + ",";
xSaveValue2b += xLevel + ",";
xSaveValue2b += "0,,";
xSaveValue2b += zDetails + ",";
xSaveValue2b += xFilter + ",";
xSaveValue2b += xTheme + ",";
xSaveValue2b += xSources + ",";
xSaveValue2b += zIntro + ",";
xSaveValue2b += zFeatures + ",";
xSaveValue2b += zTraps + ",";
xSaveValue2b += zHooks + ",";
xSaveValue2b += zRandEnc + ",";
xSaveValue2b += zAdvSeed;

xSaveValue = "";
xSaveValue += zHallLengthMax + ",";
xSaveValue += zRoomWidthMax + ",";
xSaveValue += zHallPercentage + ",";
xSaveValue += zDungeonSize + ",";
xSaveValue += zExitsValue + ",";
xSaveValue += zSecretDoorsValue + ",";
xSaveValue += zPortcullisesValue + ",";
xSaveValue += zSkin + ",";
xSaveValue += zRoomSelect + ",";
xSaveValue += sExitsValue + ",";
xSaveValue += zGrid + ",";
xSaveValue += rnd.seed + ",";
xSaveValue += xLevel + ",";
xSaveValue += xMap + ",";
xSaveValue += rnd2.seed + ",";
xSaveValue += zDetails + ",";
xSaveValue += xFilter + ",";
xSaveValue += xTheme + ",";
xSaveValue += xSources + ",";
xSaveValue += zIntro + ",";
xSaveValue += zFeatures + ",";
xSaveValue += zTraps + ",";
xSaveValue += zHooks + ",";
xSaveValue += zRandEnc + ",";
xSaveValue += zAdvSeed;

// =======================================================

function rnd() {
    rnd.seed = (rnd.seed * 9301 + 49297) % 233280;
    return rnd.seed / (233280.0);
}

function rnd2() {
    rnd2.seed = (rnd2.seed * 9301 + 49297) % 233280;
    return rnd2.seed / (233280.0);
}

function rand(number) {
    if (seedSelect == 0) {
        return Math.floor(rnd() * number);
    }
    if (seedSelect == 1) {
        return Math.floor(rnd2() * number);
    }
}

// =======================================================

function setCharts() {

    setmephits() // Reset mephits



    // Treasure -- Table:3-5 Coins
    cht = (Table305Coins.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table305Coins[r] <= xFilter && Table305Coins[r + 1] == xLevel) {
                cpercent = Table305Coins[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table305CoinsFiltered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Treasure -- Table:3-5 Goods
    cht = (Table305Goods.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table305Goods[r] <= xFilter && Table305Goods[r + 1] == xLevel) {
                cpercent = Table305Goods[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table305GoodsFiltered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Treasure -- Table:3-5 Items
    cht = (Table305Items.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table305Items[r] <= xFilter && Table305Items[r + 1] == xLevel) {
                cpercent = Table305Items[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table305ItemsFiltered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Treasure -- Table:3-6 Gems
    cht = (Table306Gems.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table306Gems[r] <= xFilter) {
                cpercent = Table306Gems[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table306GemsFiltered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Treasure -- Table:3-7 Art
    cht = (Table307Art.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table307Art[r] <= xFilter) {
                cpercent = Table307Art[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table307ArtFiltered[t] = chx
                    t += 1
                }
            }
        }
    }



    // Treasure -- Table:3-8 Alchemy
    cht = (Table308Alchemy.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table308Alchemy[r] <= xFilter) {
                cpercent = Table308Alchemy[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table308AlchemyFiltered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Treasure -- Table:3-8 Armor
    cht = (Table308Armor.length - 1) / 4
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 3; q++) {
            r = (chx * 4) + q
            if (q == 0 && Table308Armor[r] <= xFilter) {
                cpercent = Table308Armor[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table308ArmorFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Treasure -- Table:3-8 Weapons
    cht = (Table308Weapons.length - 1) / 4
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 3; q++) {
            r = (chx * 4) + q
            if (q == 0 && Table308Weapons[r] <= xFilter) {
                cpercent = Table308Weapons[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table308WeaponsFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Treasure -- Table:3-8 Gear
    cht = (Table308Gear.length - 1) / 4
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 3; q++) {
            r = (chx * 4) + q
            if (q == 0 && Table308Gear[r] <= xFilter) {
                cpercent = Table308Gear[r + 2] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table308GearFiltered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Random Door Types -- Table:3-17
    // creates a list of base table values equal to the starting position in that array
    cht = (Table317RandomDoorTypes.length - 1) / 9
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 8; q++) {
            r = (chx * 9) + q
            if (q == 0 && Table317RandomDoorTypes[r] <= xFilter) {
                cpercent = Table317RandomDoorTypes[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table317Filtered[t] = chx
                    t += 1
                }
            }
        }
    }

    // special door reroll table 	
    cht = (Table317RandomDoorTypes.length - 1) / 9
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 8; q++) {
            r = (chx * 9) + q
            if (q == 0 && Table317RandomDoorTypes[r] <= xFilter && Table317RandomDoorTypes[r + 8] == 0) {
                cpercent = Table317RandomDoorTypes[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table317Reroll[t] = chx
                    t += 1
                }
            }
        }
    }


    // Table 319 Filtered	
    cht = (Table319RandomTraps.length - 1) / 6
    cCR = 1
    if (xCR >= 4) {
        cCR = xCR - 1;
    }
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 5; q++) {
            r = (chx * 6) + q
            if (q == 0 && Table319RandomTraps[r] <= xFilter && Table319RandomTraps[r + 2] == xTheme && Table319RandomTraps[r + 5] >= cCR && Table319RandomTraps[r + 5] <= xCR) {
                cpercent = Table319RandomTraps[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table319Filtered[t] = chx
                    t += 1
                }
            }
        }
    }



    // Table 318 Filtered	
    cht = (Table318RandomContents.length - 1) / 8
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 7; q++) {
            r = (chx * 8) + q
            if (q == 0 && Table318RandomContents[r] <= xFilter && Table318RandomContents[r + 2] == xTheme) {
                cpercent = Table318RandomContents[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table318Filtered[t] = chx
                    t += 1
                }
            }
        }
    }


    //	alert(Table317Filtered);
    //	alert(t);

    // Room Descriptions
    cht = (aRandRoomDesc.length - 1) / 5
    p0 = 0
    p1 = 0
    p2 = 0
    p3 = 0
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 4; q++) {
            r = (chx * 5) + q
            if (q == 0 && aRandRoomDesc[r] <= xFilter && aRandRoomDesc[r + 2] == xTheme) {
                if (aRandRoomDesc[r + 1] == 0) {
                    aRandRoomDescTinyFiltered[p0] = aRandRoomDesc[r + 3]
                    aRandRoomNoteTinyFiltered[p0] = aRandRoomDesc[r + 4]
                    p0 += 1;
                }
                if (aRandRoomDesc[r + 1] == 1) {
                    aRandRoomDescSmallFiltered[p1] = aRandRoomDesc[r + 3]
                    aRandRoomNoteSmallFiltered[p1] = aRandRoomDesc[r + 4]
                    p1 += 1;
                }
                if (aRandRoomDesc[r + 1] == 2) {
                    aRandRoomDescMediumFiltered[p2] = aRandRoomDesc[r + 3]
                    aRandRoomNoteMediumFiltered[p2] = aRandRoomDesc[r + 4]
                    p2 += 1;
                }
                if (aRandRoomDesc[r + 1] == 3) {
                    aRandRoomDescLargeFiltered[p3] = aRandRoomDesc[r + 3]
                    aRandRoomNoteLargeFiltered[p3] = aRandRoomDesc[r + 4]
                    p3 += 1;
                }
            }
        }
    }


    // Minor Features Filtered	3-12
    cht = (Table312.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 49; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table312[r] <= xFilter && Table312[r + 2] == xTheme) {
                cpercent = Table312[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table312Filtered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Major Features Filtered	3-11
    cht = (Table311.length - 1) / 5
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 49; q++) {
            r = (chx * 5) + q
            if (q == 0 && Table311[r] <= xFilter && Table311[r + 2] == xTheme) {
                cpercent = Table311[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    Table311Filtered[t] = chx
                    t += 1
                }
            }
        }
    }


    // Monster Level One Filtered	
    cht = (MonstersLevelOne.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelOne[r] <= xFilter && MonstersLevelOne[r + 2] == xTheme && checkSource(MonstersLevelOne[r + 3]) == 1) {
                cpercent = MonstersLevelOne[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelOneFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level One Filtered -- No Reroll Chart	
    cht = (MonstersLevelOne.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelOne[r] <= xFilter && MonstersLevelOne[r + 2] == xTheme && MonstersLevelOne[r + 9] == 0 && checkSource(MonstersLevelOne[r + 3]) == 1) {
                cpercent = MonstersLevelOne[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelOneNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level One Wandering 	
    cht = (MonstersLevelOne.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelOne[r] <= xFilter && MonstersLevelOne[r + 2] == xTheme && MonstersLevelOne[r + 9] == 0 && checkSource(MonstersLevelOne[r + 3]) == 1) {
                MonstersLevelOneWandering[t] = chx
                t += 1
            }
        }
    }


    // Monster Level Two Filtered	
    cht = (MonstersLevelTwo.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwo[r] <= xFilter && MonstersLevelTwo[r + 2] == xTheme && checkSource(MonstersLevelTwo[r + 3]) == 1) {
                cpercent = MonstersLevelTwo[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTwoFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Two Filtered -- No Reroll Chart	
    cht = (MonstersLevelTwo.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwo[r] <= xFilter && MonstersLevelTwo[r + 2] == xTheme && MonstersLevelTwo[r + 9] == 0 && checkSource(MonstersLevelTwo[r + 3]) == 1) {
                cpercent = MonstersLevelTwo[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTwoNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Two Wandering 	
    cht = (MonstersLevelTwo.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwo[r] <= xFilter && MonstersLevelTwo[r + 2] == xTheme && MonstersLevelTwo[r + 9] == 0 && checkSource(MonstersLevelTwo[r + 3]) == 1) {
                MonstersLevelTwoWandering[t] = chx
                t += 1
            }
        }
    }


    // Monster Level Three Filtered	
    cht = (MonstersLevelThree.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelThree[r] <= xFilter && MonstersLevelThree[r + 2] == xTheme && checkSource(MonstersLevelThree[r + 3]) == 1) {
                cpercent = MonstersLevelThree[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelThreeFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Three Filtered -- No Reroll Chart	
    cht = (MonstersLevelThree.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelThree[r] <= xFilter && MonstersLevelThree[r + 2] == xTheme && MonstersLevelThree[r + 9] == 0 && checkSource(MonstersLevelThree[r + 3]) == 1) {
                cpercent = MonstersLevelThree[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelThreeNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Three Wandering 	
    cht = (MonstersLevelThree.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelThree[r] <= xFilter && MonstersLevelThree[r + 2] == xTheme && MonstersLevelThree[r + 9] == 0 && checkSource(MonstersLevelThree[r + 3]) == 1) {
                MonstersLevelThreeWandering[t] = chx
                t += 1
            }
        }
    }


    // Monster Level Four Filtered	
    cht = (MonstersLevelFour.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFour[r] <= xFilter && MonstersLevelFour[r + 2] == xTheme && checkSource(MonstersLevelFour[r + 3]) == 1) {
                cpercent = MonstersLevelFour[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFourFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Four Filtered -- No Reroll Chart	
    cht = (MonstersLevelFour.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFour[r] <= xFilter && MonstersLevelFour[r + 2] == xTheme && MonstersLevelFour[r + 9] == 0 && checkSource(MonstersLevelFour[r + 3]) == 1) {
                cpercent = MonstersLevelFour[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFourNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Four Wandering 	
    cht = (MonstersLevelFour.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFour[r] <= xFilter && MonstersLevelFour[r + 2] == xTheme && MonstersLevelFour[r + 9] == 0 && checkSource(MonstersLevelFour[r + 3]) == 1) {
                MonstersLevelFourWandering[t] = chx
                t += 1
            }
        }
    }


    // Monster Level Five Filtered	
    cht = (MonstersLevelFive.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFive[r] <= xFilter && MonstersLevelFive[r + 2] == xTheme && checkSource(MonstersLevelFive[r + 3]) == 1) {
                cpercent = MonstersLevelFive[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFiveFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Five Filtered -- No Reroll Chart	
    cht = (MonstersLevelFive.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFive[r] <= xFilter && MonstersLevelFive[r + 2] == xTheme && MonstersLevelFive[r + 9] == 0 && checkSource(MonstersLevelFive[r + 3]) == 1) {
                cpercent = MonstersLevelFive[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFiveNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Five Wandering 	
    cht = (MonstersLevelFive.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFive[r] <= xFilter && MonstersLevelFive[r + 2] == xTheme && MonstersLevelFive[r + 9] == 0 && checkSource(MonstersLevelFive[r + 3]) == 1) {
                MonstersLevelFiveWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Six Filtered	
    cht = (MonstersLevelSix.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSix[r] <= xFilter && MonstersLevelSix[r + 2] == xTheme && checkSource(MonstersLevelSix[r + 3]) == 1) {
                cpercent = MonstersLevelSix[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSixFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Six Filtered -- No Reroll Chart	
    cht = (MonstersLevelSix.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSix[r] <= xFilter && MonstersLevelSix[r + 2] == xTheme && MonstersLevelSix[r + 9] == 0 && checkSource(MonstersLevelSix[r + 2]) == 1) {
                cpercent = MonstersLevelSix[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSixNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Six Wandering 	
    cht = (MonstersLevelSix.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSix[r] <= xFilter && MonstersLevelSix[r + 2] == xTheme && MonstersLevelSix[r + 9] == 0 && checkSource(MonstersLevelSix[r + 3]) == 1) {
                MonstersLevelSixWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Seven Filtered	
    cht = (MonstersLevelSeven.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSeven[r] <= xFilter && MonstersLevelSeven[r + 2] == xTheme && checkSource(MonstersLevelSeven[r + 3]) == 1) {
                cpercent = MonstersLevelSeven[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSevenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Seven Filtered -- No Reroll Chart	
    cht = (MonstersLevelSeven.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSeven[r] <= xFilter && MonstersLevelSeven[r + 2] == xTheme && MonstersLevelSeven[r + 9] == 0 && checkSource(MonstersLevelSeven[r + 3]) == 1) {
                cpercent = MonstersLevelSeven[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSevenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Seven Wandering 	
    cht = (MonstersLevelSeven.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSeven[r] <= xFilter && MonstersLevelSeven[r + 2] == xTheme && MonstersLevelSeven[r + 9] == 0 && checkSource(MonstersLevelSeven[r + 3]) == 1) {
                MonstersLevelSevenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Eight Filtered	
    cht = (MonstersLevelEight.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEight[r] <= xFilter && MonstersLevelEight[r + 2] == xTheme && checkSource(MonstersLevelEight[r + 3]) == 1) {
                cpercent = MonstersLevelEight[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelEightFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Eight Filtered -- No Reroll Chart	
    cht = (MonstersLevelEight.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEight[r] <= xFilter && MonstersLevelEight[r + 2] == xTheme && MonstersLevelEight[r + 9] == 0 && checkSource(MonstersLevelEight[r + 3]) == 1) {
                cpercent = MonstersLevelEight[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelEightNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Eight Wandering 	
    cht = (MonstersLevelEight.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEight[r] <= xFilter && MonstersLevelEight[r + 2] == xTheme && MonstersLevelEight[r + 9] == 0 && checkSource(MonstersLevelEight[r + 3]) == 1) {
                MonstersLevelEightWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Nine Filtered	
    cht = (MonstersLevelNine.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelNine[r] <= xFilter && MonstersLevelNine[r + 2] == xTheme && checkSource(MonstersLevelNine[r + 3]) == 1) {
                cpercent = MonstersLevelNine[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelNineFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Nine Filtered -- No Reroll Chart	
    cht = (MonstersLevelNine.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelNine[r] <= xFilter && MonstersLevelNine[r + 2] == xTheme && MonstersLevelNine[r + 9] == 0 && checkSource(MonstersLevelNine[r + 3]) == 1) {
                cpercent = MonstersLevelNine[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelNineNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Nine Wandering 	
    cht = (MonstersLevelNine.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelNine[r] <= xFilter && MonstersLevelNine[r + 2] == xTheme && MonstersLevelNine[r + 9] == 0 && checkSource(MonstersLevelNine[r + 3]) == 1) {
                MonstersLevelNineWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Ten Filtered	
    cht = (MonstersLevelTen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTen[r] <= xFilter && MonstersLevelTen[r + 2] == xTheme && checkSource(MonstersLevelTen[r + 3]) == 1) {
                cpercent = MonstersLevelTen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Ten Filtered -- No Reroll Chart	
    cht = (MonstersLevelTen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTen[r] <= xFilter && MonstersLevelTen[r + 2] == xTheme && MonstersLevelTen[r + 9] == 0 && checkSource(MonstersLevelTen[r + 3]) == 1) {
                cpercent = MonstersLevelTen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Ten Wandering 	
    cht = (MonstersLevelTen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTen[r] <= xFilter && MonstersLevelTen[r + 2] == xTheme && MonstersLevelTen[r + 9] == 0 && checkSource(MonstersLevelTen[r + 3]) == 1) {
                MonstersLevelTenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Eleven Filtered	
    cht = (MonstersLevelEleven.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEleven[r] <= xFilter && MonstersLevelEleven[r + 2] == xTheme && checkSource(MonstersLevelEleven[r + 3]) == 1) {
                cpercent = MonstersLevelEleven[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelElevenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Eleven Filtered -- No Reroll Chart	
    cht = (MonstersLevelEleven.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEleven[r] <= xFilter && MonstersLevelEleven[r + 2] == xTheme && MonstersLevelEleven[r + 9] == 0 && checkSource(MonstersLevelEleven[r + 3]) == 1) {
                cpercent = MonstersLevelEleven[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelElevenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Eleven Wandering 	
    cht = (MonstersLevelEleven.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEleven[r] <= xFilter && MonstersLevelEleven[r + 2] == xTheme && MonstersLevelEleven[r + 9] == 0 && checkSource(MonstersLevelEleven[r + 3]) == 1) {
                MonstersLevelElevenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Twelve Filtered	
    cht = (MonstersLevelTwelve.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwelve[r] <= xFilter && MonstersLevelTwelve[r + 2] == xTheme && checkSource(MonstersLevelTwelve[r + 3]) == 1) {
                cpercent = MonstersLevelTwelve[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTwelveFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Twelve Filtered -- No Reroll Chart	
    cht = (MonstersLevelTwelve.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwelve[r] <= xFilter && MonstersLevelTwelve[r + 2] == xTheme && MonstersLevelTwelve[r + 9] == 0 && checkSource(MonstersLevelTwelve[r + 3]) == 1) {
                cpercent = MonstersLevelTwelve[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTwelveNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Twelve Wandering 	
    cht = (MonstersLevelTwelve.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwelve[r] <= xFilter && MonstersLevelTwelve[r + 2] == xTheme && MonstersLevelTwelve[r + 9] == 0 && checkSource(MonstersLevelTwelve[r + 3]) == 1) {
                MonstersLevelTwelveWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Thirteen Filtered	
    cht = (MonstersLevelThirteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelThirteen[r] <= xFilter && MonstersLevelThirteen[r + 2] == xTheme && checkSource(MonstersLevelThirteen[r + 3]) == 1) {
                cpercent = MonstersLevelThirteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelThirteenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Thirteen Filtered -- No Reroll Chart	
    cht = (MonstersLevelThirteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelThirteen[r] <= xFilter && MonstersLevelThirteen[r + 2] == xTheme && MonstersLevelThirteen[r + 9] == 0 && checkSource(MonstersLevelThirteen[r + 3]) == 1) {
                cpercent = MonstersLevelThirteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelThirteenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Thirteen Wandering 	
    cht = (MonstersLevelThirteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelThirteen[r] <= xFilter && MonstersLevelThirteen[r + 2] == xTheme && MonstersLevelThirteen[r + 9] == 0 && checkSource(MonstersLevelThirteen[r + 3]) == 1) {
                MonstersLevelThirteenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Fourteen Filtered	
    cht = (MonstersLevelFourteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFourteen[r] <= xFilter && MonstersLevelFourteen[r + 2] == xTheme && checkSource(MonstersLevelFourteen[r + 3]) == 1) {
                cpercent = MonstersLevelFourteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFourteenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Fourteen Filtered -- No Reroll Chart	
    cht = (MonstersLevelFourteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFourteen[r] <= xFilter && MonstersLevelFourteen[r + 2] == xTheme && MonstersLevelFourteen[r + 9] == 0 && checkSource(MonstersLevelFourteen[r + 3]) == 1) {
                cpercent = MonstersLevelFourteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFourteenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Fourteen Wandering 	
    cht = (MonstersLevelFourteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFourteen[r] <= xFilter && MonstersLevelFourteen[r + 2] == xTheme && MonstersLevelFourteen[r + 9] == 0 && checkSource(MonstersLevelFourteen[r + 3]) == 1) {
                MonstersLevelFourteenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Fifteen Filtered	
    cht = (MonstersLevelFifteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFifteen[r] <= xFilter && MonstersLevelFifteen[r + 2] == xTheme && checkSource(MonstersLevelFifteen[r + 3]) == 1) {
                cpercent = MonstersLevelFifteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFifteenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Fifteen Filtered -- No Reroll Chart	
    cht = (MonstersLevelFifteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFifteen[r] <= xFilter && MonstersLevelFifteen[r + 2] == xTheme && MonstersLevelFifteen[r + 9] == 0) {
                cpercent = MonstersLevelFifteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelFifteenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Fifteen Wandering 	
    cht = (MonstersLevelFifteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelFifteen[r] <= xFilter && MonstersLevelFifteen[r + 2] == xTheme && MonstersLevelFifteen[r + 9] == 0 && checkSource(MonstersLevelFifteen[r + 3]) == 1) {
                MonstersLevelFifteenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Sixteen Filtered	
    cht = (MonstersLevelSixteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSixteen[r] <= xFilter && MonstersLevelSixteen[r + 2] == xTheme && checkSource(MonstersLevelFifteen[r + 3]) == 1) {
                cpercent = MonstersLevelSixteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSixteenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Sixteen Filtered -- No Reroll Chart	
    cht = (MonstersLevelSixteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSixteen[r] <= xFilter && MonstersLevelSixteen[r + 2] == xTheme && MonstersLevelSixteen[r + 9] == 0 && checkSource(MonstersLevelSixteen[r + 3]) == 1) {
                cpercent = MonstersLevelSixteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSixteenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Sixteen Wandering 	
    cht = (MonstersLevelSixteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSixteen[r] <= xFilter && MonstersLevelSixteen[r + 2] == xTheme && MonstersLevelSixteen[r + 9] == 0 && checkSource(MonstersLevelSixteen[r + 3]) == 1) {
                MonstersLevelSixteenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Seventeen Filtered	
    cht = (MonstersLevelSeventeen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSeventeen[r] <= xFilter && MonstersLevelSeventeen[r + 2] == xTheme && checkSource(MonstersLevelSeventeen[r + 3]) == 1) {
                cpercent = MonstersLevelSeventeen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSeventeenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Seventeen Filtered -- No Reroll Chart	
    cht = (MonstersLevelSeventeen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSeventeen[r] <= xFilter && MonstersLevelSeventeen[r + 2] == xTheme && MonstersLevelSeventeen[r + 9] == 0 && checkSource(MonstersLevelSeventeen[r + 3]) == 1) {
                cpercent = MonstersLevelSeventeen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelSeventeenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Seventeen Wandering 	
    cht = (MonstersLevelSeventeen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelSeventeen[r] <= xFilter && MonstersLevelSeventeen[r + 2] == xTheme && MonstersLevelSeventeen[r + 9] == 0 && checkSource(MonstersLevelSeventeen[r + 3]) == 1) {
                MonstersLevelSeventeenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Eighteen Filtered	
    cht = (MonstersLevelEighteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEighteen[r] <= xFilter && MonstersLevelEighteen[r + 2] == xTheme && checkSource(MonstersLevelEighteen[r + 3]) == 1) {
                cpercent = MonstersLevelEighteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelEighteenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Eighteen Filtered -- No Reroll Chart	
    cht = (MonstersLevelEighteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEighteen[r] <= xFilter && MonstersLevelEighteen[r + 2] == xTheme && MonstersLevelEighteen[r + 9] == 0 && checkSource(MonstersLevelEighteen[r + 3]) == 1) {
                cpercent = MonstersLevelEighteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelEighteenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Eighteen Wandering 	
    cht = (MonstersLevelEighteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelEighteen[r] <= xFilter && MonstersLevelEighteen[r + 2] == xTheme && MonstersLevelEighteen[r + 9] == 0 && checkSource(MonstersLevelEighteen[r + 3]) == 1) {
                MonstersLevelEighteenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Nineteen Filtered	
    cht = (MonstersLevelNineteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelNineteen[r] <= xFilter && MonstersLevelNineteen[r + 2] == xTheme && checkSource(MonstersLevelNineteen[r + 3]) == 1) {
                cpercent = MonstersLevelNineteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelNineteenFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Nineteen Filtered -- No Reroll Chart	
    cht = (MonstersLevelNineteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelNineteen[r] <= xFilter && MonstersLevelNineteen[r + 2] == xTheme && MonstersLevelNineteen[r + 9] == 0 && checkSource(MonstersLevelNineteen[r + 3]) == 1) {
                cpercent = MonstersLevelNineteen[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelNineteenNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Nineteen Wandering 	
    cht = (MonstersLevelNineteen.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelNineteen[r] <= xFilter && MonstersLevelNineteen[r + 2] == xTheme && MonstersLevelNineteen[r + 9] == 0 && checkSource(MonstersLevelNineteen[r + 3]) == 1) {
                MonstersLevelNineteenWandering[t] = chx
                t += 1
            }
        }
    }

    // Monster Level Twenty Filtered	
    cht = (MonstersLevelTwenty.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwenty[r] <= xFilter && MonstersLevelTwenty[r + 2] == xTheme && checkSource(MonstersLevelTwenty[r + 3]) == 1) {
                cpercent = MonstersLevelTwenty[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTwentyFiltered[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Twenty Filtered -- No Reroll Chart	
    cht = (MonstersLevelTwenty.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwenty[r] <= xFilter && MonstersLevelTwenty[r + 2] == xTheme && MonstersLevelTwenty[r + 9] == 0 && checkSource(MonstersLevelTwenty[r + 3]) == 1) {
                cpercent = MonstersLevelTwenty[r + 1] - 1
                for (s = 0; s <= cpercent; s++) {
                    MonstersLevelTwentyNoReroll[t] = chx
                    t += 1
                }
            }
        }
    }

    // Monster Level Twenty Wandering 	
    cht = (MonstersLevelTwenty.length - 1) / 10
    var t = 0;
    for (chx = 0; chx <= cht; chx++) {
        for (q = 0; q <= 9; q++) {
            r = (chx * 10) + q
            if (q == 0 && MonstersLevelTwenty[r] <= xFilter && MonstersLevelTwenty[r + 2] == xTheme && MonstersLevelTwenty[r + 9] == 0 && checkSource(MonstersLevelTwenty[r + 3]) == 1) {
                MonstersLevelTwentyWandering[t] = chx
                t += 1
            }
        }
    }





}

// =======================================================

function checkSource(xsrc) {

    var chksrc = 0;
    var cmatch = 0;
    var zxrc = 0;
    var xmatch = new Array(0);

    xsrc += " ";
    zxrc = xsrc.length - 1;

    if (xsrc.search(/C/i) >= 0) { xmatch[0] = "C" } else { xmatch[0] = "0" }
    if (xsrc.search(/2/i) >= 0) { xmatch[1] = "2" } else { xmatch[1] = "0" }
    if (xsrc.search(/3/i) >= 0) { xmatch[2] = "3" } else { xmatch[2] = "0" }
    if (xsrc.search(/4/i) >= 0) { xmatch[3] = "4" } else { xmatch[3] = "0" }
    if (xsrc.search(/F/i) >= 0) { xmatch[4] = "F" } else { xmatch[4] = "0" }
    if (xsrc.search(/X/i) >= 0) { xmatch[5] = "X" } else { xmatch[5] = "0" }
    if (xsrc.search(/P/i) >= 0) { xmatch[6] = "P" } else { xmatch[6] = "0" }
    if (xsrc.search(/H/i) >= 0) { xmatch[7] = "H" } else { xmatch[7] = "0" }
    if (xsrc.search(/L/i) >= 0) { xmatch[8] = "L" } else { xmatch[8] = "0" }
    if (xsrc.search(/A/i) >= 0) { xmatch[9] = "A" } else { xmatch[9] = "0" }

    for (xm = 0; xm <= 9; xm++) {
        if (xmatch[xm] != "0") {
            if (chksrcs[xm] == xmatch[xm]) {
                cmatch += 1;
            } else {
                cmatch -= 1;
            }
        }
    }

    if (zxrc == cmatch) {
        chksrc = 1;
    }

    if (xsrc == "Z") {
        chksrc = 1;
    }

    return chksrc

}



// =======================================================

function cleanFiltered() {

    sxlen = aRandRoomDescTinyFiltered.length - 1;
    for (sx = 0; sx <= sxlen; sx++) {
        if (aRandRoomDescTinyFiltered[sx] == "###") {
            aRandRoomDescTinyFiltered.splice(sx, 1);
            aRandRoomNoteTinyFiltered.splice(sx, 1);
        }
    }


    sxlen = aRandRoomDescSmallFiltered.length - 1;
    for (sx = 0; sx <= sxlen; sx++) {
        if (aRandRoomDescSmallFiltered[sx] == "###") {
            aRandRoomDescSmallFiltered.splice(sx, 1);
            aRandRoomNoteSmallFiltered.splice(sx, 1);
        }
    }


    sxlen = aRandRoomDescMediumFiltered.length - 1;
    for (sx = 0; sx <= sxlen; sx++) {
        if (aRandRoomDescMediumFiltered[sx] == "###") {
            aRandRoomDescMediumFiltered.splice(sx, 1);
            aRandRoomNoteMediumFiltered.splice(sx, 1);
        }
    }

    sxlen = aRandRoomDescLargeFiltered.length - 1;
    for (sx = 0; sx <= sxlen; sx++) {
        if (aRandRoomDescLargeFiltered[sx] == "###") {
            aRandRoomDescLargeFiltered.splice(sx, 1);
            aRandRoomNoteLargeFiltered.splice(sx, 1);
        }
    }


}



// =======================================================

function randomStartRoom() {

    rWidth = rand(xRoomWidthMax - xRoomWidthMin) + xRoomWidthMin;
    rHeigth = rand(xRoomHeigthMax - xRoomHeigthMin) + xRoomHeigthMin;

    rTiles = rWidth * rHeigth
    rExits = rTiles
    rExitStart = 4;
    rExitEnd = (rExitStart - 1) + rExits
    rTileStart = rExitEnd + 1
    rTileEnd = (rTileStart - 1) + rTiles
    alength = aStarterRoom.length - 2

    aStarterRoom[alength + 1] = 2 + rExits + rTiles
    aStarterRoom[alength + 2] = rWidth
    aStarterRoom[alength + 3] = rHeigth

    for (a = rExitStart; a <= rExitEnd; a++) {
        aStarterRoom[alength + a] = 0;
    }
    for (a = rTileStart; a <= rTileEnd; a++) {
        aStarterRoom[alength + a] = "10";
    }

    aStarterRoom[aStarterRoom.length] = 0;

    astartlength = aStarterStart.length
    aStarterStart[astartlength] = aStarterStart[astartlength - 1] + aStarterRoom[alength + 1] + 1;


    var rExit1 = rand(sExitsValue) + 1;
    var rExit2 = rand(sExitsValue) + 1;
    var rExit3 = rand(sExitsValue) + 1;
    var rExit4 = rand(sExitsValue) + 1;

    if (rExit1 <= 4) {
        x = rand(rWidth);
        aStarterRoom[alength + (4 + x)] = 1;
    }
    if (rExit2 <= 4) {
        y = rand(rHeigth);
        aStarterRoom[alength + (4 + ((rWidth - 1) + (rWidth * y)))] = 2;
    }
    if (rExit3 <= 4) {
        x = rand(rWidth);
        aStarterRoom[alength + (((rHeigth - 1) * rWidth) + x) + 4] = 3;
    }
    if (rExit4 <= 4) {
        y = rand(rHeigth);
        aStarterRoom[alength + (4 + (rWidth * y))] = 4;
    }


    // alert(aStarterRoom)
}

// ==============================================

function placeStartRoom() {

    randroompos = aStarterStart.length - 2;

    if (zRoomSelect >= 3) {
        room = randroompos;
    } else {
        room = parseInt(zRoomSelect);
    }

    //	alert(room);

    tile = 0
    exit = 0

    roomstart = aStarterStart[room];
    roomend = (aStarterStart[room + 1] - 1);

    halfx = rand(.5 * aStarterRoom[roomstart + 1]) + 1;
    halfy = rand(.5 * aStarterRoom[roomstart + 2]) + 1;
    startx = 15 - halfx;
    starty = 20 - halfy;
    endx = startx + (aStarterRoom[roomstart + 1] - 1);
    endy = starty + (aStarterRoom[roomstart + 2] - 1);
    startz = startx + (30 * starty);
    totaltiles = aStarterRoom[roomstart + 1] * aStarterRoom[roomstart + 2];
    tiles = roomend - totaltiles
    exits = roomend - (2 * totaltiles)

    // place base floor on floor layer

    totalrooms += 1;
    nZ = (starty * 30) + startx;
    aRoomData[(totalrooms * 5) + 1] = nZ; // z coord
    aRoomData[(totalrooms * 5) + 2] = aStarterRoom[roomstart + 2]; // width
    aRoomData[(totalrooms * 5) + 3] = aStarterRoom[roomstart + 1]; // heigth
    aRoomData[(totalrooms * 5) + 4] = starty; // start y 
    aRoomData[(totalrooms * 5) + 5] = startx; // start x			

    for (y = starty; y <= endy; y++) {
        for (x = startx; x <= endx; x++) {
            var z = (y * 30) + x;
            tile += 1
            griddata = aStarterRoom[tiles + tile]
            aLayer1[z] = griddata;
        }
    }

    var placed = 0
    for (yy = starty; yy <= endy; yy++) {
        for (xx = startx; xx <= endx; xx++) {
            var zz = (yy * 30) + xx;
            if (aLayer1[zz] == "10" && placed == 0) {
                placed = 1;
                aLayer26[zz] = totalrooms;
            }
        }
    }

    // place exits on exit layers (14,15,16,17)	

    for (y = starty; y <= endy; y++) {
        for (x = startx; x <= endx; x++) {
            var z = (y * 30) + x;
            exit += 1
            griddata = aStarterRoom[exits + exit]
            if (griddata == 1) {
                aLayer14[z] = "21";
                aLayerShow[14] = 1;
            }
            if (griddata == 2) {
                aLayer15[z] = "22";
                aLayerShow[15] = 1;
            }
            if (griddata == 3) {
                aLayer16[z] = "23";
                aLayerShow[16] = 1;
            }
            if (griddata == 4) {
                aLayer17[z] = "24";
                aLayerShow[17] = 1;
            }
        }
    }

    wallMaker();


}


// ==============================================

function edgePrep() {

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;

            if (y == 0 || y == 39 || x == 0 || x == 29) {
                aLayer1[z] = "20";
            }

        }
    }

}

// ==============================================

function exitSweep() {

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;

            if (aLayer14[z] == "21") {
                var k = ((y - 1) * 30) + x;
                if (aLayer16[k] == null) {
                    aLayer16[k] = "23";
                    aLayerShow[16] = 1;
                }
                if (aLayer1[k] == null) {
                    aLayer1[k] = "30";
                }
            }
            if (aLayer15[z] == "22") {
                var k = (y * 30) + (x + 1);
                if (aLayer17[k] == null) {
                    aLayer17[k] = "24";
                    aLayerShow[17] = 1;
                }
                if (aLayer1[k] == null) {
                    aLayer1[k] = "30";
                }
            }
            if (aLayer16[z] == "23") {
                var k = ((y + 1) * 30) + x;
                if (aLayer14[k] == null) {
                    aLayer14[k] = "21";
                    aLayerShow[14] = 1;
                }
                if (aLayer1[k] == null) {
                    aLayer1[k] = "30";
                }
            }
            if (aLayer17[z] == "24") {
                var k = (y * 30) + (x - 1);
                if (aLayer15[k] == null) {
                    aLayer15[k] = "22";
                    aLayerShow[15] = 1;
                }
                if (aLayer1[k] == null) {
                    aLayer1[k] = "30";
                }
            }

        }
    }

}

// ==============================================

function wallMaker() {

    for (wy = 0; wy <= 39; wy++) {
        for (wx = 0; wx <= 29; wx++) {
            var wz = (wy * 30) + wx;
            var z1 = ((wy * 30) + wx) - 30;
            var z2 = ((wy * 30) + wx) + 1;
            var z3 = ((wy * 30) + wx) + 30;
            var z4 = ((wy * 30) + wx) - 1;

            if (aLayer1[wz] == null || aLayer1[wz] == 200 || aLayer1[wz] == "20") {
                if (wy != 0 && aLayer1[z1] == "10" && aLayer16[z1] == null) {
                    aLayer22[wz] = "41";
                    aLayerShow[22] = 1;
                }
                if (wx != 29 && aLayer1[z2] == "10" && aLayer17[z2] == null) {
                    aLayer23[wz] = "42";
                    aLayerShow[23] = 1;
                }

                if (wy != 39 && aLayer1[z3] == "10" && aLayer14[z3] == null) {
                    aLayer24[wz] = "43";
                    aLayerShow[24] = 1;
                }

                if (wx != 0 && aLayer1[z4] == "10" && aLayer15[z4] == null) {
                    aLayer25[wz] = "44";
                    aLayerShow[25] = 1;
                }
            }

            if (aLayer1[wz] == "10") {
                if (wy != 0 && aLayer1[z1] == null && aLayer14[wz] == null) {
                    aLayer22[wz] = "41";
                    aLayerShow[22] = 1;
                }
                if (wx != 29 && aLayer1[z2] == null && aLayer15[wz] == null) {
                    aLayer23[wz] = "42";
                    aLayerShow[23] = 1;
                }

                if (wy != 39 && aLayer1[z3] == null && aLayer16[wz] == null) {
                    aLayer24[wz] = "43";
                    aLayerShow[24] = 1;
                }

                if (wx != 0 && aLayer1[z4] == null && aLayer17[wz] == null) {
                    aLayer25[wz] = "44";
                    aLayerShow[25] = 1;
                }
            }


            if (aLayer1[wz] == "10") {
                if (wy != 0 && aLayer1[z1] == "30" && aLayer14[wz] == null) {
                    aLayer22[wz] = "41";
                    aLayerShow[22] = 1;
                }
                if (wx != 29 && aLayer1[z2] == "30" && aLayer15[wz] == null) {
                    aLayer23[wz] = "42";
                    aLayerShow[23] = 1;
                }

                if (wy != 39 && aLayer1[z3] == "30" && aLayer16[wz] == null) {
                    aLayer24[wz] = "43";
                    aLayerShow[24] = 1;
                }

                if (wx != 0 && aLayer1[z4] == "30" && aLayer17[wz] == null) {
                    aLayer25[wz] = "44";
                    aLayerShow[25] = 1;
                }
            }

            if (aLayer1[wz] == "10") {
                if (wy != 0 && aLayer1[z1] == 200 && aLayer14[wz] == null) {
                    aLayer22[wz] = "41";
                    aLayerShow[22] = 1;
                }
                if (wx != 29 && aLayer1[z2] == 200 && aLayer15[wz] == null) {
                    aLayer23[wz] = "42";
                    aLayerShow[23] = 1;
                }

                if (wy != 39 && aLayer1[z3] == 200 && aLayer16[wz] == null) {
                    aLayer24[wz] = "43";
                    aLayerShow[24] = 1;
                }

                if (wx != 0 && aLayer1[z4] == 200 && aLayer17[wz] == null) {
                    aLayer25[wz] = "44";
                    aLayerShow[25] = 1;
                }
            }

            if (aLayer1[wz] == "10") {
                if (wy != 0 && aLayer1[z1] == "20" && aLayer14[wz] == null) {
                    aLayer22[wz] = "41";
                    aLayerShow[22] = 1;
                }
                if (wx != 29 && aLayer1[z2] == "20" && aLayer15[wz] == null) {
                    aLayer23[wz] = "42";
                    aLayerShow[23] = 1;
                }

                if (wy != 39 && aLayer1[z3] == "20" && aLayer16[wz] == null) {
                    aLayer24[wz] = "43";
                    aLayerShow[24] = 1;
                }

                if (wx != 0 && aLayer1[z4] == "20" && aLayer17[wz] == null) {
                    aLayer25[wz] = "44";
                    aLayerShow[25] = 1;
                }
            }


            if (aLayer1[wz] == "30") {
                if (wy != 0 && aLayer1[z1] == "10" && aLayer14[wz] == null) {
                    aLayer22[wz] = "41";
                    aLayerShow[22] = 1;
                }
                if (wx != 29 && aLayer1[z2] == "10" && aLayer15[wz] == null) {
                    aLayer23[wz] = "42";
                    aLayerShow[23] = 1;
                }

                if (wy != 39 && aLayer1[z3] == "10" && aLayer16[wz] == null) {
                    aLayer24[wz] = "43";
                    aLayerShow[24] = 1;
                }

                if (wx != 0 && aLayer1[z4] == "10" && aLayer17[wz] == null) {
                    aLayer25[wz] = "44";
                    aLayerShow[25] = 1;
                }
            }

            // custom pieces

            if (aLayer1[wz] >= 200 || aLayer1[z1] >= 200 || aLayer1[z2] >= 200 || aLayer1[z3] >= 200 || aLayer1[z4] >= 200) {

                for (ct = 0; ct <= ctl; ct++) {
                    for (cx = 0; cx <= 5; cx++) {
                        cz = (ct * 5) + cx;
                        if (aLayer1[wz] == null || aLayer1[wz] == aCustomTile[cz] || aLayer1[wz] == "20") {
                            if (aCustomTile[cz + 1] == 1 && wy != 39 && aLayer1[z3] == "10" && aLayer14[z3] == null) {
                                aLayer24[wz] = "43";
                                aLayerShow[24] = 1;
                            }
                            if (aCustomTile[cz + 2] == 1 && wx != 0 && aLayer1[z4] == "10" && aLayer15[z4] == null) {
                                aLayer25[wz] = "44";
                                aLayerShow[25] = 1;
                            }
                            if (aCustomTile[cz + 3] == 1 && wy != 0 && aLayer1[z1] == "10" && aLayer16[z1] == null) {
                                aLayer22[wz] = "41";
                                aLayerShow[22] = 1;
                            }
                            if (aCustomTile[cz + 4] == 1 && wx != 29 && aLayer1[z2] == "10" && aLayer17[z2] == null) {
                                aLayer23[wz] = "42";
                                aLayerShow[23] = 1;
                            }
                        }
                        if (aLayer1[wz] == "10") {
                            if (aCustomTile[cz + 1] == 1 && wy != 0 && aLayer1[z1] == aCustomTile[cz] && aLayer14[wz] == null) {
                                aLayer22[wz] = "41";
                                aLayerShow[22] = 1;
                            }
                            if (aCustomTile[cz + 2] == 1 && wx != 29 && aLayer1[z2] == aCustomTile[cz] && aLayer15[wz] == null) {
                                aLayer23[wz] = "42";
                                aLayerShow[23] = 1;
                            }
                            if (aCustomTile[cz + 3] == 1 && wy != 39 && aLayer1[z3] == aCustomTile[cz] && aLayer16[wz] == null) {
                                aLayer24[wz] = "43";
                                aLayerShow[24] = 1;
                            }
                            if (aCustomTile[cz + 4] == 1 && wx != 0 && aLayer1[z4] == aCustomTile[cz] && aLayer17[wz] == null) {
                                aLayer25[wz] = "44";
                                aLayerShow[25] = 1;
                            }
                        }
                    }
                }
            }




        }
    }

}

// ==============================================

function sweepTwoHundred() {

    for (wy = 0; wy <= 39; wy++) {
        for (wx = 0; wx <= 29; wx++) {
            var wz = (wy * 30) + wx;

            if (aLayer1[wz] == 200) {
                aLayer1[wz] = "99";
                if (zSkin == 1) {
                    aLayer1[wz] = "99a";
                }
            }
        }
    }
}



// ==============================================

function thatchMaker() {

    for (ty = 0; ty <= 39; ty++) {
        for (tx = 0; tx <= 29; tx++) {
            var tz = (ty * 30) + tx;
            var z1 = ((ty * 30) + tx) - 30;
            var z2 = ((ty * 30) + tx) + 1;
            var z3 = ((ty * 30) + tx) + 30;
            var z4 = ((ty * 30) + tx) - 1;
            var z5 = (((ty * 30) + tx) - 30) + 1;
            var z6 = (((ty * 30) + tx) - 30) - 1;
            var z7 = (((ty * 30) + tx) + 30) + 1;
            var z8 = (((ty * 30) + tx) + 30) - 1;

            if (aLayer1[tz] >= 200) {
                aBaseGrid[tz] = "99";
                if (zSkin == 1) {
                    aBaseGrid[tz] = "99a";
                }
            }


            if (aLayer1[tz] == null || aLayer1[tz] == "20") {

                if (ty != 0 && aLayer1[z1] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }
                if (tx != 29 && aLayer1[z2] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }

                if (ty != 39 && aLayer1[z3] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }

                if (tx != 0 && aLayer1[z4] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }
                if (ty != 0 && tx != 29 && aLayer1[z5] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }
                if (ty != 0 && tx != 0 && aLayer1[z6] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }
                if (ty != 39 && tx != 29 && aLayer1[z7] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }
                if (ty != 39 && tx != 0 && aLayer1[z8] == "10") {
                    aBaseGrid[tz] = "99";
                    if (zSkin == 1) {
                        aBaseGrid[tz] = "99a";
                    }
                }
            }




        }
    }

}

// ==============================================

function cornerMaker() {

    for (ty = 0; ty <= 39; ty++) {
        for (tx = 0; tx <= 29; tx++) {
            var tz = (ty * 30) + tx;
            var z1 = ((ty * 30) + tx) - 30;
            var z2 = ((ty * 30) + tx) + 1;
            var z3 = ((ty * 30) + tx) + 30;
            var z4 = ((ty * 30) + tx) - 1;
            var z5 = (((ty * 30) + tx) - 30) + 1;
            var z6 = (((ty * 30) + tx) - 30) - 1;
            var z7 = (((ty * 30) + tx) + 30) + 1;
            var z8 = (((ty * 30) + tx) + 30) - 1;

            //	 	if (aLayer1[tz] == null) {
            if (ty != 0 && aLayer23[z1] != null) {
                aLayer18[tz] = "71";
                aLayerShow[18] = 1;
            }
            if (ty != 0 && aLayer25[z1] != null) {
                aLayer21[tz] = "74";
                aLayerShow[21] = 1;
            }
            if (ty != 39 && aLayer23[z3] != null) {
                aLayer19[tz] = "72";
                aLayerShow[19] = 1;
            }
            if (ty != 39 && aLayer25[z3] != null) {
                aLayer20[tz] = "73";
                aLayerShow[20] = 1;
            }

            if (tx != 29 && aLayer22[z2] != null) {
                aLayer18[tz] = "71";
                aLayerShow[18] = 1;
            }
            if (tx != 29 && aLayer24[z2] != null) {
                aLayer19[tz] = "72";
                aLayerShow[19] = 1;
            }
            if (tx != 0 && aLayer22[z4] != null) {
                aLayer21[tz] = "74";
                aLayerShow[21] = 1;
            }
            if (tx != 0 && aLayer24[z4] != null) {
                aLayer20[tz] = "73";
                aLayerShow[20] = 1;
            }
            // 	}
        }
    }

}

// ==============================================

function roomMaker(lastroom) {

    exitSweep();

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;
            if (aLayer1[z] == "30") { // found a marked tile

                exitdirection = 0;

                if (aLayer14[z] != null) { // Exit is North
                    exitdirection = 1;
                }
                if (aLayer15[z] != null) { // Exit is East
                    exitdirection = 2;
                }
                if (aLayer16[z] != null) { // Exit is South
                    exitdirection = 3;
                }
                if (aLayer17[z] != null) { // Exit is West
                    exitdirection = 4;
                }


                // Create A Room				

                roomTypeRoll = rand(100) + 1;

                if (roomTypeRoll <= zHallPercentage) {
                    roomType = 1;
                } else {
                    roomType = 2;
                }


                if (roomType == 1) { // Hallway
                    rOther = rand(zHallLengthMax - zHallLengthMin) + zHallLengthMin;
                    horv = rand(2) + 1;
                    if (horv == 1) { // Horizontal Hallway
                        rHeigth = 1;
                        rWidth = rOther;
                    } else {// Vertical Hallway 
                        rHeigth = rOther;
                        rWidth = 1;
                    }
                }

                if (roomType == 2) { // Room
                    rWidth = rand(zRoomWidthMax - zRoomWidthMin) + zRoomWidthMin;
                    rHeigth = rand(zRoomHeigthMax - zRoomHeigthMin) + zRoomHeigthMin;
                }

                if (lastroom == 2) {
                    rWidth = rand(2) + 2;
                    rHeigth = rand(2) + 2;
                    roomType = 2;
                }
                if (lastroom == 1) {
                    rWidth = 1;
                    rHeigth = 1;
                }

                // Place The Room

                yShift = 0
                xShift = 0

                xOfset = rand(rWidth);
                yOfset = rand(rHeigth);

                if (exitdirection == 1) {
                    yShift = 0
                    xShift = -1 * xOfset
                }
                if (exitdirection == 2) {
                    yShift = -1 * yOfset
                    xShift = -1 * (rWidth - 1)
                }
                if (exitdirection == 3) {
                    yShift = -1 * (rHeigth - 1)
                    xShift = -1 * xOfset
                }
                if (exitdirection == 4) {
                    yShift = -1 * yOfset
                    xShift = 0
                }

                starty = y + yShift
                endy = starty + rHeigth - 1
                startx = x + xShift
                endx = startx + rWidth - 1

                // Check to see if the space for the room is empty
                emptyspace = 0;
                for (yye = starty; yye <= endy; yye++) {
                    for (xxe = startx; xxe <= endx; xxe++) {
                        var zze = (yye * 30) + xxe;
                        if (aLayer1[zze] != null && aLayer1[zze] != "30" && aLayer1[zze] != "200") {
                            emptyspace += 1;
                        }
                    }
                }
                // If space is empty place the room
                if (emptyspace == 0) {

                    if (roomType == 2) {
                        nZ = (starty * 30) + startx;
                        totalrooms += 1;
                        aLayer26[nZ] = totalrooms;
                        aRoomData[(totalrooms * 5) + 1] = nZ; // z coord
                        aRoomData[(totalrooms * 5) + 2] = rHeigth; // heigth
                        aRoomData[(totalrooms * 5) + 3] = rWidth; // width
                        aRoomData[(totalrooms * 5) + 4] = starty; // start y 
                        aRoomData[(totalrooms * 5) + 5] = startx; // start x	
                    }

                    for (yy = starty; yy <= endy; yy++) {
                        for (xx = startx; xx <= endx; xx++) {
                            var zz = (yy * 30) + xx;
                            aLayer1[zz] = "10";
                        }
                    }
                    // Check to see if the room has any special parts

                    //				specialParts = rand(100) + 1;
                    //				partsType = rand(2) + 1; // 1 = Angled Corners 2 = Empty Corners
                    //				if (specialParts <= 50 && rWidth >=3 && rHeigth >=3) {
                    //					if (partsType == 1) {
                    //					
                    //						aLayer1[(starty * 30) + startx] = "201";
                    //						aLayer1[((starty * 30) + startx) + (rWidth - 1)] = "202";
                    //						aLayer1[(endy * 30) + startx] = "204";
                    //						aLayer1[((endy * 30) + startx) + (rWidth - 1)] = "203";																				
                    //					
                    //					
                    //					}
                    //					if (partsType == 2) {
                    //
                    //							aLayer1[(starty * 30) + startx] = "200";
                    //							aLayer1[((starty * 30) + startx) + (rWidth - 1)] = "200";
                    //							aLayer1[(endy * 30) + startx] = "200";
                    //							aLayer1[((endy * 30) + startx) + (rWidth - 1)] = "200";		
                    //						
                    //						}
                    //					} 


                    if (lastroom == 0) {

                        // Add Exits				

                        aExitUsed = new Array(0, 0, 0, 0, 0);

                        for (yy = starty; yy <= endy; yy++) {
                            for (xx = startx; xx <= endx; xx++) {
                                var zz = (yy * 30) + xx;

                                var rExit1 = rand(zExitsValue) + 1;
                                var rExit2 = rand(zExitsValue) + 1;
                                var rExit3 = rand(zExitsValue) + 1;
                                var rExit4 = rand(zExitsValue) + 1;

                                if (roomType == 1) {
                                    if (horv == 1) {
                                        rExit2 = rExit2 - 2;
                                        rExit4 = rExit4 - 2;
                                    } else {
                                        rExit1 = rExit1 - 2;
                                        rExit3 = rExit3 - 2;
                                    }
                                }

                                var echeck = 0;

                                if (rExit1 <= 1 && aExitUsed[1] == 0 && yy >= 2 && aLayer1[zz - 30] == null) {
                                    aLayer14[zz] = "21";
                                    aLayerShow[14] = 1;
                                    aExitUsed[1] = 1;

                                }

                                if (rExit2 <= 1 && aExitUsed[2] == 0 && xx <= 27 && aLayer1[zz + 1] == null) {
                                    aLayer15[zz] = "22";
                                    aLayerShow[15] = 1;
                                    aExitUsed[2] = 1;

                                }

                                if (rExit3 <= 1 && aExitUsed[3] == 0 && yy <= 37 && aLayer1[zz + 30] == null) {
                                    aLayer16[zz] = "23";
                                    aLayerShow[16] = 1;
                                    aExitUsed[3] = 1;

                                }

                                if (rExit4 <= 1 && aExitUsed[4] == 0 && xx >= 2 && aLayer1[zz - 1] == null) {
                                    aLayer17[zz] = "24";
                                    aLayerShow[17] = 1;
                                    aExitUsed[4] = 1;

                                }
                            }
                        }

                    }

                }

                wallMaker();

            }
        }
    }

}

// ======================================================

function makeDoors() {

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;

            // 1 Normal
            // 2 No Door

            // door = Math.floor(Math.random() * 2) + 1;	
            door = 1;

            if (aLayer14[z] == "21") {
                var k = ((y - 1) * 30) + x;
                if (aLayer16[k] == "23") {
                    if (door == 1) {
                        aLayer14[z] = "51"
                        aLayer16[k] = "53"
                    }
                    if (door == 2) {
                        aLayer14[z] = "20"
                        aLayer16[k] = "20"
                    }
                }
            }
            if (aLayer15[z] == "22") {
                var k = (y * 30) + (x + 1);
                if (aLayer17[k] == "24") {
                    if (door == 1) {
                        aLayer15[z] = "52"
                        aLayer17[k] = "54"
                    }
                    if (door == 2) {
                        aLayer15[z] = "20"
                        aLayer17[k] = "20"
                    }
                }
            }
            if (aLayer16[z] == "23") {
                var k = ((y + 1) * 30) + x;
                if (aLayer14[k] == "21") {
                    if (door == 1) {
                        aLayer16[z] = "53"
                        aLayer14[k] = "51"
                    }
                    if (door == 2) {
                        aLayer16[z] = "20"
                        aLayer14[k] = "20"
                    }
                }
            }
            if (aLayer17[z] == "24") {
                var k = (y * 30) + (x - 1);
                if (aLayer15[k] == "22") {
                    if (door == 1) {
                        aLayer17[z] = "54"
                        aLayer15[k] = "52"
                    }
                    if (door == 2) {
                        aLayer17[z] = "20"
                        aLayer15[k] = "20"
                    }
                }
            }
        }
    }

}

// ==============================================

function makeSpecialDoors() {

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;

            // secret doors
            if (aLayer10s[z] == 1 || aLayer10s[z] == 2) {
                var k = ((y - 1) * 30) + x;
                aLayer14[z] = "61"
                aLayer16[k] = "63"
            }
            if (aLayer11s[z] == 1 || aLayer11s[z] == 2) {
                var k = (y * 30) + (x + 1);
                aLayer15[z] = "62"
                aLayer17[k] = "64"
            }
            if (aLayer12s[z] == 1 || aLayer12s[z] == 2) {
                var k = ((y + 1) * 30) + x;
                aLayer16[z] = "63"
                aLayer14[k] = "61"
            }
            if (aLayer13s[z] == 1 || aLayer13s[z] == 2) {
                var k = (y * 30) + (x - 1);
                aLayer17[z] = "64"
                aLayer15[k] = "62"
            }


            // portcullises
            if (aLayer10s[z] == 3) {
                var k = ((y - 1) * 30) + x;
                aLayer14[z] = "55"
                aLayer16[k] = "57"
            }
            if (aLayer11s[z] == 3) {
                var k = (y * 30) + (x + 1);
                aLayer15[z] = "56"
                aLayer17[k] = "58"
            }
            if (aLayer12s[z] == 3) {
                var k = ((y + 1) * 30) + x;
                aLayer16[z] = "57"
                aLayer14[k] = "55"
            }
            if (aLayer13s[z] == 3) {
                var k = (y * 30) + (x - 1);
                aLayer17[z] = "58"
                aLayer15[k] = "56"
            }


        }
    }

}



// ==============================================

function assignDoorTypes() {

    secretpercent = 101
    if (zSecretDoorsValue == 1) {
        secretpercent = 96;
    }
    if (zSecretDoorsValue == 2) {
        secretpercent = 90;
    }

    portpercent = 101
    if (zPortcullisesValue == 1) {
        portpercent = 97;
    }
    if (zPortcullisesValue == 2) {
        portpercent = 92;
    }


    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {

            var sdoorp = rand(100) + 1;
            var sdoorx = rand(100) + 1;
            var sdoor = 0
            if (sdoorp > portpercent) {
                var sdoorz = rand(100) + 1;
                if (sdoorz > 74) {
                    sdoor = 4
                } else {
                    sdoor = 3
                }
            }
            if (sdoorx > secretpercent) {
                var sdoorz = rand(100) + 1;
                if (sdoorz > 74) {
                    sdoor = 2
                } else {
                    sdoor = 1
                }
            }

            var z = (y * 30) + x;
            var d = rand(Table317Filtered.length - 1) + 1;
            var rr = rand(Table317Reroll.length - 1) + 1;
            var dx = rand(Table319Filtered.length - 1) + 1;

            if (aLayer14[z] == "51") {
                var k = ((y - 1) * 30) + x;
                if (aLayer16[k] == "53") {
                    aLayer10[z] = Table317Filtered[d];
                    aLayer10r[z] = Table317Reroll[rr];
                    aLayer10t[z] = Table319Filtered[dx];
                    aLayer10s[z] = sdoor;
                    aLayer12[k] = Table317Filtered[d];
                    aLayer12r[k] = Table317Reroll[rr];
                    aLayer12t[k] = Table319Filtered[dx];
                    aLayer12s[k] = sdoor;
                }
            }

            if (aLayer15[z] == "52") {
                var k = (y * 30) + (x + 1);
                if (aLayer17[k] == "54") {
                    aLayer11[z] = Table317Filtered[d];
                    aLayer11r[z] = Table317Reroll[rr];
                    aLayer11t[z] = Table319Filtered[dx];
                    aLayer11s[z] = sdoor;
                    aLayer13[k] = Table317Filtered[d];
                    aLayer13r[k] = Table317Reroll[rr];
                    aLayer13t[k] = Table319Filtered[dx];
                    aLayer13s[k] = sdoor;
                }
            }

            if (aLayer16[z] == "53") {
                var k = ((y + 1) * 30) + x;
                if (aLayer14[k] == "51") {
                    aLayer12[z] = Table317Filtered[d];
                    aLayer12r[z] = Table317Reroll[rr];
                    aLayer12t[z] = Table319Filtered[dx];
                    aLayer12s[z] = sdoor;
                    aLayer10[k] = Table317Filtered[d];
                    aLayer10r[k] = Table317Reroll[rr];
                    aLayer10t[k] = Table319Filtered[dx];
                    aLayer10s[k] = sdoor;
                }
            }

            if (aLayer17[z] == "54") {
                var k = (y * 30) + (x - 1);
                if (aLayer15[k] == "52") {
                    aLayer13[z] = Table317Filtered[d];
                    aLayer13r[z] = Table317Reroll[rr];
                    aLayer13t[z] = Table319Filtered[dx];
                    aLayer13s[z] = sdoor;
                    aLayer11[k] = Table317Filtered[d];
                    aLayer11r[k] = Table317Reroll[rr];
                    aLayer11t[k] = Table319Filtered[dx];
                    aLayer11s[k] = sdoor;
                }
            }


        }
    }



}



// ======================================================

function WCDisplayLayer() {

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;
            twentysixtemp = 0;
            if (aLayer22[z] != null) {
                twentysixtemp += 1
            }
            if (aLayer23[z] != null) {
                twentysixtemp += 10
            }
            if (aLayer24[z] != null) {
                twentysixtemp += 100
            }
            if (aLayer25[z] != null) {
                twentysixtemp += 1000
            }
            if (aLayer18[z] != null && aLayer22[z] == null && aLayer23[z] == null) {
                twentysixtemp += 10000
            }
            if (aLayer19[z] != null && aLayer23[z] == null && aLayer24[z] == null) {
                twentysixtemp += 100000
            }
            if (aLayer20[z] != null && aLayer24[z] == null && aLayer25[z] == null) {
                twentysixtemp += 1000000
            }
            if (aLayer21[z] != null && aLayer22[z] == null && aLayer25[z] == null) {
                twentysixtemp += 10000000
            }
            aLayer27[z] = twentysixtemp;
        }
    }

    aLayerShow[27] = 1;

}


// ======================================================

function setMapCompass() {

    compass = 0;
    ccount = 0;
    ccheck = 0;

    for (y = 0; y <= 3; y++) {
        for (x = 0; x <= 3; x++) {
            var z = (y * 30) + x;
            if (aLayer27[z] == null) {
                ccheck += 1;
            }
        }
    }
    if (ccheck == 0) {
        for (y = 0; y <= 3; y++) {
            for (x = 0; x <= 3; x++) {
                var z = (y * 30) + x;
                aLayer28[z] = aMapCompass[ccount];
                ccount += 1;
                compass = 1;
                aLayerShow[28] = 1;
            }
        }
    }

    if (compass == 0) {
        ccheck = 0;
        for (y = 0; y <= 3; y++) {
            for (x = 26; x <= 29; x++) {
                var z = (y * 30) + x;
                if (aLayer27[z] == null) {
                    ccheck += 1;
                }
            }
        }
        if (ccheck == 0) {
            for (y = 0; y <= 3; y++) {
                for (x = 26; x <= 29; x++) {
                    var z = (y * 30) + x;
                    aLayer28[z] = aMapCompass[ccount];
                    ccount += 1;
                    compass = 2;
                    aLayerShow[28] = 1;
                }
            }
        }
    }


    if (compass == 0) {
        ccheck = 0;
        for (y = 36; y <= 39; y++) {
            for (x = 26; x <= 29; x++) {
                var z = (y * 30) + x;
                if (aLayer27[z] == null) {
                    ccheck += 1;
                }
            }
        }
        if (ccheck == 0) {
            for (y = 36; y <= 39; y++) {
                for (x = 26; x <= 29; x++) {
                    var z = (y * 30) + x;
                    aLayer28[z] = aMapCompass[ccount];
                    ccount += 1;
                    compass = 3;
                    aLayerShow[28] = 1;
                }
            }
        }
    }

    if (compass == 0) {
        ccheck = 0;
        for (y = 36; y <= 39; y++) {
            for (x = 0; x <= 3; x++) {
                var z = (y * 30) + x;
                if (aLayer27[z] == null) {
                    ccheck += 1;
                }
            }
        }
        if (ccheck == 0) {
            for (y = 36; y <= 39; y++) {
                for (x = 0; x <= 3; x++) {
                    var z = (y * 30) + x;
                    aLayer28[z] = aMapCompass[ccount];
                    ccount += 1;
                    compass = 4;
                    aLayerShow[28] = 1;
                }
            }
        }
    }


}



// ======================================================

function makeRooms() {

    for (ds = 0; ds <= zDungeonSize; ds++) {
        roomMaker(0);
    }
    roomMaker(2);
    roomMaker(1);
}




// =======================================================

function showGrid(layer) {


    pagedisp = "";

    pagedisp += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    for (y = 0; y <= 39; y++) {
        pagedisp += "<tr> ";
        for (x = 0; x <= 29; x++) {
            pagedisp += "<td width=\"20\"> ";
            var z = (y * 30) + x;

            pagedisp += "<img src=\"images/";
            if (layer == 0) {
                if (aBaseGrid[z] == null) {
                    if (zSkin == 0) {
                        if (zGrid == 0) {
                            pagedisp += "02"
                        } else {
                            pagedisp += "02b"
                        }
                    }
                    if (zSkin == 1) {
                        if (zGrid == 0) {
                            pagedisp += "02a"
                        } else {
                            pagedisp += "02ab"
                        }
                    }
                } else {
                    pagedisp += aBaseGrid[z]
                }
            }
            if (layer == 1) {
                if (aLayer1[z] == null) {
                    pagedisp += "20"
                } else {
                    if (zGrid == 0) {
                        pagedisp += aLayer1[z]
                    } else {
                        pagedisp += aLayer1[z]
                        pagedisp += "b";
                    }


                }
            }
            if (layer == 14) {
                if (aLayer14[z] == null) {
                    pagedisp += "20"
                } else {
                    pagedisp += aLayer14[z]
                }
            }
            if (layer == 15) {
                if (aLayer15[z] == null) {
                    pagedisp += "20"
                } else {
                    pagedisp += aLayer15[z]
                }
            }
            if (layer == 16) {
                if (aLayer16[z] == null) {
                    pagedisp += "20"
                } else {
                    pagedisp += aLayer16[z]
                }
            }
            if (layer == 17) {
                if (aLayer17[z] == null) {
                    pagedisp += "20"
                } else {
                    pagedisp += aLayer17[z]
                }
            }

            if (layer == 27) {
                if (aLayer27[z] == null) {
                    pagedisp += "2"
                } else {
                    pagedisp += "w"
                    pagedisp += aLayer27[z]
                }
            }

            if (layer == 28) {
                if (aLayer28[z] == null) {
                    pagedisp += "20"
                } else {
                    pagedisp += aLayer28[z]
                }
            }

            pagedisp += ".gif\"/>";
            pagedisp += "</td>";
        }
        pagedisp += "</tr>";
    }
    pagedisp += "</table>";


    if (layer == 0 && aLayerShow[layer] == 1) {
        display("pagedisplay", pagedisp);
    }
    if (layer == 1 && aLayerShow[layer] == 1) {
        display("pagedisplay1", pagedisp);
    }
    if (layer == 14 && aLayerShow[layer] == 1) {
        display("pagedisplay14", pagedisp);
    }
    if (layer == 15 && aLayerShow[layer] == 1) {
        display("pagedisplay15", pagedisp);
    }
    if (layer == 16 && aLayerShow[layer] == 1) {
        display("pagedisplay16", pagedisp);
    }
    if (layer == 17 && aLayerShow[layer] == 1) {
        display("pagedisplay17", pagedisp);
    }
    if (layer == 27 && aLayerShow[layer] == 1) {
        display("pagedisplay27", pagedisp);
    }
    if (layer == 28 && aLayerShow[layer] == 1) {
        display("pagedisplay28", pagedisp);
    }


}


// =======================================================

function showNumbers() {

    pagedisp = "";
    pagedisp += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    for (y = 0; y <= 39; y++) {
        pagedisp += "<tr valign=\"middle\"> ";
        for (x = 0; x <= 29; x++) {
            pagedisp += "<td width=\"20\" align=\"center\"> ";
            var z = (y * 30) + x;
            if (aLayer26[z] != null) {
                if (aLayer26[z] <= 9) {
                    pagedisp += "<span class=\"numbers\">" + aLayer26[z] + "</span>";
                } else {
                    pagedisp += "<span class=\"numberssmall\">" + aLayer26[z] + "</span>";
                }
            } else {
                pagedisp += "<img src=\"images/20.gif\"/>";
            }
            pagedisp += "</td>";
        }
        pagedisp += "</tr>";
    }
    pagedisp += "</table>";

    display("pagedisplay26", pagedisp);

}


// ======================================================

function hallwayExitScrub() {

    for (room = 1; room <= totalrooms; room++) {

        // flag room exits
        starty = aRoomData[(room * 5) + 4];
        endy = starty + (aRoomData[(room * 5) + 2] - 1);
        startx = aRoomData[(room * 5) + 5];
        endx = startx + (aRoomData[(room * 5) + 3] - 1);


        // set room doors to not be scrubbed		

        for (y = starty; y <= endy; y++) {
            for (x = startx; x <= endx; x++) {
                var z = (y * 30) + x;
                if (aLayer14[z] == "21") {
                    aLayer14[z] = "21x"
                }
                if (aLayer15[z] == "22") {
                    aLayer15[z] = "22x"
                }
                if (aLayer16[z] == "23") {
                    aLayer16[z] = "23x"
                }
                if (aLayer17[z] == "24") {
                    aLayer17[z] = "24x"
                }
            }
        }



        // set room door opposites to not be scrubbed 

        for (y = starty; y <= endy; y++) {
            for (x = startx; x <= endx; x++) {
                var z = (y * 30) + x;

                if (aLayer14[z] == "21x") {
                    var k = ((y - 1) * 30) + x;
                    if (aLayer16[k] == "23") {
                        aLayer16[k] = "23x";
                    }
                }
                if (aLayer15[z] == "22x") {
                    var k = (y * 30) + (x + 1);
                    if (aLayer17[k] == "24") {
                        aLayer17[k] = "24x";
                    }
                }
                if (aLayer16[z] == "23x") {
                    var k = ((y + 1) * 30) + x;
                    if (aLayer14[k] == "21") {
                        aLayer14[k] = "21x";
                    }
                }
                if (aLayer17[z] == "24x") {
                    var k = (y * 30) + (x - 1);
                    if (aLayer15[k] == "22") {
                        aLayer15[k] = "22x";
                    }
                }

            }
        }


    }

    // scrub halways doors 

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;

            scrub = rand(100) + 1;
            //			scrub = 1;

            if (scrub <= zScrubPercent) { // remove door		
                if (aLayer14[z] == "21") {
                    aLayer14[z] = "20";
                }
                if (aLayer15[z] == "22") {
                    aLayer15[z] = "20";
                }
                if (aLayer16[z] == "23") {
                    aLayer16[z] = "20";
                }
                if (aLayer17[z] == "24") {
                    aLayer17[z] = "20";
                }
            }

        }
    }


    // scrub removed door opposites

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;

            if (aLayer14[z] == "20") {
                var k = ((y - 1) * 30) + x;
                if (aLayer16[k] == "23") {
                    aLayer16[k] = "20";
                }
            }
            if (aLayer15[z] == "20") {
                var k = (y * 30) + (x + 1);
                if (aLayer17[k] == "24") {
                    aLayer17[k] = "20";
                }
            }
            if (aLayer16[z] == "20") {
                var k = ((y + 1) * 30) + x;
                if (aLayer14[k] == "21") {
                    aLayer14[k] = "20";
                }
            }
            if (aLayer17[z] == "20") {
                var k = (y * 30) + (x - 1);
                if (aLayer15[k] == "22") {
                    aLayer15[k] = "20";
                }
            }

        }
    }




    // fix room doors	

    for (y = 0; y <= 39; y++) {
        for (x = 0; x <= 29; x++) {
            var z = (y * 30) + x;
            if (aLayer14[z] == "21x") {
                aLayer14[z] = "21";
            }
            if (aLayer15[z] == "22x") {
                aLayer15[z] = "22";
            }
            if (aLayer16[z] == "23x") {
                aLayer16[z] = "23";
            }
            if (aLayer17[z] == "24x") {
                aLayer17[z] = "24";
            }
        }
    }



}




// ======================================================

function showRoomData() {

    pagedisp = "";




    pagedisp += "<table width=\"620\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    pagedisp += "<tr valign=\"top\">";
    pagedisp += "<td class=\"desctext\">";

    for (room = 1; room <= totalrooms; room++) {

        // check exits
        aRoomExits = new Array(0, 0, 0, 0, 0);

        starty = aRoomData[(room * 5) + 4];
        endy = starty + (aRoomData[(room * 5) + 2] - 1);
        startx = aRoomData[(room * 5) + 5];
        endx = startx + (aRoomData[(room * 5) + 3] - 1);

        var roomsize = 0;
        for (y = starty; y <= endy; y++) {
            for (x = startx; x <= endx; x++) {
                var z = (y * 30) + x;
                if (aLayer1[z] == "10") {
                    roomsize += 1;
                }
                if (aLayer14[z] != null) {
                    aRoomExits[0] += 1;
                    aRoomExits[1] += 1;
                }
                if (aLayer15[z] != null) {
                    aRoomExits[0] += 1;
                    aRoomExits[2] += 1;
                }
                if (aLayer16[z] != null) {
                    aRoomExits[0] += 1;
                    aRoomExits[3] += 1;
                }
                if (aLayer17[z] != null) {
                    aRoomExits[0] += 1;
                    aRoomExits[4] += 1;
                }

            }
        }

        pagedisp += "<b>ROOM: " + room + "</b><br/>";
        pagedisp += "This room is " + aRoomData[(room * 5) + 3] + "0 x " + aRoomData[(room * 5) + 2] + "0 feet ";

        if (roomsize <= 1) {
            pagedisp += "(Tiny)";
        }
        if (roomsize >= 2 && roomsize <= 9) {
            pagedisp += "(Small)";
        }
        if (roomsize >= 10 && roomsize <= 25) {
            pagedisp += "(Medium)";
        }
        if (roomsize >= 26) {
            pagedisp += "(Large)";
        }



        pagedisp += "<br/>";

        pagedisp += "<table border=\"0\" cellpadding=\"2\" cellspacing=\"2\" width=\"600\" bgcolor=\"#e3e3e3\"  background=\"images/grey.jpg\"><tr><td><font size=\"2\" face=\"arial\">";



        if (roomsize <= 1) {
            var dRoll = aRandRoomDescTinyFiltered.length - 1;
            var d = rand(dRoll) + 1;
            //	pagedisp += d + "/" + dRoll + " ";
            pagedisp += aRandRoomDescTinyFiltered[d];
            descnote = aRandRoomNoteTinyFiltered[d];
            aRandRoomDescTinyFiltered[d] = "###";
        }
        if (roomsize >= 2 && roomsize <= 9) {
            var dRoll = aRandRoomDescSmallFiltered.length - 1;
            var d = rand(dRoll) + 1;
            //	pagedisp += d + "/" + dRoll + " ";
            pagedisp += aRandRoomDescSmallFiltered[d];
            descnote = aRandRoomNoteTinyFiltered[d];
            aRandRoomDescSmallFiltered[d] = "###";
        }
        if (roomsize >= 10 && roomsize <= 25) {
            var dRoll = aRandRoomDescMediumFiltered.length - 1;
            var d = rand(dRoll) + 1;
            //	pagedisp += d + "/" + dRoll + " ";
            pagedisp += aRandRoomDescMediumFiltered[d];
            descnote = aRandRoomNoteTinyFiltered[d];
            aRandRoomDescMediumFiltered[d] = "###";
        }
        if (roomsize >= 26) {
            var dRoll = aRandRoomDescLargeFiltered.length - 1;
            var d = rand(dRoll) + 1;
            //	pagedisp += d + "/" + dRoll + " ";
            pagedisp += aRandRoomDescLargeFiltered[d];
            descnote = aRandRoomNoteTinyFiltered[d];
            aRandRoomDescLargeFiltered[d] = "###";
        }

        cleanFiltered();


        pagedisp += "</font></td></tr></table>";

        pagedisp += "<br/>";

        if (descnote != "") {
            pagedisp += descnote;
            pagedisp += "<br/><br/>";
        }

        dtlen = doortraplist.length - 1;
        for (dtl = 0; dtl <= dtlen; dtl++) {
            doortraplist[dtl] = 0;
        }
        dtloc = 0;

        pagedisp += "<li>Doors<br/>";

        for (y = starty; y <= endy; y++) {
            for (x = startx; x <= endx; x++) {
                var z = (y * 30) + x;
                trapcheck = 0;
                if (aLayer10[z] != null) {
                    trapcheck = aLayer10t[z];
                    secretcheck = aLayer10s[z];
                    pagedisp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
                    if (aLayer10s[z] == 1 || aLayer10s[z] == 2) {
                        pagedisp += "Secret: ";
                    }
                    if (aLayer10s[z] == 3) {
                        pagedisp += "Portcullis, iron: ";
                    }
                    if (aLayer10s[z] == 4) {
                        pagedisp += "Portcullis, wooden: ";
                    }
                    pagedisp += "North " + (x - (startx - 1)) + "0 feet from west wall. "
                    if (aLayer10s[z] == 3) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[2 in. thick; hardness 10; hp 60; break DC 28 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer10s[z] == 4) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[3 in. thick; hardness 5; hp 30; break DC 23 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer10s[z] != 3 && aLayer10s[z] != 4) {
                        doorRerollCheck(aLayer10[z])
                        if (rerollspecial == 1) {
                            pagedisp += doorInfo(aLayer10r[z])
                        } else {
                            pagedisp += doorInfo(aLayer10[z])
                        }
                    }
                    pagedisp += "<br/>";
                }

                if (aLayer11[z] != null) {
                    trapcheck = aLayer11t[z];
                    secretcheck = aLayer11s[z];
                    pagedisp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
                    if (aLayer11s[z] == 1 || aLayer11s[z] == 2) {
                        pagedisp += "Secret: ";
                    }
                    if (aLayer11s[z] == 3) {
                        pagedisp += "Portcullis, iron: ";
                    }
                    if (aLayer11s[z] == 4) {
                        pagedisp += "Portcullis, wooden: ";
                    }
                    pagedisp += "East " + (y - (starty - 1)) + "0 feet from north wall. "
                    if (aLayer11s[z] == 3) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[2 in. thick; hardness 10; hp 60; break DC 28 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer11s[z] == 4) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[3 in. thick; hardness 5; hp 30; break DC 23 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer11s[z] != 3 && aLayer11s[z] != 4) {
                        doorRerollCheck(aLayer11[z]);
                        if (rerollspecial == 1) {
                            pagedisp += doorInfo(aLayer11r[z])
                        } else {
                            pagedisp += doorInfo(aLayer11[z])
                        }
                    }
                    pagedisp += "<br/>";
                }

                if (aLayer12[z] != null) {
                    trapcheck = aLayer12t[z];
                    secretcheck = aLayer12s[z];
                    pagedisp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
                    if (aLayer12s[z] == 1 || aLayer12s[z] == 2) {
                        pagedisp += "Secret: ";
                    }
                    if (aLayer12s[z] == 3) {
                        pagedisp += "Portcullis, iron: ";
                    }
                    if (aLayer12s[z] == 4) {
                        pagedisp += "Portcullis, wooden: ";
                    }
                    pagedisp += "South " + (x - (startx - 1)) + "0 feet from west wall. "
                    if (aLayer12s[z] == 3) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[2 in. thick; hardness 10; hp 60; break DC 28 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer12s[z] == 4) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[3 in. thick; hardness 5; hp 30; break DC 23 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer12s[z] != 3 && aLayer12s[z] != 4) {
                        doorRerollCheck(aLayer12[z]);
                        if (rerollspecial == 1) {
                            pagedisp += doorInfo(aLayer12r[z])
                        } else {
                            pagedisp += doorInfo(aLayer12[z])
                        }
                    }
                    pagedisp += "<br/>";
                }

                if (aLayer13[z] != null) {
                    trapcheck = aLayer13t[z];
                    secretcheck = aLayer13s[z];
                    pagedisp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
                    if (aLayer13s[z] == 1 || aLayer13s[z] == 2) {
                        pagedisp += "Secret: ";
                    }
                    if (aLayer13s[z] == 3) {
                        pagedisp += "Portcullis, iron: ";
                    }
                    if (aLayer13s[z] == 4) {
                        pagedisp += "Portcullis, wooden: ";
                    }
                    pagedisp += "West " + (y - (starty - 1)) + "0 feet from north wall. "
                    if (aLayer13s[z] == 3) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[2 in. thick; hardness 10; hp 60; break DC 28 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer13s[z] == 4) {
                        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
                            pagedisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                            pagedisp += "<font size=\"1\" color=\"#777777\">";
                            pagedisp += "[3 in. thick; hardness 5; hp 30; break DC 23 -- Lift: DC 25 Strength check]</font>"
                        }
                    }
                    if (aLayer13s[z] != 3 && aLayer13s[z] != 4) {
                        doorRerollCheck(aLayer13[z]);
                        if (rerollspecial == 1) {
                            pagedisp += doorInfo(aLayer13r[z])
                        } else {
                            pagedisp += doorInfo(aLayer13[z])
                        }
                    }
                    pagedisp += "<br/>";
                }

            }
        }



        pagedisp += getRoomContents();

        pagedisp += "<br/><br/>";
        // 		pagedisp += doorTrapDesc();
        //		pagedisp += "<br/>";	



    }

    pagedisp += "</td>";
    pagedisp += "</tr>";
    pagedisp += "</table>";

    if (zTraps == 0) { // check to see if trap summary is on 0=on 1=0ff
        pagedisp += "<br/><br/>";
        pagedisp += "<table width=\"600\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
        pagedisp += "<tr valign=\"top\">";
        pagedisp += "<td class=\"desctext\" colspan=\"2\">";
        pagedisp += "<hr size=\"1\">";
        pagedisp += "<b>TRAP SUMMARY</b><br/><br/>";
        pagedisp += "</td>";
        pagedisp += "</tr>";
        pagedisp += masterTrap();
        pagedisp += "</table>";
    }

    if (zHooks != 0) { // check to see if simple hooks is on 1-5=on 0=0ff
        pagedisp += displayhook();
    }

    //	alert(xSaveValue);
    pagedisp += "<hr size=\"1\" width=\"600\">";
    pagedisp += "<span class=\"desctext\">";
    pagedisp += "<b>Map Only</b><br/>";
    pagedisp += "<input type=\"text\" name=\"savedvalue2\" size=\"90\" maxlength=\"100\" value=\"" + xSaveValue2b + "\">";
    pagedisp += "<br/><b>Map and Adventure</b> (<a href=\"mapper.htm?" + xSaveValue2a + "\" target=\"_blank\">Create New Adventure</a>)<br/>";
    pagedisp += "<input type=\"text\" name=\"savedvalue\" size=\"90\" maxlength=\"100\" value=\"" + xSaveValue + "\">";
    pagedisp += "</span><br/><br/>";



    //pagedisp += aRandRoomDescTinyFiltered;
    //pagedisp += "<br/><br/>";
    //pagedisp += aRandRoomDescSmallFiltered;
    //pagedisp += "<br/><br/>";
    //pagedisp += aRandRoomDescMediumFiltered;
    //pagedisp += "<br/><br/>";
    //pagedisp += aRandRoomDescLargeFiltered;
    //pagedisp += "<br/><br/>";

    //pagedisp += Table319Filtered;
    //pagedisp += "<br/><br/>";

    pagedisp += "<table width=\"620\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    pagedisp += "<tr valign=\"top\">";
    pagedisp += "<td class=\"desctext\" align=\"center\">";
    pagedisp += "&#169; 2006 Wizards of the Coast, Inc., a subsidiary of Hasbro, Inc. All Rights Reserved.<br/><br/>";
    pagedisp += "</td>";
    pagedisp += "</tr>";
    pagedisp += "</table>";


    pagedisp = seedIntro() + pagedisp;

    pagedisp = makeIntro() + pagedisp;




    display("roomdata", pagedisp);

}


// ======================================================

function seedIntro() {

    seedintro = "";

    if (zAdvSeed != "0") {

        seedintro = "<table border=\"0\" cellpadding=\"2\" cellspacing=\"2\" width=\"600\" ><tr><td>";
        seedintro += "<span class=\"desctext\">";
        seedintro += "<b>ADVENTURE SEED TEST</b><br/><br/>";
        seedintro += "This is a test of the Adventure Seed generator. The selected seed is " + vTitle + " (" + zAdvSeed + ").";
        seedintro += "<br/><br/></span>";
        seedintro += "<hr size=\"1\">";
        seedintro += "</td></tr></table>";

    }

    return seedintro;

}

// ======================================================

function makeIntro() {

    if (zIntro == 0) { // check to see if adventure intro is on 0=on 1=0ff

        advintro = "<table border=\"0\" cellpadding=\"2\" cellspacing=\"2\" width=\"600\" ><tr><td>";

        // ==== Headline ====	

        advintro += "<span class=\"headline\"><b>";

        if (zTheme == "A") {
            advintro += "Generic Dungeon";
        }
        if (zTheme == "C") {
            advintro += "Generic Crypt";
        }
        if (zTheme == "S") {
            advintro += "Generic Sewers";
        }

        advintro += "</b></span><br/>";

        // ==== Subheadline ====

        advintro += "<span class=\"subheadline\">";
        advintro += "<b>A Random Adventure for Four " + zLevel;

        var zLevelSuffix = "";
        if (zLevel == 1) { zLevelSuffix = "st" };
        if (zLevel == 2) { zLevelSuffix = "nd" };
        if (zLevel == 3) { zLevelSuffix = "rd" };
        if (zLevel >= 4) { zLevelSuffix = "th" };

        advintro += zLevelSuffix + "-Level Player Characters.</b>";
        advintro += "</span>";

        // ==== Preparation ====
        advintro += "<hr size=\"1\">";
        advintro += "<span class=\"desctext\">";
        advintro += "<b>PREPARATION</b><br/>";
        advintro += "You (the DM) need the D&D core rulebooks, including the <i>Player’s Handbook</i>, the <i>Dungeon Master’s Guide</i>, and the <i>Monster Manual</i> to run this adventure.";

        if (advBooks[1] >= 1) {

            advintro += " In addition, you might want to keep the ";

            var totBooks = 0;
            for (xBooks = 2; xBooks <= maxbooks; xBooks++) {
                if (advBooks[xBooks] == 1) { totBooks += 1 }
            }

            var lastbook = 0;
            for (xBooks = 0; xBooks <= maxbooks; xBooks++) {

                if (advBooks[xBooks] == 1) {

                    if (xBooks == 2) { advintro += "<i>Monster Manual II</i>"; lastbook += 1 }
                    if (xBooks == 3) { advintro += "<i>Monster Manual III</i>"; lastbook += 1 }
                    if (xBooks == 4) { advintro += "<i>Monster Manual IV</i>"; lastbook += 1 }
                    if (xBooks == 5) { advintro += "<i>Fiend Folio</i>"; lastbook += 1 }
                    if (xBooks == 6) { advintro += "<i>Expanded Psionics Handbook</i>"; lastbook += 1 }
                    if (xBooks == 7) { advintro += "<i>Complete Psionic</i>"; lastbook += 1 }
                    if (xBooks == 8) { advintro += "<i>Fiendish Codex I: Hordes of the Abyss</i>"; lastbook += 1 }
                    if (xBooks == 9) { advintro += "<i>Libris Mortis</i>"; lastbook += 1 }
                    if (xBooks == 10) { advintro += "<i>Lords of Madness</i>"; lastbook += 1 }

                    if (lastbook == (totBooks - 1) && totBooks >= 2) {
                        advintro += ", and ";
                    }
                    if (lastbook < (totBooks - 1) && totBooks >= 2) {
                        advintro += ", ";
                    }

                }



            }

            advintro += " handy.";

        }

        advintro += " This adventure utilizes the D&D v.3.5 core rules, but it can easily be used with the 3.0 rules as well.";
        advintro += "<br/><br/>To get started, print out the adventure. Read through the encounters at least once to familiarize yourself with them. Text that appears in shaded boxes is player information that you can read aloud or paraphrase for the players at the proper times.<br/><br/>";


        if (zFeatures == 0) { // check to see if dungeon features is on 0=on 1=0ff

            // ==== Dungeon Features ====

            advintro += "<span class=\"desctext\">";
            advintro += "<b>DUNGEON FEATURES</b><br/>";
            advintro += "The following features are true unless otherwise noted in a specific room description";
            advintro += "<br/>- <i>Walls:</i> All walls are standard masonary walls. Masonary walls are the most common kind of dungeon wall. Often these ancient walls sport cracks and crevices, and sometimes dangerous slimes or small monsters live in these areas and wait for prey. Masonary walls stop all but the loudest noises. (Typical thickness 1ft.; break DC 35; hardness 8; hp 90; climb DC 20). See Table 3-9:Walls in the <i>Dungeon Master's Guide</i> for other wall stats.";
            advintro += "<br/>- <i>Floor:</i> All floors in the dungeon are Flagstone. Like masonary walls, flagstone floors are made of fitted stones, they are usually cracked and only somewhat level. Slime and mold grows in these cracks. Sometimes water runs in rivulets between the stones or sits in stagnant puddles. Flagstone is the most common dungeon floor.";
            advintro += "<br/>- <i>Ceiling:</i> The average heigth of the ceiling in the dungeon is 15 ft.";
            advintro += "<br/>- <i>Doors:</i> All doors have their qualities listed in the room descriptions below. You may replace any or all doors with different types. An average door would have the following qualities (Wooden Door: 1in. thick; hardness 5; hp 10; AC5; break DC 18).";
            advintro += "<br/>- <i>Light:</i> Many rooms are lightless. A light source is required for characters to see without darkvision.";
            advintro += "<br/>- <i>Ventilation:</i> All rooms contain an adequate air supply. The air is renewed from small vents leading to the exterior of the dungeon. These vents are individually too small for any but Fine creatures to navigate.";
            advintro += "</span><br/><br/>";

        }

        if (zRandEnc == 0) { // check to see if wandering monsters is on 0=on 1=0ff	

            // ==== Wandering Monsters ====

            advintro += "<span class=\"desctext\">";
            advintro += "<b>WANDERING MONSTERS</b><br/>";
            advintro += "Monsters wander in areas of the dungeon not already populated with monsters. For every 4 hours the PCs spend in the dungeon, roll d% on the following table while the PCs are in an accessible hallway or room. (Characters who have locked themselves in a room or secret area are immune from wandering encounters.) On a roll of 41 or higher, no encounter occurs. On a roll of 1-40, read the result on the table and apply the suggested encounter.<br/><br/>";

            advintro += "<table border=\"0\" cellpadding=\"2\" cellspacing=\"2\" >";
            advintro += "<tr><td align=\"center\" class=\"desctext\"><b>d%</b></td><td class=\"desctext\"><b>Monster Information</b></td></tr>";
            advintro += "<tr bgcolor=\"#ededed\"><td valign=\"top\" align=\"center\" class=\"desctext\">";
            advintro += "<b>1-8</b>";
            advintro += "</td><td valign=\"top\" class=\"desctext\">";
            advintro += wanderingmonsters();
            advintro += "</td></tr>";
            advintro += "<tr><td valign=\"top\" align=\"center\" class=\"desctext\">";
            advintro += "<b>9-16</b>";
            advintro += "</td><td valign=\"top\" class=\"desctext\">";
            advintro += wanderingmonsters();
            advintro += "</td></tr>";
            advintro += "<tr bgcolor=\"#ededed\"><td valign=\"top\" align=\"center\" class=\"desctext\">";
            advintro += "<b>17-24</b>";
            advintro += "</td><td valign=\"top\" class=\"desctext\">";
            advintro += wanderingmonsters();
            advintro += "</td></tr>";
            advintro += "<tr><td valign=\"top\" align=\"center\" class=\"desctext\">";
            advintro += "<b>25-32</b>";
            advintro += "</td><td valign=\"top\" class=\"desctext\">";
            advintro += wanderingmonsters();
            advintro += "</td></tr>";
            advintro += "<tr bgcolor=\"#ededed\"><td valign=\"top\" align=\"center\" class=\"desctext\">";
            advintro += "<b>33-40</b>";
            advintro += "</td><td valign=\"top\" class=\"desctext\">";
            advintro += wanderingmonsters();
            advintro += "</td></tr>";
            advintro += "<tr><td valign=\"top\" align=\"center\" class=\"desctext\">";
            advintro += "<b>41+</b>";
            advintro += "</td><td valign=\"top\" class=\"desctext\">";
            advintro += "<b>No Encounter</b>";
            advintro += "</td></tr>";
            advintro += "</table>";


            advintro += "</span>";

        }

        // ========


        advintro += "<hr size=\"1\">";
        advintro += "</td></tr></table>";

    }

    return advintro;

}


// ======================================================

function wanderingmonsters() {

    var TotMonsters = 0;
    monsterdisp = "";
    listlevel = 0;

    var MonsterTemp = new Array(0);

    if (zLevel == "1") {
        var md = rand(MonstersLevelOneWandering.length - 1) + 1;
        var mdx = MonstersLevelOneWandering[md] * 10
        if (MonstersLevelOne[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelOne[mdx + mq];
            }
        }
    }

    if (zLevel == "2") {
        var md = rand(MonstersLevelTwoWandering.length - 1) + 1;
        var mdx = MonstersLevelTwoWandering[md] * 10
        if (MonstersLevelTwo[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwo[mdx + mq];
            }
        }
    }

    if (zLevel == "3") {
        var md = rand(MonstersLevelThreeWandering.length - 1) + 1;
        var mdx = MonstersLevelThreeWandering[md] * 10
        if (MonstersLevelThree[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThree[mdx + mq];
            }
        }
    }

    if (zLevel == "4") {
        var md = rand(MonstersLevelFourWandering.length - 1) + 1;
        var mdx = MonstersLevelFourWandering[md] * 10
        if (MonstersLevelFour[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFour[mdx + mq];
            }
        }
    }

    if (zLevel == "5") {
        var md = rand(MonstersLevelFiveWandering.length - 1) + 1;
        var mdx = MonstersLevelFiveWandering[md] * 10
        if (MonstersLevelFive[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFive[mdx + mq];
            }
        }
    }

    if (zLevel == "6") {
        var md = rand(MonstersLevelSixWandering.length - 1) + 1;
        var mdx = MonstersLevelSixWandering[md] * 10
        if (MonstersLevelSix[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSix[mdx + mq];
            }
        }
    }

    if (zLevel == "7") {
        var md = rand(MonstersLevelSevenWandering.length - 1) + 1;
        var mdx = MonstersLevelSevenWandering[md] * 10
        if (MonstersLevelSeven[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeven[mdx + mq];
            }
        }
    }

    if (zLevel == "8") {
        var md = rand(MonstersLevelEightWandering.length - 1) + 1;
        var mdx = MonstersLevelEightWandering[md] * 10
        if (MonstersLevelEight[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEight[mdx + mq];
            }
        }
    }

    if (zLevel == "9") {
        var md = rand(MonstersLevelNineWandering.length - 1) + 1;
        var mdx = MonstersLevelNineWandering[md] * 10
        if (MonstersLevelNine[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNine[mdx + mq];
            }
        }
    }

    if (zLevel == "10") {
        var md = rand(MonstersLevelTenWandering.length - 1) + 1;
        var mdx = MonstersLevelTenWandering[md] * 10
        if (MonstersLevelTen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTen[mdx + mq];
            }
        }
    }

    if (zLevel == "11") {
        var md = rand(MonstersLevelElevenWandering.length - 1) + 1;
        var mdx = MonstersLevelElevenWandering[md] * 10
        if (MonstersLevelEleven[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEleven[mdx + mq];
            }
        }
    }

    if (zLevel == "12") {
        var md = rand(MonstersLevelTwelveWandering.length - 1) + 1;
        var mdx = MonstersLevelTwelveWandering[md] * 10
        if (MonstersLevelTwelve[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwelve[mdx + mq];
            }
        }
    }

    if (zLevel == "13") {
        var md = rand(MonstersLevelThirteenWandering.length - 1) + 1;
        var mdx = MonstersLevelThirteenWandering[md] * 10
        if (MonstersLevelThirteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThirteen[mdx + mq];
            }
        }
    }

    if (zLevel == "14") {
        var md = rand(MonstersLevelFourteenWandering.length - 1) + 1;
        var mdx = MonstersLevelFourteenWandering[md] * 10
        if (MonstersLevelFourteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFourteen[mdx + mq];
            }
        }
    }

    if (zLevel == "15") {
        var md = rand(MonstersLevelFifteenWandering.length - 1) + 1;
        var mdx = MonstersLevelFifteenWandering[md] * 10
        if (MonstersLevelFifteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFifteen[mdx + mq];
            }
        }
    }

    if (zLevel == "16") {
        var md = rand(MonstersLevelSixteenWandering.length - 1) + 1;
        var mdx = MonstersLevelSixteenWandering[md] * 10
        if (MonstersLevelSixteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSixteen[mdx + mq];
            }
        }
    }

    if (zLevel == "17") {
        var md = rand(MonstersLevelSeventeenWandering.length - 1) + 1;
        var mdx = MonstersLevelSeventeenWandering[md] * 10
        if (MonstersLevelSeventeen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeventeen[mdx + mq];
            }
        }
    }

    if (zLevel == "18") {
        var md = rand(MonstersLevelEighteenWandering.length - 1) + 1;
        var mdx = MonstersLevelEighteenWandering[md] * 10
        if (MonstersLevelEighteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEighteen[mdx + mq];
            }
        }
    }

    if (zLevel == "19") {
        var md = rand(MonstersLevelNineteenWandering.length - 1) + 1;
        var mdx = MonstersLevelNineteenWandering[md] * 10
        if (MonstersLevelNineteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNineteen[mdx + mq];
            }
        }
    }

    if (zLevel == "20") {
        var md = rand(MonstersLevelTwentyWandering.length - 1) + 1;
        var mdx = MonstersLevelTwentyWandering[md] * 10
        if (MonstersLevelTwenty[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwenty[mdx + mq];
            }
        }
    }


    setmephits() // Reset mephits

    // determine how many different monsters there are
    for (mq = 4; mq <= 8; mq++) {
        if (MonsterTemp[mq] != "") {
            TotMonsters += 1
        }
    }

    for (mon = 1; mon <= TotMonsters; mon++) {

        var MonsterData = MonsterTemp[3 + mon];

        var MonsterInfo = MonsterData.split(';');

        for (mi = 0; (mi < MonsterInfo.length); mi++) {
            MonsterInfo[mi] = unescape(MonsterInfo[mi]);
        }

        if (MonsterInfo[1] == "P") {
            TotMon = prevmon;
        } else {
            TotMon = mDice(MonsterInfo[1], MonsterInfo[2], MonsterInfo[3]);
            prevmon = TotMon;
        }

        monsterdisp += "<b>" + MonsterInfo[0] + "</b> (" + TotMon + "): hp ";

        for (mhp = 1; mhp <= TotMon; mhp++) {
            MonHP = mDice(MonsterInfo[4], MonsterInfo[5], MonsterInfo[6])
            if (MonsterInfo[7] >= 1) {
                MonHP2 = mDice(MonsterInfo[7], MonsterInfo[8], MonsterInfo[9])
                MonHP += MonHP2
            }

            // If HP is lower than 33% of max adjust up to 33%
            m25 = Math.floor((MonsterInfo[10] * 2) * .33);

            if (MonsterInfo[4] == "1/4") {
                m25 = Math.floor(((MonsterInfo[10] * 2) * .25) * .33);
            }
            if (m25 <= 1) {
                m25 = 1;
            }
            if (MonHP <= m25) {
                MonHP = m25;
            }
            // ===					
            monsterdisp += MonHP;
            if (mhp != TotMon) {
                monsterdisp += ", ";
            } else {
                monsterdisp += ".";
            }
        }

        // extra info for DM

        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff	

            monsterdisp += "<br/>&nbsp;&nbsp;&nbsp;";
            monsterdisp += "<font size=\"1\" color=\"#777777\">";

            //			monsterdisp += "[Table: " + listlevel;				
            //			monsterdisp += ", Amount: " + MonsterInfo[1];					
            monsterdisp += "[Amount: " + MonsterInfo[1];


            if (MonsterInfo[2] >= 2) {
                monsterdisp += "d" + MonsterInfo[2];
            }
            if (MonsterInfo[3] >= 1) {
                monsterdisp += "+" + MonsterInfo[3];
            }
            monsterdisp += ", HD: " + MonsterInfo[4];
            if (MonsterInfo[5] >= 2) {
                monsterdisp += "d" + MonsterInfo[5];
            }
            if (MonsterInfo[6] >= 1) {
                monsterdisp += "+" + MonsterInfo[6];
            }
            if (MonsterInfo[6] < 0) {
                monsterdisp += MonsterInfo[6];
            }

            if (MonsterInfo[7] >= 1) {
                monsterdisp += " plus " + MonsterInfo[7];
            }
            if (MonsterInfo[8] >= 2) {
                monsterdisp += "d" + MonsterInfo[8];
            }
            if (MonsterInfo[9] >= 1) {
                monsterdisp += "+" + MonsterInfo[9];
            }
            if (MonsterInfo[9] < 0) {
                monsterdisp += MonsterInfo[9];
            }

            monsterdisp += " (" + MonsterInfo[10] + ")";
            monsterdisp += ", CR: " + MonsterInfo[11];
            monsterdisp += ", Source: ";
            mxsource = "<i>Unknown</i>";
            if (MonsterInfo[13] == "M") {
                mxsource = "<i>Monster Manual</i>";
            }
            if (MonsterInfo[13] == "2") {
                mxsource = "<i>Monster Manual II</i>";
                advBooks[1] = 1;
                advBooks[2] = 1;
            }
            if (MonsterInfo[13] == "3") {
                mxsource = "<i>Monster Manual III</i>";
                advBooks[1] = 1;
                advBooks[3] = 1;
            }
            if (MonsterInfo[13] == "4") {
                mxsource = "<i>Monster Manual IV</i>";
                advBooks[1] = 1;
                advBooks[4] = 1;
            }
            if (MonsterInfo[13] == "F") {
                mxsource = "<i>Fiend Folio</i>";
                advBooks[1] = 1;
                advBooks[5] = 1;
            }
            if (MonsterInfo[13] == "D") {
                mxsource = "<i>Dungeon Master\'s Guild</i>";
            }
            if (MonsterInfo[13] == "X") {
                mxsource = "<i>Expanded Psionics Handbook</i>";
                advBooks[1] = 1;
                advBooks[6] = 1;
            }
            if (MonsterInfo[13] == "P") {
                mxsource = "<i>Complete Psionic</i>";
                advBooks[1] = 1;
                advBooks[7] = 1;
            }
            if (MonsterInfo[13] == "H") {
                mxsource = "<i>Fiendish Codex I: Hordes of the Abyss</i>";
                advBooks[1] = 1;
                advBooks[8] = 1;
            }
            if (MonsterInfo[13] == "L") {
                mxsource = "<i>Libris Mortis</i>";
                advBooks[1] = 1;
                advBooks[9] = 1;
            }
            if (MonsterInfo[13] == "A") {
                mxsource = "<i>Lords of Madness</i>";
                advBooks[1] = 1;
                advBooks[10] = 1;
            }


            monsterdisp += mxsource;

            monsterdisp += "]</font>";
        }

        if (mon < TotMonsters) {
            monsterdisp += "<br/>";
        }
    }




    return monsterdisp;

}


// ======================================================

function displayhook() {

    var xhooks = zHooks;
    var advhook = "";

    advhook += "<table border=\"0\" cellpadding=\"2\" cellspacing=\"2\" width=\"600\" ><tr><td>";
    advhook += "<hr size=\"1\">";
    advhook += "<span class=\"desctext\">";
    advhook += "<b>ADVENTURE HOOKS</b>";

    for (hookx = 0; hookx < xhooks; hookx++) {
        var whichauthfig = rand(hookauthfig0.length - 1) + 1;
        var whichconflict = rand(hookauthfig0.length - 1) + 1;
        var whichlocadv = rand(hooklocadv.length - 1) + 1;
        var whichreward = rand(hookreward.length - 1) + 1;
        var whichvillian = rand(hookvillian.length - 1) + 1;

        advhook += "<br><br><b>Hook " + (hookx + 1) + ":</b><br>- You meet " + hookauthfig[whichauthfig] + ", who gives you your mission.<BR>- You have to resolve the " + hookconflict[whichconflict] + ".<BR>- They've determined it is the work of " + hookvillian[whichvillian] + ", and it's up to you to stop it.<BR>- You must travel to " + hooklocadv[whichlocadv] + " to find " + hookvillian[whichvillian] + ".<BR>- End the threat in exchange for " + hookreward[whichreward] + ".";

    }

    advhook += "</span></td></tr></table>";

    return advhook;

}

// ======================================================

function showSaveData() {

    pagedisp = "";

    pagedisp += "<br/><br/>";
    pagedisp += "Map Only (<a href=\"mapper.htm?" + xSaveValue2a + "\" target=\"_blank\">Create Adventure</a>)<br/>";
    pagedisp += "<input type=\"text\" name=\"savedvalue2\" size=\"40\" maxlength=\"60\" value=\"" + xSaveValue2b + "\">";
    pagedisp += "<br/><br/>";
    pagedisp += "&#169; 2006 Wizards of the Coast, Inc., a subsidiary of Hasbro, Inc. All Rights Reserved.";
    pagedisp += "<br/><br/>";

    display("roomdata", pagedisp);

}

// ======================================================

function getRoomContents() {

    roomdisp = "";

    var d = rand(Table318Filtered.length - 1) + 1;
    var dx = Table318Filtered[d] * 8

    if (Table318RandomContents[dx + 3] == 1) {
        //		roomdisp += "<li/> <font color=\"red\">Monsters</font> <br/>"
        roomdisp += "<li/> Monsters <br/>"
        roomdisp += getMonster(zLevel);
        roomdisp += "<br/>"
    }
    if (Table318RandomContents[dx + 4] == 1) {
        roomdisp += "<li/> Features <br/>"
        roomdisp += getFeatures();
    }
    if (Table318RandomContents[dx + 5] == 1) {
        roomdisp += "<li/> Hidden Treasure"
        //		roomdisp += "<li/> <font color=\"red\">Hidden Treasure</font>"	

        roomdisp += getTreasure();
    }
    if (Table318RandomContents[dx + 6] == 1) {
        roomdisp += "<li/> Trap "
        roomdisp += getTraps();
    }
    if (Table318RandomContents[dx + 7] == 1) {
        roomdisp += "<li/> Nothing "
    }

    return roomdisp;

}


// ======================================================

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

// ======================================================

function getTreasure() {

    treasurecheck = 0;
    treasuregrandtotal = 0;

    searchcheck = 20 + parseInt(xLevel);

    treasuredisp = "";
    treasuredisp = " (Search DC " + searchcheck + ")";
    treasuredisp += getTreasureCoins();
    treasuredisp += getTreasureGoods();
    treasuredisp += getTreasureItems();

    if (treasurecheck == 0) {
        treasuredisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
        treasuredisp += "It appears as if someone has beaten you to the treasure.";
    } else {
        treasuredisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        treasuredisp += "(Total Value: " + addCommas(treasuregrandtotal) + " gp)";
    }

    return treasuredisp

}

function getTreasureCoins() {

    coindisp = "";

    coinstemp = rand(Table305CoinsFiltered.length - 1);

    coinsroll = Table305CoinsFiltered[coinstemp];

    if (Table305Coins[(coinsroll * 5) + 3] != "0") {

        var treasureData = Table305Coins[(coinsroll * 5) + 3];
        var treasureInfo = treasureData.split(';');

        for (tix = 0; (tix < treasureInfo.length); tix++) {
            treasureInfo[tix] = unescape(treasureInfo[tix]);
        }

        TotTreasure = tDice(treasureInfo[0], treasureInfo[1], treasureInfo[2])

        coindisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
        coindisp += "Coins: ";
        coindisp += addCommas(TotTreasure);
        coindisp += " ";
        coindisp += Table305Coins[(coinsroll * 5) + 4];
        //		coindisp += Table305Coins[(coinsroll * 5) + 4] + " (" + Table305Coins[(coinsroll * 5) + 3] + ")";

        var gp = 0;
        if (Table305Coins[(coinsroll * 5) + 4] == "cp") {
            gp = parseInt(TotTreasure) / 100;
            coindisp += " (" + addCommas(gp) + " gp)";
            treasuregrandtotal += gp
        }
        if (Table305Coins[(coinsroll * 5) + 4] == "sp") {
            gp = parseInt(TotTreasure) / 10;
            coindisp += " (" + addCommas(gp) + " gp)";
            treasuregrandtotal += gp
        }
        if (Table305Coins[(coinsroll * 5) + 4] == "gp") {
            gp = parseInt(TotTreasure);
            treasuregrandtotal += gp
        }
        if (Table305Coins[(coinsroll * 5) + 4] == "pp") {
            gp = parseInt(TotTreasure) * 10;
            coindisp += " (" + addCommas(gp) + " gp)";
            treasuregrandtotal += gp
        }

        treasurecheck = 1;

    }

    return coindisp

}

function getTreasureGoods() {

    goodsdisp = "";

    goodstemp = rand(Table305GoodsFiltered.length - 1) + 1;
    goodsroll = Table305GoodsFiltered[goodstemp];

    if (Table305Goods[(goodsroll * 5) + 3] != "0") {

        var treasureData = Table305Goods[(goodsroll * 5) + 3];
        var treasureInfo = treasureData.split(';');

        for (tix = 0; (tix < treasureInfo.length); tix++) {
            treasureInfo[tix] = unescape(treasureInfo[tix]);
        }

        TotTreasure = mDice(treasureInfo[0], treasureInfo[1], treasureInfo[2])

        if (Table305Goods[(goodsroll * 5) + 4] == "g") {
            goodsdisp += getTreasureGems(TotTreasure);
        }
        if (Table305Goods[(goodsroll * 5) + 4] == "a") {
            goodsdisp += getTreasureArt(TotTreasure);
        }

        treasurecheck = 1;

    }

    return goodsdisp

}

function getTreasureGems(gemsamt) {
    gemsdisp = "";
    for (gemx = 0; (gemx < gemsamt); gemx++) {
        gemstemp = rand(Table306GemsFiltered.length - 1) + 1;
        gemsroll = Table306GemsFiltered[gemstemp];

        var treasureData = Table306Gems[(gemsroll * 5) + 2];
        var treasureInfo = treasureData.split(';');
        for (tix = 0; (tix < treasureInfo.length); tix++) {
            treasureInfo[tix] = unescape(treasureInfo[tix]);
        }
        TotTreasure = tDice(treasureInfo[0], treasureInfo[1], treasureInfo[2])

        var gemdata = Table306Gems[(gemsroll * 5) + 4];
        var gemInfo = gemdata.split(';');
        for (tix = 0; (tix < gemInfo.length); tix++) {
            gemInfo[tix] = unescape(gemInfo[tix]);
        }
        gtemp = rand(gemInfo.length - 1) + 1;
        gemsdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Gem: ";
        gemsdisp += gemInfo[gtemp] + " (" + addCommas(TotTreasure) + " gp)";

        treasuregrandtotal += parseInt(TotTreasure);

    }
    return gemsdisp
}

function getTreasureArt(artamt) {
    artdisp = "";
    for (artx = 0; (artx < artamt); artx++) {
        arttemp = rand(Table307ArtFiltered.length - 1) + 1;
        artroll = Table307ArtFiltered[arttemp];

        var treasureData = Table307Art[(artroll * 5) + 2];
        var treasureInfo = treasureData.split(';');
        for (tix = 0; (tix < treasureInfo.length); tix++) {
            treasureInfo[tix] = unescape(treasureInfo[tix]);
        }
        TotTreasure = tDice(treasureInfo[0], treasureInfo[1], treasureInfo[2])

        var artdata = Table307Art[(artroll * 5) + 4];
        var artInfo = artdata.split(';');
        for (tix = 0; (tix < artInfo.length); tix++) {
            artInfo[tix] = unescape(artInfo[tix]);
        }
        atemp = rand(artInfo.length - 1) + 1;
        artdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
        artdisp += artInfo[atemp] + " (" + addCommas(TotTreasure) + " gp)";

        treasuregrandtotal += parseInt(TotTreasure);

    }
    return artdisp
}


function getTreasureItems() {

    itemsdisp = "";

    itemstemp = rand(Table305ItemsFiltered.length - 1) + 1;
    itemsroll = Table305ItemsFiltered[itemstemp];

    if (Table305Items[(itemsroll * 5) + 3] != "0") {

        var treasureData = Table305Items[(itemsroll * 5) + 3];
        var treasureInfo = treasureData.split(';');

        for (tix = 0; (tix < treasureInfo.length); tix++) {
            treasureInfo[tix] = unescape(treasureInfo[tix]);
        }

        TotTreasure = mDice(treasureInfo[0], treasureInfo[1], treasureInfo[2])
        scheck = "";
        if (TotTreasure >= 2) {
            scheck = "s";
        }
        if (Table305Items[(itemsroll * 5) + 4] == "mundane") {
            itemsdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
            itemsdisp += "Roll " + TotTreasure + " time" + scheck + " on Table 3-8: Mundane Items in the <i>Dungeon Masters Guild</i>"
        }
        if (Table305Items[(itemsroll * 5) + 4] == "minor") {
            itemsdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
            itemsdisp += "Roll " + TotTreasure + " time" + scheck + " on Table 7-1: Random Magic Items (minor) in the <i>Dungeon Masters Guild</i>"
        }
        if (Table305Items[(itemsroll * 5) + 4] == "medium") {
            itemsdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
            itemsdisp += "Roll " + TotTreasure + " time" + scheck + " on Table 7-1: Random Magic Items (medium) in the <i>Dungeon Masters Guild</i>"
        }
        if (Table305Items[(itemsroll * 5) + 4] == "major") {
            itemsdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
            itemsdisp += "Roll " + TotTreasure + " time" + scheck + " on Table 7-1: Random Magic Items (major) in the <i>Dungeon Masters Guild</i>"
        }

        treasurecheck = 1;

    }

    return itemsdisp

}


function tDice(drolls, dsides, dmult) {

    // roll dem bones
    var dresult = 0;
    for (mdrolls = 1; mdrolls <= parseInt(drolls); mdrolls++) {
        mdroll = rand(parseInt(dsides)) + 1;
        if (mdroll <= 0) {
            mdroll = 1;
        }
        dresult += parseInt(mdroll);
    }

    dresult = dresult * parseInt(dmult);

    if (dresult <= 0) {
        dresult = 1;
    }



    return dresult;

}


// ======================================================

function getTraps() {

    var dx = rand(Table319Filtered.length - 1) + 1;
    trapcheck = Table319Filtered[dx];
    traptemp = "";
    if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff
        traptemp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";
        traptemp += doorTrap();
    }
    return traptemp

}

// ======================================================

function getFeatures() {

    featuredisp = "";

    featuredisp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";

    var featuretype = rand(100) + 1;

    if (featuretype <= 40) {
        var froll = rand(4) + 1;
        for (fr = 1; fr <= froll; fr++) {
            var fd = rand(Table312Filtered.length - 1) + 1;
            featuredisp += Table312[(fd * 5) + 4]
            if (fr != froll) {
                featuredisp += ", ";
            } else {
                featuredisp += ".";
            }
        }
        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff	
            featuredisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            featuredisp += "<font size=\"1\" color=\"#777777\">[1d4 Minor Features]</font>";
        }
    }

    if (featuretype >= 41 && featuretype <= 80) {
        var froll = rand(4) + 1;
        for (fr = 1; fr <= froll; fr++) {
            var fd = rand(Table311Filtered.length - 1) + 1;
            featuredisp += Table311[(fd * 5) + 4]
            if (fr != froll) {
                featuredisp += ", ";
            } else {
                featuredisp += ".";
            }
        }
        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff	
            featuredisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            featuredisp += "<font size=\"1\" color=\"#777777\">[1d4 Major Features]</font>";
        }
    }

    if (featuretype >= 81) {
        var froll = rand(4) + 1;
        for (fr = 1; fr <= froll; fr++) {
            var fd = rand(Table312Filtered.length - 1) + 1;
            featuredisp += Table312[(fd * 5) + 4]
            featuredisp += ", ";
        }
        var froll = rand(4) + 1;
        for (fr = 1; fr <= froll; fr++) {
            var fd = rand(Table311Filtered.length - 1) + 1;
            featuredisp += Table311[(fd * 5) + 4]
            if (fr != froll) {
                featuredisp += ", ";
            } else {
                featuredisp += ".";
            }
        }
        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff	
            featuredisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            featuredisp += "<font size=\"1\" color=\"#777777\">[1d4 Minor Features and 1d4 Major Features]</font>";
        }
    }


    return featuredisp;

}

// ======================================================

function getMonster(mzLevel) {

    var MonsterTemp = new Array(0);
    var TotMonsters = 0;
    monsterdisp = "";
    listlevel = 0;
    // select monster from appropriate list
    if (mzLevel == "1") {
        var md = rand(MonstersLevelOneFiltered.length - 1) + 1;
        var mdx = MonstersLevelOneFiltered[md] * 10
        if (MonstersLevelOne[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelOne[mdx + mq];
                listlevel = 1;
            }
        }
        if (MonstersLevelOne[mdx + 9] == 2) {
            var md = rand(MonstersLevelTwoNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTwoNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwo[mdx + mq];
                listlevel = 2;
            }
        }
    }
    if (mzLevel == "2") {
        var md = rand(MonstersLevelTwoFiltered.length - 1) + 1;
        var mdx = MonstersLevelTwoFiltered[md] * 10
        if (MonstersLevelTwo[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwo[mdx + mq];
                listlevel = 2;
            }
        }
        if (MonstersLevelTwo[mdx + 9] == 1) {
            var md = rand(MonstersLevelOneNoReroll.length - 1) + 1;
            var mdx = MonstersLevelOneNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelOne[mdx + mq];
                listlevel = 1;
            }
        }
        if (MonstersLevelTwo[mdx + 9] == 3) {
            var md = rand(MonstersLevelThreeNoReroll.length - 1) + 1;
            var mdx = MonstersLevelThreeNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThree[mdx + mq];
                listlevel = 3;
            }
        }


    }

    if (mzLevel == "3") {
        var md = rand(MonstersLevelThreeFiltered.length - 1) + 1;
        var mdx = MonstersLevelThreeFiltered[md] * 10
        if (MonstersLevelThree[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThree[mdx + mq];
                listlevel = 3;
            }
        }
        if (MonstersLevelThree[mdx + 9] == 2) {
            var md = rand(MonstersLevelTwoNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTwoNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwo[mdx + mq];
                listlevel = 2;
            }
        }
        if (MonstersLevelThree[mdx + 9] == 4) {
            var md = rand(MonstersLevelFourNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFourNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFour[mdx + mq];
                listlevel = 4;
            }
        }

    }

    if (mzLevel == "4") {
        var md = rand(MonstersLevelFourFiltered.length - 1) + 1;
        var mdx = MonstersLevelFourFiltered[md] * 10
        if (MonstersLevelFour[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFour[mdx + mq];
                listlevel = 4;
            }
        }
        if (MonstersLevelFour[mdx + 9] == 3) {
            var md = rand(MonstersLevelThreeNoReroll.length - 1) + 1;
            var mdx = MonstersLevelThreeNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThree[mdx + mq];
                listlevel = 3;
            }
        }
        if (MonstersLevelFour[mdx + 9] == 5) {
            var md = rand(MonstersLevelFiveNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFiveNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFive[mdx + mq];
                listlevel = 5;
            }
        }

    }

    if (mzLevel == "5") {
        var md = rand(MonstersLevelFiveFiltered.length - 1) + 1;
        var mdx = MonstersLevelFiveFiltered[md] * 10
        if (MonstersLevelFive[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFive[mdx + mq];
                listlevel = 5;
            }
        }
        if (MonstersLevelFive[mdx + 9] == 4) {
            var md = rand(MonstersLevelFourNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFourNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFour[mdx + mq];
                listlevel = 4;
            }
        }
        if (MonstersLevelFive[mdx + 9] == 6) {
            var md = rand(MonstersLevelSixNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSixNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSix[mdx + mq];
                listlevel = 6;
            }
        }

    }

    if (mzLevel == "6") {
        var md = rand(MonstersLevelSixFiltered.length - 1) + 1;
        var mdx = MonstersLevelSixFiltered[md] * 10
        if (MonstersLevelSix[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSix[mdx + mq];
                listlevel = 6;
            }
        }
        if (MonstersLevelSix[mdx + 9] == 5) {
            var md = rand(MonstersLevelFiveNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFiveNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFive[mdx + mq];
                listlevel = 5;
            }
        }
        if (MonstersLevelSix[mdx + 9] == 7) {
            var md = rand(MonstersLevelSevenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSevenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeven[mdx + mq];
                listlevel = 7;
            }
        }

    }

    if (mzLevel == "7") {
        var md = rand(MonstersLevelSevenFiltered.length - 1) + 1;
        var mdx = MonstersLevelSevenFiltered[md] * 10
        if (MonstersLevelSeven[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeven[mdx + mq];
                listlevel = 7;
            }
        }
        if (MonstersLevelSeven[mdx + 9] == 6) {
            var md = rand(MonstersLevelSixNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSixNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSix[mdx + mq];
                listlevel = 6;
            }
        }
        if (MonstersLevelSeven[mdx + 9] == 8) {
            var md = rand(MonstersLevelEightNoReroll.length - 1) + 1;
            var mdx = MonstersLevelEightNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEight[mdx + mq];
                listlevel = 8;
            }
        }

    }


    if (mzLevel == "8") {
        var md = rand(MonstersLevelEightFiltered.length - 1) + 1;
        var mdx = MonstersLevelEightFiltered[md] * 10
        if (MonstersLevelEight[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEight[mdx + mq];
                listlevel = 8;
            }
        }
        if (MonstersLevelEight[mdx + 9] == 7) {
            var md = rand(MonstersLevelSevenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSevenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeven[mdx + mq];
                listlevel = 7;
            }
        }
        if (MonstersLevelEight[mdx + 9] == 9) {
            var md = rand(MonstersLevelNineNoReroll.length - 1) + 1;
            var mdx = MonstersLevelNineNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNine[mdx + mq];
                listlevel = 9;
            }
        }

    }

    if (mzLevel == "9") {
        var md = rand(MonstersLevelNineFiltered.length - 1) + 1;
        var mdx = MonstersLevelNineFiltered[md] * 10
        if (MonstersLevelNine[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNine[mdx + mq];
                listlevel = 9;
            }
        }
        if (MonstersLevelNine[mdx + 9] == 8) {
            var md = rand(MonstersLevelEightNoReroll.length - 1) + 1;
            var mdx = MonstersLevelEightNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEight[mdx + mq];
                listlevel = 8;
            }
        }
        if (MonstersLevelNine[mdx + 9] == 10) {
            var md = rand(MonstersLevelTenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTen[mdx + mq];
                listlevel = 10;
            }
        }

    }

    if (mzLevel == "10") {
        var md = rand(MonstersLevelTenFiltered.length - 1) + 1;
        var mdx = MonstersLevelTenFiltered[md] * 10
        if (MonstersLevelTen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTen[mdx + mq];
                listlevel = 10;
            }
        }
        if (MonstersLevelTen[mdx + 9] == 9) {
            var md = rand(MonstersLevelNineNoReroll.length - 1) + 1;
            var mdx = MonstersLevelNineNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNine[mdx + mq];
                listlevel = 9;
            }
        }
        if (MonstersLevelTen[mdx + 9] == 11) {
            var md = rand(MonstersLevelElevenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelElevenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEleven[mdx + mq];
                listlevel = 11;
            }
        }

    }

    if (mzLevel == "11") {
        var md = rand(MonstersLevelElevenFiltered.length - 1) + 1;
        var mdx = MonstersLevelElevenFiltered[md] * 10
        if (MonstersLevelEleven[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEleven[mdx + mq];
                listlevel = 11;
            }
        }
        if (MonstersLevelEleven[mdx + 9] == 10) {
            var md = rand(MonstersLevelTenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTen[mdx + mq];
                listlevel = 10;
            }
        }
        if (MonstersLevelEleven[mdx + 9] == 12) {
            var md = rand(MonstersLevelTwelveNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTwelveNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwelve[mdx + mq];
                listlevel = 12;
            }
        }

    }


    if (mzLevel == "12") {
        var md = rand(MonstersLevelTwelveFiltered.length - 1) + 1;
        var mdx = MonstersLevelTwelveFiltered[md] * 10
        if (MonstersLevelTwelve[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwelve[mdx + mq];
                listlevel = 12;
            }
        }
        if (MonstersLevelTwelve[mdx + 9] == 11) {
            var md = rand(MonstersLevelElevenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelElevenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEleven[mdx + mq];
                listlevel = 11;
            }
        }
        if (MonstersLevelTwelve[mdx + 9] == 13) {
            var md = rand(MonstersLevelThirteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelThirteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThirteen[mdx + mq];
                listlevel = 13;
            }
        }

    }

    if (mzLevel == "13") {
        var md = rand(MonstersLevelThirteenFiltered.length - 1) + 1;
        var mdx = MonstersLevelThirteenFiltered[md] * 10
        if (MonstersLevelThirteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThirteen[mdx + mq];
                listlevel = 13;
            }
        }
        if (MonstersLevelThirteen[mdx + 9] == 12) {
            var md = rand(MonstersLevelTwelveNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTwelveNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwelve[mdx + mq];
                listlevel = 12;
            }
        }
        if (MonstersLevelThirteen[mdx + 9] == 14) {
            var md = rand(MonstersLevelFourteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFourteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFourteen[mdx + mq];
                listlevel = 14;
            }
        }

    }

    if (mzLevel == "14") {
        var md = rand(MonstersLevelFourteenFiltered.length - 1) + 1;
        var mdx = MonstersLevelFourteenFiltered[md] * 10
        if (MonstersLevelFourteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFourteen[mdx + mq];
                listlevel = 14;
            }
        }
        if (MonstersLevelFourteen[mdx + 9] == 13) {
            var md = rand(MonstersLevelThirteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelThirteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelThirteen[mdx + mq];
                listlevel = 13;
            }
        }
        if (MonstersLevelFourteen[mdx + 9] == 15) {
            var md = rand(MonstersLevelFifteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFifteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFifteen[mdx + mq];
                listlevel = 15;
            }
        }

    }

    if (mzLevel == "15") {
        var md = rand(MonstersLevelFifteenFiltered.length - 1) + 1;
        var mdx = MonstersLevelFifteenFiltered[md] * 10
        if (MonstersLevelFifteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFifteen[mdx + mq];
                listlevel = 15;
            }
        }
        if (MonstersLevelFifteen[mdx + 9] == 14) {
            var md = rand(MonstersLevelFourteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFourteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFourteen[mdx + mq];
                listlevel = 14;
            }
        }
        if (MonstersLevelFifteen[mdx + 9] == 16) {
            var md = rand(MonstersLevelSixteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSixteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSixteen[mdx + mq];
                listlevel = 16;
            }
        }

    }

    if (mzLevel == "16") {
        var md = rand(MonstersLevelSixteenFiltered.length - 1) + 1;
        var mdx = MonstersLevelSixteenFiltered[md] * 10
        if (MonstersLevelSixteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSixteen[mdx + mq];
                listlevel = 16;
            }
        }
        if (MonstersLevelSixteen[mdx + 9] == 15) {
            var md = rand(MonstersLevelFifteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelFifteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelFifteen[mdx + mq];
                listlevel = 15;
            }
        }
        if (MonstersLevelSixteen[mdx + 9] == 17) {
            var md = rand(MonstersLevelSeventeenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSeventeenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeventeen[mdx + mq];
                listlevel = 17;
            }
        }

    }

    if (mzLevel == "17") {
        var md = rand(MonstersLevelSeventeenFiltered.length - 1) + 1;
        var mdx = MonstersLevelSeventeenFiltered[md] * 10
        if (MonstersLevelSeventeen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeventeen[mdx + mq];
                listlevel = 17;
            }
        }
        if (MonstersLevelSeventeen[mdx + 9] == 16) {
            var md = rand(MonstersLevelSixteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSixteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSixteen[mdx + mq];
                listlevel = 16;
            }
        }
        if (MonstersLevelSeventeen[mdx + 9] == 18) {
            var md = rand(MonstersLevelEighteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelEighteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEighteen[mdx + mq];
                listlevel = 18;
            }
        }

    }

    if (mzLevel == "18") {
        var md = rand(MonstersLevelEighteenFiltered.length - 1) + 1;
        var mdx = MonstersLevelEighteenFiltered[md] * 10
        if (MonstersLevelEighteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEighteen[mdx + mq];
                listlevel = 18;
            }
        }
        if (MonstersLevelEighteen[mdx + 9] == 17) {
            var md = rand(MonstersLevelSeventeenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelSeventeenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelSeventeen[mdx + mq];
                listlevel = 17;
            }
        }
        if (MonstersLevelEighteen[mdx + 9] == 19) {
            var md = rand(MonstersLevelNineteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelNineteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNineteen[mdx + mq];
                listlevel = 19;
            }
        }

    }

    if (mzLevel == "19") {
        var md = rand(MonstersLevelNineteenFiltered.length - 1) + 1;
        var mdx = MonstersLevelNineteenFiltered[md] * 10
        if (MonstersLevelNineteen[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNineteen[mdx + mq];
                listlevel = 19;
            }
        }
        if (MonstersLevelNineteen[mdx + 9] == 18) {
            var md = rand(MonstersLevelEighteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelEighteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelEighteen[mdx + mq];
                listlevel = 18;
            }
        }
        if (MonstersLevelNineteen[mdx + 9] == 20) {
            var md = rand(MonstersLevelTwentyNoReroll.length - 1) + 1;
            var mdx = MonstersLevelTwentyNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwenty[mdx + mq];
                listlevel = 20;
            }
        }

    }


    if (mzLevel == "20") {
        var md = rand(MonstersLevelTwentyFiltered.length - 1) + 1;
        var mdx = MonstersLevelTwentyFiltered[md] * 10
        if (MonstersLevelTwenty[mdx + 9] == 0) {
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelTwenty[mdx + mq];
                listlevel = 20;
            }
        }
        if (MonstersLevelTwenty[mdx + 9] == 19) {
            var md = rand(MonstersLevelNineteenNoReroll.length - 1) + 1;
            var mdx = MonstersLevelNineteenNoReroll[md] * 10
            for (mq = 0; mq <= 9; mq++) {
                MonsterTemp[mq] = MonstersLevelNineteen[mdx + mq];
                listlevel = 19;
            }
        }


    }

    //			alert(listlevel);	

    setmephits() // Reset mephits

    // determine how many different monsters there are
    for (mq = 4; mq <= 8; mq++) {
        if (MonsterTemp[mq] != "") {
            TotMonsters += 1
        }
    }

    for (mon = 1; mon <= TotMonsters; mon++) {

        monsterdisp += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ";

        var MonsterData = MonsterTemp[3 + mon];

        var MonsterInfo = MonsterData.split(';');

        for (mi = 0; (mi < MonsterInfo.length); mi++) {
            MonsterInfo[mi] = unescape(MonsterInfo[mi]);
        }

        if (MonsterInfo[1] == "P") {
            TotMon = prevmon;
        } else {
            TotMon = mDice(MonsterInfo[1], MonsterInfo[2], MonsterInfo[3]);
            prevmon = TotMon;
        }

        monsterdisp += "<b>" + MonsterInfo[0] + "</b> (" + TotMon + "): hp ";

        for (mhp = 1; mhp <= TotMon; mhp++) {
            MonHP = mDice(MonsterInfo[4], MonsterInfo[5], MonsterInfo[6])
            if (MonsterInfo[7] >= 1) {
                MonHP2 = mDice(MonsterInfo[7], MonsterInfo[8], MonsterInfo[9])
                MonHP += MonHP2
            }

            // If HP is lower than 33% of max adjust up to 33%
            m25 = Math.floor((MonsterInfo[10] * 2) * .33);

            if (MonsterInfo[4] == "1/4") {
                m25 = Math.floor(((MonsterInfo[10] * 2) * .25) * .33);
            }
            if (m25 <= 1) {
                m25 = 1;
            }
            if (MonHP <= m25) {
                MonHP = m25;
            }
            // ===					
            monsterdisp += MonHP;
            if (mhp != TotMon) {
                monsterdisp += ", ";
            } else {
                monsterdisp += ".";
            }
        }

        // extra info for DM

        if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff	

            monsterdisp += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            monsterdisp += "<font size=\"1\" color=\"#777777\">";

            //			monsterdisp += "[Table: " + listlevel;				
            //			monsterdisp += ", Amount: " + MonsterInfo[1];					
            monsterdisp += "[Amount: " + MonsterInfo[1];


            if (MonsterInfo[2] >= 2) {
                monsterdisp += "d" + MonsterInfo[2];
            }
            if (MonsterInfo[3] >= 1) {
                monsterdisp += "+" + MonsterInfo[3];
            }
            monsterdisp += ", HD: " + MonsterInfo[4];
            if (MonsterInfo[5] >= 2) {
                monsterdisp += "d" + MonsterInfo[5];
            }
            if (MonsterInfo[6] >= 1) {
                monsterdisp += "+" + MonsterInfo[6];
            }
            if (MonsterInfo[6] < 0) {
                monsterdisp += MonsterInfo[6];
            }

            if (MonsterInfo[7] >= 1) {
                monsterdisp += " plus " + MonsterInfo[7];
            }
            if (MonsterInfo[8] >= 2) {
                monsterdisp += "d" + MonsterInfo[8];
            }
            if (MonsterInfo[9] >= 1) {
                monsterdisp += "+" + MonsterInfo[9];
            }
            if (MonsterInfo[9] < 0) {
                monsterdisp += MonsterInfo[9];
            }

            monsterdisp += " (" + MonsterInfo[10] + ")";
            monsterdisp += ", CR: " + MonsterInfo[11];
            monsterdisp += ", Source: ";
            mxsource = "<i>Unknown</i>";
            if (MonsterInfo[13] == "M") {
                mxsource = "<i>Monster Manual</i>";
            }
            if (MonsterInfo[13] == "2") {
                mxsource = "<i>Monster Manual II</i>";
                advBooks[1] = 1;
                advBooks[2] = 1;
            }
            if (MonsterInfo[13] == "3") {
                mxsource = "<i>Monster Manual III</i>";
                advBooks[1] = 1;
                advBooks[3] = 1;
            }
            if (MonsterInfo[13] == "4") {
                mxsource = "<i>Monster Manual IV</i>";
                advBooks[1] = 1;
                advBooks[4] = 1;
            }
            if (MonsterInfo[13] == "F") {
                mxsource = "<i>Fiend Folio</i>";
                advBooks[1] = 1;
                advBooks[5] = 1;
            }
            if (MonsterInfo[13] == "D") {
                mxsource = "<i>Dungeon Master\'s Guild</i>";
            }
            if (MonsterInfo[13] == "X") {
                mxsource = "<i>Expanded Psionics Handbook</i>";
                advBooks[1] = 1;
                advBooks[6] = 1;
            }
            if (MonsterInfo[13] == "P") {
                mxsource = "<i>Complete Psionic</i>";
                advBooks[1] = 1;
                advBooks[7] = 1;
            }
            if (MonsterInfo[13] == "H") {
                mxsource = "<i>Fiendish Codex I: Hordes of the Abyss</i>";
                advBooks[1] = 1;
                advBooks[8] = 1;
            }
            if (MonsterInfo[13] == "L") {
                mxsource = "<i>Libris Mortis</i>";
                advBooks[1] = 1;
                advBooks[9] = 1;
            }
            if (MonsterInfo[13] == "A") {
                mxsource = "<i>Lords of Madness</i>";
                advBooks[1] = 1;
                advBooks[10] = 1;
            }


            monsterdisp += mxsource;

            monsterdisp += "]</font>";
        }

        if (mon < TotMonsters) {
            monsterdisp += "<br/>";
        }
    }




    // alert(MonsterTemp);

    return monsterdisp;

}




function setmephits() {

    totMephits = rand(3) + 1;
    mxset = 1;
    for (mx = 0; mx <= 4; mx++) {
        if (mxset <= totMephits) {
            mephnbr = rand(10) + 1;
            MonstersLevelSix[234 + mx] = Mephits[(mephnbr * 5) + 4];
            //	alert (MonstersLevelSix[234 + mx]);
            mxset += 1;
        } else {
            MonstersLevelSix[234 + mx] = "";
        }
    }

}



function mDice(drolls, dsides, dplus) {

    // check for odd dice sides like 1/4
    var dmod = 1;
    if (drolls == "1/4") {
        drolls = 1;
        dmod = .25;
    }
    // roll dem bones
    var dresult = 0;
    for (mdrolls = 1; mdrolls <= parseInt(drolls); mdrolls++) {
        mdroll = rand(parseInt(dsides)) + 1;
        if (mdroll <= 0) {
            mdroll = 1;
        }
        dresult += parseInt(mdroll);
    }
    dresult += parseInt(dplus);

    dresult = Math.floor(dresult * dmod);
    if (dresult <= 0) {
        dresult = 1;
    }

    return dresult;

}

// =======================================================

function doorRerollCheck(lx) {

    rerollspecial = 0;
    doortemp = "";
    breakdctemp = 0;


    for (q = 0; q <= 8; q++) {
        r = (lx * 9) + q

        if (q == 8 && Table317RandomDoorTypes[r] == 1) {
            doortemp += "Door slides to one side rather than opening normally. ";
            rerollspecial = 1;
            breakdctemp = 1;
        }
        if (q == 8 && Table317RandomDoorTypes[r] == 2) {
            doortemp += "Door slides down rather than opening normally. ";
            rerollspecial = 1;
            breakdctemp = 1;
        }
        if (q == 8 && Table317RandomDoorTypes[r] == 3) {
            doortemp += "Door slides up rather than opening normally. ";
            rerollspecial = 1;
            breakdctemp = 3;
        }
        if (q == 8 && Table317RandomDoorTypes[r] == 4) {
            doortemp += "Door magically reinforced. ";
            rerollspecial = 1;
        }
    }
}

function doorInfo(lz) {

    var breakdc = 0;
    var breakdcspecial = 0;
    var breakdcspecialuse = 0;
    var doorDMinfo = "";
    var doorDMtype = 0;
    var doorDMtrapped = 0;

    for (q = 0; q <= 8; q++) {
        r = (lz * 9) + q
        if (q == 2 && Table317RandomDoorTypes[r] == 1) {
            breakdcspecial = 30;
        }
        if (q == 2 && Table317RandomDoorTypes[r] == 2) {
            breakdcspecial = 40;
        }
        if (q == 2 && Table317RandomDoorTypes[r] == 3) {
            breakdcspecial = 40;
        }
        if (q == 8 && Table317RandomDoorTypes[r] == 4) {
            breakdc = breakdcspecial;
            breakdcspecialuse = 1;
        }
    }


    for (q = 0; q <= 8; q++) {
        r = (lz * 9) + q
        if (q == 2 && Table317RandomDoorTypes[r] == 1) {
            doortemp += "Wood";
            doorDMtype = 1;
        }
        if (q == 2 && Table317RandomDoorTypes[r] == 2) {
            doortemp += "Stone";
            doorDMinfo = "[4 in. thick; hardness 8; hp 60";
            doorDMtype = 2;
        }
        if (q == 2 && Table317RandomDoorTypes[r] == 3) {
            doortemp += "Iron";
            doorDMinfo = "[2 in. thick; hardness 10; hp 60";
            doorDMtype = 3;
        }
        if (q == 3 && Table317RandomDoorTypes[r] == 1) {
            doortemp += ", simple";
            if (doorDMtype == 1) {
                doorDMinfo = "[1 in. thick; hardness 5; hp 10";
            }
        }
        if (q == 3 && Table317RandomDoorTypes[r] == 2) {
            doortemp += ", good";
            if (doorDMtype == 1) {
                doorDMinfo = "[1-1/2 in. thick; hardness 5; hp 15";
            }
        }
        if (q == 3 && Table317RandomDoorTypes[r] == 3) {
            doortemp += ", strong";
            if (doorDMtype == 1) {
                doorDMinfo = "[2 in. thick; hardness 5; hp 20";
            }
        }

        if (q == 4 && Table317RandomDoorTypes[r] == 1) {
            doortemp += ", locked";
        }

        if (q == 5 && Table317RandomDoorTypes[r] == 1) {
            doortemp += ", stuck";
        }

        if (q == 6 && Table317RandomDoorTypes[r] == 1) {
            doortemp += ", and trapped";
            doorDMtrapped = 1;
        }
        if (q == 7) {
            breakdcbase = Table317RandomDoorTypes[r]
            if (breakdcspecialuse == 4) {
                doorDMinfo += "; break DC " + breakdc;
            } else {
                breakdc += breakdcbase + breakdctemp;
                if (breakdc != 0) {
                    doorDMinfo += "; break DC " + breakdc;
                }
            }
        }
    }

    if (zDetails == 0) { // check to see if dm etails is on 0=on 1=0ff


        doortemp += ".<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        doortemp += "<font size=\"1\" color=\"#777777\">";
        doortemp += doorDMinfo;
        if (doorDMtrapped == 1) {
            doortemp += " -- ";
            doortemp += doorTrap();
        }

        if (secretcheck == 1) {
            doortemp += " -- ";
            doortemp += " Secret Door Search Check DC 20";
        }
        if (secretcheck == 2) {
            doortemp += " -- ";
            doortemp += " Secret Door Search Check DC 30, well-hidden";
        }
        doortemp += "]</font>"

    }

    return doortemp;

}



function doorTrap() {

    dtz = trapcheck;
    doortrap = ""
    doortrap += Table319RandomTraps[(dtz * 6) + 3] + "; CR:" + Table319RandomTraps[(dtz * 6) + 5];
    doortraplist[dtloc] = dtz;
    mastertraplist[dtz] = 1;
    dtloc += 1;
    return doortrap;

}

function doorTrapDesc() {

    doortrapdesc = ""
    dtxlen = doortraplist.length - 1;
    for (dtx = 0; dtx <= dtxlen; dtx++) {
        if (doortraplist[dtx] != 0) {
            doortrapdesc += "<i>" + Table319RandomTraps[(doortraplist[dtx] * 6) + 3] + ":</i> CR:" + Table319RandomTraps[(doortraplist[dtx] * 6) + 5] + "; " + Table319RandomTraps[(doortraplist[dtx] * 6) + 4] + "<br/>";
        }
    }

    return doortrapdesc;

}


function masterTrap() {

    mastertrapdesc = ""

    dtxlen = mastertraplist.length - 1;
    for (dtm = 0; dtm <= dtxlen; dtm++) {
        if (mastertraplist[dtm] == 1) {
            mastertrapdesc += "<tr valign=\"top\"><td class=\"desctext\"><li></td>";
            mastertrapdesc += "<td class=\"desctext\">";
            mastertrapdesc += "<i>" + Table319RandomTraps[(dtm * 6) + 3] + ":</i> CR:" + Table319RandomTraps[(dtm * 6) + 5] + "; " + Table319RandomTraps[(dtm * 6) + 4];
            mastertrapdesc += "</td></tr>";
        }
    }

    return mastertrapdesc;

}



// =======================================================

function bgSkin() {

    pagedisp = "";

    if (zSkin == 0) {
        pagedisp += "<img src=\"images/back1.jpg\" border=\"0\"/>"
    }
    if (zSkin == 1) {
        pagedisp += "<img src=\"images/back1a.jpg\" border=\"0\"/>"
    }

    display("background", pagedisp);

}


// =======================================================

function runMapper() {

    setCharts();
    edgePrep();
    randomStartRoom();
    placeStartRoom();
    makeRooms();
    hallwayExitScrub();
    makeDoors();
    assignDoorTypes();
    makeSpecialDoors();
    cornerMaker();
    thatchMaker();
    sweepTwoHundred();
    WCDisplayLayer();
    setMapCompass();
    bgSkin();
    showGrid(0);
    showGrid(1);
    showGrid(14);
    showGrid(15);
    showGrid(16);
    showGrid(17);
    showGrid(27);
    showGrid(28);

    showNumbers();

    if (xMap == 1) {
        seedSelect = 1;
        showRoomData();
    } else {
        showSaveData();
    }
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