// VARIABLES

var totalTrials = 5;  // total number of trials
var trialsCompleted;  // trial counter

var block = 0;
var timings = [5000, 10000];                    // 5 & 10 seconds (temporarily)
var timing;                                     // selected time per trial (i.e., for robot to travel between waypoints) for current block
var surfaceCG = shuffle([0,1,2,3])[0];          // CG rotated 0, 90, 180, 270 degrees, randomized
var surfaceRO = shuffle([4,5,6,7])[0];          // RO rotated 0, 90, 180, 270 degrees, randomized
var surfaces = shuffle([surfaceCG,surfaceRO]);  // 1 CG and 1 RO surface, randomized
var surface;                                    // selected surface for current block
var N = 10;                                     // grid size
var reward = new Array(8);                      // 8 different reward surfaces (NxN each)
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
var sigma = 10;                        // noise intensity for reward
var scalers = [1,10,100,1000];
var scaler;                            // scaler x noisy reward = output to subject
var currentReward;

var mouseXonGrid;   // current cursor location (relative to upper-left corner of grid)
var mouseYonGrid;
var currentXpos;    // current cursor location (centers of grid boxes, relative to upper-left corner of grid)
var currentYpos;
var currentXbox;    // grid box that cursor is currently in
var currentYbox; 
var goalXpos;       // position of current waypoint (relative to upper-left corner of grid)
var goalYpos;
var goalXbox;       // current waypoint (box-wise)
var goalYbox;
var priorgoalXbox;  // previous waypoint (box-wise)
var priorgoalYbox;
var BelugaXpos;     // position of robot in tank-image coordinates (relative to center/origin of tank)
var BelugaYpos; 
var BelugaXbox;     // grid box that robot is currently in
var BelugaYbox;

var GridStartX = 153;    // x-coordinate of upper-left pixel of grid
var GridStartY = 143;    // y-coordinate of upper-left pixel of grid
var GridBoxWidth = 35;   // width (in pixels) of grid box
var GridBoxHeight = 37;  // height (in pixels) of grid box

var RTank = 3.2;   // tank radius (m)

var HaveCounter;
var BelugaMoving = false;  // stays true for 'timing' msec after waypoint is set
var NeedSend = false;
var SendPeriod = 500;      // time between updates (msec)


// BODY

$(document).ready(function(){

    $('#crosshair').hide(); // hide crosshair and waypoint to start
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
        window.setInterval(doSend(), SendPeriod);
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

function initialize()
{
    trialsCompleted = 0;
    timing = shuffle(timings)[0];                                // repick timing for each block
    surface = surfaces[block];                                   // surface 1 for 1st block, surface 2 for 2nd block
    scaler = scalers[Math.floor(Math.random()*scalers.length)];  // repick reward scaler for each block
    $.Zebra_Dialog('Are you ready to begin a new task?', {
        keyboard: false,
        overlay_close: false,
        overlay_opacity: 0.7
    });
    
    goalXbox = Math.floor(Math.random()*N);     // repick starting box for each block
    goalYbox = Math.floor(Math.random()*N);
    goalXpos = GridBoxWidth*(0.5 + goalXbox);   // convert starting box to position (relative to upper-left corner of grid)
    goalYpos = GridBoxHeight*(0.5 + goalYbox);
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(surface, goalXbox, goalYbox);
    setTimeout("displayReward()", timing);         // wait for 'timing' msec (after setting waypoint) to display initial reward
    
    // update form fields and send to file (don't post form until ready to proceed to feedback)
}

function setPosition(id, X, Y, Z)  // updates Beluga position (called elsewhere, so id and Z are kept as arguments)
{
    BelugaXpos = world2tank(X);
    BelugaYpos = world2tank(Y);
    BelugaXbox = Math.floor((BelugaXpos + 0.5*$("#tank").width() - GridStartX)/GridBoxWidth);     // not always 0-9
    BelugaYbox = Math.floor((-BelugaYpos + 0.5*$("#tank").height() - GridStartY)/GridBoxHeight);
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
    if (trialsCompleted == totalTrials)  // done with current iteration of task
    {
        block = ++block;
        if (block < 2)
        {
            initialize();
        }
        else
        {
            $.Zebra_Dialog('You have now completed all of the tasks. Click "OK" to proceed to the feedback page', {
                keyboard: false,
                overlay_close: false,
                overlay_opacity: 0.7,
                onClose: $("form#params").submit()
            });
        }
    }
    
    priorgoalXbox = goalXbox;  // previous waypoint = current waypoint (not updated yet)
    priorgoalYbox = goalYbox;
    goalXbox = currentXbox;    // new waypoint = grid box that cursor is currently in
    goalYbox = currentYbox;
    goalXpos = currentXpos;    // set position of new waypoint (relative to upper-left corner of grid)
    goalYpos = currentYpos;
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(surface, goalXbox, goalYbox);
    setTimeout("displayReward()", timing);         // wait for 'timing' msec (after setting waypoint) to display reward
    
    trialsCompleted = ++trialsCompleted;
    
    // update form fields and send to file (don't post until ready to proceed to feedback)
    
    /*document.params.reward.value = currentReward;
    document.params.trial.value = trialsCompleted;
    
    formData ="state=runningTask&auth_code=<%= auth_code
    %>&subject=<%= subject %>&block=<%= block %>&timingOrder=<%= timingOrder
    %>&surfaceOrder=<%= surfaceOrder %>&dynamicsOrder=<%=
    dynamicsOrder %>&reward=".concat(currentReward.toString(),"&trial=",trialsCompleted.toString(),"&currentX=",currentX.toString(),"&currentY=",currentY.toString(),"&goalX=",goalX.toString(),"&goalY=",goalY.toString(),"&numClicks=",numClicks.toString());*/
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
    var waypointY = tank2world(-(Y + GridStartY - 0.5*$("#tank").height()));
    $("#waypoint_x").val(waypointX);
    $("#waypoint_y").val(waypointY);
    
    NeedSend = true;
    BelugaMoving = true;  // waypoint has been sent ('timing' msec before reward is displayed & subject can select a new waypoint)
}

function calculateReward(surface, Xbox, Ybox)  // randomly chosen scaler x noisy reward = output to subject
{
    var locationReward = reward[surface][Xbox][Ybox];
    noisyReward = Math.floor(25*locationReward/3.2) + Math.floor(sigma*Math.random());  // add noise
    currentReward = scaler*noisyReward;                                                 // scale
}

function displayReward()
{
    $("#reward input[name=reward]").attr('value', currentReward);
    
    BelugaMoving = false;  // subject can select a new waypoint
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
