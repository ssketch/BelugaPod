// VARIABLES

var totalTrials = 90;  // total number of trials
var trialsCompleted;   // trial counter

var block = 0;
var timings = [10000, 15000];                           // 10 & 15 seconds
var timing;                                             // selected time per trial (i.e., for robot to travel between waypoints) for current block
var surfacesCG = shuffle([0,1,2,3]);                    // CG rotated 0, 90, 180, 270 degrees, randomized
var surfacesRO = shuffle([4,5,6,7]);                    // RO rotated 0, 90, 180, 270 degrees, randomized
var surfaces = shuffle([surfacesCG[0],surfacesRO[0]]);  // 1 CG and 1 RO surface, randomized
var surface;                                            // selected surface for current block
var N = 10;                                             // grid size
var reward = new Array(8);                              // 8 different reward surfaces (NxN each)
for (var i = 0; i < reward.length; i++)
{
	reward[i] = new Array(N);
}
// CG, 0 degrees
reward[0][0] = [1,1,1,1,2,3,2,1,1,1];
reward[0][1] = [1,1,1,1,2,3,2,1,1,1];
reward[0][2] = [1,1,1,1,2,3,2,1,1,1];
reward[0][3] = [1,1,1,1,2,3,2,1,1,1];
reward[0][4] = [1,1,1,1,2,3,2,1,1,1];
reward[0][5] = [1,1,1,1,2,3,2,1,1,1];
reward[0][6] = [1,1,1,1,2,3,2,1,1,1];
reward[0][7] = [1,1,1,1,2,3,2,1,1,1];
reward[0][8] = [1,1,1,1,2,3,2,1,1,1];
reward[0][9] = [1,1,1,1,2,3,2,1,1,1];
// CG, 90 degrees
reward[1][0] = [1,1,1,1,1,1,1,1,1,1];
reward[1][1] = [1,1,1,1,1,1,1,1,1,1];
reward[1][2] = [1,1,1,1,1,1,1,1,1,1];
reward[1][3] = [2,2,2,2,2,2,2,2,2,2];
reward[1][4] = [3,3,3,3,3,3,3,3,3,3];
reward[1][5] = [2,2,2,2,2,2,2,2,2,2];
reward[1][6] = [1,1,1,1,1,1,1,1,1,1];
reward[1][7] = [1,1,1,1,1,1,1,1,1,1];
reward[1][8] = [1,1,1,1,1,1,1,1,1,1];
reward[1][9] = [1,1,1,1,1,1,1,1,1,1];
// CG, 180 degrees
reward[2][0] = [1,1,1,2,3,2,1,1,1,1];
reward[2][1] = [1,1,1,2,3,2,1,1,1,1];
reward[2][2] = [1,1,1,2,3,2,1,1,1,1];
reward[2][3] = [1,1,1,2,3,2,1,1,1,1];
reward[2][4] = [1,1,1,2,3,2,1,1,1,1];
reward[2][5] = [1,1,1,2,3,2,1,1,1,1];
reward[2][6] = [1,1,1,2,3,2,1,1,1,1];
reward[2][7] = [1,1,1,2,3,2,1,1,1,1];
reward[2][8] = [1,1,1,2,3,2,1,1,1,1];
reward[2][9] = [1,1,1,2,3,2,1,1,1,1];
// CG, 270 degrees
reward[3][0] = [1,1,1,1,1,1,1,1,1,1];
reward[3][1] = [1,1,1,1,1,1,1,1,1,1];
reward[3][2] = [1,1,1,1,1,1,1,1,1,1];
reward[3][3] = [1,1,1,1,1,1,1,1,1,1];
reward[3][4] = [2,2,2,2,2,2,2,2,2,2];
reward[3][5] = [3,3,3,3,3,3,3,3,3,3];
reward[3][6] = [2,2,2,2,2,2,2,2,2,2];
reward[3][7] = [1,1,1,1,1,1,1,1,1,1];
reward[3][8] = [1,1,1,1,1,1,1,1,1,1];
reward[3][9] = [1,1,1,1,1,1,1,1,1,1];
// RO, 0 degrees
reward[4][0] = [3,2,1,1,1,2,4,5,6,7];
reward[4][1] = [3,2,1,1,1,2,4,5,6,7];
reward[4][2] = [3,2,1,1,1,2,4,5,6,7];
reward[4][3] = [3,2,1,1,1,2,4,5,6,7];
reward[4][4] = [3,2,1,1,1,2,4,5,6,7];
reward[4][5] = [3,2,1,1,1,2,4,5,6,7];
reward[4][6] = [3,2,1,1,1,2,4,5,6,7];
reward[4][7] = [3,2,1,1,1,2,4,5,6,7];
reward[4][8] = [3,2,1,1,1,2,4,5,6,7];
reward[4][9] = [3,2,1,1,1,2,4,5,6,7];
// RO, 90 degrees
reward[5][0] = [7,7,7,7,7,7,7,7,7,7];
reward[5][1] = [6,6,6,6,6,6,6,6,6,6];
reward[5][2] = [5,5,5,5,5,5,5,5,5,5];
reward[5][3] = [4,4,4,4,4,4,4,4,4,4];
reward[5][4] = [2,2,2,2,2,2,2,2,2,2];
reward[5][5] = [1,1,1,1,1,1,1,1,1,1];
reward[5][6] = [1,1,1,1,1,1,1,1,1,1];
reward[5][7] = [1,1,1,1,1,1,1,1,1,1];
reward[5][8] = [2,2,2,2,2,2,2,2,2,2];
reward[5][9] = [3,3,3,3,3,3,3,3,3,3];
// RO, 180 degrees
reward[6][0] = [7,6,5,4,2,1,1,1,2,3];
reward[6][1] = [7,6,5,4,2,1,1,1,2,3];
reward[6][2] = [7,6,5,4,2,1,1,1,2,3];
reward[6][3] = [7,6,5,4,2,1,1,1,2,3];
reward[6][4] = [7,6,5,4,2,1,1,1,2,3];
reward[6][5] = [7,6,5,4,2,1,1,1,2,3];
reward[6][6] = [7,6,5,4,2,1,1,1,2,3];
reward[6][7] = [7,6,5,4,2,1,1,1,2,3];
reward[6][8] = [7,6,5,4,2,1,1,1,2,3];
reward[6][9] = [7,6,5,4,2,1,1,1,2,3];
// RO, 270 degrees
reward[7][0] = [3,3,3,3,3,3,3,3,3,3];
reward[7][1] = [2,2,2,2,2,2,2,2,2,2];
reward[7][2] = [1,1,1,1,1,1,1,1,1,1];
reward[7][3] = [1,1,1,1,1,1,1,1,1,1];
reward[7][4] = [1,1,1,1,1,1,1,1,1,1];
reward[7][5] = [2,2,2,2,2,2,2,2,2,2];
reward[7][6] = [4,4,4,4,4,4,4,4,4,4];
reward[7][7] = [5,5,5,5,5,5,5,5,5,5];
reward[7][8] = [6,6,6,6,6,6,6,6,6,6];
reward[7][9] = [7,7,7,7,7,7,7,7,7,7];
var sigmas = [10,10,0];                // noise intensity for reward (3rd block = noiseless)
var sigma;
var scalers = [1,10,100,1000];
var scaler;                            // scaler x noisy reward = output to subject
var currentReward;

var mouseXonGrid;  // current cursor location (relative to upper-left corner of grid)
var mouseYonGrid;
var currentXpos;   // current cursor location (centers of grid boxes, relative to upper-left corner of grid)
var currentYpos;
var currentXbox;   // grid box that cursor is currently in
var currentYbox; 
var goalXpos;      // position of current waypoint (relative to upper-left corner of grid)
var goalYpos;
var goalXbox;      // current waypoint (box-wise)
var goalYbox;
var BelugaXpos;    // position of robot in tank-image coordinates (relative to center/origin of tank)
var BelugaYpos; 
var BelugaXbox;    // grid box that robot is currently in
var BelugaYbox;

var GridStartX = 153;    // x-coordinate of upper-left pixel of grid
var GridStartY = 143;    // y-coordinate of upper-left pixel of grid
var GridBoxWidth = 35;   // width (in pixels) of grid box
var GridBoxHeight = 37;  // height (in pixels) of grid box

var RTank = 3.2;  // tank radius (m)

var HaveCounter;
var BelugaMoving = false;  // stays true for 'timing' msec after waypoint is set
var NeedSend = false;
var SendPeriod = 500;      // time between updates (msec)


// BODY

$(document).ready(function(){

    $('#crosshair').hide();  // hide crosshair and waypoint to start
    $('#waypoint').hide();
    
    requestWaypoints();
    requestPositions();
    
    initialize();
    
    $("#tank").mousemove(function(ev){
        mouseXonGrid = page2gridX(ev.pageX);
        mouseYonGrid = page2gridY(ev.pageY);
        if (mouseXonGrid >= 0 && mouseXonGrid < N*GridBoxWidth && mouseYonGrid >= 0 && mouseYonGrid < N*GridBoxHeight)  // cursor is above grid
        {
            snapToGrid(mouseXonGrid, mouseYonGrid);
        }
        else
        {
            currentXpos = -1;
            currentYpos = -1;
        }
    });
    
    $("#tank").unbind("click").click(function(ev){
        if (!BelugaMoving && currentXbox >= 0 && currentYpos >= 0)  // robot's travel time ('timing' msec) has elapsed & cursor click is above grid
        {
            doUpdate();
        }
    });
    
    if (HaveCounter == undefined)
    {
        window.setInterval(doSend, SendPeriod);
        HaveCounter = true;
    }

});


// PRIMARY FUNCTIONS

function requestWaypoints()  // via AJAX
{
    $.ajax({
        url: "/waypoints",
        dataType: "script"
    });
}

function requestPositions()  // via AJAX
{
    $.ajax({
        url: "/positions",
        dataType: "script"
    });
}

function setPosition(id, X, Y, Z)  // updates Beluga position (called elsewhere, so Z is kept as an argument)
{
    if (id != 0)  // only track robot with id = 0
    {
        return;
    }
    BelugaXpos = world2tank(X);
    BelugaYpos = world2tank(Y);
    BelugaXbox = Math.floor((BelugaXpos + 0.5*$("#tank").width() - GridStartX)/GridBoxWidth);    // not always 0-9
    BelugaYbox = Math.floor((BelugaYpos + 0.5*$("#tank").height() - GridStartY)/GridBoxHeight);
    var offX = BelugaXpos - 1;
    var offY = BelugaYpos - 1;
    var off = offX + " " + offY;
    $("#Beluga").position({
        my: "center center",
        at: "center center",
        of: "#tank",
        offset: off
    });
}

function initialize()  // set timing, surface, noise, & scaler, send robot to starting box
{
    if (block < 2)  // 1st & 2nd blocks (1 CG & 1 RO, timing picked randomly for each, noisy)
    {
        timing = shuffle(timings)[0];  // random, repick for each block
        setParamString(timing);        // set timing for Beluga ControlLaw
        surface = surfaces[block];     // surface 1 for 1st block, surface 2 for 2nd block
    }
    else  // 3rd block (fast, RO, noiseless)
    {
        timing = timings[0];      // fast timing
        setParamString(timing);
        surface = surfacesRO[1];  // next RO surface in array
    }
    sigma = sigmas[block];                                       // 10 for 1st & 2nd block, 0 (noiseless) for 3rd
    scaler = scalers[Math.floor(Math.random()*scalers.length)];  // repick reward scaler for each block
    
    $.Zebra_Dialog('Are you ready to begin a new task?', {
        keyboard: false,
        overlay_close: false,
        overlay_opacity: 0.7
    });
    
    trialsCompleted = 0;
    goalXbox = Math.floor(Math.random()*N);     // repick starting box for each block
    goalYbox = Math.floor(Math.random()*N);
    goalXpos = GridBoxWidth*(0.5 + goalXbox);   // convert starting box to position (relative to upper-left corner of grid)
    goalYpos = GridBoxHeight*(0.5 + goalYbox);
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(surface, goalXbox, goalYbox);
    setTimeout(displayReward, timing);             // wait for 'timing' msec (after setting waypoint) to display initial reward
    
    sendData();
}

function snapToGrid(X, Y)  // place a crosshair at center of grid box currently occupied by cursor (i.e., 'snap-to' location)
{
    currentXbox = Math.floor(X/GridBoxWidth);
    currentYbox = Math.floor(Y/GridBoxHeight);
    currentXpos = GridBoxWidth*(0.5 + currentXbox);
    currentYpos = GridBoxHeight*(0.5 + currentYbox);
    var offX = currentXpos + GridStartX - 1;
    var offY = currentYpos + GridStartY - 1;
    var off = offX + " " + offY;
    $('#crosshair:hidden').show();
    $("#crosshair").position({
        my: "center center",
        at: "left top",
        of: "#tank",
        offset: off
    });
}

function doUpdate()  // check task status, set waypoint, display reward, store data
{
    trialsCompleted = ++trialsCompleted;
    
    if (trialsCompleted == totalTrials)  // done with current iteration of task
    {
        block = ++block;
        
        if (block < 3)
        {
            initialize();
            return
        }
        else
        {
            $("input[name=nextSurface]").attr('value', surfacesRO[2]);  // store next RO surface for task with inference model
            $.Zebra_Dialog('The next task is your final task. As described in the instructions, you will be given a continuously updating "reward map" to help with your search. The map will be a 10x10 grid of colored dots. The larger the dot and "warmer" the color, the greater the reward at that location in the grid is likely to be. Click "OK" to proceed.', {
                keyboard: false,
                overlay_close: false,
                overlay_opacity: 0.7,
                onClose: function(caption) {
                    $("form#done").submit()
                }
            });
            return
        }
    }
    
    goalXbox = currentXbox;  // new waypoint = grid box that cursor is currently in
    goalYbox = currentYbox;
    goalXpos = currentXpos;  // set position of new waypoint (relative to upper-left corner of grid)
    goalYpos = currentYpos;
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(surface, goalXbox, goalYbox);
    setTimeout(displayReward, timing);             // wait for 'timing' msec (after setting waypoint) to display reward
    
    sendData();
}

function updateParamString(params)  // used to update timing for task (called elsewhere)
{
    $("#param_string").text(params);
}

function setWaypoint(X, Y)  // position waypoint, both on screen and for Beluga tracking/control
{
    // visually
    var offX = X + GridStartX - 1;
    var offY = Y + GridStartY - 1;
    var off = offX + " " + offY;
    $('#waypoint:hidden').show();
    $("#waypoint").position({
        my: "center center",
        at: "left top",
        of: "#tank",
        offset: off
    });
        
    // for tracking/control
    var waypointX = tank2world(X + GridStartX - 0.5*$("#tank").width());
    var waypointY = tank2world(Y + GridStartY - 0.5*$("#tank").height());
    $("#waypoint_x").val(waypointX);
    $("#waypoint_y").val(waypointY);
    
    NeedSend = true;
    BelugaMoving = true;  // waypoint has been sent ('timing' msec before reward is displayed & subject can select a new waypoint)
}

function calculateReward(surface, Xbox, Ybox)  // scaler x noisy reward = output to subject
{
    var locationReward = reward[surface][Xbox][Ybox];
    noisyReward = Math.floor(25*locationReward/3.2) + Math.floor(Math.random()*sigma);  // add noise
    currentReward = scaler*noisyReward;                                                 // scale
}

function displayReward()
{
    $("input[name=reward]").attr('value', currentReward);
    
    BelugaMoving = false;  // subject can select a new waypoint
}

function sendData()  // via AJAX
{
    var data = {};
    data['subject'] = $("input[name=subject]").val();
    data['block'] = block;
    data['timing'] = timing;
    data['surface'] = surface;
    data['trial'] = trialsCompleted;
    data['waypointX'] = goalXbox;
    data['waypointY'] = goalYbox;
    data['reward'] = currentReward;
    
     $.ajax({
        type: "POST",
        url: "processData",
        data: data
    });
}

function doSend()
{
    if (NeedSend)
    {
        $("form.new_waypoint").submit();
        NeedSend = false;
    }
    requestPositions();
    requestWaypoints();
}


// SUPPLEMENTARY FUNCTIONS

function shuffle(array)  // shuffle without overwriting the original
{
    var shuffled = array.slice();
 	var len = shuffled.length;
	var i = len;
    var j, k;
    while (i--)
    {
        j = Math.floor(Math.random()*len);
		k = shuffled[i];
  		shuffled[i] = shuffled[j];
	  	shuffled[j] = k;
 	}
	return shuffled;
}

function imgRTank()  // tank radius in tank image
{
    return 0.5*$("#tank").width();
}

function world2tank(X_or_Y)  // scales real-world (m) down to tank-image coordinates (px) - for tracking/control
{
    return X_or_Y*(imgRTank()/RTank);
}

function tank2world(X_or_Y)  // scales tank-image (px) up to real-world coordinates (m) - for tracking/control
{
    return X_or_Y*(RTank/imgRTank());
}

function page2gridX(pos)  // webpage (absolute) to grid (relative to upper-left corner) x-coordinate - for object positioning
{
    return pos - $("#tank").position().left - GridStartX;
}

function page2gridY(pos)  // webpage (absolute) to grid (relative to upper-left corner) y-coordinate - for object positioning
{
    return pos - $("#tank").position().top - GridStartY;
}

function grid2pageX(pos)  // grid (relative to upper-left corner) to webpage (absolute) x-coordinate - for object positioning
{
    return pos + $("#tank").position().left + GridStartX;
}

function grid2pageY(pos)  // grid (relative to upper-left corner) to webpage (absolute) y-coordinate - for object positioning
{
    return pos + $("#tank").position().top + GridStartY;
}
