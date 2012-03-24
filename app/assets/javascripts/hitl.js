// VARIABLES (NOTE: <%= ___ %> refers to an element ___.rb?)

var taskVersion = 0;      // 4 versions total (2 timings, 2 reward surfaces) - should these go here or in the Ruby script?
var totalTrials = 90;     // total number of trials
var trialsCompleted = 0;  // trial counter

var N = 10;            // grid size
var T = [10000,5000];  // time per trial (i.e., for robot to travel between waypoints) - define here or in the Ruby script?
/*var reward = [][];
// CG, horizontal
reward[0][0]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][1]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][2]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][3]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][4]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][5]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][6]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][7]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][8]  = [1,1,1,1,2,3,2,1,1,1];
reward[0][9]  = [1,1,1,1,2,3,2,1,1,1];
// CG, vertical
reward[1][0]  = [1,1,1,1,1,1,1,1,1,1];
reward[1][1]  = [1,1,1,1,1,1,1,1,1,1];
reward[1][2]  = [1,1,1,1,1,1,1,1,1,1];
reward[1][3]  = [1,1,1,1,1,1,1,1,1,1];
reward[1][4]  = [2,2,2,2,2,2,2,2,2,2];
reward[1][5]  = [3,3,3,3,3,3,3,3,3,3];
reward[1][6]  = [2,2,2,2,2,2,2,2,2,2];
reward[1][7]  = [1,1,1,1,1,1,1,1,1,1];
reward[1][8]  = [1,1,1,1,1,1,1,1,1,1];
reward[1][9]  = [1,1,1,1,1,1,1,1,1,1];
// RO, horizontal
reward[2][0]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][1]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][2]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][3]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][4]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][5]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][6]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][7]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][8]  = [3,2,1,1,1,2,4,5,6,7];
reward[2][9]  = [3,2,1,1,1,2,4,5,6,7];
// RO, vertical
reward[3][0]  = [3,3,3,3,3,3,3,3,3,3];
reward[3][1]  = [2,2,2,2,2,2,2,2,2,2];
reward[3][2]  = [1,1,1,1,1,1,1,1,1,1];
reward[3][3]  = [1,1,1,1,1,1,1,1,1,1];
reward[3][4]  = [1,1,1,1,1,1,1,1,1,1];
reward[3][5]  = [2,2,2,2,2,2,2,2,2,2];
reward[3][6]  = [4,4,4,4,4,4,4,4,4,4];
reward[3][7]  = [5,5,5,5,5,5,5,5,5,5];
reward[3][8]  = [6,6,6,6,6,6,6,6,6,6];
reward[3][9]  = [7,7,7,7,7,7,7,7,7,7];*/
var sigma = 10;  // noise intensity for reward
var currentReward = 0;

// will eventually need to link some of these to .rb file for storage as data
var BelugaX;        // position of robot in tank-image coordinates
var BelugaY; 
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
var priorgoalXbox;  // previous waypoint (box-wise) - do we really need this?
var priorgoalYbox;

var HaveCounter;
var NeedSend = false;
var SendPeriod = 500;  // time between updates (msec)

var RTank = 3.2;  // tank radius (m)
var Depth = 0.5;  // depth I want the robot swimming at (m) - how should I work this in? do I even need it?

var GridStartX = 153;    // x-coordinate of upper-left pixel of grid
var GridStartY = 143;    // y-coordinate of upper-left pixel of grid
var GridBoxWidth = 35;   // width (in pixels) of grid box
var GridBoxHeight = 37;  // height (in pixels) of grid box


// BODY

$(document).ready(function(){

    $('#crosshair').hide(); // hide crosshair and waypoint to start
    $('#waypoint').hide();
    
    requestWaypoints();
    requestPositions();
    
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
    
    // only want to be able to click if robot has reached previous waypoint - how can I access robot's current state? 
    $("#tank").unbind("click").click(function(ev){
        if (currentXbox >= 0 && currentYpos >= 0)  // cursor click is above grid
        {
            doUpdate();
        }
    });

    updateWaypointForm("waypoint");  // necessary? should this go inside of the above "click" if statement?

    if (HaveCounter == undefined)
    {
        window.setInterval(doSend(), SendPeriod);
        HaveCounter = true;
    }

});


// PRIMARY FUNCTIONS (in call order)

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
    BelugaX = world2tank(X);
    BelugaY = world2tank(Y);
    var offX = BelugaX - 1;
    var offY = BelugaY - 1;
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
    /*if (trialsCompleted == totalTrials)  // done with current iteration of task - here or in Ruby script?
    {
        if ()  // done with all iterations of task
        {    
            // link to feedback (this includes breaking out of the doUpdate() function)
            // maybe by making a "FEEDBACK" button appear
        }
        else
        {
            // move on to next iteration of task (this includes breaking out of the doUpdate() function)
            onLoad();
        }
    }*/
    
    priorgoalXbox = goalXbox;  // previous waypoint = current waypoint (not updated yet)
    priorgoalYbox = goalYbox;
    goalXbox = currentXbox;    // new waypoint = grid box that cursor is currently in
    goalYbox = currentYbox;
    goalXpos = currentXpos;    // set position of new waypoint (relative to upper-left corner of grid)
    goalYpos = currentYpos;
    
    setWaypoint(goalXpos, goalYpos);
    
    /*calculateReward(goalXbox,goalYbox)
    //only display once robot gets to waypoint - how can I access robot's current state?
    displayReward()
    
    trialsCompleted = ++trialsCompleted;
    
    document.params.reward.value = currentReward;
    document.params.trial.value = trialsCompleted;
    
    formData ="state=runningTask&auth_code=<%= auth_code
    %>&subject=<%= subject %>&block=<%= block %>&timingOrder=<%= timingOrder
    %>&surfaceOrder=<%= surfaceOrder %>&dynamicsOrder=<%=
    dynamicsOrder %>&reward=".concat(currentReward.toString(),"&trial=",trialsCompleted.toString(),"&currentX=",currentX.toString(),"&currentY=",currentY.toString(),"&goalX=",goalX.toString(),"&goalY=",goalY.toString(),"&numClicks=",numClicks.toString());
    var xhr = getXMLHttp();
    
    xhr.open("POST","survey.rb",true);
    xhr.send(formData);
    
    var resp= xhr.responseText;
    
    setTimeout(doUpdate, T);*/
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
}

function calculateReward(surface, Xbox, Ybox)
{
    var locationReward = reward[surface][Xbox][Ybox];   // where should I define the surface? in the Ruby script?
    currentReward = Math.floor(25*locationReward/3.2)   // with noise
                    + Math.floor(sigma*Math.random());
}

function displayReward()
{
    document.rewardForm.reward.value = currentReward;  // is this how I want to do this? or is there a 'special' jQuery way?
}

function getXMLHttp()
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function updateWaypointForm()  // for Beluga tracking/control
{
    $("#waypoint_x").val(tank2world(objCenterX("#waypoint")));
    $("#waypoint_y").val(tank2world(objCenterY("#waypoint")));
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

function debugOut(txt)
{
    $("#debug_out").text(txt);
}


// SUPPLEMENTARY FUNCTIONS (mainly for coordinate transforms and positioning)

function imgRTank()  // tank radius in tank image
{
    return 0.5*$("#tank").width();
}

function world2tank(X_or_Y)  // scales real-world down to tank-image coordinates - for tracking/control
{
    return X_or_Y*(imgRTank()/RTank);
}

function tank2world(X_or_Y)  // scales tank-image up to real-world coordinates - for tracking/control
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

function objCenterX(id)  // get x-position of center of object in grid (relative to origin at tank center) coordinates
{
    return $(id).position().left - $("#tank").position().left
           + 0.5*$(id).width() - 0.5*$("#tank").width();
}

function objCenterY(id)  // get y-position of center of object in grid (relative to origin at tank center) coordinates
{
    return $(id).position().top - $("#tank").position().top
           + 0.5*$(id).height() - 0.5*$("#tank").height();
}
