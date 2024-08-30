Welcome to my submition for the Golden Route riddle, 

 	the app is used to find the nearest threat to a missile, you will input the information of the enemy missile and will recieve the following info about the nearest flight in danger -
  		ICAO24, Callsign, Origin Country, Last Contact, On Ground, Closest Airport

Running the app - 

	to run the app you simply run the next command on the base folder of the project - 
		docker compose up --build
    	then go into the browser and open up - 
        	localhost:3000

Working with The Attack Predictor - 

    when opening the app you will see - 
		4 input fields for each vaiable needed to predict an attack
  			Latitude - Latitude of the missile
	 		Longitude - Longitude of the missile
			Speed - Speed of the missile in m/s
   			Radius - Radius of missile in km
	  	2 buttons - 
			Save Attack - saves to the database
   			Load Attack - opens a data table with saved attack
	  					  	you are able to hover over a specific row to see the data of the flight in danger
		   
	**to select a location for the missile you are also abale to simply click on the desired location on the map and set the speed and radius using the input fields**
	 
**How to use the app to find the best path for the missile while avoiding a certain safe zone?**  (backend BONUS 2)
	for this you will need to navigate using the url to  localhost:3000/safeZone

   **when opening this page you will see -**

	 	7 input fields -
   			top 4 - 
				Latitude - Latitude of the missile
		 		Longitude - Longitude of the missile
				Speed - Speed of the missile in m/s
	   			Radius - Radius of missile in km
	   		bottom 3 -
				Latitude - Latitude of the safe zone
		 		Longitude - Longitude of the safe zone
	   			Radius - Radius of safe zone in km

**where do the flight come from?**
	i am using the open-sky API to get the flights in the range of the missile.
	also, to get the nearest airport i am using openaip API.

	  		
******** BONUSES ******

**BONUS 1**

 	we are serching for T
	our known parameters are =>
 		V - speed of friendly flight
   		U - speed of enemy missile 
	 	fX, fY  - coordinates of freindly flight
   		mX, mY - coordinates of enemy missile
	 	trueDiraction - the angle of the flight from the north/ angle from the y axis to flight path
   
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
  		

**BONUS 2**

 	for this part we will consider the friendly flight as stationary, we will also convert the latitude and longitude into a 2 dimantional form to be able to solve the problem.
  	first we check if the friendly flight is inside of the safe zone, if so than the missile will not be able to hit it. same follows if the missile it self is in the safe zone.
   	next we check if there is a need for rerouting, the missile will need rerouting if the straight line from the missile to the flight goes through the safe zone. we check this using the distance of a point 	from a straight line formula.if the distance from the middle of the safe zone to the line between the missile and flight bigger than the radius than there is no need for rerouting.

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

	
