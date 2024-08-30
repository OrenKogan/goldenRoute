function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function latLonToXY(lat, lon) {
    const R = 6371000; // Radius of the Earth in meters
    const x = lon * (Math.PI / 180) * R * Math.cos((lat * Math.PI) / 180);
    const y = lat * (Math.PI / 180) * R;
    return { x, y };
}

function distance2D(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// ********** BONUS 1 ********** //

function CalculateTime(flightLat, flightLon, missileLat, missileLon, flightSpeed, missileSpeed, trueDiraction) {
    
    const { x: fX, y: fY } = latLonToXY(flightLat, flightLon);
    const { x: mX, y: mY } = latLonToXY(missileLat, missileLon);

    return SmartTimeCalc(fY - mY, fX - mX, flightSpeed, missileSpeed, trueDiraction);
}

function SmartTimeCalc(x, y, flightSpeed, missileSpeed, trueDiraction) {

    if (x == 0 && y == 0)
        return { status: "failed", errors: "Missile and Plane cannot be on same place" };

    //set variables for calculation
    alpha = 90 - trueDiraction;
    alpha_rad = degreesToRadians(alpha);

    //parametrs are named as the basic quadratic equation => ax**2 + bx + c = 0

    a = (flightSpeed ** 2 - missileSpeed ** 2);
    b = 2 * flightSpeed * (x * Math.cos(alpha_rad) + y * Math.sin(alpha_rad));
    c = x ** 2 + y ** 2;
    if (a == 0) {
        time = -c / b;

        if (time <= 0)
            return { status: "slow", time: -1 };
        cos_beta = (x + flightSpeed * time * Math.cos(alpha_rad)) / (U * T);
        if (cos_beta < -1 || cos_beta > 1)
            return { status: "slow", time: -1 };

        console.log('time => ', time);
        return { status: 'sucess', time: time };
    }

    _k = (b / 2) / a;
    _f = _k ** 2 - c / a;

    if (_f < 0)
        return { status: "slow", time: -1 };

    sqr = Math.sqrt(_f);

    t1 = -_k + sqr;
    t2 = -_k - sqr;

    let T = Infinity;

    const checkCosBeta = (t) => {
        const cos_beta = (x + flightSpeed * t * Math.cos(alpha_rad)) / (missileSpeed * t);
        return cos_beta >= -1 && cos_beta <= 1;
    };

    if (t1 > 0 && checkCosBeta(t1)) {
        T = t1;
    }

    if (t2 > 0 && checkCosBeta(t2)) {
        T = Math.min(T, t2);
    }

    if (T < Infinity) {
        return { status: "success", time: T };
    }

    return { status: "slow", time: -1 };
}

// ********** BONUS 2 ********** //

function calculateAngle(a, b, c) {
    // Calculate the cosine of the angle
    const cosC = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
    
    // Ensure the value is within the valid range for acos
    const clampedCosC = Math.max(-1, Math.min(1, cosC));
    
    // Calculate the angle in radians
    return Math.acos(clampedCosC);
}

function needForReRoute(cX, cY, mX, mY, fX,fY, r){

    if (fX - mX == 0)
        return fX - cX < r;
    const m = (fY - mY) / (fX - mX);
    const b = mY - m * mX;
    
    d = Math.abs((-m * cX + cY - b) / Math.sqrt(m ** 2 + 1));

    return d < r;
}

function calcDis(cX, cY, mX, mY, fX,fY, r){

    c = distance2D(mX, mY, fX, fY);
    b = distance2D(cX, cY, fX, fY);
    a = distance2D(mX, mY, cX, cY);
    if (b < r)
        return {status: "failed", error: "Flight is in safe zone and cannot be hit"};
    if (a < r)
        return {status: "failed", error: "missile is in safe zone and will be destroyed immidiatly"};
    if (needForReRoute(cX, cY, mX, mY, fX,fY, r)){

    
        k = Math.sqrt(a ** 2 - r ** 2);
        n = Math.sqrt(b ** 2 - r ** 2);
      
        alpha = calculateAngle(a,b, c);
        beta = Math.acos(r/a);
        gama = Math.acos(r/b);
        delta = alpha - beta - gama;
    
        sigma = delta / 2;
    
        x = r * Math.tan(sigma);
    
        return {status: "success", distance: 2 * x + k + n};
    }
    return {status: "success", distance: c};
}

function getBestDistance(safeLat, safeLon, missileLat, missileLon, flightLat, flightLon, safeRadius){
    const {x:cX, y: cY} = latLonToXY(safeLat, safeLon);
    const {x:mX, y: mY} = latLonToXY(missileLat, missileLon);
    const {x:fX, y: fY} = latLonToXY(flightLat, flightLon);

    return calcDis(cX, cY, mX, mY, fX, fY, safeRadius);
}

module.exports = {CalculateTime, getBestDistance};