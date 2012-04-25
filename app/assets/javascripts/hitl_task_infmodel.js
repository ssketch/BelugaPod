// VARIABLES

var totalTrials = 90;  // total number of trials
var trialsCompleted;   // trial counter

var block = 3;                           // 4th and final block
var timing = 10000;                      // fast timing
var surface;                             // will be pulled in from HTML
var d = 2;                               // dimensionality of grid
var N = 10;                              // grid size
var reward = new Array(4);               // just RO surfaces
for (var i = 0; i < reward.length; i++)
{
	reward[i] = new Array(N);
}
// RO, 0 degrees
reward[0][0] = [3,2,1,1,1,2,4,5,6,7];
reward[0][1] = [3,2,1,1,1,2,4,5,6,7];
reward[0][2] = [3,2,1,1,1,2,4,5,6,7];
reward[0][3] = [3,2,1,1,1,2,4,5,6,7];
reward[0][4] = [3,2,1,1,1,2,4,5,6,7];
reward[0][5] = [3,2,1,1,1,2,4,5,6,7];
reward[0][6] = [3,2,1,1,1,2,4,5,6,7];
reward[0][7] = [3,2,1,1,1,2,4,5,6,7];
reward[0][8] = [3,2,1,1,1,2,4,5,6,7];
reward[0][9] = [3,2,1,1,1,2,4,5,6,7];
// RO, 90 degrees
reward[1][0] = [7,7,7,7,7,7,7,7,7,7];
reward[1][1] = [6,6,6,6,6,6,6,6,6,6];
reward[1][2] = [5,5,5,5,5,5,5,5,5,5];
reward[1][3] = [4,4,4,4,4,4,4,4,4,4];
reward[1][4] = [2,2,2,2,2,2,2,2,2,2];
reward[1][5] = [1,1,1,1,1,1,1,1,1,1];
reward[1][6] = [1,1,1,1,1,1,1,1,1,1];
reward[1][7] = [1,1,1,1,1,1,1,1,1,1];
reward[1][8] = [2,2,2,2,2,2,2,2,2,2];
reward[1][9] = [3,3,3,3,3,3,3,3,3,3];
// RO, 180 degrees
reward[2][0] = [7,6,5,4,2,1,1,1,2,3];
reward[2][1] = [7,6,5,4,2,1,1,1,2,3];
reward[2][2] = [7,6,5,4,2,1,1,1,2,3];
reward[2][3] = [7,6,5,4,2,1,1,1,2,3];
reward[2][4] = [7,6,5,4,2,1,1,1,2,3];
reward[2][5] = [7,6,5,4,2,1,1,1,2,3];
reward[2][6] = [7,6,5,4,2,1,1,1,2,3];
reward[2][7] = [7,6,5,4,2,1,1,1,2,3];
reward[2][8] = [7,6,5,4,2,1,1,1,2,3];
reward[2][9] = [7,6,5,4,2,1,1,1,2,3];
// RO, 270 degrees
reward[3][0] = [3,3,3,3,3,3,3,3,3,3];
reward[3][1] = [2,2,2,2,2,2,2,2,2,2];
reward[3][2] = [1,1,1,1,1,1,1,1,1,1];
reward[3][3] = [1,1,1,1,1,1,1,1,1,1];
reward[3][4] = [1,1,1,1,1,1,1,1,1,1];
reward[3][5] = [2,2,2,2,2,2,2,2,2,2];
reward[3][6] = [4,4,4,4,4,4,4,4,4,4];
reward[3][7] = [5,5,5,5,5,5,5,5,5,5];
reward[3][8] = [6,6,6,6,6,6,6,6,6,6];
reward[3][9] = [7,7,7,7,7,7,7,7,7,7];
var sigma = 10;                        // noise intensity for reward
var scalers = [1,10,100,1000];
var scaler;                            // scaler x noisy reward = output to subject
var currentReward;

var meanRew;     // mean-reward vector (mu) in Bayesian inference model
var cov;         // covariance matrix (SIGMA) in Bayesian inference model
var lambda = 3;  // spatial length scale for initial (same value used in Paul Reverdy's paper)
var precision;   // precision matrix (LAMBDA) in Bayesian inference model (inverse covariance)
var posVector;   // vector representing position of current waypoint in grid (all zeros except for a 1 at waypoint position)
var posMatrix;   // matrix representing position of current waypoint in grid (all zeros except for a 1 at waypoint position along diagonal) = posVector*posVector'

var rewardMap;                     // Raphael canvas for reward map
var data;                          // to be represented in dotchart
var x = new Array(Math.pow(N,d));  // define grid for dotchart
var y = new Array(Math.pow(N,d));
for (var i = 0; i < N; i++)
{
    for (var j = 0; j < N; j++)
    {
        x[i*N + j] = j;            // x = [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4...]
        y[i*N + j] = N - i;        // y = [10,10,10,10,10,10,10,10,10,10,9,9,9,9,9,9,9,9,9,9...]
    }
}

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
    surface = parseInt($("input[name=surface]").val()) - 4;      // next RO in sequence from hitl_task.js (subtract 4 because RO surfaces are indexed 0-3 here) 
    scaler = scalers[Math.floor(Math.random()*scalers.length)];  // random reward scaler
    
    meanRew = Vector.Zero(Math.pow(N,d));                                                                         // initial mean-reward distribution = 0
    cov = Matrix.Zero(Math.pow(N,d), Math.pow(N,d));
    for (var i = 0; i < Math.pow(N,d); i++)                                                                       // inital covariance matrix = exponential with spatial length scale
    {
        for (var j = 0; j < Math.pow(N,d); j++)
        {
            cov.elements[i][j] = Math.exp(-(cov.row(i+1).distanceFrom(cov.col(j+1)))/lambda);                     // cov(i,j) = exp(-|x_i - x_j|/lambda)
        }                                                                                                         // NOTE: vectors & matrices index from 1, not 0
    }
    precision = cov.inv();
    posVector = Vector.Zero(Math.pow(N,d));                                                                       // no waypoint has been selected yet
    posMatrix = posVector.toDiagonalMatrix();
    rewardMap = Raphael($("#RM").position().left, $("#RM").position().top, $("#RM").width(), $("#RM").height());  // set up Raphael canvas
    displayRM();
    
    $.Zebra_Dialog('Are you ready to begin the final task?', {
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
    
    calculateReward(surface, goalXbox, goalYbox);
    setTimeout("displayReward()", timing);         // wait for 'timing' msec (after setting waypoint) to display initial reward and update reward map
    setTimeout("updateRM()", timing);
    
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
        $.Zebra_Dialog('You have now completed all of the tasks. Click "OK" to proceed to the feedback section.', {
            keyboard: false,
            overlay_close: false,
            overlay_opacity: 0.7,
            onClose: function(caption) {
                $("form#done").submit()
            }
        });
        return
    }
    
    goalXbox = currentXbox;  // new waypoint = grid box that cursor is currently in
    goalYbox = currentYbox;
    goalXpos = currentXpos;  // set position of new waypoint (relative to upper-left corner of grid)
    goalYpos = currentYpos;
    
    setWaypoint(goalXpos, goalYpos);
    
    calculateReward(surface, goalXbox, goalYbox);
    setTimeout("displayReward()", timing);         // wait for 'timing' msec (after setting waypoint) to display initial reward and update reward map
    setTimeout("updateRM()", timing);
    
    sendData();
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

function calculateReward(surface, Xbox, Ybox)  // scaler x noisy reward = output to subject
{
    var locationReward = reward[surface][Xbox][Ybox];
    noisyReward = Math.floor(25*locationReward/3.2) + Math.floor(Math.random()*sigma);  // add noise
    currentReward = scaler*noisyReward;                                                 // scale
}

function displayReward()
{
    $("input[name=reward]").attr('value', currentReward);
}

function updateRM()  // based on new information, update reward map according to Bayesian inference algorithm
{
    // covert goalXbox & goalYbox into posVector & posMatrix
    var pos = goalXbox + goalYbox*N;
    posVector = Vector.Zero(Math.pow(N,d));
    posVector.elements[pos] = 1;
    posMatrix = posVector.toDiagonalMatrix();
    
    // Bayesian update
    var q = (posVector.x(currentReward)).add(precision.x(meanRew));
    precision = posMatrix.x(1/(sigma*sigma)).add(precision);
    cov = precision.inv();
    meanRew = cov.x(q);
    
    displayRM();
}

function displayRM()
{
    var data = meanRew.elements;  // extract array from vector object
    rewardMap.clear();
    rewardMap.dotchart(0, 0, $("#RM").width(), $("#RM").height(), x, y, data, {symbol: "o", max: 25, heat: true});
    
    BelugaMoving = false;  // subject can select a new waypoint
}

function sendData()  // via AJAX
{
    var data = {};
    data['subject'] = $("input[name=subject]").val();
    data['block'] = block;
    data['timing'] = timing;
    data['surface'] = surface + 4;                     // to realign with surface numbers from hitl_task.js
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
