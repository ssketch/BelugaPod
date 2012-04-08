// VARIABLES

var totalTrials = 90;  // total number of training trials
var trialsCompleted;   // trial counter

var timing = 5000;                  // fast timing
var N = 10;                         // grid size
var reward = new Array(N);          // training surface (just noise)
reward[0] = [1,1,1,1,1,1,1,1,1,1];
reward[1] = [1,1,1,1,1,1,1,1,1,1];
reward[2] = [1,1,1,1,1,1,1,1,1,1];
reward[3] = [1,1,1,1,1,1,1,1,1,1];
reward[4] = [1,1,1,1,1,1,1,1,1,1];
reward[5] = [1,1,1,1,1,1,1,1,1,1];
reward[6] = [1,1,1,1,1,1,1,1,1,1];
reward[7] = [1,1,1,1,1,1,1,1,1,1];
reward[8] = [1,1,1,1,1,1,1,1,1,1];
reward[9] = [1,1,1,1,1,1,1,1,1,1];
var sigma = 10;                     // noise intensity for reward
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
var BelugaXpos;     // position of robot in tank-image coordinates (relative to center/origin of tank)
var BelugaYpos; 
var BelugaXbox;     // grid box that robot is currently in
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

function initialize()  // send robot to starting box
{
    $.Zebra_Dialog('Are you ready to begin the training?', {
        keyboard: false,
        overlay_close: false,
        overlay_opacity: 0.7
    });
    
    trialsCompleted = 0;
    goalXbox = Math.floor(Math.random()*N);     // random starting box
    goalYbox = Math.floor(Math.random()*N);
    goalXpos = GridBoxWidth*(0.5 + goalXbox);   // convert starting box to position (relative to upper-left corner of grid)
    goalYpos = GridBoxHeight*(0.5 + goalYbox);
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(goalXbox, goalYbox);
    setTimeout("displayReward()", timing);         // wait for 'timing' msec (after setting waypoint) to display initial reward
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
        $.Zebra_Dialog('You have now completed the training. Click "OK" to proceed to the experiment.', {
            keyboard: false,
            overlay_close: false,
            overlay_opacity: 0.7,
            onClose: function(caption) {
                $("form#done").submit()
            }
        });
    }
    
    goalXbox = currentXbox;    // new waypoint = grid box that cursor is currently in
    goalYbox = currentYbox;
    goalXpos = currentXpos;    // set position of new waypoint (relative to upper-left corner of grid)
    goalYpos = currentYpos;
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(goalXbox, goalYbox);
    setTimeout("displayReward()", timing);         // wait for 'timing' msec (after setting waypoint) to display reward
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

function calculateReward(Xbox, Ybox)
{
    var locationReward = reward[Xbox][Ybox];
    currentReward = Math.floor(25*locationReward/3.2) + Math.floor(Math.random()*sigma);  // add noise
}

function displayReward()
{
    $("input[name=reward]").attr('value', currentReward);
    
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
