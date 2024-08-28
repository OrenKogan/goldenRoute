
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function latLonToXY(lat, lon) {
    const R = 6371000; // Radius of the Earth in meters
    const x = lon * (Math.PI / 180) * R * Math.cos((lat * Math.PI) / 180);
    const y = lat * (Math.PI / 180) * R;
    return { x, y };
}

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

module.exports = CalculateTime;