Golden Route Riddle Submission

	Welcome to my submission for the Golden Route Riddle. This application is designed to identify the nearest threat to a missile by processing input data about the enemy missile and providing details about the 	closest endangered flight, including:

	- ICAO24
	- Callsign
	- Origin Country
	- Last Contact
	- On Ground Status
	- Closest Airport
 
**Running the Application**
To get started with the app, navigate to the base directory of the project and run the following command:

  	docker compose up --build
Then, open your browser and go to:

	localhost:3000

**Working with the Attack Predictor
**	Upon opening the app, you'll encounter the Attack Predictor interface with:
	
	4 Input Fields for enemy missile data:
		Latitude: Latitude of the missile
		Longitude: Longitude of the missile
		Speed: Speed of the missile in m/s
		Radius: Radius of the missile in km
	2 Buttons:
		Save Attack: Saves the attack data to the database.
		Load Attack: Loads a data table with saved attacks, allowing you to hover over rows to view the flight data of those in danger.
**Tip**: You can also select a missile location by clicking on the map and then entering the speed and radius using the input fields.

**Finding the Best Path for the Missile** (Backend BONUS 2)
To calculate the best path for the missile while avoiding a designated safe zone, navigate to:

	localhost:3000/safeZone

 Here, you'll find:

	7 Input Fields:
		Top 4: Missile data (Latitude, Longitude, Speed, Radius)
	Bottom 3: Safe zone data (Latitude, Longitude, Radius)
 
**Flight Data Sources**
This application utilizes the OpenSky API to retrieve flights within the missile's range. 
The nearest airport information is obtained via the OpenAIP API.

**Bonuses**
BONUS 1: Time Calculation for Missile-Flight Intersection
	We are solving for T, the time when the missile and a friendly flight will intersect. The known parameters are:
	
	V: Speed of the friendly flight
	U: Speed of the enemy missile
	fX, fY: Coordinates of the friendly flight
	mX, mY: Coordinates of the enemy missile
	trueDirection: The angle of the flight from the north (angle from the y-axis to the flight path)
 
	to find the time we will compare the equsions for the contact point of the missile and the flight 

	we will use the coordinates of the missile as (0, 0) for easier calculation. For this we will need to subtruct the missile coordinates from the flight coordinates for accurate result.
  	we will define Xp and Yp as the coordinates of the contact point

	alpha - the angle between the flight path and the x axis. 
 	alpha = 90 - trueDiraction
  
	using flight info
		Xp = fX + V * T * cos(alpha)
  		Yp = fY + V * T * sin(alpha)

 	using the missile info	
  		*reminder -  we are using coordinates of missile as 0,0 for easier calculation 
  		beta - angle between missile path and x axis
  		Xp = U * T * cos(beta)
		Yp = U * T * sin(beta)

  	from this we get - 
		fX + V * T * cos(alpha) = U * T * cos(beta)
  		fY + V * T * sin(alpha) = U * T * sin(beta)

 	we will raise both equstion to the power of 2 to get rid of beta angle in the next step
  		fX ** 2 + 2 * fX * V * T * cos(alpha) + V ** 2 * T ** 2 * cos(alpha) ** 2 = U ** 2 * T ** 2 * cos(beta) ** 2
		fY ** 2 + 2 * fY * V * T * sin(alpha) + V ** 2 * T ** 2 * sin(alpha) ** 2 = U ** 2 * T ** 2 * sin(beta) ** 2

  	now we will add both equstions to each other 
   		fX ** 2 + fY ** 2 + 2 * fX * V * T * cos(alpha) + 2 * fY * V * T * sin(alpha) + V ** 2 * T ** 2 * cos(alpha) ** 2  + V ** 2 * T ** 2 * sin(alpha) ** 2 =  U ** 2 * T ** 2 * cos(beta) ** 2 + U ** 2 * T ** 2 * sin(beta) ** 2

  	now lets simplify the equstions - 
   		fX ** 2 + fY ** 2 + 2 * V * T * (fX * cos(alpha) + fY * sin (alpha)) + V ** 2 * T ** 2 * (cos(alpha) ** 2 + sin(alpha) ** 2) = U ** 2 * T ** 2 * (cos(beta) ** 2 + sin(beta) ** 2)

   		*reminder => sin(angle) ** 2 + cos(angle) ** 2 = 1

  		therefor =>
		fX ** 2 + fY ** 2 + 2 * V * T * (fX * cos(alpha) + fY * sin (alpha)) + (V * T) ** 2 = (U * T ) ** 2

		now that we have a more simplified equestion we will tranform the equstion to a standart quadratic formula to solve for T => ax ** 2 + bx + c

  		T ** 2 * (V ** 2 - U ** 2) + 2 * V * (fX * cos(alpha) + fY * sin (alpha)) * T + fX ** 2 + fY ** 2 = 0

 		now we can just use the standard quadratic function to find T.

   		because we rasied the equasion to the power of two we might get an additional false answer, therefor we pick the smallest valid one.

BONUS 2: Missile Rerouting to Avoid a Safe Zone
For rerouting, the friendly flight is considered stationary, and we convert latitude and longitude into a 2D form. The missile requires rerouting if the straight path to the flight intersects the safe 	zone. This is determined by calculating the shortest distance from the safe zone’s center to the missile's path.

Calculaing the shortest distance - 

 		for this we will find two tangent to the safe zone, one from the missile and one from the flight.

		here is an illustration for easier understanding - 
![image](https://github.com/user-attachments/assets/af25de27-5328-4839-82d7-7b55f0c41417)
  
      		first we find a, b and c using distance between two points formula.
		then using the pitagoras formula we find k and n.

    		next we will need to find the angle thats between the two radiuses of the deltoid( r, r, x, x), lets call that angle delta
      		for this we find the big angle of the triangle created by a, b, c.
		then subtract from it the two angles created by a, r, k and b, r, n. to find these angles we will use the law of cosines.
  		
		once we have the delta angle we divide it by 2 to find the angle in front of x in each of the congruent triangles. using the tangent in a right triangle we will find x.

  		finally once adding 2 * x + k + n we get the shortest distanation that the missile need to travel.


